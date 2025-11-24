import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { CreatorStage, getStageInfo } from "@/lib/creatorStageUtils";

interface GrantAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
  creatorEmail: string;
  creatorStage?: CreatorStage;
  onConfirm: (reason?: string) => Promise<void>;
}

export const GrantAccessDialog = ({
  open,
  onOpenChange,
  creatorName,
  creatorEmail,
  creatorStage,
  onConfirm,
}: GrantAccessDialogProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(reason || undefined);
      setReason("");
    } finally {
      setLoading(false);
    }
  };

  const stageInfo = creatorStage ? getStageInfo(creatorStage) : null;
  const isEarlyAccess = creatorStage !== 'meeting_completed';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEarlyAccess ? 'Grant Early Access' : 'Grant Full Dashboard Access'}
          </DialogTitle>
          <DialogDescription>
            {isEarlyAccess 
              ? 'This creator has not completed their meeting yet. Granting early access will bypass the meeting requirement.'
              : 'Meeting completed successfully. Ready to grant full dashboard access to all creator features.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {stageInfo && (
            <div className={`flex items-start gap-3 p-3 rounded-md border ${
              isEarlyAccess ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20'
            }`}>
              {isEarlyAccess ? (
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              )}
              <div className="space-y-2 flex-1">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Creator</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>{creatorName}</strong> ({creatorEmail})
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current Stage</p>
                  <Badge variant="secondary" className={stageInfo.color}>
                    {stageInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    Current: Meeting Only
                  </Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    New: Full Dashboard Access
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">
              {isEarlyAccess ? 'Reason (Required for Early Access)' : 'Reason (Optional)'}
            </Label>
            <Textarea
              id="reason"
              placeholder={isEarlyAccess 
                ? "e.g., Known creator, trusted contact, urgent requirement..." 
                : "e.g., Great meeting, ready to start..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This will be logged in the audit trail for reference.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Granting Access..." : "Grant Full Access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
