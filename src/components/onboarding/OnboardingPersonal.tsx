import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { onboardingPersonalSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAutoSave } from "@/hooks/useAutoSave";

interface OnboardingPersonalProps {
  onNext: () => void;
  onboardingData: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
}

const OnboardingPersonal = ({ onNext, onboardingData, onComplete }: OnboardingPersonalProps) => {
  const form = useForm<z.infer<typeof onboardingPersonalSchema>>({
    resolver: zodResolver(onboardingPersonalSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      nationality: "",
      location: "",
      phoneNumber: "",
      email: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
  });

  useEffect(() => {
    if (onboardingData) {
      form.reset({
        fullName: onboardingData.personal_full_name || "",
        dateOfBirth: onboardingData.personal_date_of_birth || "",
        nationality: onboardingData.personal_nationality || "",
        location: onboardingData.personal_location || "",
        phoneNumber: onboardingData.personal_phone_number || "",
        email: onboardingData.personal_email || "",
        emergencyContact: onboardingData.personal_emergency_contact || "",
        emergencyPhone: onboardingData.personal_emergency_phone || "",
      });
    }
  }, [onboardingData, form]);

  // Auto-save form data
  useAutoSave({
    data: form.watch(),
    onSave: async (data) => {
      await onComplete(1, {
        personal_full_name: data.fullName,
        personal_date_of_birth: data.dateOfBirth,
        personal_nationality: data.nationality,
        personal_location: data.location,
        personal_phone_number: data.phoneNumber,
        personal_email: data.email,
        personal_emergency_contact: data.emergencyContact,
        personal_emergency_phone: data.emergencyPhone,
      });
    },
    delay: 2000,
    enabled: true,
  });

  const onSubmit = async (values: z.infer<typeof onboardingPersonalSchema>) => {
    const stepData = {
      personal_full_name: values.fullName,
      personal_date_of_birth: values.dateOfBirth,
      personal_nationality: values.nationality,
      personal_location: values.location,
      personal_phone_number: values.phoneNumber,
      personal_email: values.email,
      personal_emergency_contact: values.emergencyContact,
      personal_emergency_phone: values.emergencyPhone,
    };

    const result = await onComplete(1, stepData);
    if (!result.error) {
      toast.success("Personal information saved!");
      onNext();
    } else {
      toast.error("Failed to save. Please try again.");
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Personal Information</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Legal Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full legal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dutch, Brazilian" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+31 6 12345678"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of emergency contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Phone *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+31 6 12345678"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" className="glow-red">
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default OnboardingPersonal;
