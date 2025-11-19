import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LogOut, User, FileText, Upload, Mail, Calendar, CheckSquare, Shield, DollarSign } from "lucide-react";
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
import WeeklyCommitments from "@/components/dashboard/WeeklyCommitments";
import StudioShoots from "@/components/dashboard/StudioShoots";
import { CreatorInvoices } from "@/components/dashboard/CreatorInvoices";
import { InvoiceStatus } from "@/components/dashboard/InvoiceStatus";
import { ContentUpload } from "@/components/uploads/ContentUpload";
import { ContentGallery } from "@/components/uploads/ContentGallery";
import { CreatorProfile } from "@/components/dashboard/CreatorProfile";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useUserRole } from "@/hooks/useUserRole";
import { useNotifications } from "@/hooks/useNotifications";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import ContactSupport from "@/components/dashboard/ContactSupport";
import { Badge } from "@/components/ui/badge";
import { NotificationBell, NotificationItem } from "@/components/NotificationBell";
import { supabase } from "@/integrations/supabase/client";
import { NoAccessView } from "@/components/dashboard/NoAccessView";
import { MeetingBookingView } from "@/components/dashboard/MeetingBookingView";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { accessLevel, loading: accessLoading } = useAccessLevel();
  const { onboardingData, loading: onboardingLoading, completeStep } = useOnboarding(user?.id);
  const { isAdminOrManager } = useUserRole();
  const { pendingCommitments, newInvoices, newSupportResponses, totalNotifications } = useNotifications(user?.id);
  const [activeTab, setActiveTab] = useState("onboarding");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadRefresh, setUploadRefresh] = useState(0);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

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

  if (accessLevel === 'meeting_only') {
    return <MeetingBookingView />;
  }

  // Full dashboard access (accessLevel === 'full_access')

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

  if (authLoading || onboardingLoading) {
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

    switch (currentStep) {
      case 1:
        return <OnboardingPersonal {...commonProps} onNext={() => setCurrentStep(2)} />;
      case 2:
        return <OnboardingBody {...commonProps} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <OnboardingBackstory {...commonProps} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
      case 4:
        return <OnboardingBoundaries {...commonProps} onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />;
      case 5:
        return <OnboardingPricing {...commonProps} onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />;
      case 6:
        return <OnboardingPersona {...commonProps} onNext={() => setCurrentStep(7)} onBack={() => setCurrentStep(5)} />;
      case 7:
        return <OnboardingSocials {...commonProps} onNext={() => setCurrentStep(8)} onBack={() => setCurrentStep(6)} />;
      case 8:
        return <OnboardingScripts {...commonProps} onNext={() => setCurrentStep(9)} onBack={() => setCurrentStep(7)} />;
      case 9:
        return <OnboardingContent {...commonProps} onNext={() => setCurrentStep(10)} onBack={() => setCurrentStep(8)} />;
      case 10:
        return <OnboardingCommitments {...commonProps} onBack={() => setCurrentStep(9)} />;
      default:
        return <OnboardingPersonal {...commonProps} onNext={() => setCurrentStep(2)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl font-bold">Creator Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell
              notifications={notificationItems}
              totalCount={totalNotifications}
              onMarkAllRead={handleMarkSupportAsViewed}
              showMarkAllRead={newSupportResponses > 0}
            />
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="md:col-span-1 p-6 h-fit bg-card border-primary/20">
            <nav className="space-y-4">
              {/* First Section */}
              <div className="space-y-2">
                <Button
                  variant={activeTab === "onboarding" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "onboarding" ? "border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("onboarding")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Onboarding
                </Button>
                <Button
                  variant={activeTab === "account" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "account" ? "border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("account")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Creator Profile
                </Button>
                <Button
                  variant={activeTab === "upload" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "upload" ? "border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("upload")}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Uploads
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50"></div>

              {/* Second Section */}
              <div className="space-y-2">
                <Button
                  variant={activeTab === "commitments" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "commitments" ? "border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("commitments")}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Weekly Commitments
                  {pendingCommitments > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {pendingCommitments}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={activeTab === "shoots" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "shoots" ? "border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("shoots")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Studio Shoots
                </Button>
                <Button
                  variant={activeTab === "invoices" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "invoices" ? "border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("invoices")}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Invoices
                  {newInvoices > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {newInvoices}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50"></div>

              {/* Third Section */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-primary/40 hover:bg-primary/10"
                  onClick={() => navigate("/admin")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
                <Button
                  variant={activeTab === "support" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "support" ? "border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("support")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </nav>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "onboarding" && (
              <div>
                <Card className="p-6 mb-6 bg-card border-primary/20">
                  <h2 className="font-serif text-2xl font-bold mb-4">Complete Your Onboarding</h2>
                  <p className="text-muted-foreground mb-4">
                    Step {currentStep} of {totalSteps}
                  </p>
                  <Progress value={progress} className="mb-2" />
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
            
            {activeTab === "upload" && user && (
              <div className="space-y-6">
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
            
            {activeTab === "support" && user && (
              <ContactSupport userId={user.id} userName={user.email || ""} />
            )}

            {activeTab === "commitments" && user && (
              <WeeklyCommitments userId={user.id} />
            )}

            {activeTab === "shoots" && user && (
              <StudioShoots userId={user.id} />
            )}

            {activeTab === "invoices" && user && (
              <InvoiceStatus />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
