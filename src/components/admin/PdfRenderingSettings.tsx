import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Check, AlertCircle, Sparkles } from "lucide-react";

export const PdfRenderingSettings = () => {
  const hasPdfShiftKey = false; // This would be checked from backend

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>PDF Rendering Quality</CardTitle>
        </div>
        <CardDescription>
          Configure professional PDF generation for contracts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50">
            <div className="mt-1">
              {hasPdfShiftKey ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Sparkles className="h-5 w-5 text-amber-600" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Current Rendering Engine</span>
                <Badge variant={hasPdfShiftKey ? "default" : "secondary"}>
                  {hasPdfShiftKey ? "Professional (PDFShift)" : "Enhanced (jsPDF)"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {hasPdfShiftKey
                  ? "Using professional HTML-to-PDF service for highest quality output"
                  : "Using enhanced in-house rendering with improved styling and layout"}
              </p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Want professional-grade PDFs?</strong>
              <br />
              <div className="mt-2 space-y-2 text-sm">
                <p>
                  Add the <code className="px-2 py-1 bg-muted rounded text-xs">PDFSHIFT_API_KEY</code> secret to enable:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Perfect HTML/CSS rendering (matching web preview exactly)</li>
                  <li>Complex layouts and multi-page documents</li>
                  <li>Custom fonts and advanced typography</li>
                  <li>High-resolution graphics and images</li>
                  <li>Professional watermarks and headers/footers</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-background border rounded-lg space-y-3">
            <h4 className="font-semibold text-sm">Setup Instructions</h4>
            <ol className="list-decimal ml-4 space-y-2 text-sm text-muted-foreground">
              <li>Sign up for a free account at <a href="https://pdfshift.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pdfshift.io</a></li>
              <li>Get your API key from the dashboard</li>
              <li>Add it as a secret named <code className="px-2 py-1 bg-muted rounded text-xs">PDFSHIFT_API_KEY</code></li>
              <li>Contracts will automatically use professional rendering</li>
            </ol>
            <div className="pt-2 text-xs text-muted-foreground">
              <strong>Note:</strong> The enhanced jsPDF renderer works great for most contracts. Professional rendering is recommended only if you need pixel-perfect HTML/CSS rendering.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <div className="text-sm font-semibold">Enhanced Rendering</div>
              <div className="text-xs text-muted-foreground">
                ✓ Professional styling<br />
                ✓ Multi-page support<br />
                ✓ Custom fonts<br />
                ✓ Fast generation<br />
                ✓ No external dependencies
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold">Professional Rendering</div>
              <div className="text-xs text-muted-foreground">
                ✓ Pixel-perfect HTML/CSS<br />
                ✓ Complex layouts<br />
                ✓ Advanced typography<br />
                ✓ High-resolution output<br />
                ✓ Watermarks & headers
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
