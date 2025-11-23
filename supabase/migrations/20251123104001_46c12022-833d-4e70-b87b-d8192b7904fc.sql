-- Migration 1: Extend creator_contracts table with new fields
ALTER TABLE creator_contracts ADD COLUMN IF NOT EXISTS contract_data JSONB;
ALTER TABLE creator_contracts ADD COLUMN IF NOT EXISTS contract_version TEXT DEFAULT 'long';
ALTER TABLE creator_contracts ADD COLUMN IF NOT EXISTS generated_pdf_url TEXT;
ALTER TABLE creator_contracts ADD COLUMN IF NOT EXISTS template_version TEXT DEFAULT '1.0';
ALTER TABLE creator_contracts ADD COLUMN IF NOT EXISTS digital_signature_creator TEXT;
ALTER TABLE creator_contracts ADD COLUMN IF NOT EXISTS digital_signature_agency TEXT;
ALTER TABLE creator_contracts ADD COLUMN IF NOT EXISTS signature_date TIMESTAMPTZ;
ALTER TABLE creator_contracts ADD COLUMN IF NOT EXISTS generation_status TEXT DEFAULT 'pending';

-- Migration 2: Create contract_templates table
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  template_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- Only admins can read templates
CREATE POLICY "Admins can read contract templates"
ON contract_templates FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- Only admins can insert/update templates
CREATE POLICY "Admins can manage contract templates"
ON contract_templates FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- Insert default LONG contract template
INSERT INTO contract_templates (version, template_content) VALUES (
  'long',
  '<!DOCTYPE html>
<html>
<head>
  <style>
    @import url(''https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap'');
    body { font-family: ''Inter'', sans-serif; color: #000; line-height: 1.8; padding: 60px; background: #fff; }
    .header { text-align: center; border-bottom: 3px solid #D4AF37; padding-bottom: 30px; margin-bottom: 40px; }
    .logo { height: 100px; margin-bottom: 20px; }
    h1 { font-family: ''Playfair Display'', serif; color: #D4AF37; font-size: 32px; margin: 0; }
    h2 { font-family: ''Playfair Display'', serif; color: #8B0000; font-size: 24px; border-bottom: 1px solid #D4AF37; padding-bottom: 10px; margin-top: 40px; }
    .section { margin: 30px 0; padding: 20px 0; }
    .highlight { background: rgba(212, 175, 55, 0.1); padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <img src="{{bb_logo_url}}" class="logo" alt="Bureau Boudoir">
    <h1>CREATOR AGREEMENT</h1>
  </div>
  
  <div class="section">
    <p><strong>Agency:</strong> Bureau Boudoir, {{agency_address}}, KvK {{agency_kvk}}</p>
    <p><strong>Represented by:</strong> {{agency_representative}}</p>
    <p><strong>Creator:</strong> {{creator_name}}, born {{creator_dob}}, residing at {{creator_address}}</p>
  </div>
  
  <div class="highlight">
    <h2>Revenue Split</h2>
    <p style="font-size: 18px;">
      Creator receives <strong>{{percentage_split_creator}}%</strong><br>
      Agency receives <strong>{{percentage_split_agency}}%</strong>
    </p>
  </div>
  
  <div class="section">
    <h2>Contract Term</h2>
    <p>Duration: <strong>{{contract_term_months}} months</strong></p>
    <p>Start Date: <strong>{{contract_start_date}}</strong></p>
    <p>End Date: <strong>{{contract_end_date}}</strong></p>
    <p>Auto-Renewal: <strong>{{auto_renew}}</strong></p>
  </div>

  <div class="section">
    <h2>1. Purpose of Cooperation</h2>
    <p>The Creator appoints the Agency as her exclusive management partner for the development, marketing, and monetization of adult content on digital platforms.</p>
  </div>

  <div class="section">
    <h2>2. Services Provided by the Agency</h2>
    <p>The Agency provides comprehensive management including content strategy, marketing, platform management, and professional development.</p>
  </div>

  <div class="section">
    <h2>3. Creator Obligations</h2>
    <p>The Creator commits to producing high-quality content as agreed, maintaining professional standards, and collaborating with the Agency team.</p>
  </div>

  <div class="section">
    <h2>4. Financial Terms</h2>
    <p>Revenue split as defined above. Monthly invoicing and payment within 30 days.</p>
  </div>

  <div class="section">
    <h2>5. Content Ownership and Rights</h2>
    <p>All content created remains the intellectual property of the Creator. The Agency receives license for marketing and distribution.</p>
  </div>

  <div class="section">
    <h2>6. Termination</h2>
    <p>Either party may terminate with {{termination_notice_days}} days written notice. Post-termination rights apply for {{post_termination_rights_days}} days.</p>
  </div>

  {{#if custom_clauses}}
  <div class="section">
    <h2>Custom Clauses</h2>
    <div class="highlight">{{custom_clauses}}</div>
  </div>
  {{/if}}
</body>
</html>'
) ON CONFLICT (version) DO NOTHING;