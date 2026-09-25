CREATE OR REPLACE FUNCTION public.register_team(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_team_name text := btrim(payload->>'team_name');
  v_lead jsonb := payload->'lead';
  v_members jsonb := coalesce(payload->'members', '[]'::jsonb);
  v_member jsonb;
  v_ref text;
  v_team_id uuid;
  v_count int;
  v_emails text[];
BEGIN
  IF v_team_name IS NULL OR length(v_team_name) < 2 THEN
    RAISE EXCEPTION 'INVALID_TEAM_NAME';
  END IF;

  v_count := jsonb_array_length(v_members);
  IF v_count < 2 OR v_count > 4 THEN
    RAISE EXCEPTION 'INVALID_MEMBER_COUNT';
  END IF;

  SELECT array_agg(lower(btrim(e)))
    INTO v_emails
    FROM (
      SELECT v_lead->>'email' AS e
      UNION ALL
      SELECT m->>'email' FROM jsonb_array_elements(v_members) m
    ) s;

  IF (SELECT count(DISTINCT x) FROM unnest(v_emails) x) <> array_length(v_emails, 1) THEN
    RAISE EXCEPTION 'DUPLICATE_EMAIL_IN_TEAM';
  END IF;

  IF EXISTS (SELECT 1 FROM public.teams WHERE lower(team_name) = lower(v_team_name)) THEN
    RAISE EXCEPTION 'TEAM_NAME_TAKEN';
  END IF;

  LOOP
    v_ref := 'AH-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.teams WHERE reference_id = v_ref);
  END LOOP;

  INSERT INTO public.teams (team_name, college_name, reference_id)
  VALUES (v_team_name, btrim(v_lead->>'college_name'), v_ref)
  RETURNING id INTO v_team_id;

  INSERT INTO public.team_members (team_id, name, email, phone, college_name, college_id_number, role)
  VALUES (
    v_team_id,
    btrim(v_lead->>'name'),
    lower(btrim(v_lead->>'email')),
    btrim(v_lead->>'phone'),
    btrim(v_lead->>'college_name'),
    btrim(v_lead->>'college_id_number'),
    'lead'
  );

  FOR v_member IN SELECT * FROM jsonb_array_elements(v_members)
  LOOP
    INSERT INTO public.team_members (team_id, name, email, phone, college_name, role)
    VALUES (
      v_team_id,
      btrim(v_member->>'name'),
      lower(btrim(v_member->>'email')),
      btrim(v_member->>'phone'),
      btrim(v_member->>'college_name'),
      'member'
    );
  END LOOP;

  RETURN jsonb_build_object('reference_id', v_ref, 'team_id', v_team_id);
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'EMAIL_ALREADY_REGISTERED';
  WHEN check_violation THEN
    RAISE EXCEPTION 'INVALID_MEMBER_DETAILS';
END;
$fn$;

REVOKE ALL ON FUNCTION public.register_team(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_team(jsonb) TO service_role;