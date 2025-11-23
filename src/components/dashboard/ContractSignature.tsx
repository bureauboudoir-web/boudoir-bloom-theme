import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Eraser, Pen, Undo2, Redo2 } from "lucide-react";

interface ContractSignatureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignatureSubmit: (signatureData: string) => Promise<void>;
  contractData?: {
    creator_name: string;
    percentage_split_creator: string;
    percentage_split_agency: string;
    contract_term_months: string;
    contract_start_date: string;
  };
}

export const ContractSignature = ({
  open,
  onOpenChange,
  onSignatureSubmit,
  contractData,
}: ContractSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [penSize, setPenSize] = useState(2);
  const [penColor, setPenColor] = useState("#000000");
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      clearSignature();
      setAgreedToTerms(false);
      setHistory([]);
      setHistoryStep(-1);
    }
  }, [open]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Set drawing style
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [open]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  // Touch events for mobile
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newStep = historyStep - 1;
    setHistoryStep(newStep);

    if (newStep === -1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    } else {
      const img = new Image();
      img.src = history[newStep];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const redo = () => {
    if (historyStep >= history.length - 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newStep = historyStep + 1;
    setHistoryStep(newStep);

    const img = new Image();
    img.src = history[newStep];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHasSignature(true);
    };
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setHistory([]);
    setHistoryStep(-1);
  };

  const handleSubmit = async () => {
    if (!hasSignature) {
      toast.error("Please sign before submitting");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);
    try {
      // Convert canvas to base64 PNG
      const signatureData = canvas.toDataURL("image/png");
      await onSignatureSubmit(signatureData);
      toast.success("Contract signed successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting signature:", error);
      toast.error("Failed to submit signature");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-rose-gold">
            Sign Your Contract
          </DialogTitle>
          <DialogDescription>
            Review the key terms and sign below to finalize your agreement
          </DialogDescription>
        </DialogHeader>

        {/* Contract Summary */}
        {contractData && (
          <Card className="bg-muted/30 border-rose-gold/20">
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold text-foreground mb-3">Contract Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Your Name:</span>
                  <p className="font-medium text-foreground">{contractData.creator_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Revenue Split:</span>
                  <p className="font-medium text-foreground">
                    {contractData.percentage_split_creator}% / {contractData.percentage_split_agency}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Contract Term:</span>
                  <p className="font-medium text-foreground">{contractData.contract_term_months} months</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <p className="font-medium text-foreground">{contractData.contract_start_date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signature Canvas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-foreground">
              <Pen className="inline h-4 w-4 mr-2" />
              Your Signature
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyStep <= -1}
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
                disabled={!hasSignature}
              >
                <Eraser className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Pen Controls */}
          <div className="flex items-center gap-6 p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-foreground">Pen Size:</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 5].map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={penSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPenSize(size)}
                    className="w-10 h-10 p-0"
                  >
                    <div
                      className="rounded-full bg-current"
                      style={{ width: `${size * 2}px`, height: `${size * 2}px` }}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-foreground">Color:</Label>
              <div className="flex gap-2">
                {["#000000", "#1a56db", "#c81e1e", "#0e9f6e"].map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPenColor(color)}
                    className={`w-10 h-10 p-0 ${penColor === color ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <Card className="border-2 border-dashed border-rose-gold/30">
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawingTouch}
                onTouchMove={drawTouch}
                onTouchEnd={stopDrawing}
                className="w-full h-48 cursor-crosshair touch-none bg-background"
                style={{ touchAction: "none" }}
              />
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            Draw your signature above using your mouse or touch screen
          </p>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border">
          <Checkbox
            id="agree-terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className="mt-1"
          />
          <Label
            htmlFor="agree-terms"
            className="text-sm leading-relaxed cursor-pointer text-foreground"
          >
            I have read and agree to all terms and conditions outlined in this contract. I
            understand that by signing this document electronically, I am legally bound by its
            terms and my signature has the same legal effect as a handwritten signature.
          </Label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!hasSignature || !agreedToTerms || isSubmitting}
            className="bg-rose-gold hover:bg-rose-gold/90"
          >
            {isSubmitting ? "Signing..." : "Sign Contract"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
