-- Set replica identity to FULL for complete row data in realtime events
ALTER TABLE creator_meetings REPLICA IDENTITY FULL;