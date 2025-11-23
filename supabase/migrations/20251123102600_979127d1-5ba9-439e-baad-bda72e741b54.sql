-- Create timeline_events table to track notification events
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('application', 'meeting', 'onboarding', 'contract', 'access')),
  event_type TEXT NOT NULL CHECK (event_type IN ('approved', 'scheduled', 'completed', 'signed', 'granted')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own timeline events"
  ON timeline_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own timeline events"
  ON timeline_events
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all timeline events"
  ON timeline_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin', 'manager')
    )
  );

CREATE POLICY "System can insert timeline events"
  ON timeline_events
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_timeline_events_user_id ON timeline_events(user_id);
CREATE INDEX idx_timeline_events_read ON timeline_events(user_id, read) WHERE read = false;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timeline_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating updated_at
CREATE TRIGGER timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION update_timeline_events_updated_at();

-- Trigger for application approval
CREATE OR REPLACE FUNCTION notify_application_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    INSERT INTO timeline_events (user_id, stage, event_type)
    SELECT id, 'application', 'approved'
    FROM profiles
    WHERE email = NEW.email
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_application_approved
  AFTER UPDATE ON creator_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_application_approved();

-- Trigger for meeting scheduled
CREATE OR REPLACE FUNCTION notify_meeting_scheduled()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    INSERT INTO timeline_events (user_id, stage, event_type)
    VALUES (NEW.user_id, 'meeting', 'scheduled')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_meeting_scheduled
  AFTER UPDATE ON creator_meetings
  FOR EACH ROW
  EXECUTE FUNCTION notify_meeting_scheduled();

-- Trigger for meeting completed
CREATE OR REPLACE FUNCTION notify_meeting_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO timeline_events (user_id, stage, event_type)
    VALUES (NEW.user_id, 'meeting', 'completed')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_meeting_completed
  AFTER UPDATE ON creator_meetings
  FOR EACH ROW
  EXECUTE FUNCTION notify_meeting_completed();

-- Trigger for onboarding completion
CREATE OR REPLACE FUNCTION notify_onboarding_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    INSERT INTO timeline_events (user_id, stage, event_type)
    VALUES (NEW.user_id, 'onboarding', 'completed')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_onboarding_completed
  AFTER UPDATE ON onboarding_data
  FOR EACH ROW
  EXECUTE FUNCTION notify_onboarding_completed();

-- Trigger for contract signed
CREATE OR REPLACE FUNCTION notify_contract_signed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contract_signed = true AND (OLD.contract_signed IS NULL OR OLD.contract_signed = false) THEN
    INSERT INTO timeline_events (user_id, stage, event_type)
    VALUES (NEW.user_id, 'contract', 'signed')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_contract_signed
  AFTER UPDATE ON creator_contracts
  FOR EACH ROW
  EXECUTE FUNCTION notify_contract_signed();

-- Trigger for full access granted
CREATE OR REPLACE FUNCTION notify_access_granted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.access_level = 'full_access' AND (OLD.access_level IS NULL OR OLD.access_level != 'full_access') THEN
    INSERT INTO timeline_events (user_id, stage, event_type)
    VALUES (NEW.user_id, 'access', 'granted')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_access_granted
  AFTER UPDATE ON creator_access_levels
  FOR EACH ROW
  EXECUTE FUNCTION notify_access_granted();

-- Enable realtime for timeline_events
ALTER PUBLICATION supabase_realtime ADD TABLE timeline_events;