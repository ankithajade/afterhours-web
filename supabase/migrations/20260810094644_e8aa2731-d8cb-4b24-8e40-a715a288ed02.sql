CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can read contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (public.is_organizer(auth.uid()));

CREATE POLICY "Organizers can update contact messages"
ON public.contact_messages FOR UPDATE TO authenticated
USING (public.is_organizer(auth.uid())) WITH CHECK (public.is_organizer(auth.uid()));

CREATE POLICY "Organizers can delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING (public.is_organizer(auth.uid()));