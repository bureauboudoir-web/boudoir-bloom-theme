import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { OnboardingData } from "@/hooks/useOnboarding";
import { User, Heart, Shield, DollarSign, Theater, MessageSquare, Camera, MapPin, Mail, Phone, Calendar, Briefcase, Instagram, Twitter, Video, Youtube, Link as LinkIcon, Send, CheckCircle2, Lightbulb, Clock, Lock, AlertCircle, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ProfileSkeleton } from "@/components/ui/loading-skeletons";
import { AccessLevel } from "@/hooks/useAccessLevel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface CreatorProfileProps {
  onboardingData: OnboardingData | null;
  userId: string;
  userName?: string;
  profilePictureUrl?: string | null;
  onNavigateToOnboarding?: (step: number) => void;
  accessLevel?: AccessLevel;
  meetingCompleted?: boolean;
}

export const CreatorProfile = ({
  onboardingData,
  userId,
  userName,
  profilePictureUrl,
  onNavigateToOnboarding,
  accessLevel,
  meetingCompleted,
}: CreatorProfileProps) => {
  const { user } = useAuth();

  // Determine if a section should be locked
  const isSectionLocked = (sectionIndex: number) => {
    // Sections 1-2 are always unlocked
    if (sectionIndex <= 2) return false;
    
    // If user has full access or meeting completed, unlock all
    if (accessLevel === 'full_access' || meetingCompleted) return false;
    
    // If meeting_only access and sections 3+, lock them
    if (accessLevel === 'meeting_only' && sectionIndex > 2) return true;
    
    return false;
  };
  const isCompleted = onboardingData?.is_completed || false;
  const isOnboardingComplete = isCompleted;
  const completedSteps = onboardingData?.completed_steps?.length || 0;
  const totalSteps = 16; // Updated to 16 sections
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  const formatValue = (value: any, minLength: number = 2) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }
    // Validate string length
    if (typeof value === 'string' && value.trim().length < minLength) {
      return <span className="text-muted-foreground italic">Please complete profile</span>;
    }
    return value;
  };

  const formatArray = (arr: string[] | null | undefined) => {
    if (!arr || arr.length === 0) {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((item, index) => (
          <Badge key={index} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    );
  };

  const calculateAge = (dateOfBirth: string | null | undefined) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // Validate age is reasonable
    if (age < 18 || age > 100) return null;
    return age;
  };

  const age = calculateAge(onboardingData?.personal_date_of_birth);

  if (!onboardingData) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Creator Profile</h2>
          <p className="text-muted-foreground">Your onboarding information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.hash = '#settings'}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Settings
          </Button>
          <Badge variant={isOnboardingComplete ? "default" : "secondary"}>
            {isOnboardingComplete ? "Profile Complete" : "In Progress"}
          </Badge>
        </div>
      </div>

      {!isOnboardingComplete && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Complete your onboarding to unlock all profile sections.
          </AlertDescription>
        </Alert>
      )}

      <ProfilePictureUpload 
        userId={userId}
        currentPictureUrl={profilePictureUrl}
        userName={userName || onboardingData.personal_full_name || "User"}
      />

      {/* Profile Sections - Detailed Onboarding Data */}
      <Accordion type="multiple" defaultValue={["personal", "body"]} className="space-y-4">
        {/* Personal Information */}
        <AccordionItem value="personal" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="font-semibold">Personal Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p>{formatValue(onboardingData.personal_full_name)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p>{formatValue(onboardingData.personal_date_of_birth)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                <p>{formatValue(onboardingData.personal_nationality)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{formatValue(onboardingData.personal_location)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p>{formatValue(onboardingData.personal_phone_number)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Business Phone</p>
                <p>{formatValue(onboardingData.business_phone)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{formatValue(onboardingData.personal_email)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                <p>{formatValue(onboardingData.personal_emergency_contact)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Phone</p>
                <p>{formatValue(onboardingData.personal_emergency_phone)}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Physical Description */}
        <AccordionItem value="body" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold">Physical Description</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Height</p>
                <p>{formatValue(onboardingData.body_height ? `${onboardingData.body_height} cm` : null)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                <p>{formatValue(onboardingData.body_weight ? `${onboardingData.body_weight} kg` : null)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Body Type</p>
                <p>{formatValue(onboardingData.body_type)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hair Color</p>
                <p>{formatValue(onboardingData.body_hair_color)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eye Color</p>
                <p>{formatValue(onboardingData.body_eye_color)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tattoos</p>
                <p>{formatValue(onboardingData.body_tattoos)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Piercings</p>
                <p>{formatValue(onboardingData.body_piercings)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Distinctive Features</p>
                <p>{formatValue(onboardingData.body_distinctive_features)}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Amsterdam Story */}
        <AccordionItem value="backstory" className="border rounded-lg px-4" disabled={isSectionLocked(3)}>
          <AccordionTrigger 
            className={cn(
              "hover:no-underline",
              isSectionLocked(3) && "cursor-not-allowed opacity-60"
            )}
            onClick={(e) => {
              if (isSectionLocked(3)) {
                e.preventDefault();
                toast.info("Complete your meeting to unlock this section", {
                  description: "Book and complete your introduction meeting to access all profile sections",
                  action: {
                    label: "View Meetings",
                    onClick: () => window.location.hash = "#meetings"
                  }
                });
              }
            }}
          >
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold">My Amsterdam Story</span>
              </div>
              {isSectionLocked(3) && (
                <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="space-y-4">
              {/* Connection to Amsterdam */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-primary">Connection to Amsterdam</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {onboardingData.backstory_years_in_amsterdam ? (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Years in Amsterdam</p>
                      <p className="text-sm">{onboardingData.backstory_years_in_amsterdam}</p>
                    </div>
                  ) : (
                    <div 
                      onClick={() => onNavigateToOnboarding?.(3)}
                      className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
                    >
                      <p className="text-sm font-medium text-muted-foreground">Years in Amsterdam</p>
                      <p className="text-sm italic text-muted-foreground/70">Add years in Amsterdam</p>
                    </div>
                  )}
                  
                  {onboardingData.backstory_neighborhood ? (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Neighborhood</p>
                      <p className="text-sm">{onboardingData.backstory_neighborhood}</p>
                    </div>
                  ) : (
                    <div 
                      onClick={() => onNavigateToOnboarding?.(3)}
                      className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
                    >
                      <p className="text-sm font-medium text-muted-foreground">Neighborhood</p>
                      <p className="text-sm italic text-muted-foreground/70">Add neighborhood</p>
                    </div>
                  )}
                </div>
                
                {onboardingData.backstory_what_you_love ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">What I Love About Amsterdam</p>
                    <p className="text-sm whitespace-pre-wrap">{onboardingData.backstory_what_you_love}</p>
                  </div>
                ) : (
                  <div 
                    onClick={() => onNavigateToOnboarding?.(3)}
                    className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
                  >
                    <p className="text-sm font-medium text-muted-foreground">What I Love About Amsterdam</p>
                    <p className="text-sm italic text-muted-foreground/70">Share what you love about Amsterdam</p>
                  </div>
                )}
              </div>

              {/* Amsterdam Character (Alter Ego) */}
              {onboardingData.backstory_alter_ego ? (
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 space-y-2">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">Amsterdam Alter Ego</p>
                  <p className="italic font-medium">{onboardingData.backstory_alter_ego}</p>
                  {onboardingData.backstory_persona_sentence ? (
                    <p className="text-sm text-muted-foreground">{onboardingData.backstory_persona_sentence}</p>
                  ) : (
                    <p 
                      onClick={() => onNavigateToOnboarding?.(3)}
                      className="text-sm text-muted-foreground/70 italic cursor-pointer hover:text-primary transition-colors"
                    >
                      Add your persona description
                    </p>
                  )}
                </div>
              ) : (
                <div 
                  onClick={() => onNavigateToOnboarding?.(3)}
                  className="bg-primary/5 p-4 rounded-lg border-2 border-dashed border-primary/30 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all text-center"
                >
                  <p className="text-sm italic text-muted-foreground">Add your Amsterdam alter ego</p>
                </div>
              )}

              {/* RLD Atmosphere */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">RLD Atmosphere</p>
                {onboardingData.backstory_rld_atmosphere && onboardingData.backstory_rld_atmosphere.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.backstory_rld_atmosphere.map((attr: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{attr}</Badge>
                    ))}
                  </div>
                ) : (
                  <div 
                    onClick={() => onNavigateToOnboarding?.(3)}
                    className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all text-center"
                  >
                    <p className="text-sm italic text-muted-foreground/70">Add RLD atmosphere traits</p>
                  </div>
                )}
              </div>

              {/* Style & Aesthetic */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-primary">Style & Aesthetic</h4>
                
                {/* Colors */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Colors</p>
                  {onboardingData.backstory_colors && onboardingData.backstory_colors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {onboardingData.backstory_colors.map((color: string, idx: number) => (
                        <Badge key={idx} variant="outline">{color}</Badge>
                      ))}
                    </div>
                  ) : (
                    <div 
                      onClick={() => onNavigateToOnboarding?.(3)}
                      className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all text-center"
                    >
                      <p className="text-sm italic text-muted-foreground/70">Add your colors</p>
                    </div>
                  )}
                </div>

                {/* Lighting & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {onboardingData.backstory_lighting ? (
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span className="text-sm">{onboardingData.backstory_lighting}</span>
                    </div>
                  ) : (
                    <div 
                      onClick={() => onNavigateToOnboarding?.(3)}
                      className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm italic text-muted-foreground/70">Add lighting preference</p>
                    </div>
                  )}

                  {onboardingData.backstory_time_of_night ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">{onboardingData.backstory_time_of_night}</span>
                    </div>
                  ) : (
                    <div 
                      onClick={() => onNavigateToOnboarding?.(3)}
                      className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm italic text-muted-foreground/70">Add time preference</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Character Secret */}
              {onboardingData.backstory_character_secret ? (
                <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 space-y-1">
                  <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold">My Secret</p>
                  <p className="text-sm italic">{onboardingData.backstory_character_secret}</p>
                </div>
              ) : (
                <div 
                  onClick={() => onNavigateToOnboarding?.(3)}
                  className="bg-amber-500/5 p-4 rounded-lg border-2 border-dashed border-amber-500/30 cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/50 transition-all text-center"
                >
                  <p className="text-sm italic text-muted-foreground">Add your character secret</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Boundaries & Comfort Levels */}
        <AccordionItem value="boundaries" className="border rounded-lg px-4" disabled={isSectionLocked(4)}>
          <AccordionTrigger 
            className={cn(
              "hover:no-underline",
              isSectionLocked(4) && "cursor-not-allowed opacity-60"
            )}
            onClick={(e) => {
              if (isSectionLocked(4)) {
                e.preventDefault();
                toast.info("Complete your meeting to unlock this section", {
                  description: "Book and complete your introduction meeting to access all profile sections",
                  action: {
                    label: "View Meetings",
                    onClick: () => window.location.hash = "#meetings"
                  }
                });
              }
            }}
          >
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold">Boundaries & Comfort Levels</span>
              </div>
              {isSectionLocked(4) && (
                <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            {/* Comfortable With */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Comfortable With</p>
              {onboardingData.boundaries_comfortable_with && onboardingData.boundaries_comfortable_with.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {onboardingData.boundaries_comfortable_with.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div 
                  onClick={() => onNavigateToOnboarding?.(4)}
                  className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all text-center"
                >
                  <p className="text-sm italic text-muted-foreground/70">Add what you're comfortable with</p>
                </div>
              )}
            </div>
            
            {/* Hard Limits */}
            {onboardingData.boundaries_hard_limits ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hard Limits</p>
                <p className="whitespace-pre-wrap">{onboardingData.boundaries_hard_limits}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(4)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Hard Limits</p>
                <p className="text-sm italic text-muted-foreground/70">Add your hard limits</p>
              </div>
            )}
            
            {/* Soft Limits */}
            {onboardingData.boundaries_soft_limits ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Soft Limits</p>
                <p className="whitespace-pre-wrap">{onboardingData.boundaries_soft_limits}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(4)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Soft Limits</p>
                <p className="text-sm italic text-muted-foreground/70">Add your soft limits</p>
              </div>
            )}
            
            {/* Additional Notes */}
            {onboardingData.boundaries_additional_notes ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                <p className="whitespace-pre-wrap">{onboardingData.boundaries_additional_notes}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(4)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                <p className="text-sm italic text-muted-foreground/70">Add additional notes about your boundaries</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Pricing Structure */}
        <AccordionItem value="pricing" className="border rounded-lg px-4" disabled={isSectionLocked(5)}>
          <AccordionTrigger 
            className={cn(
              "hover:no-underline",
              isSectionLocked(5) && "cursor-not-allowed opacity-60"
            )}
            onClick={(e) => {
              if (isSectionLocked(5)) {
                e.preventDefault();
                toast.info("Complete your meeting to unlock this section", {
                  description: "Book and complete your introduction meeting to access all profile sections",
                  action: {
                    label: "View Meetings",
                    onClick: () => window.location.hash = "#meetings"
                  }
                });
              }
            }}
          >
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold">Pricing Structure</span>
              </div>
              {isSectionLocked(5) && (
                <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscription</p>
                <p>{formatValue(onboardingData.pricing_subscription ? `$${onboardingData.pricing_subscription}` : null)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PPV Photo Set</p>
                <p>{formatValue(onboardingData.pricing_ppv_photo ? `$${onboardingData.pricing_ppv_photo}` : null)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PPV Video</p>
                <p>{formatValue(onboardingData.pricing_ppv_video ? `$${onboardingData.pricing_ppv_video}` : null)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Custom Content</p>
                <p>{formatValue(onboardingData.pricing_custom_content ? `$${onboardingData.pricing_custom_content}` : null)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chat Rate</p>
                <p>{formatValue(onboardingData.pricing_chat ? `$${onboardingData.pricing_chat}` : null)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sexting Rate</p>
                <p>{formatValue(onboardingData.pricing_sexting ? `$${onboardingData.pricing_sexting}` : null)}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Persona & Character */}
        <AccordionItem value="persona" className="border rounded-lg px-4" disabled={isSectionLocked(6)}>
          <AccordionTrigger 
            className={cn(
              "hover:no-underline",
              isSectionLocked(6) && "cursor-not-allowed opacity-60"
            )}
            onClick={(e) => {
              if (isSectionLocked(6)) {
                e.preventDefault();
                toast.info("Complete your meeting to unlock this section", {
                  description: "Book and complete your introduction meeting to access all profile sections",
                  action: {
                    label: "View Meetings",
                    onClick: () => window.location.hash = "#meetings"
                  }
                });
              }
            }}
          >
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <Theater className="h-5 w-5 text-primary" />
                <span className="font-semibold">Persona & Character</span>
              </div>
              {isSectionLocked(6) && (
                <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            {/* Stage Name */}
            {onboardingData.persona_stage_name ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stage Name</p>
                <p className="text-lg font-semibold text-primary">{onboardingData.persona_stage_name}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(6)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Stage Name</p>
                <p className="text-sm italic text-muted-foreground/70">Add your stage name</p>
              </div>
            )}
            
            {/* Description */}
            {onboardingData.persona_description ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="whitespace-pre-wrap">{onboardingData.persona_description}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(6)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm italic text-muted-foreground/70">Add your persona description</p>
              </div>
            )}
            
            {/* Backstory */}
            {onboardingData.persona_backstory ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Backstory</p>
                <p className="whitespace-pre-wrap">{onboardingData.persona_backstory}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(6)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Backstory</p>
                <p className="text-sm italic text-muted-foreground/70">Add your backstory</p>
              </div>
            )}
            
            {/* Personality Traits */}
            {onboardingData.persona_personality ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Personality Traits</p>
                <p className="whitespace-pre-wrap">{onboardingData.persona_personality}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(6)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Personality Traits</p>
                <p className="text-sm italic text-muted-foreground/70">Add your personality traits</p>
              </div>
            )}
            
            {/* Interests */}
            {onboardingData.persona_interests ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interests</p>
                <p className="whitespace-pre-wrap">{onboardingData.persona_interests}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(6)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Interests</p>
                <p className="text-sm italic text-muted-foreground/70">Add your interests</p>
              </div>
            )}
            
            {/* Fantasy/Niche */}
            {onboardingData.persona_fantasy ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fantasy/Niche</p>
                <p className="whitespace-pre-wrap">{onboardingData.persona_fantasy}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(6)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Fantasy/Niche</p>
                <p className="text-sm italic text-muted-foreground/70">Add your fantasy/niche</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Scripts & Messaging */}
        <AccordionItem value="scripts" className="border rounded-lg px-4" disabled={isSectionLocked(7)}>
          <AccordionTrigger 
            className={cn(
              "hover:no-underline",
              isSectionLocked(7) && "cursor-not-allowed opacity-60"
            )}
            onClick={(e) => {
              if (isSectionLocked(7)) {
                e.preventDefault();
                toast.info("Complete your meeting to unlock this section", {
                  description: "Book and complete your introduction meeting to access all profile sections",
                  action: {
                    label: "View Meetings",
                    onClick: () => window.location.hash = "#meetings"
                  }
                });
              }
            }}
          >
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="font-semibold">Scripts & Messaging</span>
              </div>
              {isSectionLocked(7) && (
                <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            {/* Greeting Message */}
            {onboardingData.scripts_greeting ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Greeting Message</p>
                <p className="whitespace-pre-wrap">{onboardingData.scripts_greeting}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(7)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Greeting Message</p>
                <p className="text-sm italic text-muted-foreground/70">Add your greeting message</p>
              </div>
            )}
            
            {/* Sexting Style */}
            {onboardingData.scripts_sexting ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sexting Style</p>
                <p className="whitespace-pre-wrap">{onboardingData.scripts_sexting}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(7)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Sexting Style</p>
                <p className="text-sm italic text-muted-foreground/70">Add your sexting style</p>
              </div>
            )}
            
            {/* PPV Promotion */}
            {onboardingData.scripts_ppv ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">PPV Promotion</p>
                <p className="whitespace-pre-wrap">{onboardingData.scripts_ppv}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(7)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">PPV Promotion</p>
                <p className="text-sm italic text-muted-foreground/70">Add your PPV promotion script</p>
              </div>
            )}
            
            {/* Renewal Message */}
            {onboardingData.scripts_renewal ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Renewal Message</p>
                <p className="whitespace-pre-wrap">{onboardingData.scripts_renewal}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(7)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Renewal Message</p>
                <p className="text-sm italic text-muted-foreground/70">Add your renewal message</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Content Production */}
        <AccordionItem value="content" className="border rounded-lg px-4" disabled={isSectionLocked(8)}>
          <AccordionTrigger 
            className={cn(
              "hover:no-underline",
              isSectionLocked(8) && "cursor-not-allowed opacity-60"
            )}
            onClick={(e) => {
              if (isSectionLocked(8)) {
                e.preventDefault();
                toast.info("Complete your meeting to unlock this section", {
                  description: "Book and complete your introduction meeting to access all profile sections",
                  action: {
                    label: "View Meetings",
                    onClick: () => window.location.hash = "#meetings"
                  }
                });
              }
            }}
          >
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <span className="font-semibold">Content Production</span>
              </div>
              {isSectionLocked(8) && (
                <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Count */}
              {onboardingData.content_photo_count ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Initial Photos Needed</p>
                  <p className="text-lg font-semibold">{onboardingData.content_photo_count}</p>
                </div>
              ) : (
                <div 
                  onClick={() => onNavigateToOnboarding?.(8)}
                  className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
                >
                  <p className="text-sm font-medium text-muted-foreground">Initial Photos Needed</p>
                  <p className="text-sm italic text-muted-foreground/70">Add photo count</p>
                </div>
              )}
              
              {/* Video Count */}
              {onboardingData.content_video_count ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Initial Videos Needed</p>
                  <p className="text-lg font-semibold">{onboardingData.content_video_count}</p>
                </div>
              ) : (
                <div 
                  onClick={() => onNavigateToOnboarding?.(8)}
                  className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
                >
                  <p className="text-sm font-medium text-muted-foreground">Initial Videos Needed</p>
                  <p className="text-sm italic text-muted-foreground/70">Add video count</p>
                </div>
              )}
            </div>
            
            {/* Content Themes */}
            {onboardingData.content_themes ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Content Themes</p>
                <p className="whitespace-pre-wrap">{onboardingData.content_themes}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(8)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Content Themes</p>
                <p className="text-sm italic text-muted-foreground/70">Add your content themes</p>
              </div>
            )}
            
            {/* Shooting Preferences */}
            {onboardingData.content_shooting_preferences ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shooting Preferences</p>
                <p className="whitespace-pre-wrap">{onboardingData.content_shooting_preferences}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(8)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Shooting Preferences</p>
                <p className="text-sm italic text-muted-foreground/70">Add your shooting preferences</p>
              </div>
            )}
            
            {/* Equipment Needs */}
            {onboardingData.content_equipment_needs ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Equipment Needs</p>
                <p className="whitespace-pre-wrap">{onboardingData.content_equipment_needs}</p>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateToOnboarding?.(8)}
                className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              >
                <p className="text-sm font-medium text-muted-foreground">Equipment Needs</p>
                <p className="text-sm italic text-muted-foreground/70">Add your equipment needs</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Section 9: Visual Identity */}
        <AccordionItem value="visual-identity" className="border rounded-lg px-4" disabled={isSectionLocked(9)}>
          <AccordionTrigger className={cn("hover:no-underline", isSectionLocked(9) && "cursor-not-allowed opacity-60")}>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span className="font-semibold">Visual Identity</span>
              {isSectionLocked(9) && <Lock className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Brand colors, aesthetic, and visual style preferences</p>
            <div className="text-sm">
              {onboardingData.section_visual_identity && Object.keys(onboardingData.section_visual_identity).length > 0 ? (
                <div className="space-y-2">
                  {onboardingData.section_visual_identity.primary_color && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: onboardingData.section_visual_identity.primary_color }} />
                      <span>Primary: {onboardingData.section_visual_identity.primary_color}</span>
                    </div>
                  )}
                  {onboardingData.section_visual_identity.aesthetic && <p>Aesthetic: {onboardingData.section_visual_identity.aesthetic}</p>}
                </div>
              ) : (
                <div onClick={() => onNavigateToOnboarding?.(9)} className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                  <p className="italic text-muted-foreground/70">Add visual identity details</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 10: Creator Story */}
        <AccordionItem value="creator-story" className="border rounded-lg px-4" disabled={isSectionLocked(10)}>
          <AccordionTrigger className={cn("hover:no-underline", isSectionLocked(10) && "cursor-not-allowed opacity-60")}>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="font-semibold">Creator Story</span>
              {isSectionLocked(10) && <Lock className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Your journey, milestones, and future goals</p>
            <div className="text-sm">
              {onboardingData.section_creator_story && Object.keys(onboardingData.section_creator_story).length > 0 ? (
                <div className="space-y-2">
                  {onboardingData.section_creator_story.origin && <p className="whitespace-pre-wrap">{onboardingData.section_creator_story.origin}</p>}
                  {onboardingData.section_creator_story.future_goals && <p><strong>Future Goals:</strong> {onboardingData.section_creator_story.future_goals}</p>}
                </div>
              ) : (
                <div onClick={() => onNavigateToOnboarding?.(10)} className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                  <p className="italic text-muted-foreground/70">Share your creator story</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 11: Brand Alignment */}
        <AccordionItem value="brand-alignment" className="border rounded-lg px-4" disabled={isSectionLocked(11)}>
          <AccordionTrigger className={cn("hover:no-underline", isSectionLocked(11) && "cursor-not-allowed opacity-60")}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Brand Alignment</span>
              {isSectionLocked(11) && <Lock className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Brand voice, target audience, and positioning</p>
            <div className="text-sm">
              {onboardingData.section_brand_alignment && Object.keys(onboardingData.section_brand_alignment).length > 0 ? (
                <div className="space-y-2">
                  {onboardingData.section_brand_alignment.brand_voice && <p><strong>Brand Voice:</strong> {onboardingData.section_brand_alignment.brand_voice}</p>}
                  {onboardingData.section_brand_alignment.positioning_statement && <p className="whitespace-pre-wrap">{onboardingData.section_brand_alignment.positioning_statement}</p>}
                </div>
              ) : (
                <div onClick={() => onNavigateToOnboarding?.(11)} className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                  <p className="italic text-muted-foreground/70">Define brand alignment</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 12: Fetish/Special Interests */}
        <AccordionItem value="fetish-interests" className="border rounded-lg px-4" disabled={isSectionLocked(12)}>
          <AccordionTrigger className={cn("hover:no-underline", isSectionLocked(12) && "cursor-not-allowed opacity-60")}>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <span className="font-semibold">Special Interests</span>
              {isSectionLocked(12) && <Lock className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Content categories (staff-use filtering)</p>
            <div className="text-sm">
              {onboardingData.section_fetish_interests && Object.keys(onboardingData.section_fetish_interests).length > 0 ? (
                <div className="space-y-2">
                  {onboardingData.section_fetish_interests.categories && formatArray(onboardingData.section_fetish_interests.categories)}
                </div>
              ) : (
                <div onClick={() => onNavigateToOnboarding?.(12)} className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                  <p className="italic text-muted-foreground/70">Add special interests</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 13: Engagement Style */}
        <AccordionItem value="engagement-style" className="border rounded-lg px-4" disabled={isSectionLocked(13)}>
          <AccordionTrigger className={cn("hover:no-underline", isSectionLocked(13) && "cursor-not-allowed opacity-60")}>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-semibold">Engagement Style</span>
              {isSectionLocked(13) && <Lock className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Communication and fan interaction preferences</p>
            <div className="text-sm">
              {onboardingData.section_engagement_style && Object.keys(onboardingData.section_engagement_style).length > 0 ? (
                <div className="space-y-2">
                  {onboardingData.section_engagement_style.communication_style && <p><strong>Style:</strong> {onboardingData.section_engagement_style.communication_style}</p>}
                  {onboardingData.section_engagement_style.response_time && <p><strong>Response Time:</strong> {onboardingData.section_engagement_style.response_time}</p>}
                </div>
              ) : (
                <div onClick={() => onNavigateToOnboarding?.(13)} className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                  <p className="italic text-muted-foreground/70">Define engagement style</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 14: Market Positioning */}
        <AccordionItem value="market-positioning" className="border rounded-lg px-4" disabled={isSectionLocked(14)}>
          <AccordionTrigger className={cn("hover:no-underline", isSectionLocked(14) && "cursor-not-allowed opacity-60")}>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span className="font-semibold">Market Positioning</span>
              {isSectionLocked(14) && <Lock className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Niche, competitors, and market strategy</p>
            <div className="text-sm">
              {onboardingData.section_market_positioning && Object.keys(onboardingData.section_market_positioning).length > 0 ? (
                <div className="space-y-2">
                  {onboardingData.section_market_positioning.niche && <p><strong>Niche:</strong> {onboardingData.section_market_positioning.niche}</p>}
                  {onboardingData.section_market_positioning.price_tier && <p><strong>Price Tier:</strong> {onboardingData.section_market_positioning.price_tier}</p>}
                </div>
              ) : (
                <div onClick={() => onNavigateToOnboarding?.(14)} className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                  <p className="italic text-muted-foreground/70">Define market positioning</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 15: Fan Expectations */}
        <AccordionItem value="fan-expectations" className="border rounded-lg px-4" disabled={isSectionLocked(15)}>
          <AccordionTrigger className={cn("hover:no-underline", isSectionLocked(15) && "cursor-not-allowed opacity-60")}>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="font-semibold">Fan Expectations</span>
              {isSectionLocked(15) && <Lock className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Content frequency and interaction commitments</p>
            <div className="text-sm">
              {onboardingData.section_fan_expectations && Object.keys(onboardingData.section_fan_expectations).length > 0 ? (
                <div className="space-y-2">
                  {onboardingData.section_fan_expectations.content_frequency && <p><strong>Frequency:</strong> {onboardingData.section_fan_expectations.content_frequency}</p>}
                  {onboardingData.section_fan_expectations.value_proposition && <p className="whitespace-pre-wrap">{onboardingData.section_fan_expectations.value_proposition}</p>}
                </div>
              ) : (
                <div onClick={() => onNavigateToOnboarding?.(15)} className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                  <p className="italic text-muted-foreground/70">Define fan expectations</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 16: Creative Boundaries */}
        <AccordionItem value="creative-boundaries" className="border rounded-lg px-4" disabled={isSectionLocked(16)}>
          <AccordionTrigger className={cn("hover:no-underline", isSectionLocked(16) && "cursor-not-allowed opacity-60")}>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <span className="font-semibold">Creative Boundaries</span>
              {isSectionLocked(16) && <Lock className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Content limits and collaboration rules</p>
            <div className="text-sm">
              {onboardingData.section_creative_boundaries && Object.keys(onboardingData.section_creative_boundaries).length > 0 ? (
                <div className="space-y-2">
                  {onboardingData.section_creative_boundaries.content_limits && formatArray(onboardingData.section_creative_boundaries.content_limits)}
                  {onboardingData.section_creative_boundaries.creative_control && <p className="whitespace-pre-wrap">{onboardingData.section_creative_boundaries.creative_control}</p>}
                </div>
              ) : (
                <div onClick={() => onNavigateToOnboarding?.(16)} className="cursor-pointer hover:bg-muted/50 p-3 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all">
                  <p className="italic text-muted-foreground/70">Define creative boundaries</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
