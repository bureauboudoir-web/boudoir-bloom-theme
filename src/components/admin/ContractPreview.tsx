import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContractData {
  creator_name: string;
  creator_dob: string;
  creator_address: string;
  percentage_split_creator: string;
  percentage_split_agency: string;
  contract_term_months: string;
  contract_start_date: string;
  contract_end_date: string;
  custom_clauses: string;
  agency_representative: string;
  agency_address: string;
  agency_kvk: string;
  auto_renew: boolean;
}

interface ContractPreviewProps {
  contractData: ContractData;
}

export const ContractPreview = ({ contractData }: ContractPreviewProps) => {
  return (
    <Card className="max-h-[600px] overflow-y-auto">
      <CardContent className="pt-6 space-y-6 font-serif">
        {/* Header */}
        <div className="text-center border-b-2 border-rose-gold pb-6 mb-6">
          <h1 className="text-3xl font-bold text-rose-gold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            BUREAU BOUDOIR
          </h1>
          <h2 className="text-xl text-glow-red" style={{ fontFamily: 'Playfair Display, serif' }}>
            CREATOR AGREEMENT
          </h2>
        </div>

        {/* Parties */}
        <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border">
          <div>
            <span className="font-semibold text-foreground">Agency: </span>
            <span className="text-muted-foreground">
              Bureau Boudoir, {contractData.agency_address}, KvK {contractData.agency_kvk}
            </span>
          </div>
          <div>
            <span className="font-semibold text-foreground">Represented by: </span>
            <span className="text-muted-foreground">{contractData.agency_representative}</span>
          </div>
          <div>
            <span className="font-semibold text-foreground">Creator: </span>
            <span className="text-muted-foreground">
              {contractData.creator_name}, born {contractData.creator_dob}, residing at{" "}
              {contractData.creator_address}
            </span>
          </div>
        </div>

        {/* Revenue Split - Highlighted */}
        <div className="bg-rose-gold/10 border-l-4 border-rose-gold p-4 rounded-r-lg">
          <h3 className="text-lg font-bold text-glow-red mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Revenue Split
          </h3>
          <p className="text-lg leading-relaxed text-foreground">
            Creator receives <strong className="text-rose-gold">{contractData.percentage_split_creator}%</strong>
            <br />
            Agency receives <strong className="text-rose-gold">{contractData.percentage_split_agency}%</strong>
          </p>
        </div>

        {/* Contract Term */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-glow-red border-b border-rose-gold pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Contract Term
          </h3>
          <div className="space-y-1 pl-4">
            <p className="text-foreground">
              <span className="font-semibold">Duration:</span> {contractData.contract_term_months} months
            </p>
            <p className="text-foreground">
              <span className="font-semibold">Start Date:</span> {contractData.contract_start_date}
            </p>
            <p className="text-foreground">
              <span className="font-semibold">End Date:</span> {contractData.contract_end_date}
            </p>
            <p className="text-foreground">
              <span className="font-semibold">Auto-Renewal:</span>{" "}
              {contractData.auto_renew ? "YES" : "NO"}
            </p>
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-glow-red border-b border-rose-gold pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            1. Purpose of Cooperation
          </h3>
          <p className="text-muted-foreground leading-relaxed pl-4">
            The Creator appoints the Agency as her exclusive management partner for the
            development, marketing, and monetization of adult content on digital platforms.
          </p>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-glow-red border-b border-rose-gold pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            2. Services Provided by the Agency
          </h3>
          <p className="text-muted-foreground leading-relaxed pl-4">
            The Agency provides comprehensive management including content strategy, marketing,
            platform management, and professional development.
          </p>
        </div>

        {/* Obligations */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-glow-red border-b border-rose-gold pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            3. Creator Obligations
          </h3>
          <p className="text-muted-foreground leading-relaxed pl-4">
            The Creator commits to producing high-quality content as agreed, maintaining
            professional standards, and collaborating with the Agency team.
          </p>
        </div>

        {/* Financial Terms */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-glow-red border-b border-rose-gold pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            4. Financial Terms
          </h3>
          <p className="text-muted-foreground leading-relaxed pl-4">
            Revenue split as defined above. Monthly invoicing and payment within 30 days.
          </p>
        </div>

        {/* Content Ownership */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-glow-red border-b border-rose-gold pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            5. Content Ownership and Rights
          </h3>
          <p className="text-muted-foreground leading-relaxed pl-4">
            All content created remains the intellectual property of the Creator. The Agency
            receives license for marketing and distribution.
          </p>
        </div>

        {/* Termination */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-glow-red border-b border-rose-gold pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            6. Termination
          </h3>
          <p className="text-muted-foreground leading-relaxed pl-4">
            Either party may terminate with 30 days written notice. Post-termination rights apply
            for 90 days.
          </p>
        </div>

        {/* Custom Clauses */}
        {contractData.custom_clauses && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-glow-red border-b border-rose-gold pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Custom Clauses
            </h3>
            <div className="bg-rose-gold/10 p-4 rounded-lg">
              <p className="text-foreground whitespace-pre-wrap">{contractData.custom_clauses}</p>
            </div>
          </div>
        )}

        {/* Signature Placeholders */}
        <div className="grid grid-cols-2 gap-6 pt-6 mt-6 border-t-2 border-rose-gold">
          <div className="space-y-4">
            <p className="font-semibold text-foreground">Agency Representative</p>
            <p className="text-muted-foreground">{contractData.agency_representative}</p>
            <div className="border-t-2 border-foreground/20 pt-2 mt-12">
              <p className="text-sm text-muted-foreground">Signature</p>
            </div>
            <p className="text-sm text-muted-foreground">Date: _______________</p>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-foreground">Creator</p>
            <p className="text-muted-foreground">{contractData.creator_name}</p>
            <div className="border-t-2 border-foreground/20 pt-2 mt-12">
              <p className="text-sm text-muted-foreground">Signature</p>
            </div>
            <p className="text-sm text-muted-foreground">Date: _______________</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border">
          <p>Bureau Boudoir | Amsterdam | {contractData.agency_kvk}</p>
        </div>
      </CardContent>
    </Card>
  );
};
