export const mockContractData = {
  creator_id: 'test-user-123',
  creator_name: 'Test Creator',
  creator_dob: '1995-06-15',
  creator_address: '123 Test Street, Amsterdam',
  percentage_split_creator: '60',
  percentage_split_agency: '40',
  contract_term_months: '12',
  contract_start_date: '2025-01-01',
  contract_end_date: '2026-01-01',
  custom_clauses: 'Test custom clauses',
  agency_representative: 'Test Agency Rep',
  agency_address: 'Agency Address, Amsterdam',
  agency_kvk: '12345678',
  auto_renew: true,
  termination_notice_days: 30,
  post_termination_rights_days: 90,
};

export const mockSignatureData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export const createMockContract = (overrides?: Partial<typeof mockContractData>) => ({
  ...mockContractData,
  ...overrides,
});

export const simulateSignature = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(100, 100);
  ctx.lineTo(190, 50);
  ctx.stroke();
};

export const mockContractResponse = {
  id: 'contract-123',
  user_id: 'user-123',
  contract_signed: false,
  signed_at: null,
  digital_signature_creator: null,
  signed_contract_url: null,
  generated_pdf_url: 'https://example.com/contract.pdf',
  contract_version: 'long',
  contract_data: mockContractData,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockSignedContract = {
  ...mockContractResponse,
  contract_signed: true,
  signed_at: new Date().toISOString(),
  digital_signature_creator: mockSignatureData,
  signed_contract_url: 'https://example.com/signed-contract.pdf',
};
