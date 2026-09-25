REVOKE ALL ON FUNCTION public.register_team(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_team(jsonb) TO service_role;