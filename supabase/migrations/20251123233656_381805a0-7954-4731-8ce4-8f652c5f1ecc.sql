-- Add test data for existing John creator and populate all dashboard sections

DO $$
DECLARE
  john_id uuid := 'a7060a51-4e9d-4138-95c0-09f1650bd931';
BEGIN
  -- PHASE 1: Update John's meeting to be upcoming
  UPDATE creator_meetings
  SET 
    meeting_date = CURRENT_DATE + INTERVAL '2 days',
    meeting_time = '10:00',
    status = 'confirmed',
    meeting_type = 'online',
    meeting_location = 'Zoom',
    meeting_notes = 'Monthly check-in - Review November content performance',
    duration_minutes = 60
  WHERE user_id = john_id
  AND assigned_manager_id = 'd9353e7a-00f3-459b-bfc6-f8d203c36c93';

  -- PHASE 2: Add support tickets for John
  INSERT INTO support_tickets (user_id, subject, message, status, created_at)
  VALUES (
    john_id,
    'Invoice payment confirmation needed',
    'Hi! I submitted my payment confirmation for invoice INV-2025-0015 last week but haven''t heard back. Can you please confirm you received it? I want to make sure everything is processed correctly.',
    'open',
    NOW() - INTERVAL '6 hours'
  );

  -- PHASE 3: Add weekly commitments for John
  INSERT INTO weekly_commitments (user_id, content_type, description, status, created_at)
  VALUES (
    john_id,
    'photo_sets',
    '3 photo sets: Bedroom series (30 photos each)',
    'pending',
    NOW() - INTERVAL '2 days'
  );

  INSERT INTO weekly_commitments (user_id, content_type, description, status, created_at)
  VALUES (
    john_id,
    'videos',
    '1 video: Behind the scenes content (5-7 minutes)',
    'pending',
    NOW() - INTERVAL '2 days'
  );

  -- PHASE 4: Add invoices for John
  INSERT INTO invoices (
    user_id, invoice_number, invoice_date, due_date, amount, currency,
    description, status, notes, created_by_user_id, created_at
  ) VALUES (
    john_id,
    'INV-2025-0015',
    CURRENT_DATE - INTERVAL '8 days',
    CURRENT_DATE + INTERVAL '22 days',
    950.00,
    'EUR',
    'Content creation - Week of Nov 11-17, 2025',
    'pending',
    'Awaiting creator payment confirmation',
    'd9353e7a-00f3-459b-bfc6-f8d203c36c93',
    CURRENT_DATE - INTERVAL '8 days'
  );

  INSERT INTO invoices (
    user_id, invoice_number, invoice_date, due_date, amount, currency,
    description, status, payment_method, notes, 
    creator_payment_confirmed_at, created_by_user_id, created_at
  ) VALUES (
    john_id,
    'INV-2025-0016',
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '15 days',
    1100.00,
    'EUR',
    'Content creation - Week of Nov 4-10, 2025',
    'pending',
    'bank_transfer',
    'Creator confirmed payment on ' || (CURRENT_DATE - INTERVAL '6 days')::text,
    CURRENT_DATE - INTERVAL '6 days',
    'd9353e7a-00f3-459b-bfc6-f8d203c36c93',
    CURRENT_DATE - INTERVAL '15 days'
  );

  -- PHASE 5: Add content uploads for John
  INSERT INTO content_uploads (
    user_id, file_name, file_url, content_type, status,
    description, created_at
  ) VALUES (
    john_id,
    'bedroom_series_01.jpg',
    'https://placeholder.com/bedroom1.jpg',
    'image',
    'approved',
    'Bedroom series - Part 1 of 3',
    NOW() - INTERVAL '5 days'
  );

  INSERT INTO content_uploads (
    user_id, file_name, file_url, content_type, status,
    description, length, marketing_notes, created_at
  ) VALUES (
    john_id,
    'behind_scenes_v1.mp4',
    'https://placeholder.com/video1.mp4',
    'video',
    'pending_review',
    'Behind the scenes - Day in the life',
    '6:23',
    'Great authentic content, good for social media teasers',
    NOW() - INTERVAL '1 day'
  );

END $$;