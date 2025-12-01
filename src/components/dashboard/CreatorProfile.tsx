import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { OnboardingData } from "@/hooks/useOnboarding";
import { User, Heart, MapPin, Shield, DollarSign, MessageSquare, Share2, Target, Camera, CheckSquare, Download } from "lucide-react";
import { ProfileSkeleton } from "@/components/ui/loading-skeletons";
import { AccessLevel } from "@/hooks/useAccessLevel";
import { toast } from "sonner";
import { SectionEditor } from "@/components/onboarding/SectionEditor";
import { SectionProgressRing } from "@/components/onboarding/SectionProgressRing";
import { useUserRole } from "@/hooks/useUserRole";
import { exportOnboardingProfile, downloadJSON, fetchOnboardingData } from "@/lib/onboardingExport";
import { Step1PrivateInfoForm } from "@/components/onboarding/sections/Step1PrivateInfoForm";
import { Step2BrandIdentityForm } from "@/components/onboarding/sections/Step2BrandIdentityForm";
import { Step3AmsterdamStoryForm } from "@/components/onboarding/sections/Step3AmsterdamStoryForm";
import { Step4PersonaForm } from "@/components/onboarding/sections/Step4PersonaForm";
import { Step5BoundariesForm } from "@/components/onboarding/sections/Step5BoundariesForm";
import { Step6PricingForm } from "@/components/onboarding/sections/Step6PricingForm";
import { Step7MessagingForm } from "@/components/onboarding/sections/Step7MessagingForm";
import { Step8SocialsForm } from "@/components/onboarding/sections/Step8SocialsForm";
import { Step9ContentPreferencesForm } from "@/components/onboarding/sections/Step9ContentPreferencesForm";
import { Step10MarketPositioningForm } from "@/components/onboarding/sections/Step10MarketPositioningForm";
import { Step11CommitmentsForm } from "@/components/onboarding/sections/Step11CommitmentsForm";

interface CreatorProfileProps {
  onboardingData: OnboardingData | null;
  userId: string;
  userName?: string;
  profilePictureUrl?: string | null;
  accessLevel?: AccessLevel;
  meetingCompleted?: boolean;
  onSaveSection: (sectionId: number, sectionData: any) => Promise<void>;
}

export const CreatorProfile = ({
  onboardingData,
  userId,
  userName,
  profilePictureUrl,
  accessLevel,
  meetingCompleted,
  onSaveSection
}: CreatorProfileProps) => {
  const [sectionData, setSectionData] = useState<Record<number, any>>({});
  const [sectionValidity, setSectionValidity] = useState<Record<number, boolean>>({});
  const [isExporting, setIsExporting] = useState(false);
  const { isAdmin, isManager, isSuperAdmin } = useUserRole();
  const canViewPrivateInfo = isAdmin || isManager || isSuperAdmin;

  const isSectionLocked = (sectionIndex: number) => {
    if (sectionIndex <= 2) return false;
    if (accessLevel === 'full_access' || meetingCompleted) return false;
    if (accessLevel === 'meeting_only' && sectionIndex > 2) return true;
    return false;
  };

  const completedSteps = onboardingData?.completed_steps || [];
  const totalSteps = 11;
  const completionPercentage = Math.round((completedSteps.length / totalSteps) * 100);

  if (!onboardingData) {
    return <ProfileSkeleton />;
  }

  const handleSectionChange = (sectionId: number, data: any, isValid?: boolean) => {
    setSectionData(prev => ({ ...prev, [sectionId]: data }));
    if (isValid !== undefined) {
      setSectionValidity(prev => ({ ...prev, [sectionId]: isValid }));
    }
  };

  const handleSectionSave = async (sectionId: number) => {
    const data = sectionData[sectionId];
    if (!data) {
      toast.error("No changes to save");
      return;
    }
    await onSaveSection(sectionId, data);
  };

  const handleExportProfile = async () => {
    setIsExporting(true);
    try {
      const result = await exportOnboardingProfile(userId);
      
      if (result.success) {
        toast.success("Profile exported successfully! Files stored in your account.");
        
        // Optionally also download JSON locally
        const data = await fetchOnboardingData(userId);
        if (data) {
          downloadJSON(data, `${userName || 'creator'}_onboarding_${Date.now()}.json`);
        }
      } else {
        toast.error(result.error || "Failed to export profile");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("An error occurred while exporting");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="border-primary/20 bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-serif font-bold mb-2">Creator Profile</h2>
              <p className="text-muted-foreground mb-4">Complete your onboarding profile</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{completedSteps.length} of {totalSteps} sections complete</span>
                  <span className="font-semibold">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>

              <div className="flex items-center gap-3 mt-3">
                {completionPercentage === 100 && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Profile Complete!
                  </Badge>
                )}
                
                {completionPercentage === 100 && (
                  <Button
                    onClick={handleExportProfile}
                    disabled={isExporting}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export Profile"}
                  </Button>
                )}
              </div>
            </div>

            <SectionProgressRing completed={completedSteps.length} total={totalSteps} />
          </div>
        </CardContent>
      </Card>

      <ProfilePictureUpload 
        userId={userId}
        currentPictureUrl={profilePictureUrl}
        userName={userName || onboardingData.personal_full_name || "User"}
      />

      {/* 11-Step Onboarding Sections (Section 1 admin-only, Section 11 visible to all but internal only) */}
      <Accordion type="multiple" className="space-y-4">
        {/* Section 1: Personal Information (Admin/Manager Only) */}
        {canViewPrivateInfo && (
          <AccordionItem value="section-1" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 w-full">
                <User className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Personal Information (Private)</h3>
                  <p className="text-sm text-muted-foreground">Admin/Manager only</p>
                </div>
                {completedSteps.includes(1) && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Complete
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <SectionEditor
                sectionId={1}
                title="Personal Information"
                icon={<User className="h-5 w-5" />}
                description="Private personal details"
                isComplete={completedSteps.includes(1)}
                onSave={() => handleSectionSave(1)}
              >
                <Step1PrivateInfoForm 
                  initialData={onboardingData.step1_private_info || {}}
                  onChange={(data) => handleSectionChange(1, data)}
                />
              </SectionEditor>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Section 2: Brand & Character Identity */}
        <AccordionItem value="section-2" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <Heart className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Brand & Character Identity</h3>
                <p className="text-sm text-muted-foreground">Your brand personality and values</p>
              </div>
              {completedSteps.includes(2) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={2}
              title="Brand & Character Identity"
              icon={<Heart className="h-5 w-5" />}
              description="Define your brand personality"
              isComplete={completedSteps.includes(2)}
              onSave={() => handleSectionSave(2)}
            >
              <Step2BrandIdentityForm
                initialData={onboardingData.step2_brand_identity || {}}
                onChange={(data) => handleSectionChange(2, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Amsterdam Story */}
        <AccordionItem value="section-3" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Amsterdam Story</h3>
                <p className="text-sm text-muted-foreground">Your connection to Amsterdam</p>
              </div>
              {completedSteps.includes(3) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
              {isSectionLocked(3) && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Locked
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={3}
              title="Amsterdam Story"
              icon={<MapPin className="h-5 w-5" />}
              description="Share your Amsterdam connection"
              isLocked={isSectionLocked(3)}
              isComplete={completedSteps.includes(3)}
              onSave={() => handleSectionSave(3)}
            >
              <Step3AmsterdamStoryForm
                initialData={onboardingData.step3_amsterdam_story || {}}
                onChange={(data) => handleSectionChange(3, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Persona & Character */}
        <AccordionItem value="section-4" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <Heart className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Persona & Character</h3>
                <p className="text-sm text-muted-foreground">Character voice, personality & physical traits</p>
              </div>
              {completedSteps.includes(4) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
              {isSectionLocked(4) && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Locked
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={4}
              title="Persona & Character"
              icon={<Heart className="h-5 w-5" />}
              description="Define your character's voice and appearance"
              isLocked={isSectionLocked(4)}
              isComplete={completedSteps.includes(4)}
              onSave={() => handleSectionSave(4)}
            >
              <Step4PersonaForm
                initialData={onboardingData.step4_persona || {}}
                onChange={(data) => handleSectionChange(4, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Boundaries & Comfort Levels */}
        <AccordionItem value="section-5" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <Shield className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Boundaries & Comfort Levels</h3>
                <p className="text-sm text-muted-foreground">Your limits and preferences</p>
              </div>
              {completedSteps.includes(5) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
              {isSectionLocked(5) && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Locked
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={5}
              title="Boundaries & Comfort Levels"
              icon={<Shield className="h-5 w-5" />}
              description="Set your boundaries"
              isLocked={isSectionLocked(5)}
              isComplete={completedSteps.includes(5)}
              onSave={() => handleSectionSave(5)}
            >
              <Step5BoundariesForm
                initialData={onboardingData.step5_boundaries || {}}
                onChange={(data) => handleSectionChange(5, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 6: Services & Pricing */}
        <AccordionItem value="section-6" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <DollarSign className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Services & Pricing</h3>
                <p className="text-sm text-muted-foreground">Your rates and offerings</p>
              </div>
              {completedSteps.includes(6) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
              {isSectionLocked(6) && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Locked
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={6}
              title="Services & Pricing"
              icon={<DollarSign className="h-5 w-5" />}
              description="Define your pricing structure"
              isLocked={isSectionLocked(6)}
              isComplete={completedSteps.includes(6)}
              onSave={() => handleSectionSave(6)}
            >
              <Step6PricingForm
                initialData={onboardingData.step6_pricing || {}}
                onChange={(data) => handleSectionChange(6, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 7: Messaging Preferences */}
        <AccordionItem value="section-7" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Messaging Preferences</h3>
                <p className="text-sm text-muted-foreground">Communication style and templates</p>
              </div>
              {completedSteps.includes(7) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
              {isSectionLocked(7) && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Locked
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={7}
              title="Messaging Preferences"
              icon={<MessageSquare className="h-5 w-5" />}
              description="Define your messaging style"
              isLocked={isSectionLocked(7)}
              isComplete={completedSteps.includes(7)}
              onSave={() => handleSectionSave(7)}
            >
              <Step7MessagingForm
                initialData={onboardingData.step7_messaging || {}}
                onChange={(data) => handleSectionChange(7, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 8: Socials & Platforms */}
        <AccordionItem value="section-8" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <Share2 className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Socials & Platforms</h3>
                <p className="text-sm text-muted-foreground">Social media links and platforms</p>
              </div>
              {completedSteps.includes(8) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
              {isSectionLocked(8) && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Locked
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={8}
              title="Socials & Platforms"
              icon={<Share2 className="h-5 w-5" />}
              description="Connect your social profiles"
              isLocked={isSectionLocked(8)}
              isComplete={completedSteps.includes(8)}
              onSave={() => handleSectionSave(8)}
            >
              <Step8SocialsForm
                initialData={onboardingData.step8_content_preferences || {}}
                onChange={(data) => handleSectionChange(8, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 9: Content Preferences */}
        <AccordionItem value="section-9" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <Camera className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Content Preferences</h3>
                <p className="text-sm text-muted-foreground">Posting schedule and content styles</p>
              </div>
              {completedSteps.includes(9) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
              {isSectionLocked(9) && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Locked
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={9}
              title="Content Preferences"
              icon={<Camera className="h-5 w-5" />}
              description="Your content preferences"
              isLocked={isSectionLocked(9)}
              isComplete={completedSteps.includes(9)}
              onSave={() => handleSectionSave(9)}
            >
              <Step9ContentPreferencesForm
                initialData={onboardingData.step9_market_positioning || {}}
                onChange={(data) => handleSectionChange(9, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 10: Market Positioning */}
        <AccordionItem value="section-10" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <Target className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Market Positioning</h3>
                <p className="text-sm text-muted-foreground">Your niche and target audience</p>
              </div>
              {completedSteps.includes(10) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
              {isSectionLocked(10) && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Locked
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={10}
              title="Market Positioning"
              icon={<Target className="h-5 w-5" />}
              description="Define your market niche"
              isLocked={isSectionLocked(10)}
              isComplete={completedSteps.includes(10)}
              onSave={() => handleSectionSave(10)}
            >
              <Step10MarketPositioningForm
                initialData={onboardingData.step10_commitments || {}}
                onChange={(data) => handleSectionChange(10, data)}
              />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>

        {/* Section 11: Requirements & Commitments (Internal only) */}
        <AccordionItem value="section-11" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <CheckSquare className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Requirements & Commitments</h3>
                <p className="text-sm text-muted-foreground">Final agreements (Internal only)</p>
              </div>
              {completedSteps.includes(11) && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionEditor
              sectionId={11}
              title="Requirements & Commitments"
              icon={<CheckSquare className="h-5 w-5" />}
              description="Final agreements (Internal only)"
                isComplete={completedSteps.includes(11)}
                onSave={() => handleSectionSave(11)}
              >
                <Step11CommitmentsForm
                  initialData={onboardingData.step11_commitments || {}}
                  onChange={(data) => handleSectionChange(11, data)}
                />
            </SectionEditor>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};