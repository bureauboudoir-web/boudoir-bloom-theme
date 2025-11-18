import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { OnboardingData } from "@/hooks/useOnboarding";
import { User, Heart, Shield, DollarSign, Theater, MessageSquare, Camera, MapPin, Mail, Phone, Calendar, Briefcase } from "lucide-react";

interface CreatorProfileProps {
  onboardingData: OnboardingData | null;
  userId: string;
  userName?: string;
  profilePictureUrl?: string | null;
}

export const CreatorProfile = ({
  onboardingData,
  userId,
  userName,
  profilePictureUrl,
}: CreatorProfileProps) => {
  const isCompleted = onboardingData?.is_completed || false;
  const completedSteps = onboardingData?.completed_steps?.length || 0;
  const totalSteps = 8;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">Not provided</span>;
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
    return age;
  };

  const age = calculateAge(onboardingData?.personal_date_of_birth);

  if (!onboardingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Creator Profile</CardTitle>
          <CardDescription>Complete your onboarding to view your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please complete the onboarding process to create your creator profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background h-32"></div>
        <CardContent className="pt-0 -mt-16">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Profile Picture */}
            <div className="relative">
              <ProfilePictureUpload
                userId={userId}
                currentPictureUrl={profilePictureUrl}
                userName={userName || onboardingData.personal_full_name || "User"}
              />
              {isCompleted && (
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white border-2 border-background">
                  ✓ Verified
                </Badge>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left space-y-4 mt-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2 justify-center md:justify-start">
                  {formatValue(onboardingData.personal_full_name)}
                  {age && (
                    <span className="text-xl text-muted-foreground font-normal">({age})</span>
                  )}
                </h1>
                {onboardingData.persona_stage_name && (
                  <p className="text-xl text-primary font-medium mt-1">
                    "{onboardingData.persona_stage_name}"
                  </p>
                )}
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {onboardingData.personal_location && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium truncate">{onboardingData.personal_location}</p>
                    </div>
                  </div>
                )}
                
                {onboardingData.personal_email && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium truncate">{onboardingData.personal_email}</p>
                    </div>
                  </div>
                )}
                
                {onboardingData.personal_phone_number && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium truncate">{onboardingData.personal_phone_number}</p>
                    </div>
                  </div>
                )}
                
                {onboardingData.pricing_subscription && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Subscription</p>
                      <p className="text-sm font-medium">${onboardingData.pricing_subscription}/mo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {isCompleted ? (
                  <Badge className="bg-green-500">✓ Onboarding Complete</Badge>
                ) : (
                  <Badge variant="secondary">{completionPercentage}% Complete</Badge>
                )}
                {onboardingData.body_type && (
                  <Badge variant="outline">{onboardingData.body_type}</Badge>
                )}
                {onboardingData.personal_nationality && (
                  <Badge variant="outline">{onboardingData.personal_nationality}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections */}
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

        {/* Boundaries & Comfort Levels */}
        <AccordionItem value="boundaries" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Boundaries & Comfort Levels</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Comfortable With</p>
              {formatArray(onboardingData.boundaries_comfortable_with)}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hard Limits</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.boundaries_hard_limits)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Soft Limits</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.boundaries_soft_limits)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.boundaries_additional_notes)}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pricing Structure */}
        <AccordionItem value="pricing" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-semibold">Pricing Structure</span>
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
        <AccordionItem value="persona" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Theater className="h-5 w-5 text-primary" />
              <span className="font-semibold">Persona & Character</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Stage Name</p>
              <p>{formatValue(onboardingData.persona_stage_name)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.persona_description)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Backstory</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.persona_backstory)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Personality Traits</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.persona_personality)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Interests</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.persona_interests)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fantasy/Niche</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.persona_fantasy)}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Scripts & Messaging */}
        <AccordionItem value="scripts" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-semibold">Scripts & Messaging</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Greeting Message</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.scripts_greeting)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sexting Style</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.scripts_sexting)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">PPV Promotion</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.scripts_ppv)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Renewal Message</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.scripts_renewal)}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Content Production */}
        <AccordionItem value="content" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span className="font-semibold">Content Production</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Initial Photos Needed</p>
                <p>{formatValue(onboardingData.content_photo_count)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Initial Videos Needed</p>
                <p>{formatValue(onboardingData.content_video_count)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Content Themes</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.content_themes)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Shooting Preferences</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.content_shooting_preferences)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Equipment Needs</p>
              <p className="whitespace-pre-wrap">{formatValue(onboardingData.content_equipment_needs)}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
