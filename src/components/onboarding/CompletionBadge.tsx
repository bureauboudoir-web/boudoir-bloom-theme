import { CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompletionBadgeProps {
  isComplete: boolean;
  isEmpty: boolean;
}

export const CompletionBadge = ({ isComplete, isEmpty }: CompletionBadgeProps) => {
  if (isComplete) {
    return (
      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Complete
      </Badge>
    );
  }
  
  if (isEmpty) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <Circle className="h-3 w-3 mr-1" />
        Empty
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
      <AlertCircle className="h-3 w-3 mr-1" />
      Partial
    </Badge>
  );
};