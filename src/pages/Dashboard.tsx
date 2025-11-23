import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, User, FileText, Upload, Mail, Calendar, CheckSquare, Shield, DollarSign, Menu } from "lucide-react";
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
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useUserRole } from "@/hooks/useUserRole";
import { useNotifications } from "@/hooks/useNotifications";
import { useAccessLevel, AccessLevel } from "@/hooks/useAccessLevel";
import { useMeetingStatus } from "@/hooks/useMeetingStatus";
import ContactSupport from "@/components/dashboard/ContactSupport";
import { Badge } from "@/components/ui/badge";
import { NotificationBell, NotificationItem } from "@/components/NotificationBell";
import { LanguageSelector } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { NoAccessView } from "@/components/dashboard/NoAccessView";
import { MeetingBookingView } from "@/components/dashboard/MeetingBookingView";
import { ContentLibrary } from "@/components/dashboard/ContentLibrary";
import { toast } from "sonner";
import { isPostMeetingStep, getStepConfig, getLastPreMeetingStep } from "@/config/onboardingSteps";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { accessLevel, loading: accessLoading } = useAccessLevel();
  const { onboardingData, loading: onboardingLoading, completeStep } = useOnboarding(user?.id);
  const { isAdmin, isSuperAdmin, isManagerOnly, roles, loading: rolesLoading } = useUserRole();
  const { pendingCommitments, newInvoices, newSupportResponses, timelineNotifications, totalNotifications } = useNotifications(user?.id);
  const { data: meetingStatus } = useMeetingStatus();
  const [activeTab, setActiveTab] = useState<"overview" | "onboarding" | "account" | "meetings" | "upload" | "commitments" | "shoots" | "invoices" | "contract" | "support" | "library">("overview");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadRefresh, setUploadRefresh] = useState(0);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;
  const currentStepConfig = getStepConfig(currentStep);

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
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>;
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
          return <OnboardingPersona {...commonProps} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
        case 3:
          return <OnboardingSocials {...commonProps} onNext={() => {
            // If meeting not completed, stop at step 3
            if (!meetingStatus?.meetingCompleted) {
              toast.info("Complete your meeting to continue with the detailed questionnaire");
              setActiveTab("meetings");
            } else {
              setCurrentStep(4);
            }
          }} onBack={() => setCurrentStep(2)} />;
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
    if (currentStep <= 3) {
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
                      onAdminClick={() => navigate("/admin")}
                      onManagerClick={() => navigate("/manager")}
                      onMobileMenuClose={() => setMobileMenuOpen(false)}
                      accessLevel={accessLevel}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold">Creator Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSelector />
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
        <div className="grid md:grid-cols-4 gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          <Card className="hidden md:block md:col-span-1 p-6 h-fit bg-card border-primary/20 sticky top-20">
            <DashboardNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              pendingCommitments={pendingCommitments}
              newInvoices={newInvoices}
              isAdmin={isAdmin}
              isSuperAdmin={isSuperAdmin}
              isManagerOnly={isManagerOnly}
              onAdminClick={() => navigate("/admin")}
              onManagerClick={() => navigate("/manager")}
              accessLevel={accessLevel}
            />
          </Card>

          {/* Main Content */}
          <div className="md:col-span-3 w-full">
            {activeTab === "overview" && user && (
              <DashboardOverview 
                userId={user.id}
                onNavigate={(tab) => setActiveTab(tab as typeof activeTab)}
                accessLevel={accessLevel}
              />
            )}

            {activeTab === "onboarding" && (
              <div>
                <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-card border-primary/20">
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold mb-1">Complete Your Onboarding</h2>
                      {currentStepConfig && (
                        <p className="text-sm text-muted-foreground">
                          {currentStepConfig.label} - {currentStepConfig.description}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">
                          Step {currentStep} of {totalSteps}
                        </p>
                        {currentStepConfig && (
                          <Badge variant={currentStepConfig.stage === "pre-meeting" ? "default" : "secondary"} className="text-xs">
                            {currentStepConfig.stage === "pre-meeting" ? "Pre-Meeting" : "Post-Meeting"}
                          </Badge>
                        )}
                      </div>
                      <Progress value={progress} />
                    </div>
                  </div>
                </Card>
                
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
              />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
