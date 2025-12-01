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
    step2_body_info?: any;
    step3_brand_identity?: any;
    step4_amsterdam_story?: any;
    step5_persona?: any;
    step6_boundaries?: any;
    step7_pricing?: any;
    step8_messaging?: any;
    step9_socials_platforms?: any;
    step10_content_preferences?: any;
    step11_market_positioning?: any;
    step12_commitments?: any;
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
    const completionPercentage = Math.round((completedSteps.length / 12) * 100);

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
        step2_body_info: onboarding?.step2_body_info,
        step3_brand_identity: onboarding?.step2_brand_identity,
        step4_amsterdam_story: onboarding?.step3_amsterdam_story,
        step5_persona: onboarding?.step4_persona,
        step6_boundaries: onboarding?.step5_boundaries,
        step7_pricing: onboarding?.step6_pricing,
        step8_messaging: onboarding?.step7_messaging,
        step9_socials_platforms: onboarding?.step8_content_preferences,
        step10_content_preferences: onboarding?.step9_market_positioning,
        step11_market_positioning: onboarding?.step10_commitments,
        step12_commitments: onboarding?.step11_commitments,
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
