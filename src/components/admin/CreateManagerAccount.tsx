import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Mail, User, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateManagerAccountProps {
  onSuccess?: () => void;
}

export const CreateManagerAccount = ({ onSuccess }: CreateManagerAccountProps) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<'admin' | 'manager' | 'chatter' | 'marketing' | 'studio'>('manager');
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successData, setSuccessData] = useState<{
    email: string;
    fullName: string;
    role: string;
    invitationUrl: string;
    expiresAt: string;
  } | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !fullName || !role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (fullName.trim().length < 2) {
      toast({
        title: "Error",
        description: "Full name must be at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-manager-account", {
        body: {
          email: email.toLowerCase().trim(),
          fullName: fullName.trim(),
          role: role,
        },
      });

      if (error) throw error;

      console.log("Manager account created:", data);

      setSuccessData({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        invitationUrl: data.invitationUrl,
        expiresAt: data.expiresAt,
      });

      setShowSuccessDialog(true);

      // Reset form
      setEmail("");
      setFullName("");
      setRole('manager');

      const roleLabels: Record<string, string> = {
        admin: 'Admin',
        manager: 'Manager',
        chatter: 'Chatter',
        marketing: 'Marketing',
        studio: 'Studio'
      };

      toast({
        title: "Success",
        description: `${roleLabels[data.role] || data.role} account created successfully`,
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating manager account:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setFullName("");
    setRole('manager');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Invitation link copied to clipboard",
    });
  };

  return (
    <>
      <Card className="p-6 bg-muted/30 border-primary/20 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-lg font-bold">Create Team Account</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Sarah Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  disabled={isCreating}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isCreating}
                  required
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-destructive">*</span>
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value as typeof role)} disabled={isCreating}>
              <SelectTrigger id="role" className="bg-background">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="font-medium">Admin</div>
                      <div className="text-xs text-muted-foreground">Full system access and control</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="manager">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Manager</div>
                      <div className="text-xs text-muted-foreground">Manage creators, content, and meetings</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="chatter">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="font-medium">Chatter</div>
                      <div className="text-xs text-muted-foreground">Access chat tools and scripts</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="marketing">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="font-medium">Marketing</div>
                      <div className="text-xs text-muted-foreground">Marketing and content planning</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="studio">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-pink-500" />
                    <div>
                      <div className="font-medium">Studio</div>
                      <div className="text-xs text-muted-foreground">Studio uploads and shoots</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isCreating}
            >
              Reset
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> The new user will receive a welcome email with a password setup link. 
            The link expires after 72 hours (or your configured duration).
          </p>
        </div>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Created Successfully! 🎉</DialogTitle>
            <DialogDescription>
              The {successData?.role} account has been created and a welcome email has been sent.
            </DialogDescription>
          </DialogHeader>

          {successData && (
            <div className="space-y-4">
              {/* Account Details */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">{successData.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{successData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className={`w-4 h-4 mt-0.5 ${successData.role === 'manager' ? 'text-blue-500' : 'text-red-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-muted-foreground capitalize">{successData.role}</p>
                  </div>
                </div>
              </div>

              {/* Invitation Link */}
              <div className="space-y-2">
                <Label>Password Setup Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={successData.invitationUrl}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyToClipboard(successData.invitationUrl)}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Link expires: {new Date(successData.expiresAt).toLocaleString()}
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-medium mb-2">Next Steps:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>The user will receive a welcome email with instructions</li>
                  <li>They'll click the link to set up their password</li>
                  <li>After password setup, they can log in to the admin dashboard</li>
                  <li>You can manage their roles anytime from the Roles tab</li>
                </ol>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessDialog(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
