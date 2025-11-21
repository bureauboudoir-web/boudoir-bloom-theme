import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ContractData {
  id: string;
  contract_template_url: string | null;
  signed_contract_url: string | null;
  contract_signed: boolean;
  template_uploaded_at: string | null;
  signed_at: string | null;
}

export const CreatorContract = () => {
  const { user } = useAuth();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContract();
    }
  }, [user]);

  const fetchContract = async () => {
    try {
      const { data, error } = await supabase
        .from('creator_contracts')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setContract(data);
    } catch (error) {
      console.error('Error fetching contract:', error);
      toast.error('Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const downloadContract = async (url: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('contracts')
        .download(url.replace(`${supabase.storage.from('contracts').getPublicUrl('').data.publicUrl}/`, ''));

      if (error) throw error;

      const blob = new Blob([data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      
      toast.success('Contract downloaded');
    } catch (error) {
      console.error('Error downloading contract:', error);
      toast.error('Failed to download contract');
    }
  };

  const handleSignedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const filePath = `${user.id}/signed-contract-${Date.now()}.pdf`;
      
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('contracts')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('creator_contracts')
        .update({
          signed_contract_url: publicUrl,
          contract_signed: true,
          signed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success('Signed contract uploaded successfully');
      fetchContract();
    } catch (error) {
      console.error('Error uploading signed contract:', error);
      toast.error('Failed to upload signed contract');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading contract...</div>;
  }

  if (!contract || !contract.contract_template_url) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract</CardTitle>
          <CardDescription>Your contract will appear here once uploaded by an administrator</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No contract available yet. Please contact support if you expected to see a contract here.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Creator Contract
          </CardTitle>
          <CardDescription>
            Review, download, and upload your signed contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contract Template */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Contract Template</h3>
                <p className="text-sm text-muted-foreground">
                  Uploaded: {contract.template_uploaded_at 
                    ? new Date(contract.template_uploaded_at).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
              <Button
                onClick={() => downloadContract(contract.contract_template_url!, 'contract-template.pdf')}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Signed Contract Status */}
          {contract.contract_signed && contract.signed_contract_url ? (
            <div className="border border-green-200 bg-green-50 dark:bg-green-950 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="font-semibold">Contract Signed</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Signed on: {new Date(contract.signed_at!).toLocaleDateString()}
              </p>
              <Button
                onClick={() => downloadContract(contract.signed_contract_url!, 'signed-contract.pdf')}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Signed Copy
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Upload Signed Contract</h3>
              <p className="text-sm text-muted-foreground">
                Please download the contract, sign it, and upload the signed version here.
              </p>
              <div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleSignedUpload}
                  disabled={uploading}
                  className="hidden"
                  id="signed-contract-upload"
                />
                <label htmlFor="signed-contract-upload">
                  <Button
                    variant="default"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Signed Contract'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
