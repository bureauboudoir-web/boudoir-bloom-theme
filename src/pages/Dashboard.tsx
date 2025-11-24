import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, User, FileText, Upload, Mail, Calendar, CheckSquare, Shield, DollarSign, Menu, Clock, Lock as LockIcon, Lightbulb } from "lucide-react";
import OnboardingPersonal from "@/components/onboarding/OnboardingPersonal";
import OnboardingBody from "@/components/onboarding/OnboardingBody";
import OnboardingBackstory from "@/components/onboarding/OnboardingBackstory";
import OnboardingBoundaries from "@/components/onboarding/OnboardingBoundaries";
import OnboardingPricing from "@/components/onboarding/OnboardingPricing";
import OnboardingPersona from "@/components/onboarding/OnboardingPersona";
import OnboardingScripts from "@/components/onboarding/OnboardingScripts";
import OnboardingContent from "@/components/onboarding/OnboardingContent";
import OnboardingCommitments from "@/components/onboarding/OnboardingCommitments";
import { OnboardingSocials } from "@/components/onboarding/OnboardingSocials";
import { OnboardingStageGate } from "@/components/onboarding/OnboardingStageGate";
import WeeklyCommitments from "@/components/dashboard/WeeklyCommitments";
import StudioShoots from "@/components/dashboard/StudioShoots";
import { CreatorInvoices } from "@/components/dashboard/CreatorInvoices";
import { InvoiceStatus } from "@/components/dashboard/InvoiceStatus";
import { ContentUpload } from "@/components/uploads/ContentUpload";
import { ContentGallery } from "@/components/uploads/ContentGallery";
import { CreatorProfile } from "@/components/dashboard/CreatorProfile";
import { CreatorContract } from "@/components/dashboard/CreatorContract";
import { Settings } from "@/pages/Settings";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AdminControlsOverview } from "@/components/admin/AdminControlsOverview";
import { ManagerControlsOverview } from "@/components/admin/ManagerControlsOverview";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useUserRole } from "@/hooks/useUserRole";
import { useNotifications } from "@/hooks/useNotifications";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { useAccessLevel, AccessLevel } from "@/hooks/useAccessLevel";
import { useMeetingStatus } from "@/hooks/useMeetingStatus";
import ContactSupport from "@/components/dashboard/ContactSupport";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotificationBell, NotificationItem } from "@/components/NotificationBell";
import { LanguageSelector } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { NoAccessView } from "@/components/dashboard/NoAccessView";
import { MeetingBookingView } from "@/components/dashboard/MeetingBookingView";
import { ContentLibrary } from "@/components/dashboard/ContentLibrary";
import { toast } from "sonner";
import { isPostMeetingStep, getStepConfig, getLastPreMeetingStep } from "@/config/onboardingSteps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationsManagement } from "@/components/admin/ApplicationsManagement";
import { CreatorOverview } from "@/components/admin/CreatorOverview";
import { AdminCommitments } from "@/components/admin/AdminCommitments";
import { AdminShoots } from "@/components/admin/AdminShoots";
import { ContentReview } from "@/components/admin/ContentReview";
import { AdminMeetings } from "@/components/admin/AdminMeetings";
import AdminSupportTickets from "@/components/admin/AdminSupportTickets";
import { AdminInvoices } from "@/components/admin/AdminInvoices";
import { AdminContracts } from "@/components/admin/AdminContracts";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { PermissionsManager } from "@/components/admin/PermissionsManager";
import { ManagerAvailabilitySettings } from "@/components/admin/ManagerAvailabilitySettings";
import { AccessManagement } from "@/components/admin/AccessManagement";
import { AccessAuditLog } from "@/components/admin/AccessAuditLog";
import { PendingActivationsWidget } from "@/components/admin/PendingActivationsWidget";
import { Analytics } from "@/components/admin/Analytics";
import { ManagerNotifications } from "@/components/admin/ManagerNotifications";
import { TestDataGenerator } from "@/components/admin/TestDataGenerator";
import { ProductionReadinessCheck } from "@/components/admin/ProductionReadinessCheck";
import { EnhancedTestManagerFlow } from "@/components/admin/EnhancedTestManagerFlow";
import { useTranslation } from "react-i18next";
import { Wrench, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { accessLevel, loading: accessLoading } = useAccessLevel();
  const { onboardingData, loading: onboardingLoading, completeStep } = useOnboarding(user?.id);
  const { isAdmin, isSuperAdmin, isManagerOnly, isCreator, isManager, roles, loading: rolesLoading } = useUserRole();
  const { pendingCommitments, newInvoices, newSupportResponses, timelineNotifications, totalNotifications } = useNotifications(user?.id);
  const { data: meetingStatus } = useMeetingStatus();
  const { 
    newSupportTickets, 
    pendingReviews, 
    pendingInvoiceConfirmations, 
    overdueCommitments, 
    upcomingMeetings,
    pendingActivations,
    totalNotifications: adminTotalNotifications 
  } = useAdminNotifications();
  const [activeTab, setActiveTab] = useState<"overview" | "onboarding" | "account" | "settings" | "meetings" | "upload" | "commitments" | "shoots" | "invoices" | "contract" | "support" | "library" | "admin" | "manager">("overview");
  const [adminSubTab, setAdminSubTab] = useState<string>("overview");
  const [managerSubTab, setManagerSubTab] = useState<string>("overview");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadRefresh, setUploadRefresh] = useState(0);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalSteps = 10;
  
  // Dynamic step calculation based on access level
  const getVisibleTotalSteps = () => {
    if (accessLevel === 'meeting_only' && !meetingStatus?.meetingCompleted) {
      return 2; // Only show pre-meeting steps
    }
    return 10; // Show all steps
  };
  
  const visibleTotalSteps = getVisibleTotalSteps();
  const progress = (currentStep / visibleTotalSteps) * 100;
  const currentStepConfig = getStepConfig(currentStep);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Security check: Ensure user has proper role assigned
  useEffect(() => {
    const checkUserRole = async () => {
      if (user && !rolesLoading) {
        if (roles.length === 0) {
          console.error("Unauthorized access attempt - no role assigned");
          toast.error("Access denied. Please contact support.");
          await signOut();
        }
      }
    };
    checkUserRole();
  }, [user, roles, rolesLoading, signOut]);

  const handleMarkSupportAsViewed = async () => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('support_tickets')
        .update({ creator_viewed_response_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .not('admin_response', 'is', null);
    } catch (error) {
      console.error('Error marking support as viewed:', error);
    }
  };

  const handleSupportTabClick = () => {
    setActiveTab('support');
    handleMarkSupportAsViewed();
  };

  const notificationItems: NotificationItem[] = [
    ...timelineNotifications,
    ...(pendingCommitments > 0 ? [{
      id: 'commitments',
      type: 'commitment' as const,
      title: 'Pending Commitments',
      description: `You have ${pendingCommitments} pending commitment${pendingCommitments === 1 ? '' : 's'}`,
      count: pendingCommitments,
      color: 'yellow' as const,
      action: () => setActiveTab('commitments'),
    }] : []),
    ...(newInvoices > 0 ? [{
      id: 'invoices',
      type: 'invoice' as const,
      title: 'New Invoices',
      description: `You have ${newInvoices} invoice${newInvoices === 1 ? '' : 's'} awaiting confirmation`,
      count: newInvoices,
      color: 'blue' as const,
      action: () => setActiveTab('invoices'),
    }] : []),
    ...(newSupportResponses > 0 ? [{
      id: 'support',
      type: 'support' as const,
      title: 'Support Responses',
      description: `You have ${newSupportResponses} new response${newSupportResponses === 1 ? '' : 's'} from admin`,
      count: newSupportResponses,
      color: 'green' as const,
      action: handleSupportTabClick,
    }] : []),
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (onboardingData) {
      setCurrentStep(onboardingData.current_step || 1);
    }
  }, [onboardingData]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_picture_url')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setProfilePictureUrl(data.profile_picture_url);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Show loading while checking access
  if (authLoading || accessLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show appropriate view based on access level
  if (accessLevel === 'no_access') {
    return <NoAccessView />;
  }

  // meeting_only users stay in dashboard with limited access

  if (onboardingLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleStepComplete = async (step: number, stepData: Record<string, any>) => {
    const result = await completeStep(step, stepData);
    if (!result.error) {
      setCurrentStep(step + 1);
    }
    return result;
  };

  const renderOnboardingStep = () => {
    const commonProps = {
      onboardingData,
      onComplete: handleStepComplete
    };

    // Check if current step is post-meeting and meeting isn't completed
    const isStepLocked = isPostMeetingStep(currentStep) && !meetingStatus?.meetingCompleted;

    const stepContent = () => {
      switch (currentStep) {
        case 1:
          return <OnboardingPersonal {...commonProps} onNext={() => setCurrentStep(2)} />;
        case 2:
          return <OnboardingPersona {...commonProps} onNext={() => {
            // Check if meeting completed before proceeding to step 3
            if (!meetingStatus?.meetingCompleted) {
              toast.info("Please complete your meeting first to continue with the rest of the onboarding process");
              setActiveTab("meetings");
            } else {
              setCurrentStep(3);
            }
          }} onBack={() => setCurrentStep(1)} />;
        case 3:
          return <OnboardingSocials {...commonProps} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
        case 4:
          return <OnboardingBody {...commonProps} onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />;
        case 5:
          return <OnboardingBoundaries {...commonProps} onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />;
        case 6:
          return <OnboardingBackstory {...commonProps} onNext={() => setCurrentStep(7)} onBack={() => setCurrentStep(5)} />;
        case 7:
          return <OnboardingContent {...commonProps} onNext={() => setCurrentStep(8)} onBack={() => setCurrentStep(6)} />;
        case 8:
          return <OnboardingPricing {...commonProps} onNext={() => setCurrentStep(9)} onBack={() => setCurrentStep(7)} />;
        case 9:
          return <OnboardingScripts {...commonProps} onNext={() => setCurrentStep(10)} onBack={() => setCurrentStep(8)} />;
        case 10:
          return <OnboardingCommitments {...commonProps} onBack={() => setCurrentStep(9)} />;
        default:
          return <OnboardingPersonal {...commonProps} onNext={() => setCurrentStep(2)} />;
      }
    };

    // Wrap in appropriate stage gate
    if (currentStep <= 2) {
      return (
        <OnboardingStageGate stage="pre-meeting">
          {stepContent()}
        </OnboardingStageGate>
      );
    } else {
      return (
        <OnboardingStageGate 
          stage="post-meeting"
          onNavigateToMeetings={() => setActiveTab("meetings")}
        >
          {stepContent()}
        </OnboardingStageGate>
      );
    }
  };

  // Get dashboard title based on role
  const getDashboardTitle = () => {
    if (isAdmin || isSuperAdmin) return t('dashboard.pageTitle.adminDashboard');
    if (isManagerOnly) return t('dashboard.pageTitle.managerDashboard');
    return t('dashboard.pageTitle.creatorDashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                  <div className="p-6 border-b border-border">
                    <h2 className="font-serif text-xl font-bold">Navigation</h2>
                  </div>
                  <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                    <DashboardNav
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      pendingCommitments={pendingCommitments}
                      newInvoices={newInvoices}
                      isAdmin={isAdmin}
                      isSuperAdmin={isSuperAdmin}
                      isManagerOnly={isManagerOnly}
                      isCreator={isCreator}
                      isManager={isManager}
                      onAdminClick={() => setActiveTab("admin")}
                      onManagerClick={() => setActiveTab("manager")}
                      onMobileMenuClose={() => setMobileMenuOpen(false)}
                      accessLevel={accessLevel}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold">{getDashboardTitle()}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSelector />
              {(isAdmin || isSuperAdmin) && (
                <Button
                  onClick={() => navigate("/admin")}
                  variant="default"
                  size="sm"
                  className="gap-2 bg-primary hover:bg-primary/90 relative"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  {adminTotalNotifications > 0 && (
                    <Badge className="ml-1 h-5 min-w-[20px] px-1.5 bg-destructive text-destructive-foreground">
                      {adminTotalNotifications}
                    </Badge>
                  )}
                  <ArrowRight className="w-3 h-3 hidden lg:inline" />
                </Button>
              )}
              <NotificationBell
                notifications={notificationItems}
                totalCount={totalNotifications}
                onMarkAllRead={handleMarkSupportAsViewed}
                showMarkAllRead={newSupportResponses > 0}
              />
              <Button variant="ghost" size="sm" onClick={signOut} className="hidden sm:flex">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut} className="sm:hidden">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
            <Card className="p-6 h-fit bg-card border-primary/20 sticky top-20">
              <DashboardNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                pendingCommitments={pendingCommitments}
                newInvoices={newInvoices}
                isAdmin={isAdmin}
                isSuperAdmin={isSuperAdmin}
                isManagerOnly={isManagerOnly}
                isCreator={isCreator}
                isManager={isManager}
                onAdminClick={() => setActiveTab("admin")}
                onManagerClick={() => setActiveTab("manager")}
                accessLevel={accessLevel}
              />
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{/* min-w-0 prevents overflow on mobile */}
            {activeTab === "overview" && user && (
              <DashboardOverview 
                userId={user.id}
                onNavigate={(tab, subTab) => {
                  setActiveTab(tab as typeof activeTab);
                  if (subTab) {
                    if (tab === 'admin') setAdminSubTab(subTab);
                    if (tab === 'manager') setManagerSubTab(subTab);
                  }
                }}
                accessLevel={accessLevel}
                meetingCompleted={meetingStatus?.meetingCompleted}
              />
            )}

            {activeTab === "onboarding" && (
              <div>
                {/* Limited Access Banner */}
                {accessLevel === 'meeting_only' && !meetingStatus?.meetingCompleted && (
                  <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-sm">
                      <span className="font-semibold">Limited Access Mode:</span> Complete steps 1-2 now, then book your meeting to unlock the remaining 8 sections.
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-card border-primary/20">
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold mb-1">
                        {accessLevel === 'meeting_only' && !meetingStatus?.meetingCompleted 
                          ? "Pre-Meeting Setup" 
                          : "Complete Your Onboarding"}
                      </h2>
                      {currentStepConfig && (
                        <p className="text-sm text-muted-foreground">
                          {currentStepConfig.label} - {currentStepConfig.description}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">
                          {accessLevel === 'meeting_only' && !meetingStatus?.meetingCompleted 
                            ? `Pre-Meeting: Step ${currentStep} of ${visibleTotalSteps}`
                            : `Step ${currentStep} of ${visibleTotalSteps}`}
                        </p>
                        {currentStepConfig && (
                          <Badge variant={currentStepConfig.stage === "pre-meeting" ? "default" : "secondary"} className="text-xs">
                            {currentStepConfig.stage === "pre-meeting" ? "Pre-Meeting" : "Post-Meeting"}
                          </Badge>
                        )}
                      </div>
                      <Progress value={progress} />
                      {accessLevel === 'meeting_only' && !meetingStatus?.meetingCompleted && currentStep <= 2 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          ✨ 8 more sections unlock after your meeting
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Preview of Post-Meeting Steps */}
                {accessLevel === 'meeting_only' && !meetingStatus?.meetingCompleted && currentStep === 2 && (
                  <Card className="p-4 mb-4 bg-muted/30 border-dashed">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <LockIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">Unlocks After Your Meeting</h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <div>✓ Social Media</div>
                        <div>✓ Physical Details</div>
                        <div>✓ Boundaries</div>
                        <div>✓ Backstory</div>
                        <div>✓ Content Preferences</div>
                        <div>✓ Pricing</div>
                        <div>✓ Scripts</div>
                        <div>✓ Commitments</div>
                      </div>
                      <Button 
                        onClick={() => setActiveTab('meetings')} 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Your Meeting
                      </Button>
                    </div>
                  </Card>
                )}
                
                {renderOnboardingStep()}
              </div>
            )}
            
            {activeTab === "account" && user && (
              <CreatorProfile 
                onboardingData={onboardingData}
                userId={user.id}
                userName={user.email || undefined}
                profilePictureUrl={profilePictureUrl}
                onNavigateToOnboarding={(step) => {
                  setCurrentStep(step);
                  setActiveTab("onboarding");
                }}
                accessLevel={accessLevel}
                meetingCompleted={meetingStatus?.meetingCompleted}
              />
            )}

            {activeTab === "settings" && user && (
              <Settings userId={user.id} onNavigate={(tab) => setActiveTab(tab as typeof activeTab)} />
            )}
            
            {activeTab === "upload" && user && accessLevel === 'full_access' && (
              <div className="space-y-4 sm:space-y-6">
                <ContentUpload 
                  userId={user.id} 
                  onUploadComplete={() => setUploadRefresh(prev => prev + 1)}
                />
                <ContentGallery 
                  userId={user.id} 
                  refreshTrigger={uploadRefresh}
                />
              </div>
            )}
            
            {activeTab === "support" && user && accessLevel === 'full_access' && (
              <ContactSupport userId={user.id} userName={user.email || "User"} />
            )}

            {activeTab === "commitments" && user && accessLevel === 'full_access' && (
              <WeeklyCommitments userId={user.id} />
            )}

            {activeTab === "shoots" && user && accessLevel === 'full_access' && (
              <StudioShoots userId={user.id} />
            )}

            {activeTab === "invoices" && user && accessLevel === 'full_access' && (
              <InvoiceStatus />
            )}

            {activeTab === "contract" && user && accessLevel === 'full_access' && (
              <CreatorContract />
            )}

            {activeTab === "meetings" && user && (
              <MeetingBookingView mode="management" />
            )}

            {activeTab === "library" && user && accessLevel === 'full_access' && (
              <ContentLibrary userId={user.id} />
            )}

            {activeTab === "admin" && (isAdmin || isSuperAdmin) && (
              <div className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 overflow-hidden">
                  <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                    <div>
                      <h2 className="text-3xl font-bold font-serif tracking-tight">Admin Controls</h2>
                      <p className="text-sm text-muted-foreground mt-2">Manage applications, creators, and system settings</p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <Tabs value={adminSubTab} onValueChange={setAdminSubTab} className="w-full">
                      <div className="border-b border-border/50 bg-muted/30 px-6">
                        <TabsList className="h-auto bg-transparent border-0 w-full justify-start gap-1 py-3 overflow-x-auto scrollbar-hide">
                          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Analytics</TabsTrigger>
                          <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Applications</TabsTrigger>
                          <TabsTrigger value="creators" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Creators</TabsTrigger>
                          <TabsTrigger value="commitments" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Commitments</TabsTrigger>
                          <TabsTrigger value="shoots" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Shoots</TabsTrigger>
                          <TabsTrigger value="review" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Review</TabsTrigger>
                          <TabsTrigger value="meetings" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Meetings</TabsTrigger>
                          <TabsTrigger value="support" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Support</TabsTrigger>
                          <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Invoices</TabsTrigger>
                          <TabsTrigger value="contracts" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Contracts</TabsTrigger>
                          <TabsTrigger value="access" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Access</TabsTrigger>
                          {isSuperAdmin && (
                            <>
                              <TabsTrigger value="roles" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Roles</TabsTrigger>
                              <TabsTrigger value="permissions" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Permissions</TabsTrigger>
                              <TabsTrigger value="dev-tools" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm bg-primary/10 border border-primary/20">
                                <Wrench className="w-4 h-4 mr-1" />
                                Dev Tools
                              </TabsTrigger>
                            </>
                          )}
                        </TabsList>
                      </div>

                      <div className="p-6">
                        <TabsContent value="overview" className="mt-0">
                          <AdminControlsOverview onNavigate={(tab) => setAdminSubTab(tab)} />
                        </TabsContent>

                        <TabsContent value="analytics" className="mt-0">
                          <Analytics />
                        </TabsContent>

                        <TabsContent value="applications" className="mt-0">
                          <ApplicationsManagement />
                        </TabsContent>

                        <TabsContent value="creators" className="mt-0">
                          <CreatorOverview />
                        </TabsContent>

                        <TabsContent value="commitments" className="mt-0">
                          <AdminCommitments />
                        </TabsContent>

                        <TabsContent value="shoots" className="mt-0">
                          <AdminShoots />
                        </TabsContent>

                        <TabsContent value="review" className="mt-0">
                          <ContentReview />
                        </TabsContent>

                        <TabsContent value="meetings" className="mt-0">
                          <AdminMeetings />
                        </TabsContent>

                        <TabsContent value="support" className="mt-0">
                          <AdminSupportTickets />
                        </TabsContent>

                        <TabsContent value="invoices" className="mt-0">
                          <AdminInvoices />
                        </TabsContent>

                        <TabsContent value="contracts" className="mt-0">
                          <AdminContracts />
                        </TabsContent>

                        <TabsContent value="access" className="mt-0">
                          <Card className="border-muted/50">
                            <Tabs defaultValue="manage" className="w-full">
                              <div className="border-b border-border/50 px-4 pt-4">
                                <TabsList className="h-auto bg-muted/30 p-1 rounded-lg">
                                  <TabsTrigger value="manage" className="rounded-md">Manage Access</TabsTrigger>
                                  <TabsTrigger value="audit" className="rounded-md">Audit Log</TabsTrigger>
                                </TabsList>
                              </div>
                              
                              <div className="p-4">
                                <TabsContent value="manage" className="mt-0">
                                  <AccessManagement />
                                </TabsContent>
                                
                                <TabsContent value="audit" className="mt-0">
                                  <AccessAuditLog />
                                </TabsContent>
                              </div>
                            </Tabs>
                          </Card>
                        </TabsContent>

                        {isSuperAdmin && (
                          <>
                            <TabsContent value="roles" className="mt-0">
                              <RoleManagement />
                            </TabsContent>

                            <TabsContent value="permissions" className="mt-0">
                              <PermissionsManager />
                            </TabsContent>

                            <TabsContent value="dev-tools" className="mt-0">
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold">Development Tools</h3>
                                    <p className="text-sm text-muted-foreground">Test data generation and development utilities</p>
                                  </div>
                                  <Button
                                    onClick={() => navigate("/admin")}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Shield className="w-4 h-4" />
                                    Full Admin Dashboard
                                  </Button>
                                </div>
                                <ProductionReadinessCheck />
                                <EnhancedTestManagerFlow />
                                <TestDataGenerator />
                              </div>
                            </TabsContent>
                          </>
                        )}
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "manager" && isManagerOnly && (
              <div className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 overflow-hidden">
                  <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                    <div>
                      <h2 className="text-3xl font-bold font-serif tracking-tight">Manager Controls</h2>
                      <p className="text-sm text-muted-foreground mt-2">Manage your assigned creators and meetings</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <Tabs value={managerSubTab} onValueChange={setManagerSubTab} className="w-full">
                      <div className="border-b border-border/50 bg-muted/30 px-6">
                        <TabsList className="h-auto bg-transparent border-0 w-full justify-start gap-1 py-3 overflow-x-auto scrollbar-hide">
                          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                          <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Applications</TabsTrigger>
                          <TabsTrigger value="creators" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Creators</TabsTrigger>
                          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Notifications</TabsTrigger>
                          <TabsTrigger value="commitments" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Commitments</TabsTrigger>
                          <TabsTrigger value="shoots" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Shoots</TabsTrigger>
                          <TabsTrigger value="meetings" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Meetings</TabsTrigger>
                          <TabsTrigger value="access" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Access</TabsTrigger>
                          <TabsTrigger value="contracts" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Contracts</TabsTrigger>
                          <TabsTrigger value="availability" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Availability</TabsTrigger>
                          <TabsTrigger value="support" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Support</TabsTrigger>
                        </TabsList>
                      </div>

                      <div className="p-6">
                        <TabsContent value="overview" className="mt-0 space-y-4">
                          <PendingActivationsWidget onNavigateToMeetings={() => setActiveTab('meetings')} />
                          <ManagerControlsOverview managerId={user.id} onNavigate={(tab) => setManagerSubTab(tab)} />
                        </TabsContent>

                        <TabsContent value="applications" className="mt-0">
                          <ApplicationsManagement />
                        </TabsContent>

                        <TabsContent value="creators" className="mt-0">
                          <CreatorOverview />
                        </TabsContent>

                        <TabsContent value="notifications" className="mt-0">
                          <ManagerNotifications userId={user.id} />
                        </TabsContent>

                        <TabsContent value="commitments" className="mt-0">
                          <AdminCommitments />
                        </TabsContent>

                        <TabsContent value="shoots" className="mt-0">
                          <AdminShoots />
                        </TabsContent>

                        <TabsContent value="meetings" className="mt-0">
                          <AdminMeetings />
                        </TabsContent>

                        <TabsContent value="access" className="mt-0">
                          <Card className="border-muted/50">
                            <Tabs defaultValue="manage" className="w-full">
                              <div className="border-b border-border/50 px-4 pt-4">
                                <TabsList className="h-auto bg-muted/30 p-1 rounded-lg">
                                  <TabsTrigger value="manage" className="rounded-md">Manage Access</TabsTrigger>
                                  <TabsTrigger value="audit" className="rounded-md">Audit Log</TabsTrigger>
                                </TabsList>
                              </div>
                              
                              <div className="p-4">
                                <TabsContent value="manage" className="mt-0">
                                  <AccessManagement />
                                </TabsContent>
                                
                                <TabsContent value="audit" className="mt-0">
                                  <AccessAuditLog />
                                </TabsContent>
                              </div>
                            </Tabs>
                          </Card>
                        </TabsContent>

                        <TabsContent value="contracts" className="mt-0">
                          <AdminContracts />
                        </TabsContent>

                        <TabsContent value="availability" className="mt-0">
                          <ManagerAvailabilitySettings />
                        </TabsContent>

                        <TabsContent value="support" className="mt-0">
                          <AdminSupportTickets />
                        </TabsContent>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
