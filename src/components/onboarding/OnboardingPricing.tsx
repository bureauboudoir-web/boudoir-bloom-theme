import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { onboardingPricingSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface OnboardingPricingProps {
  onNext: () => void;
  onBack: () => void;
  onboardingData: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
}

const OnboardingPricing = ({
  onNext,
  onBack,
  onboardingData,
  onComplete,
}: OnboardingPricingProps) => {
  const form = useForm<z.infer<typeof onboardingPricingSchema>>({
    resolver: zodResolver(onboardingPricingSchema),
    defaultValues: {
      subscription: "",
      ppvPhoto: "",
      ppvVideo: "",
      customContent: "",
      chat: "",
      sexting: "",
    },
  });

  useEffect(() => {
    if (onboardingData) {
      form.reset({
        subscription: onboardingData.pricing_subscription?.toString() || "",
        ppvPhoto: onboardingData.pricing_ppv_photo?.toString() || "",
        ppvVideo: onboardingData.pricing_ppv_video?.toString() || "",
        customContent: onboardingData.pricing_custom_content?.toString() || "",
        chat: onboardingData.pricing_chat?.toString() || "",
        sexting: onboardingData.pricing_sexting?.toString() || "",
      });
    }
  }, [onboardingData, form]);

  const onSubmit = async (values: z.infer<typeof onboardingPricingSchema>) => {
    const stepData = {
      pricing_subscription: values.subscription ? parseFloat(values.subscription) : null,
      pricing_ppv_photo: values.ppvPhoto ? parseFloat(values.ppvPhoto) : null,
      pricing_ppv_video: values.ppvVideo ? parseFloat(values.ppvVideo) : null,
      pricing_custom_content: values.customContent ? parseFloat(values.customContent) : null,
      pricing_chat: values.chat ? parseFloat(values.chat) : null,
      pricing_sexting: values.sexting ? parseFloat(values.sexting) : null,
    };

    const result = await onComplete(8, stepData);
    if (!result.error) {
      toast.success("Pricing information saved!");
      onNext();
    } else {
      toast.error("Failed to save. Please try again.");
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Pricing Structure</h3>
      <p className="text-sm text-muted-foreground mb-6">
        These are initial suggestions. We'll refine them together based on market positioning.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subscription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Subscription ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="15"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Must be positive</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ppvPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PPV Photo Set ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Must be positive</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ppvVideo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PPV Video ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Must be positive</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Content Base ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="50"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Must be positive</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Chat ($/min)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="2"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Must be positive</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexting Session ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="30"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Must be positive</FormDescription>
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

export default OnboardingPricing;
