
-- ============ roles ============
CREATE TYPE public.app_role AS ENUM ('admin', 'organizer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_organizer(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'organizer')
  )
$$;

CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============ teams ============
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  college_name text NOT NULL,
  reference_id text NOT NULL UNIQUE,
  payment_status text NOT NULL DEFAULT 'unpaid',
  registration_status text NOT NULL DEFAULT 'pending',
  amount_inr integer NOT NULL DEFAULT 1000,
  stripe_session_id text,
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT teams_payment_status_check CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  CONSTRAINT teams_registration_status_check CHECK (registration_status IN ('pending', 'confirmed', 'waitlisted', 'cancelled'))
);

CREATE UNIQUE INDEX teams_team_name_lower_idx ON public.teams (lower(team_name));

GRANT SELECT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can read teams"
  ON public.teams FOR SELECT TO authenticated
  USING (public.is_organizer(auth.uid()));
CREATE POLICY "Organizers can update teams"
  ON public.teams FOR UPDATE TO authenticated
  USING (public.is_organizer(auth.uid()))
  WITH CHECK (public.is_organizer(auth.uid()));
CREATE POLICY "Organizers can delete teams"
  ON public.teams FOR DELETE TO authenticated
  USING (public.is_organizer(auth.uid()));

-- ============ team members ============
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  college_name text NOT NULL,
  college_id_number text,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT team_members_role_check CHECK (role IN ('lead', 'member')),
  CONSTRAINT team_members_phone_check CHECK (phone ~ '^[6-9][0-9]{9}$'),
  CONSTRAINT team_members_email_check CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

CREATE UNIQUE INDEX team_members_email_unique_idx ON public.team_members (lower(email));
CREATE INDEX team_members_team_id_idx ON public.team_members (team_id);

GRANT SELECT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can read team members"
  ON public.team_members FOR SELECT TO authenticated
  USING (public.is_organizer(auth.uid()));
CREATE POLICY "Organizers can update team members"
  ON public.team_members FOR UPDATE TO authenticated
  USING (public.is_organizer(auth.uid()))
  WITH CHECK (public.is_organizer(auth.uid()));
CREATE POLICY "Organizers can delete team members"
  ON public.team_members FOR DELETE TO authenticated
  USING (public.is_organizer(auth.uid()));

-- ============ updated_at ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER teams_touch_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ registration routine ============
CREATE OR REPLACE FUNCTION public.register_team(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    v_ref := 'AH-' || upper(substr(encode(gen_random_bytes(5), 'hex'), 1, 8));
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
$$;

REVOKE ALL ON FUNCTION public.register_team(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_team(jsonb) TO service_role;
