DROP FUNCTION IF EXISTS public.register_team(jsonb);
DROP FUNCTION IF EXISTS public.register_team(text, text, text, text, jsonb);
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;