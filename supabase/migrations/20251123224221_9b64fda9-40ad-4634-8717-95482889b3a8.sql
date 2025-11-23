-- Add test data for Support Tickets, Studio Shoots, and Meeting improvements
-- Simplified version without shoot_type constraints

DO $$ 
DECLARE
  test_creator_1_id UUID;
  test_creator_2_id UUID;
  shoot_1_id UUID;
  shoot_2_id UUID;
  shoot_3_id UUID;
  shoot_4_id UUID;
BEGIN
  -- Get test user IDs
  SELECT id INTO test_creator_1_id FROM profiles WHERE email LIKE '%creator%' OR email LIKE '%test%' LIMIT 1;
  SELECT id INTO test_creator_2_id FROM profiles WHERE email LIKE '%creator%' OR email LIKE '%test%' LIMIT 1 OFFSET 1;

  -- Only proceed if we have test users
  IF test_creator_1_id IS NOT NULL THEN
    
    -- ============================================
    -- SUPPORT TICKETS TEST DATA
    -- ============================================
    
    INSERT INTO support_tickets (user_id, subject, message, status, admin_response, responded_at, created_at)
    VALUES
      (test_creator_1_id, 'Problem with Studio Access', 
       'I am unable to access the studio booking system. When I click on "Studio Shoots", nothing loads. Can you please help?', 
       'open', NULL, NULL, NOW() - INTERVAL '2 hours'),
      
      (test_creator_1_id, 'Schedule Change Request', 
       'I need to reschedule my upcoming shoot from next Tuesday to Thursday. Is this possible? The original time was 2 PM.', 
       'open', NULL, NULL, NOW() - INTERVAL '5 hours'),
      
      (test_creator_1_id, 'Payment Timeline Question', 
       'When will I receive payment for the content I submitted last week? I submitted 5 photos and 2 videos on Monday.', 
       'in_progress', 
       'Hi! Your payment is scheduled to be processed this Friday. You should receive it by Monday at the latest. We will send you a confirmation email once it is sent.', 
       NOW() - INTERVAL '1 day',
       NOW() - INTERVAL '3 days'),
      
      (test_creator_1_id, 'Upload Issue Fixed', 
       'I was having trouble uploading large video files yesterday. They kept failing at 80%. Can you look into this?', 
       'resolved', 
       'Thank you for reporting this! We identified a server issue that was causing large uploads to fail. This has now been fixed. Please try uploading again and let us know if you experience any issues.', 
       NOW() - INTERVAL '2 days',
       NOW() - INTERVAL '4 days'),
      
      (test_creator_1_id, 'Contract Signature Help', 
       'I completed signing my contract but I am not sure if it went through. Can you confirm you received it?', 
       'resolved', 
       'Yes, we can confirm we received your signed contract on file. Everything looks good! You are all set to continue with your onboarding. Welcome to the team!', 
       NOW() - INTERVAL '5 days',
       NOW() - INTERVAL '6 days')
    ON CONFLICT DO NOTHING;

    -- Add ticket for second creator if exists
    IF test_creator_2_id IS NOT NULL AND test_creator_2_id != test_creator_1_id THEN
      INSERT INTO support_tickets (user_id, subject, message, status, created_at)
      VALUES
        (test_creator_2_id, 'Meeting Not Showing', 
         'My meeting details are not appearing in my dashboard. I scheduled it last week but now I cannot see any information about it.', 
         'open', NOW() - INTERVAL '1 hour')
      ON CONFLICT DO NOTHING;
    END IF;

    -- ============================================
    -- STUDIO SHOOTS TEST DATA
    -- ============================================
    
    -- Upcoming Shoot 1
    INSERT INTO studio_shoots (
      user_id, title, shoot_date, location, description, 
      duration_hours, status, crew_size, video_staff_name, photo_staff_name,
      equipment_needed, special_requirements, marketing_notes
    )
    VALUES (
      test_creator_1_id,
      'Red Light Window Solo Shoot',
      NOW() + INTERVAL '3 days',
      'Studio A - Red Light District Theme',
      'Solo content shoot featuring red light window aesthetic with Amsterdam vibes',
      2,
      'confirmed',
      3,
      'Marco V.',
      'Sophie L.',
      '4K camera, lighting kit, red accent lights, window props',
      'Please arrive 15 minutes early for makeup. Bring 3 outfit options.',
      'Focus on mysterious, alluring aesthetic. Target audience: European market.'
    )
    RETURNING id INTO shoot_1_id;

    INSERT INTO shoot_participants (shoot_id, user_id, role, response_status, invited_at, responded_at)
    VALUES (shoot_1_id, test_creator_1_id, 'primary', 'confirmed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');

    -- Upcoming Shoot 2 (multi-participant)
    IF test_creator_2_id IS NOT NULL AND test_creator_2_id != test_creator_1_id THEN
      INSERT INTO studio_shoots (
        user_id, title, shoot_date, location, description, 
        duration_hours, status, crew_size, video_staff_name, photo_staff_name,
        equipment_needed, budget, marketing_notes
      )
      VALUES (
        test_creator_2_id,
        'Duo Collab: Amsterdam Nights',
        NOW() + INTERVAL '5 days',
        'Studio B - Premium Suite',
        'Collaborative content with two creators, luxury hotel theme',
        3,
        'confirmed',
        4,
        'Lucas M.',
        'Nina P.',
        '2x 4K cameras, luxury bedroom set, ambient lighting, champagne props',
        500,
        'High-end luxury content. Both creators to be featured equally.'
      )
      RETURNING id INTO shoot_2_id;

      INSERT INTO shoot_participants (shoot_id, user_id, role, response_status, invited_at, responded_at)
      VALUES 
        (shoot_2_id, test_creator_2_id, 'primary', 'confirmed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
        (shoot_2_id, test_creator_1_id, 'participant', 'pending', NOW() - INTERVAL '1 day', NULL);
    END IF;

    -- Past Shoot 1
    INSERT INTO studio_shoots (
      user_id, title, shoot_date, location, description, 
      duration_hours, status, video_staff_name, photo_staff_name
    )
    VALUES (
      test_creator_1_id,
      'Behind the Curtains: Canal Views',
      NOW() - INTERVAL '10 days',
      'Studio A',
      'Solo shoot with Amsterdam canal backdrop theme',
      2,
      'completed',
      'Marco V.',
      'Sophie L.'
    )
    RETURNING id INTO shoot_3_id;

    INSERT INTO shoot_participants (shoot_id, user_id, role, response_status, invited_at, responded_at)
    VALUES (shoot_3_id, test_creator_1_id, 'primary', 'confirmed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days');

    -- Past Shoot 2
    INSERT INTO studio_shoots (
      user_id, title, shoot_date, location, description, 
      duration_hours, status, photo_staff_name
    )
    VALUES (
      test_creator_1_id,
      'Spring Collection: Tulip Gardens',
      NOW() - INTERVAL '20 days',
      'Outdoor Location - Vondelpark',
      'Outdoor spring-themed photo shoot',
      1.5,
      'completed',
      'Nina P.'
    )
    RETURNING id INTO shoot_4_id;

    INSERT INTO shoot_participants (shoot_id, user_id, role, response_status, invited_at, responded_at)
    VALUES (shoot_4_id, test_creator_1_id, 'primary', 'confirmed', NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days');

    -- ============================================
    -- IMPROVE MEETING DATA
    -- ============================================
    
    UPDATE creator_meetings
    SET 
      meeting_date = NOW() + INTERVAL '7 days',
      meeting_time = '14:00',
      status = 'confirmed',
      meeting_type = 'online',
      meeting_link = 'https://meet.google.com/abc-defg-hij'
    WHERE user_id = test_creator_1_id 
      AND (meeting_date IS NULL OR status = 'not_booked')
      AND NOT EXISTS (
        SELECT 1 FROM creator_meetings cm2 
        WHERE cm2.user_id = test_creator_1_id 
        AND cm2.status IN ('confirmed', 'completed')
      );

  END IF;

END $$;