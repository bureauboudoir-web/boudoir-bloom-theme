import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { Copy, Key, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { VoiceToolDebug } from "@/components/admin/VoiceToolDebug";

export function ApiKeysManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin, isSuperAdmin, rolesLoaded } = useUserRole();
  const [label, setLabel] = useState("");
  const [scope, setScope] = useState("full-access");
  const [showDialog, setShowDialog] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [revokeKeyId, setRevokeKeyId] = useState<string | null>(null);
  const [showFullKey, setShowFullKey] = useState(false);

  // Fetch API keys
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
    enabled: rolesLoaded && (isAdmin || isSuperAdmin),
  });

  // Generate API key
  const generateApiKey = () => {
    const prefix = "sk";
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    return `${prefix}_${randomPart}`;
  };

  // Hash API key
  const hashApiKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  // Generate key preview (first 4 + ... + last 4)
  const generateKeyPreview = (key: string) => {
    if (key.length < 12) return key;
    return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
  };

  // Create key mutation
  const createKeyMutation = useMutation({
    mutationFn: async () => {
      const rawKey = generateApiKey();
      const keyHash = await hashApiKey(rawKey);
      const keyPreview = generateKeyPreview(rawKey);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("external_api_keys").insert({
        label,
        key_hash: keyHash,
        key_preview: keyPreview,
        scope,
        created_by: userData.user.id,
      });

      if (error) throw error;
      return rawKey;
    },
    onSuccess: (rawKey) => {
      queryClient.invalidateQueries({ queryKey: ["external-api-keys"] });
      setGeneratedKey(rawKey);
      setShowDialog(true);
      setLabel("");
      setScope("full-access");
      toast({
        title: "API Key Created",
        description: "Your new API key has been generated. Make sure to copy it now.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create API key: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Revoke key mutation
  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("external_api_keys")
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: userData.user.id,
        })
        .eq("id", keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-api-keys"] });
      setRevokeKeyId(null);
      toast({
        title: "API Key Revoked",
        description: "The API key has been revoked successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to revoke API key: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const getScopeBadgeVariant = (scope: string) => {
    switch (scope) {
      case "full-access":
        return "default";
      case "read-only":
        return "secondary";
      case "content-upload-only":
        return "outline";
      case "starterpack-write":
        return "outline";
      case "voice-upload":
        return "outline";
      default:
        return "default";
    }
  };

  if (!rolesLoaded || !(isAdmin || isSuperAdmin)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">API & Integration Settings</h2>
        <p className="text-muted-foreground mt-2">
          Generate and manage external API keys for Content Generator and Voice Tool integrations
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
            Create a new API key for external integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="e.g., Content-Voice-Tool"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope">Scope</Label>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger id="scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-access">Full Access</SelectItem>
                    <SelectItem value="read-only">Read Only</SelectItem>
                    <SelectItem value="content-upload-only">Content Upload Only</SelectItem>
                    <SelectItem value="starterpack-write">Starter Pack Write</SelectItem>
                    <SelectItem value="voice-upload">Voice Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={() => createKeyMutation.mutate()}
              disabled={!label || createKeyMutation.isPending}
              className="w-full md:w-auto"
            >
              <Key className="h-4 w-4 mr-2" />
              Generate API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>Active API Keys</CardTitle>
          <CardDescription>
            Manage your existing API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !apiKeys || apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys found. Create your first one above.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.label}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {key.key_preview || "sk_xxxx...xxxx"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getScopeBadgeVariant(key.scope || "")}>
                          {key.scope}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {key.created_at && format(new Date(key.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {key.last_used_at
                          ? format(new Date(key.last_used_at), "MMM d, yyyy")
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.is_active ? "default" : "destructive"}>
                          {key.is_active ? "Active" : "Revoked"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {key.is_active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRevokeKeyId(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Tool Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Tool Integration</CardTitle>
          <CardDescription>
            Configure and test external Voice Tool API connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoiceToolDebug />
        </CardContent>
      </Card>
    
      {/* Generated Key Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              API Key Generated
            </DialogTitle>
            <DialogDescription>
              <span className="text-destructive font-semibold">
                ⚠️ This key will not be shown again!
              </span>
              <br />
              Copy it now and store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="api-key" className="sr-only">
                  API Key
                </Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    readOnly
                    value={generatedKey || ""}
                    type={showFullKey ? "text" : "password"}
                    className="font-mono text-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowFullKey(!showFullKey)}
                  >
                    {showFullKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => generatedKey && copyToClipboard(generatedKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-semibold mb-1">Usage:</p>
              <code className="text-xs">
                Authorization: Bearer {generatedKey ? generateKeyPreview(generatedKey) : "sk_xxxx...xxxx"}
              </code>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>I've Saved My Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!revokeKeyId} onOpenChange={() => setRevokeKeyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Any applications using this API key will immediately
              lose access. You'll need to generate a new key and update your applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => revokeKeyId && revokeKeyMutation.mutate(revokeKeyId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
