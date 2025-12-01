import { supabase } from "@/integrations/supabase/client";

export interface ExportedOnboardingData {
  profile: {
    id: string;
    full_name: string;
    email: string;
    profile_picture_url?: string;
    creator_status?: string;
  };
  sections: {
    step1_private_info?: any;
    step2_brand_identity?: any;
    step3_amsterdam_story?: any;
    step4_persona?: any;
    step5_boundaries?: any;
    step6_pricing?: any;
    step7_messaging?: any;
    step8_socials_platforms?: any;
    step9_content_preferences?: any;
    step10_market_positioning?: any;
    step11_commitments?: any;
  };
  completion: {
    current_step: number;
    completed_steps: number[];
    is_completed: boolean;
    completion_percentage: number;
  };
}

/**
 * Fetches complete onboarding data for a creator
 */
export async function fetchOnboardingData(
  creatorId: string
): Promise<ExportedOnboardingData | null> {
  try {
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email, profile_picture_url, creator_status")
      .eq("id", creatorId)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // Fetch onboarding data
    const { data: onboarding, error: onboardingError } = await supabase
      .from("onboarding_data")
      .select("*")
      .eq("user_id", creatorId)
      .single();

    if (onboardingError) {
      console.error("Error fetching onboarding:", onboardingError);
      return null;
    }

    const completedSteps = onboarding?.completed_steps || [];
    const completionPercentage = Math.round((completedSteps.length / 11) * 100);

    return {
      profile: {
        id: profile.id,
        full_name: profile.full_name || "",
        email: profile.email || "",
        profile_picture_url: profile.profile_picture_url,
        creator_status: profile.creator_status,
      },
      sections: {
        step1_private_info: onboarding?.step1_private_info,
        step2_brand_identity: onboarding?.step2_brand_identity,
        step3_amsterdam_story: onboarding?.step3_amsterdam_story,
        step4_persona: onboarding?.step4_persona,
        step5_boundaries: onboarding?.step5_boundaries,
        step6_pricing: onboarding?.step6_pricing,
        step7_messaging: onboarding?.step7_messaging,
        step8_socials_platforms: onboarding?.step8_content_preferences, // DB column name
        step9_content_preferences: onboarding?.step9_market_positioning, // DB column name
        step10_market_positioning: onboarding?.step10_commitments, // DB column name
        step11_commitments: onboarding?.step11_commitments,
      },
      completion: {
        current_step: onboarding?.current_step || 1,
        completed_steps: completedSteps,
        is_completed: onboarding?.is_completed || false,
        completion_percentage: completionPercentage,
      },
    };
  } catch (error) {
    console.error("Error in fetchOnboardingData:", error);
    return null;
  }
}

/**
 * Generates a JSON export of onboarding data
 */
export function generateJSONExport(data: ExportedOnboardingData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Downloads JSON export as a file
 */
export function downloadJSON(data: ExportedOnboardingData, filename: string) {
  const json = generateJSONExport(data);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports onboarding data via edge function (generates PDF + JSON, stores in Supabase)
 */
export async function exportOnboardingProfile(
  creatorId: string
): Promise<{ success: boolean; pdfUrl?: string; jsonUrl?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "export-creator-onboarding",
      {
        body: { creator_id: creatorId },
      }
    );

    if (error) {
      console.error("Error exporting onboarding:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      pdfUrl: data?.pdf_url,
      jsonUrl: data?.json_url,
    };
  } catch (error: any) {
    console.error("Error in exportOnboardingProfile:", error);
    return { success: false, error: error.message };
  }
}
