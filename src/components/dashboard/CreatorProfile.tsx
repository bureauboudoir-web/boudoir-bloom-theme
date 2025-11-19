import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { OnboardingData } from "@/hooks/useOnboarding";
import { User, Heart, Shield, DollarSign, Theater, MessageSquare, Camera, MapPin, Mail, Phone, Calendar, Briefcase, Instagram, Twitter, Video, Youtube, Link as LinkIcon, Send, CheckCircle2, Lightbulb, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CreatorProfileProps {
  onboardingData: OnboardingData | null;
  userId: string;
  userName?: string;
  profilePictureUrl?: string | null;
  onNavigateToOnboarding?: (step: number) => void;
}

export const CreatorProfile = ({
  onboardingData,
  userId,
  userName,
  profilePictureUrl,
  onNavigateToOnboarding,
}: CreatorProfileProps) => {
  const isCompleted = onboardingData?.is_completed || false;
  const completedSteps = onboardingData?.completed_steps?.length || 0;
  const totalSteps = 9;
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
            {/* Profile Picture & Progress */}
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              <ProfilePictureUpload
                userId={userId}
                currentPictureUrl={profilePictureUrl}
                userName={userName || onboardingData.personal_full_name || "User"}
              />
              
              {/* Onboarding Progress */}
              <div className="w-full max-w-[150px] flex flex-col items-center gap-2">
                {completionPercentage === 100 ? (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700 w-full justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Profile Complete
                  </Badge>
                ) : (
                  <>
                    <Progress value={completionPercentage} className="h-2" />
                    <span className="text-xs text-muted-foreground">
                      Profile {completionPercentage}% Complete
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left space-y-3 mt-4">
              {/* Name and Age */}
              <div>
                {!onboardingData.personal_full_name || onboardingData.personal_full_name.trim().length < 2 ? (
                  <div 
                    onClick={() => onNavigateToOnboarding?.(1)}
                    className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors justify-center md:justify-start"
                  >
                    <User className="h-5 w-5" />
                    <span className="italic text-2xl">Add your name</span>
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                    {onboardingData.personal_full_name}
                    {age && (
                      <span className="text-xl text-muted-foreground font-normal">({age})</span>
                    )}
                  </h1>
                )}
                {onboardingData.persona_stage_name && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    "{onboardingData.persona_stage_name}"
                  </p>
                )}
              </div>

              {/* Location */}
              {onboardingData.personal_location && onboardingData.personal_location.length > 1 ? (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-center md:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>{onboardingData.personal_location}</span>
                </div>
              ) : (
                <div 
                  onClick={() => onNavigateToOnboarding?.(1)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground justify-center md:justify-start cursor-pointer hover:text-foreground transition-colors"
                >
                  <MapPin className="h-4 w-4 opacity-50" />
                  <span className="italic">Add location</span>
                </div>
              )}

              {/* OnlyFans Link - Prominent */}
              <div>
                {onboardingData.fan_platform_onlyfans ? (
                  <a 
                    href={onboardingData.fan_platform_onlyfans} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                      <LinkIcon className="h-4 w-4" />
                      OnlyFans Profile
                    </Button>
                  </a>
                ) : (
                  <Button 
                    onClick={() => onNavigateToOnboarding?.(7)}
                    variant="outline" 
                    className="gap-2 text-muted-foreground border-dashed hover:text-foreground hover:border-solid transition-all"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Add OnlyFans Link
                  </Button>
                )}
              </div>

              {/* Social Links - Icon Only */}
              <TooltipProvider>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {onboardingData.social_instagram ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={onboardingData.social_instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>Instagram</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          onClick={() => onNavigateToOnboarding?.(7)}
                          className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:text-muted-foreground/50 transition-all"
                        >
                          <Instagram className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Add Instagram</TooltipContent>
                    </Tooltip>
                  )}
                  {onboardingData.social_twitter ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={onboardingData.social_twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>Twitter</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          onClick={() => onNavigateToOnboarding?.(7)}
                          className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:text-muted-foreground/50 transition-all"
                        >
                          <Twitter className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Add Twitter</TooltipContent>
                    </Tooltip>
                  )}
                  {onboardingData.social_tiktok ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={onboardingData.social_tiktok} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                        >
                          <Video className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>TikTok</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          onClick={() => onNavigateToOnboarding?.(7)}
                          className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:text-muted-foreground/50 transition-all"
                        >
                          <Video className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Add TikTok</TooltipContent>
                    </Tooltip>
                  )}
                  {onboardingData.social_youtube ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={onboardingData.social_youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                        >
                          <Youtube className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>YouTube</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          onClick={() => onNavigateToOnboarding?.(7)}
                          className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:text-muted-foreground/50 transition-all"
                        >
                          <Youtube className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Add YouTube</TooltipContent>
                    </Tooltip>
                  )}
                  {onboardingData.social_telegram ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={onboardingData.social_telegram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                        >
                          <Send className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>Telegram</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          onClick={() => onNavigateToOnboarding?.(7)}
                          className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:text-muted-foreground/50 transition-all"
                        >
                          <Send className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Add Telegram</TooltipContent>
                    </Tooltip>
                  )}
                  {onboardingData.fan_platform_fansly ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={onboardingData.fan_platform_fansly} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-9 w-9 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>Fansly</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          onClick={() => onNavigateToOnboarding?.(7)}
                          className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:text-muted-foreground/50 transition-all"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Add Fansly</TooltipContent>
                    </Tooltip>
                  )}
                  {onboardingData.fan_platform_other && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={onboardingData.fan_platform_other} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>Other Platform</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
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
        <AccordionItem value="backstory" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-semibold">My Amsterdam Story</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {/* Check if any backstory data exists */}
            {(!onboardingData.backstory_neighborhood && 
              !onboardingData.backstory_what_you_love && 
              !onboardingData.backstory_alter_ego &&
              !onboardingData.backstory_rld_atmosphere?.length &&
              !onboardingData.backstory_lighting &&
              !onboardingData.backstory_time_of_night &&
              !onboardingData.backstory_character_secret) ? (
              <div className="text-center py-6">
                <Button 
                  onClick={() => onNavigateToOnboarding?.(3)}
                  variant="outline" 
                  className="gap-2 text-muted-foreground border-dashed hover:border-solid hover:text-foreground transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  Add Your Amsterdam Story
                </Button>
              </div>
            ) : (
              <>
                {/* Connection to Amsterdam */}
                {(onboardingData.backstory_neighborhood || onboardingData.backstory_what_you_love) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-primary">Connection to Amsterdam</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {onboardingData.backstory_years_in_amsterdam && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Years in Amsterdam</p>
                          <p className="text-sm">{onboardingData.backstory_years_in_amsterdam}</p>
                        </div>
                      )}
                      {onboardingData.backstory_neighborhood && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Neighborhood</p>
                          <p className="text-sm">{onboardingData.backstory_neighborhood}</p>
                        </div>
                      )}
                    </div>
                    {onboardingData.backstory_what_you_love && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">What I Love About Amsterdam</p>
                        <p className="text-sm whitespace-pre-wrap">{onboardingData.backstory_what_you_love}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Amsterdam Character */}
                {onboardingData.backstory_alter_ego && (
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 space-y-2">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide">Amsterdam Alter Ego</p>
                    <p className="italic font-medium">{onboardingData.backstory_alter_ego}</p>
                    {onboardingData.backstory_persona_sentence && (
                      <p className="text-sm text-muted-foreground">{onboardingData.backstory_persona_sentence}</p>
                    )}
                  </div>
                )}

                {/* RLD Atmosphere */}
                {onboardingData.backstory_rld_atmosphere && onboardingData.backstory_rld_atmosphere.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">RLD Atmosphere</p>
                    <div className="flex flex-wrap gap-2">
                      {onboardingData.backstory_rld_atmosphere.map((attr: string, idx: number) => (
                        <Badge key={idx} variant="secondary">{attr}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Style & Aesthetic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {onboardingData.backstory_colors && onboardingData.backstory_colors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Colors</p>
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.backstory_colors.map((color: string, idx: number) => (
                          <Badge key={idx} variant="outline">{color}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {(onboardingData.backstory_lighting || onboardingData.backstory_time_of_night) && (
                    <div className="space-y-2">
                      {onboardingData.backstory_lighting && (
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <span className="text-sm">{onboardingData.backstory_lighting}</span>
                        </div>
                      )}
                      {onboardingData.backstory_time_of_night && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm">{onboardingData.backstory_time_of_night}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Character Secret */}
                {onboardingData.backstory_character_secret && (
                  <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 space-y-1">
                    <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold">My Secret</p>
                    <p className="text-sm italic">{onboardingData.backstory_character_secret}</p>
                  </div>
                )}
              </>
            )}
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
