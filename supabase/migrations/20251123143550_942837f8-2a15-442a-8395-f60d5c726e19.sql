-- Phase 1: Critical Access & Meeting Fixes

-- 1. Update profiles.assigned_manager_id for creators who have meetings with managers assigned
UPDATE profiles
SET assigned_manager_id = cm.assigned_manager_id,
    updated_at = now()
FROM creator_meetings cm
WHERE profiles.id = cm.user_id
  AND cm.assigned_manager_id IS NOT NULL
  AND profiles.assigned_manager_id IS NULL;

-- 2. Create timeline events for approved applications
INSERT INTO timeline_events (user_id, stage, event_type, created_at)
SELECT DISTINCT p.id, 'application', 'approved', ca.reviewed_at
FROM profiles p
JOIN user_roles ur ON ur.user_id = p.id AND ur.role = 'creator'
JOIN creator_applications ca ON ca.email = p.email AND ca.status = 'approved'
LEFT JOIN timeline_events te ON te.user_id = p.id AND te.stage = 'application'
WHERE te.id IS NULL
  AND ca.reviewed_at IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. Create timeline events for scheduled meetings
INSERT INTO timeline_events (user_id, stage, event_type, created_at)
SELECT DISTINCT cm.user_id, 'meeting', 'scheduled', 
       COALESCE(cm.meeting_date, cm.created_at)
FROM creator_meetings cm
LEFT JOIN timeline_events te ON te.user_id = cm.user_id 
  AND te.stage = 'meeting' AND te.event_type = 'scheduled'
WHERE cm.status IN ('confirmed', 'pending')
  AND te.id IS NULL
ON CONFLICT DO NOTHING;

-- 4. Create timeline events for completed meetings
INSERT INTO timeline_events (user_id, stage, event_type, created_at)
SELECT DISTINCT cm.user_id, 'meeting', 'completed', cm.completed_at
FROM creator_meetings cm
LEFT JOIN timeline_events te ON te.user_id = cm.user_id 
  AND te.stage = 'meeting' AND te.event_type = 'completed'
WHERE cm.status = 'completed'
  AND cm.completed_at IS NOT NULL
  AND te.id IS NULL
ON CONFLICT DO NOTHING;

-- 5. Create timeline events for full access grants
INSERT INTO timeline_events (user_id, stage, event_type, created_at)
SELECT DISTINCT cal.user_id, 'access', 'granted', cal.granted_at
FROM creator_access_levels cal
LEFT JOIN timeline_events te ON te.user_id = cal.user_id AND te.stage = 'access'
WHERE cal.access_level = 'full_access'
  AND te.id IS NULL
  AND cal.granted_at IS NOT NULL
ON CONFLICT DO NOTHING;

-- 6. Create timeline events for signed contracts
INSERT INTO timeline_events (user_id, stage, event_type, created_at)
SELECT DISTINCT cc.user_id, 'contract', 'signed', cc.signed_at
FROM creator_contracts cc
LEFT JOIN timeline_events te ON te.user_id = cc.user_id AND te.stage = 'contract'
WHERE cc.contract_signed = true
  AND cc.signed_at IS NOT NULL
  AND te.id IS NULL
ON CONFLICT DO NOTHING;

-- 7. Create timeline events for completed onboarding
INSERT INTO timeline_events (user_id, stage, event_type, created_at)
SELECT DISTINCT od.user_id, 'onboarding', 'completed', od.updated_at
FROM onboarding_data od
LEFT JOIN timeline_events te ON te.user_id = od.user_id AND te.stage = 'onboarding'
WHERE od.is_completed = true
  AND te.id IS NULL
  AND od.updated_at IS NOT NULL
ON CONFLICT DO NOTHING;