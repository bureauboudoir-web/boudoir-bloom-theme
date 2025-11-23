import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface ContractAmendmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  currentData: any;
}

export const ContractAmendmentDialog = ({ 
  open, 
  onOpenChange, 
  contractId, 
  currentData 
}: ContractAmendmentDialogProps) => {
  const [amendmentType, setAmendmentType] = useState<string>("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newRevenueSplit, setNewRevenueSplit] = useState("");
  const [amendmentReason, setAmendmentReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amendmentType || !amendmentReason) {
      toast.error("Please select amendment type and provide reason");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare updated contract data
      const updatedData = { ...currentData };
      
      if (amendmentType === "extend" && newEndDate) {
        updatedData.contract_end_date = newEndDate;
        updatedData.amendment_history = [
          ...(currentData.amendment_history || []),
          {
            type: "extension",
            date: new Date().toISOString(),
            old_end_date: currentData.contract_end_date,
            new_end_date: newEndDate,
            reason: amendmentReason,
          },
        ];
      } else if (amendmentType === "revenue" && newRevenueSplit) {
        const [creator, agency] = newRevenueSplit.split("/");
        updatedData.percentage_split_creator = creator;
        updatedData.percentage_split_agency = agency;
        updatedData.amendment_history = [
          ...(currentData.amendment_history || []),
          {
            type: "revenue_change",
            date: new Date().toISOString(),
            old_split: `${currentData.percentage_split_creator}/${currentData.percentage_split_agency}`,
            new_split: newRevenueSplit,
            reason: amendmentReason,
          },
        ];
      } else if (amendmentType === "terms") {
        updatedData.amendment_history = [
          ...(currentData.amendment_history || []),
          {
            type: "terms_update",
            date: new Date().toISOString(),
            changes: amendmentReason,
          },
        ];
      }

      // Update contract in database
      const { error } = await supabase
        .from("creator_contracts")
        .update({
          contract_data: updatedData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", contractId);

      if (error) throw error;

      // Create notification
      await supabase.from("notification_history").insert({
        user_id: currentData.creator_id,
        title: "Contract Amendment",
        description: `Your contract has been amended: ${amendmentType}. Reason: ${amendmentReason}`,
        notification_type: "contract_amendment",
        priority: "high",
      });

      toast.success("Contract amendment saved successfully");
      onOpenChange(false);
      
      // Reset form
      setAmendmentType("");
      setNewEndDate("");
      setNewRevenueSplit("");
      setAmendmentReason("");
    } catch (error) {
      console.error("Error amending contract:", error);
      toast.error("Failed to amend contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-rose-gold">Contract Amendment</DialogTitle>
          <DialogDescription>
            Create an official amendment to the existing contract
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Amendment Type</Label>
            <Select value={amendmentType} onValueChange={setAmendmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type of amendment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="extend">Extend Contract Duration</SelectItem>
                <SelectItem value="revenue">Change Revenue Split</SelectItem>
                <SelectItem value="terms">Update Terms & Conditions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {amendmentType === "extend" && (
            <div className="space-y-2">
              <Label>New End Date</Label>
              <Input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                min={currentData.contract_end_date}
              />
              <p className="text-xs text-muted-foreground">
                Current end date: {currentData.contract_end_date}
              </p>
            </div>
          )}

          {amendmentType === "revenue" && (
            <div className="space-y-2">
              <Label>New Revenue Split</Label>
              <Select value={newRevenueSplit} onValueChange={setNewRevenueSplit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new split" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50/50">50% / 50%</SelectItem>
                  <SelectItem value="60/40">60% / 40%</SelectItem>
                  <SelectItem value="70/30">70% / 30%</SelectItem>
                  <SelectItem value="80/20">80% / 20%</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Current split: Creator {currentData.percentage_split_creator}% / Agency {currentData.percentage_split_agency}%
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Reason for Amendment</Label>
            <Textarea
              value={amendmentReason}
              onChange={(e) => setAmendmentReason(e.target.value)}
              placeholder="Provide detailed reason for this amendment..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-rose-gold hover:bg-rose-gold/90"
            >
              {isSubmitting ? "Saving..." : "Save Amendment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};