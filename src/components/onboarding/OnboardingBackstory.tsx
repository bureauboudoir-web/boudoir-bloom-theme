import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Heart, User, Sparkles, Palette, Calendar } from "lucide-react";
import { toast } from "sonner";
import { OnboardingData } from "@/hooks/useOnboarding";
import { useAutoSave } from "@/hooks/useAutoSave";

interface OnboardingBackstoryProps {
  onNext: () => void;
  onBack: () => void;
  onboardingData: OnboardingData | null;
  onComplete: (step: number, data: Record<string, any>) => Promise<{ error: any }>;
}

const RLD_ATMOSPHERE_OPTIONS = [
  "mysterious",
  "artistic",
  "bold",
  "romantic",
  "rebellious",
  "confident",
  "playful",
  "elegant"
];

const LIGHTING_OPTIONS = [
  "red glow",
  "candlelight",
  "soft neon",
  "golden hour",
  "moonlight",
  "warm amber"
];

const TIME_OPTIONS = [
  "dusk",
  "evening",
  "midnight",
  "2am quiet streets",
  "early morning"
];

const COLOR_OPTIONS = [
  "red",
  "gold",
  "black",
  "purple",
  "blue",
  "amber",
  "rose",
  "emerald"
];

const OnboardingBackstory = ({
  onNext,
  onBack,
  onboardingData,
  onComplete
}: OnboardingBackstoryProps) => {
  // Connection to Amsterdam
  const [yearsInAmsterdam, setYearsInAmsterdam] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [yearsWorkingCentrum, setYearsWorkingCentrum] = useState("");
  const [whatBroughtYou, setWhatBroughtYou] = useState("");
  const [whatYouLove, setWhatYouLove] = useState("");

  // Red Light District Influence
  const [rldFascination, setRldFascination] = useState("");
  const [rldFeeling, setRldFeeling] = useState("");
  const [rldAtmosphere, setRldAtmosphere] = useState<string[]>([]);

  // Personal Journey
  const [careerStory, setCareerStory] = useState("");
  const [pastShapedYou, setPastShapedYou] = useState("");
  const [contentExpression, setContentExpression] = useState("");

  // Amsterdam Character
  const [alterEgo, setAlterEgo] = useState("");
  const [personaSentence, setPersonaSentence] = useState("");
  const [characterSecret, setCharacterSecret] = useState("");

  // Emotional Anchors
  const [momentChangedYou, setMomentChangedYou] = useState("");
  const [confidentSpot, setConfidentSpot] = useState("");
  const [vulnerableSpot, setVulnerableSpot] = useState("");

  // Style & Aesthetic
  const [colors, setColors] = useState<string[]>([]);
  const [lighting, setLighting] = useState("");
  const [timeOfNight, setTimeOfNight] = useState("");

  // Future Chapter
  const [amsterdamGoals, setAmsterdamGoals] = useState("");
  const [howChanged, setHowChanged] = useState("");
  const [becoming, setBecoming] = useState("");

  useEffect(() => {
    if (onboardingData) {
      setYearsInAmsterdam(onboardingData.backstory_years_in_amsterdam || "");
      setNeighborhood(onboardingData.backstory_neighborhood || "");
      setYearsWorkingCentrum(onboardingData.backstory_years_working_centrum || "");
      setWhatBroughtYou(onboardingData.backstory_what_brought_you || "");
      setWhatYouLove(onboardingData.backstory_what_you_love || "");
      
      setRldFascination(onboardingData.backstory_rld_fascination || "");
      setRldFeeling(onboardingData.backstory_rld_feeling || "");
      setRldAtmosphere(onboardingData.backstory_rld_atmosphere || []);
      
      setCareerStory(onboardingData.backstory_career_story || "");
      setPastShapedYou(onboardingData.backstory_past_shaped_you || "");
      setContentExpression(onboardingData.backstory_content_expression || "");
      
      setAlterEgo(onboardingData.backstory_alter_ego || "");
      setPersonaSentence(onboardingData.backstory_persona_sentence || "");
      setCharacterSecret(onboardingData.backstory_character_secret || "");
      
      setMomentChangedYou(onboardingData.backstory_moment_changed_you || "");
      setConfidentSpot(onboardingData.backstory_confident_spot || "");
      setVulnerableSpot(onboardingData.backstory_vulnerable_spot || "");
      
      setColors(onboardingData.backstory_colors || []);
      setLighting(onboardingData.backstory_lighting || "");
      setTimeOfNight(onboardingData.backstory_time_of_night || "");
      
      setAmsterdamGoals(onboardingData.backstory_amsterdam_goals || "");
      setHowChanged(onboardingData.backstory_how_changed || "");
      setBecoming(onboardingData.backstory_becoming || "");
    }
  }, [onboardingData]);

  // Auto-save data
  const backstoryData = useMemo(() => ({
    backstory_years_in_amsterdam: yearsInAmsterdam,
    backstory_neighborhood: neighborhood,
    backstory_years_working_centrum: yearsWorkingCentrum,
    backstory_what_brought_you: whatBroughtYou,
    backstory_what_you_love: whatYouLove,
    backstory_rld_fascination: rldFascination,
    backstory_rld_feeling: rldFeeling,
    backstory_rld_atmosphere: rldAtmosphere,
    backstory_career_story: careerStory,
    backstory_past_shaped_you: pastShapedYou,
    backstory_content_expression: contentExpression,
    backstory_alter_ego: alterEgo,
    backstory_persona_sentence: personaSentence,
    backstory_character_secret: characterSecret,
    backstory_moment_changed_you: momentChangedYou,
    backstory_confident_spot: confidentSpot,
    backstory_vulnerable_spot: vulnerableSpot,
    backstory_colors: colors,
    backstory_lighting: lighting,
    backstory_time_of_night: timeOfNight,
    backstory_amsterdam_goals: amsterdamGoals,
    backstory_how_changed: howChanged,
    backstory_becoming: becoming,
  }), [
    yearsInAmsterdam, neighborhood, yearsWorkingCentrum, whatBroughtYou, whatYouLove,
    rldFascination, rldFeeling, rldAtmosphere, careerStory, pastShapedYou,
    contentExpression, alterEgo, personaSentence, characterSecret, momentChangedYou,
    confidentSpot, vulnerableSpot, colors, lighting, timeOfNight,
    amsterdamGoals, howChanged, becoming
  ]);

  useAutoSave({
    data: backstoryData,
    onSave: async (data) => {
      await onComplete(6, data);
    },
    delay: 2000,
  });

  const toggleAtmosphere = (value: string) => {
    setRldAtmosphere(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleColor = (value: string) => {
    setColors(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stepData = {
      backstory_years_in_amsterdam: yearsInAmsterdam,
      backstory_neighborhood: neighborhood,
      backstory_years_working_centrum: yearsWorkingCentrum,
      backstory_what_brought_you: whatBroughtYou,
      backstory_what_you_love: whatYouLove,
      backstory_rld_fascination: rldFascination,
      backstory_rld_feeling: rldFeeling,
      backstory_rld_atmosphere: rldAtmosphere,
      backstory_career_story: careerStory,
      backstory_past_shaped_you: pastShapedYou,
      backstory_content_expression: contentExpression,
      backstory_alter_ego: alterEgo,
      backstory_persona_sentence: personaSentence,
      backstory_character_secret: characterSecret,
      backstory_moment_changed_you: momentChangedYou,
      backstory_confident_spot: confidentSpot,
      backstory_vulnerable_spot: vulnerableSpot,
      backstory_colors: colors,
      backstory_lighting: lighting,
      backstory_time_of_night: timeOfNight,
      backstory_amsterdam_goals: amsterdamGoals,
      backstory_how_changed: howChanged,
      backstory_becoming: becoming,
    };

    const result = await onComplete(6, stepData);
    if (result.error) {
      toast.error("Failed to save backstory data");
    } else {
      onNext();
    }
  };

  return (
    <Card className="p-8 bg-card border-primary/20">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold mb-2 flex items-center gap-2">
          <MapPin className="h-7 w-7 text-primary" />
          Your Amsterdam Story
        </h2>
        <p className="text-muted-foreground">
          Tell us about your connection to Amsterdam and the Red Light District. This helps shape your persona and content identity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Accordion type="multiple" className="w-full">
          {/* Section 1: Connection to Amsterdam */}
          <AccordionItem value="connection">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Your Connection to Amsterdam
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="years">How long have you lived in Amsterdam?</Label>
                <Input
                  id="years"
                  value={yearsInAmsterdam}
                  onChange={(e) => setYearsInAmsterdam(e.target.value)}
                  placeholder="e.g., 2 years, 6 months"
                  maxLength={50}
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Where in the city do you live or spend the most time?</Label>
                <Input
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g., De Wallen, Jordaan, De Pijp"
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="centrum">How long have you worked in Amsterdam Centrum?</Label>
                <Input
                  id="centrum"
                  value={yearsWorkingCentrum}
                  onChange={(e) => setYearsWorkingCentrum(e.target.value)}
                  placeholder="e.g., 1 year, just started, N/A"
                  maxLength={50}
                />
              </div>

              <div>
                <Label htmlFor="brought">What originally brought you to Amsterdam?</Label>
                <Textarea
                  id="brought"
                  value={whatBroughtYou}
                  onChange={(e) => setWhatBroughtYou(e.target.value)}
                  placeholder="Study, freedom, adventure, change, work..."
                  maxLength={200}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="love">What do you love most about this city?</Label>
                <Textarea
                  id="love"
                  value={whatYouLove}
                  onChange={(e) => setWhatYouLove(e.target.value)}
                  placeholder="Canals, lights, culture, people, energy..."
                  maxLength={200}
                  rows={3}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Red Light District Influence */}
          <AccordionItem value="rld">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Red Light District Influence
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="fascination">What fascinates you about the Red Light District?</Label>
                <Textarea
                  id="fascination"
                  value={rldFascination}
                  onChange={(e) => setRldFascination(e.target.value)}
                  placeholder="The energy, confidence, history, lights, empowerment..."
                  maxLength={300}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="feeling">When you walk through the RLD, how does it make you feel?</Label>
                <Textarea
                  id="feeling"
                  value={rldFeeling}
                  onChange={(e) => setRldFeeling(e.target.value)}
                  placeholder="Excited, inspired, free, mysterious, powerful..."
                  maxLength={300}
                  rows={3}
                />
              </div>

              <div>
                <Label>Which part of the RLD atmosphere matches your personality?</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {RLD_ATMOSPHERE_OPTIONS.map((option) => (
                    <Badge
                      key={option}
                      variant={rldAtmosphere.includes(option) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => toggleAtmosphere(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 3: Personal Journey */}
          <AccordionItem value="journey">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Your Personal Journey
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="career">How did you get into your current career or creative path?</Label>
                <Textarea
                  id="career"
                  value={careerStory}
                  onChange={(e) => setCareerStory(e.target.value)}
                  placeholder="Tell the story in your own words..."
                  maxLength={500}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="past">What part of your past shaped the version of you we see today?</Label>
                <Textarea
                  id="past"
                  value={pastShapedYou}
                  onChange={(e) => setPastShapedYou(e.target.value)}
                  placeholder="Share what influenced you..."
                  maxLength={500}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="expression">What are you hoping to express through your content and persona?</Label>
                <Textarea
                  id="expression"
                  value={contentExpression}
                  onChange={(e) => setContentExpression(e.target.value)}
                  placeholder="Your creative vision..."
                  maxLength={500}
                  rows={4}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: Amsterdam Character */}
          <AccordionItem value="character">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Amsterdam Character
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="alterego">If you had to describe your "Amsterdam alter ego," who is she?</Label>
                <Input
                  id="alterego"
                  value={alterEgo}
                  onChange={(e) => setAlterEgo(e.target.value)}
                  placeholder="e.g., the artist, the dreamer, the mysterious girl behind the red glow"
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="sentence">Describe your Amsterdam persona in one sentence</Label>
                <Input
                  id="sentence"
                  value={personaSentence}
                  onChange={(e) => setPersonaSentence(e.target.value)}
                  placeholder="A captivating one-liner about your character..."
                  maxLength={150}
                />
              </div>

              <div>
                <Label htmlFor="secret">What secret does your Amsterdam character hold?</Label>
                <Textarea
                  id="secret"
                  value={characterSecret}
                  onChange={(e) => setCharacterSecret(e.target.value)}
                  placeholder="A hook for chat/storyline..."
                  maxLength={300}
                  rows={3}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 5: Emotional Anchors */}
          <AccordionItem value="emotional">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Emotional Anchors
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="moment">What's a moment in Amsterdam that changed you or opened you up?</Label>
                <Textarea
                  id="moment"
                  value={momentChangedYou}
                  onChange={(e) => setMomentChangedYou(e.target.value)}
                  placeholder="Share a transformative moment..."
                  maxLength={500}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="confident">What part of Amsterdam makes you feel most confident?</Label>
                <Textarea
                  id="confident"
                  value={confidentSpot}
                  onChange={(e) => setConfidentSpot(e.target.value)}
                  placeholder="A place or experience that empowers you..."
                  maxLength={300}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="vulnerable">What part makes you feel vulnerable or curious?</Label>
                <Textarea
                  id="vulnerable"
                  value={vulnerableSpot}
                  onChange={(e) => setVulnerableSpot(e.target.value)}
                  placeholder="Where you feel most raw or open..."
                  maxLength={300}
                  rows={3}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 6: Style & Aesthetic */}
          <AccordionItem value="aesthetic">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Style, Aesthetic & Symbolism
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label>What colours represent your Amsterdam energy?</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COLOR_OPTIONS.map((color) => (
                    <Badge
                      key={color}
                      variant={colors.includes(color) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="lighting">What type of lighting matches your mood?</Label>
                <Select value={lighting} onValueChange={setLighting}>
                  <SelectTrigger id="lighting">
                    <SelectValue placeholder="Select lighting style" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIGHTING_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time">What time of night feels "most you" in this city?</Label>
                <Select value={timeOfNight} onValueChange={setTimeOfNight}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time of night" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 7: Future Chapter */}
          <AccordionItem value="future">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Future – Your Amsterdam Chapter
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="goals">What do you want to achieve in Amsterdam?</Label>
                <Textarea
                  id="goals"
                  value={amsterdamGoals}
                  onChange={(e) => setAmsterdamGoals(e.target.value)}
                  placeholder="Your aspirations and dreams..."
                  maxLength={500}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="changed">How has living or working here changed you?</Label>
                <Textarea
                  id="changed"
                  value={howChanged}
                  onChange={(e) => setHowChanged(e.target.value)}
                  placeholder="Your transformation..."
                  maxLength={500}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="becoming">What version of yourself are you becoming in this city?</Label>
                <Textarea
                  id="becoming"
                  value={becoming}
                  onChange={(e) => setBecoming(e.target.value)}
                  placeholder="Who you're evolving into..."
                  maxLength={500}
                  rows={4}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Next Step
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OnboardingBackstory;
