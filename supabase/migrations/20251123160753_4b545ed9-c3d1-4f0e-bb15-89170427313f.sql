-- Create notification history table
CREATE TABLE public.notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  notification_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

-- Admins and managers can view their own notification history
CREATE POLICY "Users can view their own notification history"
ON public.notification_history
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own notification history
CREATE POLICY "System can insert notification history"
ON public.notification_history
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own notification history (mark as read)
CREATE POLICY "Users can update their own notification history"
ON public.notification_history
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notification history
CREATE POLICY "Users can delete their own notification history"
ON public.notification_history
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_notification_history_user_created 
ON public.notification_history(user_id, created_at DESC);

CREATE INDEX idx_notification_history_unread 
ON public.notification_history(user_id, is_read, created_at DESC);