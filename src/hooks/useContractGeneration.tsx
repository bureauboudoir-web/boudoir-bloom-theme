import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const useContractGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContract = async (contractData: ContractData) => {
    setIsGenerating(true);
    try {
      console.log("📄 Generating contract for:", contractData.creator_name);

      const { data, error } = await supabase.functions.invoke("generate-contract-pdf", {
        body: { contractData },
      });

      if (error) {
        console.error("Contract generation error:", error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to generate contract");
      }

      console.log("✅ Contract generated successfully:", data.data);
      toast.success(`Contract generated for ${contractData.creator_name}`);
      
      return data.data;
    } catch (error) {
      console.error("Error in contract generation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate contract";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContract,
    isGenerating,
  };
};
