-- Add new columns to content_uploads for better categorization
ALTER TABLE content_uploads 
ADD COLUMN IF NOT EXISTS content_category text CHECK (content_category IN (
  'video', 'photo', 'script', 'hook', 'marketing_artwork', 'other'
)),
ADD COLUMN IF NOT EXISTS platform_type text CHECK (platform_type IN (
  'tiktok', 'instagram', 'youtube', 'twitter', 'onlyfans', 'fansly', 'telegram', 'other'
)),
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS usage_rights text,
ADD COLUMN IF NOT EXISTS hashtags text[],
ADD COLUMN IF NOT EXISTS title text;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_uploads_category ON content_uploads(content_category);
CREATE INDEX IF NOT EXISTS idx_content_uploads_platform ON content_uploads(platform_type);
CREATE INDEX IF NOT EXISTS idx_content_uploads_featured ON content_uploads(is_featured);
CREATE INDEX IF NOT EXISTS idx_content_uploads_status ON content_uploads(status);
CREATE INDEX IF NOT EXISTS idx_content_uploads_uploaded_at ON content_uploads(uploaded_at DESC);

COMMENT ON COLUMN content_uploads.content_category IS 'Primary content type: video, photo, script, hook, marketing_artwork, other';
COMMENT ON COLUMN content_uploads.platform_type IS 'Target platform: tiktok, instagram, youtube, twitter, onlyfans, fansly, telegram, other';
COMMENT ON COLUMN content_uploads.is_featured IS 'Manager-marked exceptional content';
COMMENT ON COLUMN content_uploads.usage_rights IS 'Notes about where/how content can be used';
COMMENT ON COLUMN content_uploads.hashtags IS 'Array of hashtags for searching and filtering';
COMMENT ON COLUMN content_uploads.title IS 'Content title for better organization';