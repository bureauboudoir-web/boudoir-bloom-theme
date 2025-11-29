import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { onboardingPersonaSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useTranslation } from "react-i18next";

interface OnboardingPersonaProps {
  onNext: () => void;
  onBack: () => void;
  onboardingData: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
}

const OnboardingPersona = ({
  onNext,
  onBack,
  onboardingData,
  onComplete,
}: OnboardingPersonaProps) => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof onboardingPersonaSchema>>({
    resolver: zodResolver(onboardingPersonaSchema),
    defaultValues: {
      stageName: "",
      description: "",
      backstory: "",
      personality: "",
      interests: "",
      fantasy: "",
    },
  });

  useEffect(() => {
    if (onboardingData) {
      form.reset({
        stageName: onboardingData.persona_stage_name || "",
        description: onboardingData.persona_description || "",
        backstory: onboardingData.persona_backstory || "",
        personality: onboardingData.persona_personality || "",
        interests: onboardingData.persona_interests || "",
        fantasy: onboardingData.persona_fantasy || "",
      });
    }
  }, [onboardingData, form]);

  // Auto-save form data
  useAutoSave({
    data: form.watch(),
    onSave: async (data) => {
      await onComplete(2, {
        persona_stage_name: data.stageName,
        persona_description: data.description,
        persona_backstory: data.backstory,
        persona_personality: data.personality,
        persona_interests: data.interests,
        persona_fantasy: data.fantasy,
      });
    },
    delay: 2000,
    enabled: true,
  });

  const onSubmit = async (values: z.infer<typeof onboardingPersonaSchema>) => {
    const stepData = {
      persona_stage_name: values.stageName,
      persona_description: values.description,
      persona_backstory: values.backstory,
      persona_personality: values.personality,
      persona_interests: values.interests,
      persona_fantasy: values.fantasy,
    };

    const result = await onComplete(2, stepData);
    if (!result.error) {
      toast.success(t('onboarding.persona.saveSuccess'));
      onNext();
    } else {
      toast.error(t('onboarding.persona.saveFailed'));
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">{t('onboarding.persona.title')}</h3>
      <p className="text-sm text-muted-foreground mb-6">
        {t('onboarding.persona.subtitle')}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="stageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage Name / Persona Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your creator name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Persona Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the character you want to portray (e.g., girl next door, mysterious seductress, confident professional...)"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="backstory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Backstory</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your character's story and background..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personality Traits</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Playful, Mysterious, Intellectual, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interests & Hobbies</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Yoga, Travel, Fashion, Gaming, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fantasy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fantasy Niche</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What specific fantasy or appeal will your persona embody?"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" className="glow-red">
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default OnboardingPersona;
