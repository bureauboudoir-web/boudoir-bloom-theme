-- Update the valid_language_code constraint to support all 25 languages
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_language_code;

ALTER TABLE profiles ADD CONSTRAINT valid_language_code 
  CHECK (preferred_language = ANY (ARRAY[
    'en', 'es', 'fr', 'it', 'ru', 'nl', 'de', 'pt', 'zh', 'ja', 
    'ko', 'ar', 'hi', 'tr', 'pl', 'sv', 'no', 'da', 'fi', 'el', 
    'cs', 'hu', 'ro', 'th', 'vi'
  ]));