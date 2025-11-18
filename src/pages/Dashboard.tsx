import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LogOut, User, FileText, Upload, Mail, Calendar, CheckSquare, Shield } from "lucide-react";
import OnboardingPersonal from "@/components/onboarding/OnboardingPersonal";
import OnboardingBody from "@/components/onboarding/OnboardingBody";
import OnboardingBoundaries from "@/components/onboarding/OnboardingBoundaries";
import OnboardingPricing from "@/components/onboarding/OnboardingPricing";
import OnboardingPersona from "@/components/onboarding/OnboardingPersona";
import OnboardingScripts from "@/components/onboarding/OnboardingScripts";
import OnboardingContent from "@/components/onboarding/OnboardingContent";
import OnboardingCommitments from "@/components/onboarding/OnboardingCommitments";
import WeeklyCommitments from "@/components/dashboard/WeeklyCommitments";
import StudioShoots from "@/components/dashboard/StudioShoots";
import { ContentUpload } from "@/components/uploads/ContentUpload";
import { ContentGallery } from "@/components/uploads/ContentGallery";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useUserRole } from "@/hooks/useUserRole";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { onboardingData, loading: onboardingLoading, completeStep } = useOnboarding(user?.id);
  const { isAdminOrManager } = useUserRole();
  const [activeTab, setActiveTab] = useState("onboarding");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadRefresh, setUploadRefresh] = useState(0);
  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

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
        return <OnboardingBoundaries {...commonProps} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
      case 4:
        return <OnboardingPricing {...commonProps} onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />;
      case 5:
        return <OnboardingPersona {...commonProps} onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />;
      case 6:
        return <OnboardingScripts {...commonProps} onNext={() => setCurrentStep(7)} onBack={() => setCurrentStep(5)} />;
      case 7:
        return <OnboardingContent {...commonProps} onNext={() => setCurrentStep(8)} onBack={() => setCurrentStep(6)} />;
      case 8:
        return <OnboardingCommitments {...commonProps} onBack={() => setCurrentStep(7)} />;
      default:
        return <OnboardingPersonal {...commonProps} onNext={() => setCurrentStep(2)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-primary text-glow-red">Bureau Boudoir</h1>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
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
                  className="w-full justify-start"
                  onClick={() => setActiveTab("onboarding")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Onboarding
                </Button>
                <Button
                  variant={activeTab === "account" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("account")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
                <Button
                  variant={activeTab === "upload" ? "default" : "ghost"}
                  className="w-full justify-start"
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
                  className="w-full justify-start"
                  onClick={() => setActiveTab("commitments")}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Weekly Commitments
                </Button>
                <Button
                  variant={activeTab === "shoots" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("shoots")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Studio Shoots
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50"></div>

              {/* Third Section */}
              <div className="space-y-2">
                {isAdminOrManager && (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-primary/40 hover:bg-primary/10"
                    onClick={() => navigate("/admin")}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Button>
                )}
                <Button
                  variant={activeTab === "support" ? "default" : "ghost"}
                  className="w-full justify-start"
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
            
            {activeTab === "account" && (
              <Card className="p-6 bg-card border-primary/20">
                <h2 className="font-serif text-2xl font-bold mb-4">Account Information</h2>
                <p className="text-muted-foreground">Your account details and settings will appear here.</p>
              </Card>
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
            
            {activeTab === "support" && (
              <Card className="p-6 bg-card border-primary/20">
                <h2 className="font-serif text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground">Get in touch with your representative.</p>
              </Card>
            )}

            {activeTab === "commitments" && user && (
              <WeeklyCommitments userId={user.id} />
            )}

            {activeTab === "shoots" && user && (
              <StudioShoots userId={user.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
