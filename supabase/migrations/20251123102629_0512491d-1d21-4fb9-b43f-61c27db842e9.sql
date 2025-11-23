-- Fix function search path security warnings by replacing functions with search_path set

CREATE OR REPLACE FUNCTION update_timeline_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;