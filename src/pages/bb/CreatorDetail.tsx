import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { adminNavigation } from "@/config/roleNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useAccessManagement } from "@/hooks/useAccessManagement";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/RoleBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { CheckCircle, XCircle, Calendar, User, FileText, Shield, ExternalLink } from "lucide-react";

interface CreatorProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  creator_status: string | null;
  assigned_manager_id: string | null;
}

interface CreatorApplication {
  id: string;
  status: string;
  experience_level: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

interface CreatorMeeting {
  id: string;
  status: string;
  meeting_date: string | null;
  meeting_time: string | null;
  assigned_manager_id: string | null;
  meeting_purpose: string | null;
}

interface AccessLevel {
  access_level: string;
  granted_by: string | null;
  granted_at: string | null;
  grant_method: string | null;
}

interface OnboardingData {
  current_step: number;
  is_completed: boolean;
  completed_steps: number[] | null;
  updated_at: string | null;
}

export default function CreatorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isManager, isSuperAdmin, rolesLoaded } = useUserRole();
  const { grantAccessAfterMeeting, grantEarlyAccess, loading: accessLoading } = useAccessManagement();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [application, setApplication] = useState<CreatorApplication | null>(null);
  const [meeting, setMeeting] = useState<CreatorMeeting | null>(null);
  const [accessLevel, setAccessLevel] = useState<AccessLevel | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);

  useEffect(() => {
    if (rolesLoaded && !isAdmin && !isManager && !isSuperAdmin) {
      toast.error("Access denied");
      navigate("/dashboard");
    }
  }, [rolesLoaded, isAdmin, isManager, isSuperAdmin, navigate]);

  useEffect(() => {
    if (!id || !rolesLoaded) return;
    loadCreatorData();
  }, [id, rolesLoaded]);

  const loadCreatorData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        toast.error("Creator not found");
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch application by email
      if (profileData.email) {
        const { data: appData } = await supabase
          .from("creator_applications")
          .select("*")
          .eq("email", profileData.email)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        setApplication(appData);
      }

      // Fetch meeting
      const { data: meetingData } = await supabase
        .from("creator_meetings")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      setMeeting(meetingData);

      // Fetch access level
      const { data: accessData } = await supabase
        .from("creator_access_levels")
        .select("*")
        .eq("user_id", id)
        .maybeSingle();
      
      setAccessLevel(accessData);

      // Fetch onboarding data
      const { data: onboardingData } = await supabase
        .from("onboarding_data")
        .select("current_step, is_completed, completed_steps, updated_at")
        .eq("user_id", id)
        .maybeSingle();
      
      setOnboarding(onboardingData);

    } catch (error: any) {
      console.error("Error loading creator data:", error);
      toast.error("Failed to load creator data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = async () => {
    if (!application?.id) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await supabase.functions.invoke("approve-creator-application", {
        body: { applicationId: application.id, managerId: session.user.id }
      });

      if (response.error) throw response.error;

      toast.success("Application approved successfully");
      loadCreatorData();
    } catch (error: any) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    }
  };

  const handleRejectApplication = async () => {
    if (!application?.id) return;

    try {
      const { error } = await supabase
        .from("creator_applications")
        .update({ status: "declined", reviewed_at: new Date().toISOString() })
        .eq("id", application.id);

      if (error) throw error;

      toast.success("Application rejected");
      loadCreatorData();
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    }
  };

  const handleMarkMeetingCompleted = async () => {
    if (!meeting?.id || !profile) return;

    try {
      const success = await grantAccessAfterMeeting(
        profile.id,
        profile.full_name || profile.email,
        meeting.id
      );

      if (success) {
        toast.success("Meeting marked as completed and access granted");
        loadCreatorData();
      }
    } catch (error: any) {
      console.error("Error marking meeting completed:", error);
      toast.error("Failed to mark meeting as completed");
    }
  };

  const handleGrantFullAccess = async () => {
    if (!profile) return;

    try {
      const success = await grantEarlyAccess(
        profile.id,
        profile.full_name || profile.email,
        "Manual full access grant"
      );

      if (success) {
        toast.success("Full access granted");
        loadCreatorData();
      }
    } catch (error: any) {
      console.error("Error granting full access:", error);
      toast.error("Failed to grant full access");
    }
  };

  if (!rolesLoaded || loading) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={adminNavigation} />} title="Creator Detail">
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={adminNavigation} />} title="Creator Detail">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Creator not found</p>
              <Button onClick={() => navigate("/dashboard/creators")} className="mt-4">
                Back to Creators
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigation={<RoleNavigation sections={adminNavigation} />} title="Creator Detail">
      <div className="space-y-6">
        {/* Creator Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {profile.full_name || profile.email}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
              </div>
              <div className="flex gap-2">
                <RoleBadge isCreator />
                {profile.creator_status && (
                  <Badge variant="outline">{profile.creator_status}</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{profile.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground font-mono">{profile.id}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <Button onClick={() => navigate(`/dashboard/creator`)} variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Creator Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Application Details */}
        {application && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <StatusBadge status={application.status as any} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Experience Level</span>
                  <span className="text-sm">{application.experience_level}</span>
                </div>
                {application.admin_notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Admin Notes</p>
                    <p className="text-sm text-muted-foreground">{application.admin_notes}</p>
                  </div>
                )}
                {application.reviewed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reviewed</span>
                    <span className="text-sm">{format(new Date(application.reviewed_at), "PPp")}</span>
                  </div>
                )}
                {application.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Application
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Application?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will create a creator account and send an invitation email.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleApproveApplication}>
                            Approve
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex-1">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Application
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Application?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will mark the application as declined.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRejectApplication}>
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meeting Info */}
        {meeting && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meeting Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <StatusBadge status={meeting.status as any} />
                </div>
                {meeting.meeting_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Scheduled</span>
                    <span className="text-sm">
                      {format(new Date(meeting.meeting_date), "PPp")}
                    </span>
                  </div>
                )}
                {meeting.meeting_purpose && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Purpose</span>
                    <span className="text-sm">{meeting.meeting_purpose}</span>
                  </div>
                )}
                {meeting.status === "confirmed" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" disabled={accessLoading}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Meeting Completed
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Complete Meeting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark the meeting as completed and grant full access to the creator.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMarkMeetingCompleted}>
                          Complete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Access Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Level</span>
                <Badge variant={accessLevel?.access_level === "full_access" ? "default" : "secondary"}>
                  {accessLevel?.access_level || "no_access"}
                </Badge>
              </div>
              {accessLevel?.grant_method && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Grant Method</span>
                  <span className="text-sm">{accessLevel.grant_method}</span>
                </div>
              )}
              {accessLevel?.granted_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Granted</span>
                  <span className="text-sm">{format(new Date(accessLevel.granted_at), "PPp")}</span>
                </div>
              )}
              {accessLevel?.access_level !== "full_access" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={accessLoading}>
                      <Shield className="h-4 w-4 mr-2" />
                      Grant Full Access
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Grant Full Access?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will grant full access to the creator, bypassing the meeting requirement.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleGrantFullAccess}>
                        Grant Access
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Progress */}
        {onboarding && (
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={onboarding.is_completed ? "default" : "secondary"}>
                    {onboarding.is_completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Step</span>
                  <span className="text-sm">{onboarding.current_step} of 11</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed Steps</span>
                  <span className="text-sm">{onboarding.completed_steps?.length || 0} / 11</span>
                </div>
                {onboarding.updated_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm">{format(new Date(onboarding.updated_at), "PPp")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
