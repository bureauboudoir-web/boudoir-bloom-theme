-- Enable realtime for relevant tables
ALTER TABLE public.creator_applications REPLICA IDENTITY FULL;
ALTER TABLE public.creator_access_levels REPLICA IDENTITY FULL;
ALTER TABLE public.content_uploads REPLICA IDENTITY FULL;
ALTER TABLE public.support_tickets REPLICA IDENTITY FULL;
ALTER TABLE public.creator_meetings REPLICA IDENTITY FULL;
ALTER TABLE public.onboarding_data REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.creator_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.creator_access_levels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_uploads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.creator_meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding_data;