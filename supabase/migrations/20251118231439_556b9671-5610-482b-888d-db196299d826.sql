-- Add creator_viewed_response_at column to track when creators view admin responses
ALTER TABLE public.support_tickets 
ADD COLUMN creator_viewed_response_at TIMESTAMP WITH TIME ZONE;