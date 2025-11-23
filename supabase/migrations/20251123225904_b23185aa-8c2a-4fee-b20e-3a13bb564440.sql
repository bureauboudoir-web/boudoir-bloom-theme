-- Add comprehensive test data for manager dashboard testing

-- Insert weekly commitments for test creators
INSERT INTO weekly_commitments (user_id, content_type, description, is_completed, created_by_user_id)
VALUES
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'Photo Set', '5 Red Light District window poses - completed', true, '113134e3-41b8-4931-a75e-d022876a2535'),
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'Video Content', 'Teaser video for OnlyFans - in progress', false, '113134e3-41b8-4931-a75e-d022876a2535'),
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'Photo Set', 'Boudoir lingerie collection - pending', false, '113134e3-41b8-4931-a75e-d022876a2535'),
  ('de692215-f1a4-4378-9377-c98b6f0aee8c', 'Photo Set', 'Initial content batch', false, '113134e3-41b8-4931-a75e-d022876a2535'),
  ('de692215-f1a4-4378-9377-c98b6f0aee8c', 'Video Content', 'Introduction video - in progress', false, '113134e3-41b8-4931-a75e-d022876a2535'),
  ('de692215-f1a4-4378-9377-c98b6f0aee8c', 'Photo Set', 'Window poses series - pending', false, '113134e3-41b8-4931-a75e-d022876a2535');

-- Insert studio shoots
INSERT INTO studio_shoots (user_id, title, shoot_date, location, duration_hours, photo_staff_name, video_staff_name, created_by_user_id, description)
VALUES
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'Red Light Window Solo Content', CURRENT_DATE + INTERVAL '3 days', 'Studio A - Amsterdam Centrum', 2, 'Marcus Photography', 'Laura Video', '113134e3-41b8-4931-a75e-d022876a2535', 'Solo window content shoot'),
  ('de692215-f1a4-4378-9377-c98b6f0aee8c', 'Duo Collaboration Shoot', CURRENT_DATE + INTERVAL '5 days', 'Studio B - De Wallen', 3, 'Marcus Photography', 'Laura Video', '113134e3-41b8-4931-a75e-d022876a2535', 'Collaborative shoot with Emma'),
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'Boudoir Photo Session', CURRENT_DATE - INTERVAL '10 days', 'Studio A', 2, 'Marcus Photography', NULL, '113134e3-41b8-4931-a75e-d022876a2535', 'Classic boudoir session');

-- Add shoot participants for duo shoot
INSERT INTO shoot_participants (shoot_id, user_id, role, response_status)
SELECT s.id, 'de692215-f1a4-4378-9377-c98b6f0aee8c', 'primary', 'pending'
FROM studio_shoots s WHERE s.title = 'Duo Collaboration Shoot' LIMIT 1;

INSERT INTO shoot_participants (shoot_id, user_id, role, response_status)
SELECT s.id, '53f58505-6d86-4b66-ac33-2038b32da13c', 'participant', 'confirmed'
FROM studio_shoots s WHERE s.title = 'Duo Collaboration Shoot' LIMIT 1;

-- Insert content uploads
INSERT INTO content_uploads (user_id, file_name, file_url, file_size, marketing_notes)
VALUES
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'emma_window_001.jpg', 'https://placeholder.url/e1.jpg', 2500000, 'Strong visual appeal'),
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'emma_video_002.mp4', 'https://placeholder.url/e2.mp4', 15000000, 'Excellent quality'),
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'emma_lingerie_003.jpg', 'https://placeholder.url/e3.jpg', 2800000, 'Approved for posting'),
  ('de692215-f1a4-4378-9377-c98b6f0aee8c', 'sophie_window_001.jpg', 'https://placeholder.url/s1.jpg', 2200000, 'Review lighting'),
  ('de692215-f1a4-4378-9377-c98b6f0aee8c', 'sophie_video.mp4', 'https://placeholder.url/s2.mp4', 12000000, 'Needs better audio');

-- Delete existing meetings to avoid duplicates
DELETE FROM creator_meetings WHERE user_id IN ('53f58505-6d86-4b66-ac33-2038b32da13c', 'de692215-f1a4-4378-9377-c98b6f0aee8c');

-- Insert creator meetings
INSERT INTO creator_meetings (user_id, assigned_manager_id, meeting_date, meeting_time, status, meeting_type, meeting_location, duration_minutes, completed_at)
VALUES
  ('53f58505-6d86-4b66-ac33-2038b32da13c', '113134e3-41b8-4931-a75e-d022876a2535', CURRENT_DATE - INTERVAL '30 days', '14:00', 'completed', 'online', 'Zoom', 60, CURRENT_DATE - INTERVAL '30 days'),
  ('de692215-f1a4-4378-9377-c98b6f0aee8c', '113134e3-41b8-4931-a75e-d022876a2535', CURRENT_DATE + INTERVAL '2 days', '15:30', 'confirmed', 'online', 'Zoom', 60, NULL);

-- Insert support tickets
INSERT INTO support_tickets (user_id, subject, message, status)
VALUES
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'Content Upload Issue', 'Having trouble uploading video content. Upload keeps failing at 80%.', 'open'),
  ('de692215-f1a4-4378-9377-c98b6f0aee8c', 'Question About Shoot Schedule', 'Can we reschedule the duo shoot to next week? I have a conflict.', 'in_progress'),
  ('53f58505-6d86-4b66-ac33-2038b32da13c', 'Payment Inquiry', 'When will I receive payment for last week?', 'resolved');