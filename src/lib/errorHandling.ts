import { toast } from "sonner";

/**
 * Centralized Error Handling Utilities
 */

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Parse Supabase errors into user-friendly messages
 */
export const parseSupabaseError = (error: any): string => {
  if (!error) return "An unknown error occurred";

  // PostgreSQL error codes
  const pgErrors: Record<string, string> = {
    "23505": "This record already exists",
    "23503": "Cannot delete this record as it's referenced elsewhere",
    "23502": "Required field is missing",
    "42501": "You don't have permission to perform this action",
    "P0001": "Operation failed due to business logic constraints",
  };

  if (error.code && pgErrors[error.code]) {
    return pgErrors[error.code];
  }

  // Supabase specific errors
  if (error.message) {
    if (error.message.includes("JWT")) {
      return "Your session has expired. Please log in again.";
    }
    if (error.message.includes("rate limit")) {
      return "Too many requests. Please try again later.";
    }
    if (error.message.includes("network")) {
      return "Network error. Please check your connection.";
    }
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Handle async operations with error handling
 */
export const handleAsync = async <T>(
  operation: () => Promise<T>,
  options?: {
    onError?: (error: any) => void;
    errorMessage?: string;
    successMessage?: string;
  }
): Promise<{ data: T | null; error: any | null }> => {
  try {
    const data = await operation();
    if (options?.successMessage) {
      toast.success(options.successMessage);
    }
    return { data, error: null };
  } catch (error: any) {
    console.error("Operation failed:", error);
    const errorMessage = options?.errorMessage || parseSupabaseError(error);
    toast.error(errorMessage);
    if (options?.onError) {
      options.onError(error);
    }
    return { data: null, error };
  }
};

/**
 * Retry logic for failed operations
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError;
};

/**
 * Validate response from edge functions
 */
export const validateEdgeFunctionResponse = (response: any): { valid: boolean; error?: string } => {
  if (!response) {
    return { valid: false, error: "No response received" };
  }
  
  if (response.error) {
    return { valid: false, error: response.error };
  }
  
  return { valid: true };
};

/**
 * Log errors to console with context
 */
export const logError = (context: string, error: any, additionalData?: any) => {
  console.error(`[${context}]`, {
    error: error.message || error,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...additionalData,
  });
};
