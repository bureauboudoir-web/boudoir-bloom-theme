import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, ExternalLink, FolderOpen } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface CreatorAccount {
  id: string;
  platform_name: string;
  username: string | null;
  email: string | null;
  category: string;
  status: string | null;
  profile_url: string | null;
  notes: string | null;
  user_id: string;
  created_at: string | null;
}

interface Creator {
  id: string;
  full_name: string | null;
  email: string;
}

export const CreatorAccountsManager = () => {
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [accounts, setAccounts] = useState<CreatorAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [googleDriveEnabled, setGoogleDriveEnabled] = useState(false);

  // Form state
  const [platformName, setPlatformName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("fan_platform");
  const [profileUrl, setProfileUrl] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isSuperAdmin || isAdmin) {
      fetchCreators();
      checkGoogleDriveStatus();
    }
  }, [isSuperAdmin, isAdmin]);

  useEffect(() => {
    if (selectedCreatorId) {
      fetchAccounts();
    }
  }, [selectedCreatorId]);

  const checkGoogleDriveStatus = async () => {
    const { data } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'enable_google_drive_sync')
      .single();
    
    setGoogleDriveEnabled(data?.setting_value === true);
  };

  const fetchCreators = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name');

    if (error) {
      console.error('Error fetching creators:', error);
      return;
    }

    setCreators(data || []);
  };

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('creator_accounts')
      .select('*')
      .eq('user_id', selectedCreatorId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch accounts');
      console.error(error);
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  };

  const handleAddAccount = async () => {
    if (!selectedCreatorId || !platformName) {
      toast.error('Please select a creator and enter platform name');
      return;
    }

    const { error } = await supabase
      .from('creator_accounts')
      .insert({
        user_id: selectedCreatorId,
        platform_name: platformName,
        username: username || null,
        email: email || null,
        category,
        profile_url: profileUrl || null,
        notes: notes || null,
        status: 'active'
      });

    if (error) {
      toast.error('Failed to add account');
      console.error(error);
    } else {
      toast.success('Account added successfully');
      setIsDialogOpen(false);
      resetForm();
      fetchAccounts();
    }
  };

  const resetForm = () => {
    setPlatformName("");
    setUsername("");
    setEmail("");
    setCategory("fan_platform");
    setProfileUrl("");
    setNotes("");
  };

  const syncToGoogleDrive = async (accountId: string) => {
    toast.info('Syncing to Google Drive...');
    
    const { error } = await supabase.functions.invoke('sync-to-gdrive', {
      body: { accountId, userId: selectedCreatorId }
    });

    if (error) {
      toast.error('Sync failed: ' + error.message);
    } else {
      toast.success('Synced to Google Drive');
    }
  };

  if (!isSuperAdmin && !isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Accounts Manager</CardTitle>
        <CardDescription>
          Manage social media and platform accounts for creators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Creator</Label>
          <Select value={selectedCreatorId} onValueChange={setSelectedCreatorId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a creator" />
            </SelectTrigger>
            <SelectContent>
              {creators.map((creator) => (
                <SelectItem key={creator.id} value={creator.id}>
                  {creator.full_name || creator.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCreatorId && (
          <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Platform Name *</Label>
                      <Input
                        placeholder="e.g., OnlyFans, Instagram"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fan_platform">Fan Platform</SelectItem>
                          <SelectItem value="social_media">Social Media</SelectItem>
                          <SelectItem value="content_platform">Content Platform</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        placeholder="@username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="account@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Profile URL</Label>
                    <Input
                      placeholder="https://..."
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Additional information..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleAddAccount} className="w-full">
                    Add Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading accounts...</div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No accounts found</div>
              ) : (
                accounts.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{account.platform_name}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                              {account.category.replace('_', ' ')}
                            </span>
                          </div>
                          
                          {account.username && (
                            <p className="text-sm text-muted-foreground">@{account.username}</p>
                          )}
                          
                          {account.email && (
                            <p className="text-sm text-muted-foreground">{account.email}</p>
                          )}
                          
                          {account.notes && (
                            <p className="text-sm mt-2">{account.notes}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {account.profile_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(account.profile_url!, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {googleDriveEnabled && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => syncToGoogleDrive(account.id)}
                            >
                              <FolderOpen className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
