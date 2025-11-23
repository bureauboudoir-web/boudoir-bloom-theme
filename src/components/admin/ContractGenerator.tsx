import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ContractPreview } from "./ContractPreview";
import { useContractGeneration } from "@/hooks/useContractGeneration";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContractData {
  creator_id: string;
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
  termination_notice_days: number;
  post_termination_rights_days: number;
  contract_version?: string;
}

interface ContractGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorId?: string;
}

export const ContractGenerator = ({ open, onOpenChange, creatorId }: ContractGeneratorProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { generateContract, isGenerating } = useContractGeneration();
  const [contractData, setContractData] = useState<ContractData>({
    creator_id: "",
    creator_name: "",
    creator_dob: "",
    creator_address: "",
    percentage_split_creator: "60",
    percentage_split_agency: "40",
    contract_term_months: "12",
    contract_start_date: format(new Date(), "yyyy-MM-dd"),
    contract_end_date: "",
    custom_clauses: "",
    agency_representative: "Maikel Tensen",
    agency_address: "Oude Kerksplein 18 hs, Amsterdam",
    agency_kvk: "73001899",
    auto_renew: true,
    termination_notice_days: 30,
    post_termination_rights_days: 90,
    contract_version: "long",
  });

  // Fetch creators for selection
  const { data: creators } = useQuery({
    queryKey: ["creators-for-contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name");
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch onboarding data when creator selected
  const { data: onboardingData } = useQuery({
    queryKey: ["onboarding-data", contractData.creator_id],
    queryFn: async () => {
      if (!contractData.creator_id) return null;
      
      const { data, error } = await supabase
        .from("onboarding_data")
        .select("*")
        .eq("user_id", contractData.creator_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contractData.creator_id,
  });

  // Auto-populate from onboarding data
  useEffect(() => {
    if (onboardingData) {
      setContractData((prev) => ({
        ...prev,
        creator_name: onboardingData.personal_full_name || prev.creator_name,
        creator_dob: onboardingData.personal_date_of_birth || prev.creator_dob,
        creator_address: onboardingData.personal_location || prev.creator_address,
      }));
    }
  }, [onboardingData]);

  // Calculate end date based on start date and term
  useEffect(() => {
    if (contractData.contract_start_date && contractData.contract_term_months) {
      const startDate = new Date(contractData.contract_start_date);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + parseInt(contractData.contract_term_months));
      setContractData((prev) => ({
        ...prev,
        contract_end_date: format(endDate, "yyyy-MM-dd"),
      }));
    }
  }, [contractData.contract_start_date, contractData.contract_term_months]);

  // Pre-select creator if passed as prop
  useEffect(() => {
    if (creatorId && creators) {
      const creator = creators.find((c) => c.id === creatorId);
      if (creator) {
        setContractData((prev) => ({
          ...prev,
          creator_id: creatorId,
          creator_name: creator.full_name || "",
        }));
      }
    }
  }, [creatorId, creators]);

  const handleNext = () => {
    if (step === 1) {
      if (!contractData.creator_id || !contractData.creator_name) {
        toast.error("Please select a creator and fill in required fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const result = await generateContract(contractData);
      console.log("Contract generated:", result);
      toast.success("Contract PDF generated successfully!");
      
      // Wait a moment to show success message, then close
      setTimeout(() => {
        onOpenChange(false);
        setStep(1); // Reset to step 1 for next use
      }, 2000);
    } catch (error) {
      console.error("Failed to generate contract:", error);
      // Error toast already shown in useContractGeneration
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-rose-gold">
            Generate Creator Contract
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Step 1: Enter contract details"}
            {step === 2 && "Step 2: Preview contract"}
            {step === 3 && "Step 3: Generate & save"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Form */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="creator">Creator *</Label>
                  <Select
                    value={contractData.creator_id}
                    onValueChange={(value) => {
                      const creator = creators?.find((c) => c.id === value);
                      setContractData({
                        ...contractData,
                        creator_id: value,
                        creator_name: creator?.full_name || "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a creator" />
                    </SelectTrigger>
                    <SelectContent>
                      {creators?.map((creator) => (
                        <SelectItem key={creator.id} value={creator.id}>
                          {creator.full_name || creator.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contract_version">Contract Version *</Label>
                  <Select
                    value={contractData.contract_version}
                    onValueChange={(value) =>
                      setContractData({ ...contractData, contract_version: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 pages)</SelectItem>
                      <SelectItem value="medium">Medium (3-4 pages)</SelectItem>
                      <SelectItem value="long">Long/Comprehensive (5+ pages)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Short for simple agreements, Long for complete legal documentation
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creator_name">Full Name *</Label>
                    <Input
                      id="creator_name"
                      value={contractData.creator_name}
                      onChange={(e) =>
                        setContractData({ ...contractData, creator_name: e.target.value })
                      }
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creator_dob">Date of Birth *</Label>
                    <Input
                      id="creator_dob"
                      type="date"
                      value={contractData.creator_dob}
                      onChange={(e) =>
                        setContractData({ ...contractData, creator_dob: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creator_address">Address *</Label>
                  <Textarea
                    id="creator_address"
                    value={contractData.creator_address}
                    onChange={(e) =>
                      setContractData({ ...contractData, creator_address: e.target.value })
                    }
                    placeholder="Street, City, Country"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Revenue Split</Label>
                    <Select
                      value={`${contractData.percentage_split_creator}/${contractData.percentage_split_agency}`}
                      onValueChange={(value) => {
                        const [creator, agency] = value.split("/");
                        setContractData({
                          ...contractData,
                          percentage_split_creator: creator,
                          percentage_split_agency: agency,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50/50">50% / 50%</SelectItem>
                        <SelectItem value="60/40">60% / 40% (Default)</SelectItem>
                        <SelectItem value="70/30">70% / 30%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Contract Term</Label>
                    <Select
                      value={contractData.contract_term_months}
                      onValueChange={(value) =>
                        setContractData({ ...contractData, contract_term_months: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months (Default)</SelectItem>
                        <SelectItem value="18">18 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={contractData.contract_start_date}
                      onChange={(e) =>
                        setContractData({ ...contractData, contract_start_date: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date (Auto-calculated)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={contractData.contract_end_date}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_clauses">Custom Clauses (Optional)</Label>
                  <Textarea
                    id="custom_clauses"
                    value={contractData.custom_clauses}
                    onChange={(e) =>
                      setContractData({ ...contractData, custom_clauses: e.target.value })
                    }
                    placeholder="Add any custom terms or conditions..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNext} className="bg-rose-gold hover:bg-rose-gold/90">
                Next: Preview <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <div className="space-y-4">
            <ContractPreview contractData={contractData} />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Edit
              </Button>
              <Button onClick={handleNext} className="bg-rose-gold hover:bg-rose-gold/90">
                Generate PDF <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-5xl">✨</div>
                  <h3 className="text-xl font-semibold text-green-800">
                    Ready to Generate Contract
                  </h3>
                  <p className="text-green-700">
                    Contract for {contractData.creator_name} is ready. PDF generation will be
                    available in Session 2.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={isGenerating}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Preview
              </Button>
              <Button 
                onClick={handleGeneratePDF} 
                className="bg-rose-gold hover:bg-rose-gold/90"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating PDF..." : "Generate PDF & Send"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
