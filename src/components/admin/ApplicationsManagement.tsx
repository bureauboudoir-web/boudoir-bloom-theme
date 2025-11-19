import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience_level: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
}

export const ApplicationsManagement = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('pending');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('creator_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application: Application) => {
    try {
      console.log("Step 1: Creating auth user account...");
      // 1. Create auth user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: application.email,
        email_confirm: true,
        user_metadata: { full_name: application.name }
      });

      if (authError) {
        console.error("Step 1 failed:", authError);
        throw new Error(`Failed to create user account: ${authError.message}`);
      }

      const userId = authData.user.id;
      console.log("Step 1 complete: User created with ID:", userId);

      console.log("Step 2: Assigning creator role...");
      // 2. Assign creator role
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: userId,
        role: 'creator'
      });

      if (roleError) {
        console.error("Step 2 failed:", roleError);
        throw new Error(`Failed to assign creator role: ${roleError.message}`);
      }
      console.log("Step 2 complete: Creator role assigned");

      console.log("Step 3: Creating access level record...");
      // 3. Create access level record
      const { error: accessError } = await supabase.from('creator_access_levels').insert({
        user_id: userId,
        access_level: 'meeting_only'
      });

      if (accessError) {
        console.error("Step 3 failed:", accessError);
        throw new Error(`Failed to create access level: ${accessError.message}`);
      }
      console.log("Step 3 complete: Access level created");

      console.log("Step 4: Creating meeting record...");
      // 4. Create meeting record
      const { error: meetingError } = await supabase.from('creator_meetings').insert({
        application_id: application.id,
        user_id: userId,
        status: 'not_booked'
      });

      if (meetingError) {
        console.error("Step 4 failed:", meetingError);
        throw new Error(`Failed to create meeting record: ${meetingError.message}`);
      }
      console.log("Step 4 complete: Meeting record created");

      console.log("Step 5: Updating application status...");
      // 5. Update application status
      const { data: currentUser } = await supabase.auth.getUser();
      const { error: updateError } = await supabase.from('creator_applications')
        .update({ 
          status: 'approved',
          application_status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: currentUser.user?.id,
          approval_email_sent_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (updateError) {
        console.error("Step 5 failed:", updateError);
        throw new Error(`Failed to update application status: ${updateError.message}`);
      }
      console.log("Step 5 complete: Application status updated");

      console.log("Step 6: Sending password reset email...");
      // 6. Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(application.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetError) {
        console.error("Step 6 warning:", resetError);
        toast.warning("User created but password reset email failed. User may need manual password reset.");
      } else {
        console.log("Step 6 complete: Password reset email sent");
      }

      console.log("Step 7: Sending meeting invitation email...");
      // 7. Send meeting invitation email
      const { error: inviteError } = await supabase.functions.invoke('send-meeting-invitation', {
        body: {
          name: application.name,
          email: application.email,
          loginUrl: `${window.location.origin}/login`,
          passwordResetUrl: `${window.location.origin}/reset-password`
        }
      });

      if (inviteError) {
        console.error("Step 7 warning:", inviteError);
        toast.warning("Application approved but invitation email failed to send.");
      } else {
        console.log("Step 7 complete: Meeting invitation email sent");
      }

      toast.success("Application approved successfully! User account created.");
      fetchApplications();
    } catch (error: any) {
      console.error("Error approving application:", error);
      toast.error(`Failed to approve application: ${error.message}`);
    }
  };

  const handleDecline = async (application: Application, sendEmail: boolean, reason?: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      await supabase.from('creator_applications')
        .update({ 
          status: 'declined',
          application_status: 'declined',
          reviewed_at: new Date().toISOString(),
          reviewed_by: currentUser.user?.id,
          admin_notes: reason || null
        })
        .eq('id', application.id);

      if (sendEmail) {
        await supabase.functions.invoke('send-application-declined', {
          body: {
            name: application.name,
            email: application.email,
            reason: reason
          }
        });
      }

      toast.success(sendEmail ? "Application declined and email sent" : "Application declined");
      fetchApplications();
    } catch (error: any) {
      console.error("Error declining application:", error);
      toast.error("Failed to decline application");
    }
  };

  const DeclineDialog = ({ application }: { application: Application }) => {
    const [reason, setReason] = useState("");
    const [sendEmail, setSendEmail] = useState(true);
    const [showDialog, setShowDialog] = useState(false);

    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="text-destructive hover:text-destructive"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Decline
        </Button>

        {showDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Decline Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Reason (optional)</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide a reason for declining..."
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendEmail" 
                    checked={sendEmail}
                    onCheckedChange={(checked) => setSendEmail(!!checked)}
                  />
                  <Label htmlFor="sendEmail">
                    Send decline notification email
                  </Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleDecline(application, sendEmail, reason);
                      setShowDialog(false);
                    }}
                  >
                    Confirm Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Approved
        </Button>
        <Button
          variant={filter === 'declined' ? 'default' : 'outline'}
          onClick={() => setFilter('declined')}
        >
          Declined
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No applications found
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{app.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{app.email}</p>
                    <p className="text-sm text-muted-foreground">{app.phone}</p>
                  </div>
                  <Badge variant={
                    app.status === 'approved' ? 'default' :
                    app.status === 'declined' ? 'destructive' : 'secondary'
                  }>
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm"><strong>Experience:</strong> {app.experience_level}</p>
                  <p className="text-sm text-muted-foreground">
                    Applied: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(app)}
                      className="bg-primary"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <DeclineDialog application={app} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
