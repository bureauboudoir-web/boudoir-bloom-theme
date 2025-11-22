import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle, XCircle, Mail, Clock, MessageSquare, Save, X, AlertCircle, RefreshCw, Search, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InvitationExpiryStatus } from "./InvitationExpiryStatus";
import { PaginationControls } from "./shared/PaginationControls";
import { ApplicationsKanbanView } from "./ApplicationsKanbanView";
import { ViewModeToggle, ViewMode } from "./shared/ViewModeToggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ManagerSelect } from "./ManagerSelect";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AdminNote {
  note: string;
  updated_by: string;
  updated_at: string;
}

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience_level: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
  admin_notes_history: AdminNote[] | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reviewed_by_name: string | null;
  email_status?: string | null;
  email_sent_at?: string | null;
  password_reset_expires_at?: string | null;
  link_clicked_at?: string | null;
  link_used_at?: string | null;
}

export const ApplicationsManagement = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('pending');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedApps, setExpandedApps] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch applications without foreign key hint to avoid schema cache issues
      let query = supabase
        .from('creator_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) {
        console.error("Error fetching applications:", fetchError);
        setError(fetchError.message || "Failed to load applications");
        return;
      }

      // Get unique reviewer IDs
      const reviewerIds = [...new Set(data?.map(app => app.reviewed_by).filter(Boolean))];
      
      // Fetch reviewer profiles separately
      let reviewerProfiles: Record<string, string> = {};
      if (reviewerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', reviewerIds);
        
        if (profiles) {
          reviewerProfiles = Object.fromEntries(
            profiles.map(p => [p.id, p.full_name || 'Unknown'])
          );
        }
      }

      // Transform data and add reviewer names
      const transformedData = data?.map((app: any) => ({
        ...app,
        reviewed_by_name: app.reviewed_by ? reviewerProfiles[app.reviewed_by] : null,
      }));

      // For approved applications, check if emails were sent successfully
      if (transformedData) {
        for (const app of transformedData) {
          if (app.status === 'approved') {
            const { data: emailLog } = await supabase
              .from('email_logs')
              .select('status, sent_at, password_reset_expires_at, link_clicked_at, link_used_at')
              .eq('application_id', app.id)
              .eq('email_type', 'meeting_invitation')
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            app.email_status = emailLog?.status || null;
            app.email_sent_at = emailLog?.sent_at || null;
            app.password_reset_expires_at = emailLog?.password_reset_expires_at || null;
            app.link_clicked_at = emailLog?.link_clicked_at || null;
            app.link_used_at = emailLog?.link_used_at || null;
          }
        }
      }

      setApplications(transformedData || []);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      setError(error.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application: Application, managerId: string) => {
    if (!managerId) {
      toast.error("Please select an admin/manager to assign");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('approve-creator-application', {
        body: {
          applicationId: application.id,
          managerId: managerId
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to approve application");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success("Application approved! User account created and emails sent.");
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

  const handleResendInvitation = async (application: Application) => {
    try {
      toast.loading("Resending invitation...", { id: "resend-invitation" });

      // First, try to refresh the session to ensure we have a valid token
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Session refresh failed:", refreshError);
        toast.error("Your session has expired. Please log out and log in again.", { id: "resend-invitation" });
        return;
      }

      if (!refreshedSession) {
        toast.error("No active session. Please log in again.", { id: "resend-invitation" });
        return;
      }

      console.log("Session refreshed successfully, calling edge function");
      
      const { data, error } = await supabase.functions.invoke('resend-meeting-invitation', {
        body: {
          applicationId: application.id
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to resend invitation");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success("Invitation email resent successfully! Check email logs for delivery status.", { id: "resend-invitation" });
      fetchApplications();
    } catch (error: any) {
      console.error("Error resending invitation:", error);
      
      // Provide more specific error messages
      if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
        toast.error("Authentication failed. Please log out and log in again.", { id: "resend-invitation" });
      } else if (error.message?.includes("session") || error.message?.includes("expired")) {
        toast.error("Session expired. Please log out and log in again.", { id: "resend-invitation" });
      } else {
        toast.error(`Failed to resend invitation: ${error.message}`, { id: "resend-invitation" });
      }
    }
  };

  const handleSaveNote = async (applicationId: string) => {
    if (!noteText.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      toast.loading("Saving note...", { id: "save-note" });
      
      const { error } = await supabase
        .from('creator_applications')
        .update({ 
          admin_notes: noteText,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast.success("Note saved successfully!", { id: "save-note" });
      setEditingNoteId(null);
      setNoteText("");
      fetchApplications();
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast.error(`Failed to save note: ${error.message}`, { id: "save-note" });
    }
  };

  const startEditingNote = (app: Application) => {
    setEditingNoteId(app.id);
    setNoteText(app.admin_notes || "");
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setNoteText("");
  };

  const ApproveDialog = ({ application }: { application: Application }) => {
    const [selectedManager, setSelectedManager] = useState("");
    const [showDialog, setShowDialog] = useState(false);

    return (
      <>
        <Button
          size="sm"
          onClick={() => setShowDialog(true)}
          className="bg-primary"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Approve
        </Button>

        {showDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Approve Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Select an admin or manager to handle this creator's meetings:
                  </p>
                  <ManagerSelect 
                    value={selectedManager}
                    onChange={setSelectedManager}
                    label="Assign to"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      handleApprove(application, selectedManager);
                      setShowDialog(false);
                    }}
                    disabled={!selectedManager}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </>
    );
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
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Applications</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchApplications}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const toggleExpand = (appId: string) => {
    const newExpanded = new Set(expandedApps);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedApps(newExpanded);
  };

  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.phone.includes(query)
    );
  });
  
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => {
              setFilter('pending');
              setCurrentPage(1);
            }}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => {
              setFilter('approved');
              setCurrentPage(1);
            }}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'declined' ? 'default' : 'outline'}
            onClick={() => {
              setFilter('declined');
              setCurrentPage(1);
            }}
          >
            Declined
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
          >
            All
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <ViewModeToggle value={viewMode} onValueChange={setViewMode} showKanban={true} />
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <ApplicationsKanbanView 
          applications={filteredApplications}
          onApprove={(app) => {
            setSelectedApp(app);
            setApproveDialog(true);
          }}
          onDecline={(app) => {
            setSelectedApp(app);
            setDeclineDialog(true);
          }}
        />
      ) : (
        <>
          <div className="grid gap-4">
            {paginatedApplications.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {searchQuery ? "No applications match your search" : "No applications found"}
                </CardContent>
              </Card>
            ) : (
              paginatedApplications.map((app) => {
            const isExpanded = expandedApps.has(app.id);
            
            return (
              <Collapsible key={app.id} open={isExpanded} onOpenChange={() => toggleExpand(app.id)}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          <div className="text-left space-y-1">
                            <CardTitle className="text-xl">{app.name}</CardTitle>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{app.email}</span>
                              <span>•</span>
                              <span>{app.experience_level}</span>
                              <span>•</span>
                              <span>{new Date(app.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {app.status === 'approved' && app.email_status === 'sent' && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              <Mail className="w-3 h-3 mr-1" />
                              Email Sent
                            </Badge>
                          )}
                          <Badge variant={
                            app.status === 'approved' ? 'default' :
                            app.status === 'declined' ? 'destructive' : 'secondary'
                          }>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-4 border-t">
                      <div>
                        <p className="text-sm"><strong>Phone:</strong> {app.phone}</p>
                        <p className="text-sm"><strong>Experience:</strong> {app.experience_level}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Email Status for Approved Applications */}
                      {app.status === 'approved' && (
                        <InvitationExpiryStatus 
                          emailStatus={app.email_status}
                          emailSentAt={app.email_sent_at}
                          passwordResetExpiresAt={app.password_reset_expires_at}
                          linkClickedAt={app.link_clicked_at}
                          linkUsedAt={app.link_used_at}
                        />
                      )}

                      {/* Application History */}
                      {(app.reviewed_at || app.reviewed_by_name || app.admin_notes || app.admin_notes_history?.length) && (
                        <div className="border-t border-border pt-4 mt-4 space-y-3">
                          <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Application History
                          </p>
                          {app.reviewed_at && (
                            <p className="text-sm text-muted-foreground">
                              Reviewed: {new Date(app.reviewed_at).toLocaleDateString()} at {new Date(app.reviewed_at).toLocaleTimeString()}
                            </p>
                          )}
                          {app.reviewed_by_name && (
                            <p className="text-sm text-muted-foreground">
                              Reviewed by: {app.reviewed_by_name}
                            </p>
                          )}
                          
                          {/* Admin Notes Section */}
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Admin Notes
                              </p>
                              {editingNoteId !== app.id && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditingNote(app)}
                                >
                                  {app.admin_notes ? 'Edit Note' : 'Add Note'}
                                </Button>
                              )}
                            </div>
                            
                            {editingNoteId === app.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  placeholder="Add internal notes about this application..."
                                  rows={3}
                                  className="w-full"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveNote(app.id)}
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save Note
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEditingNote}
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : app.admin_notes ? (
                              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                                {app.admin_notes}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">No notes added yet</p>
                            )}
                            
                            {/* Notes History */}
                            {app.admin_notes_history && app.admin_notes_history.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs font-medium text-muted-foreground">Notes History:</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {app.admin_notes_history.map((note: AdminNote, idx: number) => (
                                    <div key={idx} className="text-xs bg-muted/20 p-2 rounded">
                                      <p className="text-muted-foreground">{note.note}</p>
                                      <p className="text-muted-foreground/60 mt-1">
                                        {new Date(note.updated_at).toLocaleString()}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {app.status === 'pending' && (
                          <>
                            <ApproveDialog application={app} />
                            <DeclineDialog application={app} />
                          </>
                        )}
                        {app.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResendInvitation(app)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Resend Invitation
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })
        )}
      </div>
    </div>
  );
};
