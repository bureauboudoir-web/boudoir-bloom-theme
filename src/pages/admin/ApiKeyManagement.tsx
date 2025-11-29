import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Key, Copy, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageContainer } from "@/components/PageContainer";

export default function ApiKeyManagement() {
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all API keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ["external-api-keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("external_api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Generate random API key
  const generateApiKey = () => {
    const array = new Uint8Array(36);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Hash API key using SHA-256
  const hashApiKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Create new API key mutation
  const createKeyMutation = useMutation({
    mutationFn: async (label: string) => {
      const rawKey = generateApiKey();
      const keyHash = await hashApiKey(rawKey);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("external_api_keys")
        .insert({
          key_hash: keyHash,
          label,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { ...data, raw_key: rawKey };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["external-api-keys"] });
      setGeneratedKey(data.raw_key);
      setShowKeyDialog(true);
      setNewKeyLabel("");
      toast.success("API key generated successfully");
    },
    onError: (error) => {
      toast.error("Failed to generate API key");
      console.error(error);
    },
  });

  // Revoke API key mutation
  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("external_api_keys")
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: user?.id,
        })
        .eq("id", keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-api-keys"] });
      toast.success("API key revoked successfully");
      setKeyToRevoke(null);
    },
    onError: (error) => {
      toast.error("Failed to revoke API key");
      console.error(error);
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API Key Management</h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage API keys for external integrations
          </p>
        </div>

        {/* Generate New Key Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Generate New API Key
            </CardTitle>
            <CardDescription>
              Create a new API key for external services. The key will only be shown once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="key-label">Key Label</Label>
                <Input
                  id="key-label"
                  placeholder="e.g., Content Generator, Voice Tool"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => createKeyMutation.mutate(newKeyLabel)}
                  disabled={!newKeyLabel.trim() || createKeyMutation.isPending}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Generate Key
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing API Keys</CardTitle>
            <CardDescription>
              View and manage all generated API keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : !apiKeys || apiKeys.length === 0 ? (
              <p className="text-muted-foreground">No API keys generated yet</p>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{key.label}</h3>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? "Active" : "Revoked"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(key.created_at).toLocaleString()}
                      </p>
                      {key.last_used_at && (
                        <p className="text-sm text-muted-foreground">
                          Last used: {new Date(key.last_used_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    {key.is_active && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setKeyToRevoke(key.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Key Dialog */}
        <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Key Generated</DialogTitle>
              <DialogDescription>
                Save this key now. You won't be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                {generatedKey}
              </div>
              <Button
                className="w-full"
                onClick={() => generatedKey && copyToClipboard(generatedKey)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Revoke Confirmation Dialog */}
        <AlertDialog open={!!keyToRevoke} onOpenChange={() => setKeyToRevoke(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke this API key? This action cannot be undone and
                any services using this key will lose access immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => keyToRevoke && revokeKeyMutation.mutate(keyToRevoke)}
              >
                Revoke Key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageContainer>
  );
}
