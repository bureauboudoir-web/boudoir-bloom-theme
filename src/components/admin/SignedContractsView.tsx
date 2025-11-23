import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye, RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Contract {
  id: string;
  user_id: string;
  contract_signed: boolean;
  signed_at: string | null;
  digital_signature_creator: string | null;
  signed_contract_url: string | null;
  generated_pdf_url: string | null;
  contract_version: string | null;
  contract_data: any;
}

interface Creator {
  id: string;
  full_name: string;
  email: string;
}

interface SignedContractsViewProps {
  contracts: Record<string, Contract>;
  creators: Creator[];
}

export const SignedContractsView = ({ contracts, creators }: SignedContractsViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "term">("date");
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const signedContracts = Object.entries(contracts)
    .filter(([_, contract]) => contract.contract_signed)
    .map(([userId, contract]) => ({
      ...contract,
      creator: creators.find(c => c.id === userId),
    }))
    .filter(item => item.creator);

  const filteredContracts = signedContracts.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.creator?.full_name?.toLowerCase().includes(query) ||
      item.creator?.email?.toLowerCase().includes(query)
    );
  });

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.signed_at || 0).getTime() - new Date(a.signed_at || 0).getTime();
      case "name":
        return (a.creator?.full_name || "").localeCompare(b.creator?.full_name || "");
      case "term":
        const termA = a.contract_data?.contract_term_months || 0;
        const termB = b.contract_data?.contract_term_months || 0;
        return termA - termB;
      default:
        return 0;
    }
  });

  const handleRegenerateContract = async (contractId: string) => {
    setRegenerating(contractId);
    try {
      const { data, error } = await supabase.functions.invoke('regenerate-signed-contract', {
        body: { contractId },
      });

      if (error) throw error;

      toast.success('Signed contract regenerated successfully');
    } catch (error) {
      console.error('Error regenerating contract:', error);
      toast.error('Failed to regenerate contract');
    } finally {
      setRegenerating(null);
    }
  };

  if (signedContracts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No signed contracts yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by creator name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Signed Date</SelectItem>
            <SelectItem value="name">Creator Name</SelectItem>
            <SelectItem value="term">Contract Term</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contract Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedContracts.map((item) => {
          const contractData = item.contract_data || {};
          const split = `${contractData.percentage_split_creator || 'N/A'}/${contractData.percentage_split_agency || 'N/A'}`;
          const term = contractData.contract_term_months ? `${contractData.contract_term_months}m` : 'N/A';

          return (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                {/* Creator Info */}
                <div>
                  <h3 className="font-semibold text-lg">{item.creator?.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{item.creator?.email}</p>
                </div>

                {/* Signature Preview */}
                {item.digital_signature_creator && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/40">
                    <img
                      src={item.digital_signature_creator}
                      alt="Signature"
                      className="h-16 w-full object-contain"
                    />
                  </div>
                )}

                {/* Contract Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Signed:</span>
                    <span className="font-medium">
                      {item.signed_at ? new Date(item.signed_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Split:</span>
                    <span className="font-medium">{split}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Term:</span>
                    <span className="font-medium">{term}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span className="font-medium capitalize">{item.contract_version || 'N/A'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border/40">
                  <Button
                    onClick={() => window.open(item.signed_contract_url || item.generated_pdf_url!, '_blank')}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={!item.signed_contract_url && !item.generated_pdf_url}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => handleRegenerateContract(item.id)}
                    variant="outline"
                    size="sm"
                    disabled={regenerating === item.id}
                  >
                    <RefreshCw className={`h-4 w-4 ${regenerating === item.id ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {sortedContracts.length} of {signedContracts.length} signed contracts
      </div>
    </div>
  );
};
