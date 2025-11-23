import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, CheckCircle2, XCircle, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { ContractGenerator } from "./ContractGenerator";

interface Creator {
  id: string;
  full_name: string;
  email: string;
}

interface Contract {
  id: string;
  user_id: string;
  contract_template_url: string | null;
  signed_contract_url: string | null;
  contract_signed: boolean;
  template_uploaded_at: string | null;
  signed_at: string | null;
  generated_pdf_url: string | null;
  generation_status: string | null;
  contract_data: any;
  contract_version: string | null;
}

export const AdminContracts = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [contracts, setContracts] = useState<Record<string, Contract>>({});
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [selectedCreatorForGeneration, setSelectedCreatorForGeneration] = useState<string>();

  useEffect(() => {
    if (user) {
      fetchCreators();
      fetchContracts();
    }
  }, [user]);

  const fetchCreators = async () => {
    try {
      let assignedCreatorIds: string[] = [];

      // If manager (not admin/super_admin), filter by assigned creators
      if (!isSuperAdmin && !isAdmin && user) {
        const { data: assignedMeetings } = await supabase
          .from('creator_meetings')
          .select('user_id')
          .eq('assigned_manager_id', user.id);

        assignedCreatorIds = [...new Set(assignedMeetings?.map(m => m.user_id) || [])];

        if (assignedCreatorIds.length === 0) {
          setCreators([]);
          setLoading(false);
          return;
        }
      }

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'creator');

      if (rolesError) throw rolesError;

      let creatorIds = roles?.map(r => r.user_id) || [];

      // Filter to only assigned creators for managers
      if (!isSuperAdmin && !isAdmin && assignedCreatorIds.length > 0) {
        creatorIds = creatorIds.filter(id => assignedCreatorIds.includes(id));
      }

      if (creatorIds.length === 0) {
        setCreators([]);
        setLoading(false);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', creatorIds);

      if (profilesError) throw profilesError;

      setCreators(profiles || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast.error('Failed to load creators');
    } finally {
      setLoading(false);
    }
  };

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('creator_contracts')
        .select('*');

      if (error) throw error;

      const contractsMap: Record<string, Contract> = {};
      data?.forEach(contract => {
        contractsMap[contract.user_id] = contract;
      });
      setContracts(contractsMap);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const handleUploadTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCreator || !user) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const filePath = `${selectedCreator}/contract-template-${Date.now()}.pdf`;
      
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('contracts')
        .getPublicUrl(filePath);

      const existingContract = contracts[selectedCreator];

      if (existingContract) {
        const { error: updateError } = await supabase
          .from('creator_contracts')
          .update({
            contract_template_url: publicUrl,
            template_uploaded_at: new Date().toISOString(),
            uploaded_by: user.id,
          })
          .eq('user_id', selectedCreator);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('creator_contracts')
          .insert({
            user_id: selectedCreator,
            contract_template_url: publicUrl,
            template_uploaded_at: new Date().toISOString(),
            uploaded_by: user.id,
          });

        if (insertError) throw insertError;
      }

      toast.success('Contract template uploaded successfully');
      fetchContracts();
      setSelectedCreator("");
    } catch (error) {
      console.error('Error uploading contract:', error);
      toast.error('Failed to upload contract');
    } finally {
      setUploading(false);
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

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>
                Generate new contracts or upload templates for creators
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowContractGenerator(true)}
              className="bg-rose-gold hover:bg-rose-gold/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate New Contract
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Contract Template (Legacy)</CardTitle>
          <CardDescription>
            Upload a contract template for a specific creator (old method)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedCreator} onValueChange={setSelectedCreator}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a creator" />
              </SelectTrigger>
              <SelectContent>
                {creators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    {creator.full_name || creator.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUploadTemplate}
                disabled={!selectedCreator || uploading}
                className="hidden"
                id="contract-template-upload"
              />
              <label htmlFor="contract-template-upload">
                <Button
                  variant="default"
                  disabled={!selectedCreator || uploading}
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Template'}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Creator Contracts</CardTitle>
          <CardDescription>
            View and manage all creator contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Signed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creators.map((creator) => {
                const contract = contracts[creator.id];
                return (
                  <TableRow key={creator.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{creator.full_name}</div>
                        <div className="text-sm text-muted-foreground">{creator.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract?.generation_status === 'generated' ? (
                        <span className="text-sm text-green-600">Generated</span>
                      ) : contract?.generation_status === 'pending' ? (
                        <span className="text-sm text-yellow-600">Pending</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not generated</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contract?.contract_template_url ? (
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" />
                          {new Date(contract.template_uploaded_at!).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No template</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contract?.contract_signed ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Signed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Not signed</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedCreatorForGeneration(creator.id);
                            setShowContractGenerator(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-rose-gold border-rose-gold hover:bg-rose-gold/10"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Generate
                        </Button>
                        {contract?.generated_pdf_url && (
                          <Button
                            onClick={() => window.open(contract.generated_pdf_url!, '_blank')}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {contract?.contract_template_url && (
                          <Button
                            onClick={() => downloadContract(contract.contract_template_url!, 'template.pdf')}
                            variant="outline"
                            size="sm"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        {contract?.signed_contract_url && (
                          <Button
                            onClick={() => downloadContract(contract.signed_contract_url!, 'signed.pdf')}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Signed
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ContractGenerator
        open={showContractGenerator}
        onOpenChange={(open) => {
          setShowContractGenerator(open);
          if (!open) {
            setSelectedCreatorForGeneration(undefined);
            fetchContracts(); // Refresh contracts after closing
          }
        }}
        creatorId={selectedCreatorForGeneration}
      />
    </div>
  );
};
