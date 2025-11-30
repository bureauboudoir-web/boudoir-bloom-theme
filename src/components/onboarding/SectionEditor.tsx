import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, AlertCircle, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionEditorProps {
  sectionId: number;
  title: string;
  icon: ReactNode;
  description: string;
  children: ReactNode;
  isLocked?: boolean;
  isComplete?: boolean;
  onSave: () => Promise<void>;
  className?: string;
}

export const SectionEditor = ({
  sectionId,
  title,
  icon,
  description,
  children,
  isLocked = false,
  isComplete = false,
  onSave,
  className
}: SectionEditorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      await onSave();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn("border-primary/20 bg-card", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-primary">{icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold">{title}</h3>
                {isComplete && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                )}
                {isLocked && (
                  <Badge className="bg-muted text-muted-foreground">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {saveStatus === 'success' && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Section saved successfully!</AlertDescription>
          </Alert>
        )}

        {saveStatus === 'error' && (
          <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to save. Please try again.</AlertDescription>
          </Alert>
        )}

        {isLocked ? (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Complete your introduction meeting to unlock this section.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {children}
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isLocked}
              className="w-full glow-red"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Section
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};