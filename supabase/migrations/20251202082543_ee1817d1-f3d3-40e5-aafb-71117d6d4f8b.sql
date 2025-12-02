-- Add missing columns to uploads table
ALTER TABLE uploads 
ADD COLUMN IF NOT EXISTS file_name text,
ADD COLUMN IF NOT EXISTS file_size bigint,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add trigger for updated_at if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_uploads_updated_at'
  ) THEN
    CREATE TRIGGER update_uploads_updated_at
      BEFORE UPDATE ON uploads
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_uploads_creator_id ON uploads(creator_id);
CREATE INDEX IF NOT EXISTS idx_uploads_emotional_category ON uploads(emotional_category);