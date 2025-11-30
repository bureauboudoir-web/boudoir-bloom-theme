import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { OnboardingData } from "@/hooks/useOnboarding";
import { User, Heart, MapPin, Shield, DollarSign, Theater, MessageSquare, Camera, Palette, BookOpen, Target, Tag, MessageCircle, TrendingUp, Users, Lock as LockIcon } from "lucide-react";
import { ProfileSkeleton } from "@/components/ui/loading-skeletons";
import { AccessLevel } from "@/hooks/useAccessLevel";
import { toast } from "sonner";
import { SectionEditor } from "@/components/onboarding/SectionEditor";
import { SectionProgressRing } from "@/components/onboarding/SectionProgressRing";
import { PersonalInfoForm } from "@/components/onboarding/sections/PersonalInfoForm";
import { PhysicalDescriptionForm } from "@/components/onboarding/sections/PhysicalDescriptionForm";
import { AmsterdamStoryForm } from "@/components/onboarding/sections/AmsterdamStoryForm";
import { BoundariesForm } from "@/components/onboarding/sections/BoundariesForm";
import { PricingForm } from "@/components/onboarding/sections/PricingForm";
import { PersonaForm } from "@/components/onboarding/sections/PersonaForm";
import { ScriptsForm } from "@/components/onboarding/sections/ScriptsForm";
import { ContentPreferencesForm } from "@/components/onboarding/sections/ContentPreferencesForm";
import { VisualIdentityForm } from "@/components/onboarding/sections/VisualIdentityForm";
import { CreatorStoryForm } from "@/components/onboarding/sections/CreatorStoryForm";
import { BrandAlignmentForm } from "@/components/onboarding/sections/BrandAlignmentForm";
import { FetishInterestsForm } from "@/components/onboarding/sections/FetishInterestsForm";
import { EngagementStyleForm } from "@/components/onboarding/sections/EngagementStyleForm";
import { MarketPositioningForm } from "@/components/onboarding/sections/MarketPositioningForm";
import { FanExpectationsForm } from "@/components/onboarding/sections/FanExpectationsForm";
import { CreativeBoundariesForm } from "@/components/onboarding/sections/CreativeBoundariesForm";

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

  const isSectionLocked = (sectionIndex: number) => {
    if (sectionIndex <= 2) return false;
    if (accessLevel === 'full_access' || meetingCompleted) return false;
    if (accessLevel === 'meeting_only' && sectionIndex > 2) return true;
    return false;
  };

  const completedSteps = onboardingData?.completed_steps || [];
  const totalSteps = 16;
  const completionPercentage = Math.round((completedSteps.length / totalSteps) * 100);

  if (!onboardingData) {
    return <ProfileSkeleton />;
  }

  const handleSectionChange = (sectionId: number, data: any) => {
    setSectionData(prev => ({ ...prev, [sectionId]: data }));
  };

  const handleSectionSave = async (sectionId: number) => {
    const data = sectionData[sectionId];
    if (!data) {
      toast.error("No changes to save");
      return;
    }
    await onSaveSection(sectionId, data);
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="border-primary/20 bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-serif font-bold mb-2">Creator Profile</h2>
              <p className="text-muted-foreground mb-4">Complete all 16 sections for full profile</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{completedSteps.length} of {totalSteps} sections complete</span>
                  <span className="font-semibold">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>

              {completionPercentage === 100 && (
                <Badge className="mt-3 bg-green-500/10 text-green-500 border-green-500/20">
                  Profile Complete!
                </Badge>
              )}
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

      {/* 16 Editable Sections */}
      <Accordion type="multiple" className="space-y-4">
        {/* Section 1: Personal Information */}
        <AccordionItem value="section-1" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={1}
              title="Personal Information"
              icon={<User className="h-5 w-5" />}
              description="Your basic personal details"
              isComplete={completedSteps.includes(1)}
              onSave={() => handleSectionSave(1)}
            >
              <PersonalInfoForm 
                initialData={{
                  personal_full_name: onboardingData.personal_full_name,
                  personal_date_of_birth: onboardingData.personal_date_of_birth,
                  personal_nationality: onboardingData.personal_nationality,
                  personal_location: onboardingData.personal_location,
                  personal_phone_number: onboardingData.personal_phone_number,
                  business_phone: onboardingData.business_phone,
                  personal_email: onboardingData.personal_email,
                  personal_emergency_contact: onboardingData.personal_emergency_contact,
                  personal_emergency_phone: onboardingData.personal_emergency_phone,
                }}
                onChange={(data) => handleSectionChange(1, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 2: Physical Description */}
        <AccordionItem value="section-2" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={2}
              title="Physical Description"
              icon={<Heart className="h-5 w-5" />}
              description="Your physical characteristics"
              isComplete={completedSteps.includes(2)}
              onSave={() => handleSectionSave(2)}
            >
              <PhysicalDescriptionForm
                initialData={{
                  body_height: onboardingData.body_height,
                  body_weight: onboardingData.body_weight,
                  body_type: onboardingData.body_type,
                  body_hair_color: onboardingData.body_hair_color,
                  body_eye_color: onboardingData.body_eye_color,
                  body_tattoos: onboardingData.body_tattoos,
                  body_piercings: onboardingData.body_piercings,
                  body_distinctive_features: onboardingData.body_distinctive_features,
                }}
                onChange={(data) => handleSectionChange(2, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 3: Amsterdam Story */}
        <AccordionItem value="section-3" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={3}
              title="My Amsterdam Story"
              icon={<MapPin className="h-5 w-5" />}
              description="Your connection to Amsterdam"
              isLocked={isSectionLocked(3)}
              isComplete={completedSteps.includes(3)}
              onSave={() => handleSectionSave(3)}
            >
              <AmsterdamStoryForm
                initialData={{
                  backstory_years_in_amsterdam: onboardingData.backstory_years_in_amsterdam,
                  backstory_neighborhood: onboardingData.backstory_neighborhood,
                  backstory_what_you_love: onboardingData.backstory_what_you_love,
                  backstory_alter_ego: onboardingData.backstory_alter_ego,
                  backstory_persona_sentence: onboardingData.backstory_persona_sentence,
                  backstory_rld_atmosphere: onboardingData.backstory_rld_atmosphere,
                }}
                onChange={(data) => handleSectionChange(3, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 4: Boundaries */}
        <AccordionItem value="section-4" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={4}
              title="Boundaries & Comfort Levels"
              icon={<Shield className="h-5 w-5" />}
              description="Your limits and comfort zones"
              isLocked={isSectionLocked(4)}
              isComplete={completedSteps.includes(4)}
              onSave={() => handleSectionSave(4)}
            >
              <BoundariesForm
                initialData={{
                  boundaries_comfortable_with: onboardingData.boundaries_comfortable_with,
                  boundaries_hard_limits: onboardingData.boundaries_hard_limits,
                  boundaries_soft_limits: onboardingData.boundaries_soft_limits,
                  boundaries_additional_notes: onboardingData.boundaries_additional_notes,
                }}
                onChange={(data) => handleSectionChange(4, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 5: Pricing */}
        <AccordionItem value="section-5" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={5}
              title="Pricing Structure"
              icon={<DollarSign className="h-5 w-5" />}
              description="Your pricing for different services"
              isLocked={isSectionLocked(5)}
              isComplete={completedSteps.includes(5)}
              onSave={() => handleSectionSave(5)}
            >
              <PricingForm
                initialData={{
                  pricing_subscription_monthly: onboardingData.pricing_subscription_monthly,
                  pricing_ppv_photo: onboardingData.pricing_ppv_photo,
                  pricing_ppv_video: onboardingData.pricing_ppv_video,
                  pricing_custom_request: onboardingData.pricing_custom_request,
                  pricing_sexting_session: onboardingData.pricing_sexting_session,
                  pricing_video_call: onboardingData.pricing_video_call,
                }}
                onChange={(data) => handleSectionChange(5, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 6: Persona */}
        <AccordionItem value="section-6" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={6}
              title="Persona & Character"
              icon={<Theater className="h-5 w-5" />}
              description="Your creative persona"
              isLocked={isSectionLocked(6)}
              isComplete={completedSteps.includes(6)}
              onSave={() => handleSectionSave(6)}
            >
              <PersonaForm
                initialData={{
                  persona_stage_name: onboardingData.persona_stage_name,
                  persona_description: onboardingData.persona_description,
                  persona_backstory: onboardingData.persona_backstory,
                  persona_personality_traits: onboardingData.persona_personality_traits,
                }}
                onChange={(data) => handleSectionChange(6, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 7: Scripts */}
        <AccordionItem value="section-7" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={7}
              title="Scripts & Messaging"
              icon={<MessageSquare className="h-5 w-5" />}
              description="Your communication templates"
              isLocked={isSectionLocked(7)}
              isComplete={completedSteps.includes(7)}
              onSave={() => handleSectionSave(7)}
            >
              <ScriptsForm
                initialData={{
                  scripts_greeting_message: onboardingData.scripts_greeting_message,
                  scripts_ppv_promo: onboardingData.scripts_ppv_promo,
                  scripts_sexting_opener: onboardingData.scripts_sexting_opener,
                  scripts_renewal_message: onboardingData.scripts_renewal_message,
                }}
                onChange={(data) => handleSectionChange(7, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 8: Content Preferences */}
        <AccordionItem value="section-8" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={8}
              title="Content Preferences"
              icon={<Camera className="h-5 w-5" />}
              description="Your content creation preferences"
              isLocked={isSectionLocked(8)}
              isComplete={completedSteps.includes(8)}
              onSave={() => handleSectionSave(8)}
            >
              <ContentPreferencesForm
                initialData={{
                  content_posts_per_week: onboardingData.content_posts_per_week,
                  content_photo_sets: onboardingData.content_photo_sets,
                  content_video_count: onboardingData.content_video_count,
                  content_themes: onboardingData.content_themes,
                  content_preferences: onboardingData.content_preferences,
                }}
                onChange={(data) => handleSectionChange(8, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 9: Visual Identity */}
        <AccordionItem value="section-9" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={9}
              title="Visual Identity"
              icon={<Palette className="h-5 w-5" />}
              description="Your brand's visual style"
              isLocked={isSectionLocked(9)}
              isComplete={completedSteps.includes(9)}
              onSave={() => handleSectionSave(9)}
            >
              <VisualIdentityForm
                initialData={onboardingData.section_visual_identity}
                onChange={(data) => handleSectionChange(9, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 10: Creator Story */}
        <AccordionItem value="section-10" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={10}
              title="Creator Story"
              icon={<BookOpen className="h-5 w-5" />}
              description="Your journey as a creator"
              isLocked={isSectionLocked(10)}
              isComplete={completedSteps.includes(10)}
              onSave={() => handleSectionSave(10)}
            >
              <CreatorStoryForm
                initialData={onboardingData.section_creator_story}
                onChange={(data) => handleSectionChange(10, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 11: Brand Alignment */}
        <AccordionItem value="section-11" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={11}
              title="Brand Alignment"
              icon={<Target className="h-5 w-5" />}
              description="Your brand positioning"
              isLocked={isSectionLocked(11)}
              isComplete={completedSteps.includes(11)}
              onSave={() => handleSectionSave(11)}
            >
              <BrandAlignmentForm
                initialData={onboardingData.section_brand_alignment}
                onChange={(data) => handleSectionChange(11, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 12: Fetish/Special Interests */}
        <AccordionItem value="section-12" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={12}
              title="Special Interests"
              icon={<Tag className="h-5 w-5" />}
              description="Content categorization (staff-use only)"
              isLocked={isSectionLocked(12)}
              isComplete={completedSteps.includes(12)}
              onSave={() => handleSectionSave(12)}
            >
              <FetishInterestsForm
                initialData={onboardingData.section_fetish_interests}
                onChange={(data) => handleSectionChange(12, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 13: Engagement Style */}
        <AccordionItem value="section-13" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={13}
              title="Engagement Style"
              icon={<MessageCircle className="h-5 w-5" />}
              description="How you interact with fans"
              isLocked={isSectionLocked(13)}
              isComplete={completedSteps.includes(13)}
              onSave={() => handleSectionSave(13)}
            >
              <EngagementStyleForm
                initialData={onboardingData.section_engagement_style}
                onChange={(data) => handleSectionChange(13, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 14: Market Positioning */}
        <AccordionItem value="section-14" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={14}
              title="Market Positioning"
              icon={<TrendingUp className="h-5 w-5" />}
              description="Your market niche and strategy"
              isLocked={isSectionLocked(14)}
              isComplete={completedSteps.includes(14)}
              onSave={() => handleSectionSave(14)}
            >
              <MarketPositioningForm
                initialData={onboardingData.section_market_positioning}
                onChange={(data) => handleSectionChange(14, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 15: Fan Expectations */}
        <AccordionItem value="section-15" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={15}
              title="Fan Expectations"
              icon={<Users className="h-5 w-5" />}
              description="What fans can expect from you"
              isLocked={isSectionLocked(15)}
              isComplete={completedSteps.includes(15)}
              onSave={() => handleSectionSave(15)}
            >
              <FanExpectationsForm
                initialData={onboardingData.section_fan_expectations}
                onChange={(data) => handleSectionChange(15, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>

        {/* Section 16: Creative Boundaries */}
        <AccordionItem value="section-16" className="border-none">
          <AccordionTrigger className="hover:no-underline p-0">
            <SectionEditor
              sectionId={16}
              title="Creative Boundaries"
              icon={<LockIcon className="h-5 w-5" />}
              description="Your creative control preferences"
              isLocked={isSectionLocked(16)}
              isComplete={completedSteps.includes(16)}
              onSave={() => handleSectionSave(16)}
            >
              <CreativeBoundariesForm
                initialData={onboardingData.section_creative_boundaries}
                onChange={(data) => handleSectionChange(16, data)}
              />
            </SectionEditor>
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    </div>
  );
};