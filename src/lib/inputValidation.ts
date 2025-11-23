import { z } from "zod";

/**
 * Centralized Input Validation Schemas
 * All user inputs MUST be validated using these schemas
 */

// Email validation with length limits
export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" })
  .transform(email => email.toLowerCase());

// Password validation (min 8 chars)
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be less than 128 characters" });

// Name validation
export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name cannot be empty" })
  .max(100, { message: "Name must be less than 100 characters" });

// Phone validation
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+]?[\d\s\-()]+$/, { message: "Invalid phone number format" })
  .min(10, { message: "Phone number must be at least 10 digits" })
  .max(20, { message: "Phone number must be less than 20 characters" });

// URL validation
export const urlSchema = z
  .string()
  .trim()
  .url({ message: "Invalid URL format" })
  .max(2048, { message: "URL must be less than 2048 characters" });

// Text field validation (general purpose)
export const textFieldSchema = (minLength = 1, maxLength = 500) =>
  z
    .string()
    .trim()
    .min(minLength, { message: `Text must be at least ${minLength} characters` })
    .max(maxLength, { message: `Text must be less than ${maxLength} characters` });

// Textarea validation
export const textareaSchema = (minLength = 1, maxLength = 5000) =>
  z
    .string()
    .trim()
    .min(minLength, { message: `Text must be at least ${minLength} characters` })
    .max(maxLength, { message: `Text must be less than ${maxLength} characters` });

// Number validation
export const numberSchema = (min = 0, max = 1000000) =>
  z
    .number()
    .min(min, { message: `Value must be at least ${min}` })
    .max(max, { message: `Value must be less than ${max}` });

// Date validation
export const dateSchema = z.date().or(z.string().datetime());

// Contact form validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: textareaSchema(10, 1000),
});

// Signup form validation
export const signupFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
  fullName: nameSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login form validation
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Onboarding personal info validation
export const onboardingPersonalSchema = z.object({
  personal_full_name: nameSchema,
  personal_email: emailSchema,
  personal_phone_number: phoneSchema,
  personal_date_of_birth: dateSchema,
  personal_nationality: textFieldSchema(2, 100),
  personal_location: textFieldSchema(2, 200),
  personal_emergency_contact: nameSchema.optional(),
  personal_emergency_phone: phoneSchema.optional(),
});

// Onboarding persona validation
export const onboardingPersonaSchema = z.object({
  persona_stage_name: nameSchema,
  persona_description: textareaSchema(10, 500),
  persona_backstory: textareaSchema(10, 1000).optional(),
  persona_personality: textareaSchema(10, 500).optional(),
  persona_interests: textareaSchema(10, 500).optional(),
  persona_fantasy: textareaSchema(10, 500).optional(),
});

// Social media validation
export const onboardingSocialsSchema = z.object({
  social_instagram: urlSchema.optional().or(z.literal("")),
  social_twitter: urlSchema.optional().or(z.literal("")),
  social_tiktok: urlSchema.optional().or(z.literal("")),
  social_youtube: urlSchema.optional().or(z.literal("")),
  social_telegram: textFieldSchema(3, 100).optional().or(z.literal("")),
  fan_platform_onlyfans: urlSchema.optional().or(z.literal("")),
  fan_platform_fansly: urlSchema.optional().or(z.literal("")),
  fan_platform_other: urlSchema.optional().or(z.literal("")),
  business_phone: phoneSchema.optional().or(z.literal("")),
});

// Pricing validation
export const onboardingPricingSchema = z.object({
  pricing_subscription: numberSchema(0, 10000).optional(),
  pricing_ppv_photo: numberSchema(0, 1000).optional(),
  pricing_ppv_video: numberSchema(0, 5000).optional(),
  pricing_sexting: numberSchema(0, 1000).optional(),
  pricing_chat: numberSchema(0, 500).optional(),
  pricing_custom_content: numberSchema(0, 10000).optional(),
});

/**
 * Sanitize HTML to prevent XSS attacks
 * Use this for any user-generated content that might contain HTML
 */
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Validate and encode URL parameters
 */
export const encodeUrlParam = (param: string): string => {
  return encodeURIComponent(param.trim());
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file: File, maxSizeMB = 100, allowedTypes: string[] = []) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new Error(`File type must be one of: ${allowedTypes.join(", ")}`);
  }
  
  return true;
};
