import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  experience: z.enum(["start", "growing", "established"], {
    errorMap: () => ({ message: "Please select your experience level" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(1, "Password is required").max(255, "Password must be less than 255 characters"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(255, "Password must be less than 255 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(255, "Password must be less than 255 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Onboarding validation schemas
export const onboardingPersonalSchema = z.object({
  fullName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  dateOfBirth: z.string()
    .refine((date) => {
      if (!date) return true; // Optional field
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 100;
    }, "You must be between 18 and 100 years old"),
  nationality: z.string()
    .min(2, "Nationality is required")
    .max(100, "Nationality must be less than 100 characters"),
  location: z.string()
    .min(2, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 digits")
    .regex(/^[+]?[\d\s()-]+$/, "Invalid phone number format"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  emergencyContact: z.string()
    .min(2, "Emergency contact name is required")
    .max(100, "Name must be less than 100 characters"),
  emergencyPhone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 digits")
    .regex(/^[+]?[\d\s()-]+$/, "Invalid phone number format"),
});

export const onboardingBodySchema = z.object({
  height: z.string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 100 && parseFloat(val) <= 250), {
      message: "Height must be between 100 and 250 cm"
    }),
  weight: z.string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 30 && parseFloat(val) <= 300), {
      message: "Weight must be between 30 and 300 kg"
    }),
  bodyType: z.string().max(100, "Body type must be less than 100 characters").optional(),
  hairColor: z.string().max(50, "Hair color must be less than 50 characters").optional(),
  eyeColor: z.string().max(50, "Eye color must be less than 50 characters").optional(),
  tattoos: z.string().max(500, "Description must be less than 500 characters").optional(),
  piercings: z.string().max(500, "Description must be less than 500 characters").optional(),
  distinctiveFeatures: z.string().max(500, "Description must be less than 500 characters").optional(),
});

export const onboardingPricingSchema = z.object({
  subscription: z.string()
    .optional()
    .refine((val) => !val || val === "" || parseFloat(val) >= 0, "Price must be positive"),
  ppvPhoto: z.string()
    .optional()
    .refine((val) => !val || val === "" || parseFloat(val) >= 0, "Price must be positive"),
  ppvVideo: z.string()
    .optional()
    .refine((val) => !val || val === "" || parseFloat(val) >= 0, "Price must be positive"),
  customContent: z.string()
    .optional()
    .refine((val) => !val || val === "" || parseFloat(val) >= 0, "Price must be positive"),
  chat: z.string()
    .optional()
    .refine((val) => !val || val === "" || parseFloat(val) >= 0, "Price must be positive"),
  sexting: z.string()
    .optional()
    .refine((val) => !val || val === "" || parseFloat(val) >= 0, "Price must be positive"),
});

export const onboardingPersonaSchema = z.object({
  stageName: z.string()
    .min(2, "Stage name must be at least 2 characters")
    .max(100, "Stage name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  backstory: z.string()
    .max(2000, "Backstory must be less than 2000 characters")
    .optional(),
  personality: z.string()
    .max(1000, "Personality must be less than 1000 characters")
    .optional(),
  interests: z.string()
    .max(1000, "Interests must be less than 1000 characters")
    .optional(),
  fantasy: z.string()
    .max(1000, "Fantasy must be less than 1000 characters")
    .optional(),
});
