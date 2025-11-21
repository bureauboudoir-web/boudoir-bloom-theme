import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { onboardingBodySchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface OnboardingBodyProps {
  onNext: () => void;
  onBack: () => void;
  onboardingData: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
}

const OnboardingBody = ({
  onNext,
  onBack,
  onboardingData,
  onComplete,
}: OnboardingBodyProps) => {
  const form = useForm<z.infer<typeof onboardingBodySchema>>({
    resolver: zodResolver(onboardingBodySchema),
    defaultValues: {
      height: "",
      weight: "",
      bodyType: "",
      hairColor: "",
      eyeColor: "",
      tattoos: "",
      piercings: "",
      distinctiveFeatures: "",
    },
  });

  useEffect(() => {
    if (onboardingData) {
      form.reset({
        height: onboardingData.body_height?.toString() || "",
        weight: onboardingData.body_weight?.toString() || "",
        bodyType: onboardingData.body_type || "",
        hairColor: onboardingData.body_hair_color || "",
        eyeColor: onboardingData.body_eye_color || "",
        tattoos: onboardingData.body_tattoos || "",
        piercings: onboardingData.body_piercings || "",
        distinctiveFeatures: onboardingData.body_distinctive_features || "",
      });
    }
  }, [onboardingData, form]);

  const onSubmit = async (values: z.infer<typeof onboardingBodySchema>) => {
    const stepData = {
      body_height: values.height ? parseFloat(values.height) : null,
      body_weight: values.weight ? parseFloat(values.weight) : null,
      body_type: values.bodyType,
      body_hair_color: values.hairColor,
      body_eye_color: values.eyeColor,
      body_tattoos: values.tattoos,
      body_piercings: values.piercings,
      body_distinctive_features: values.distinctiveFeatures,
    };

    const result = await onComplete(2, stepData);
    if (!result.error) {
      toast.success("Physical attributes saved!");
      onNext();
    } else {
      toast.error("Failed to save. Please try again.");
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Physical Attributes</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Help us understand your unique features for content planning.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 170"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Between 100-250 cm</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 65"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Between 30-300 kg</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bodyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Athletic, Curvy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hairColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hair Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blonde, Brunette" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eyeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eye Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blue, Brown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tattoos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tattoos</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe your tattoos (if any)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="piercings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piercings</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe your piercings (if any)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distinctiveFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distinctive Features</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Any unique features"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

export default OnboardingBody;
