export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      creator_applications: {
        Row: {
          created_at: string | null
          email: string
          experience_level: string
          id: string
          name: string
          phone: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          experience_level: string
          id?: string
          name: string
          phone: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          experience_level?: string
          id?: string
          name?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      onboarding_data: {
        Row: {
          body_distinctive_features: string | null
          body_eye_color: string | null
          body_hair_color: string | null
          body_height: number | null
          body_piercings: string | null
          body_tattoos: string | null
          body_type: string | null
          body_weight: number | null
          boundaries_additional_notes: string | null
          boundaries_comfortable_with: string[] | null
          boundaries_hard_limits: string | null
          boundaries_soft_limits: string | null
          commitments_agreements: string[] | null
          commitments_questions: string | null
          completed_steps: number[] | null
          content_equipment_needs: string | null
          content_photo_count: number | null
          content_shooting_preferences: string | null
          content_themes: string | null
          content_video_count: number | null
          created_at: string | null
          current_step: number | null
          id: string
          is_completed: boolean | null
          persona_backstory: string | null
          persona_description: string | null
          persona_fantasy: string | null
          persona_interests: string | null
          persona_personality: string | null
          persona_stage_name: string | null
          personal_date_of_birth: string | null
          personal_email: string | null
          personal_emergency_contact: string | null
          personal_emergency_phone: string | null
          personal_full_name: string | null
          personal_location: string | null
          personal_nationality: string | null
          personal_phone_number: string | null
          pricing_chat: number | null
          pricing_custom_content: number | null
          pricing_ppv_photo: number | null
          pricing_ppv_video: number | null
          pricing_sexting: number | null
          pricing_subscription: number | null
          scripts_greeting: string | null
          scripts_ppv: string | null
          scripts_renewal: string | null
          scripts_sexting: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body_distinctive_features?: string | null
          body_eye_color?: string | null
          body_hair_color?: string | null
          body_height?: number | null
          body_piercings?: string | null
          body_tattoos?: string | null
          body_type?: string | null
          body_weight?: number | null
          boundaries_additional_notes?: string | null
          boundaries_comfortable_with?: string[] | null
          boundaries_hard_limits?: string | null
          boundaries_soft_limits?: string | null
          commitments_agreements?: string[] | null
          commitments_questions?: string | null
          completed_steps?: number[] | null
          content_equipment_needs?: string | null
          content_photo_count?: number | null
          content_shooting_preferences?: string | null
          content_themes?: string | null
          content_video_count?: number | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_completed?: boolean | null
          persona_backstory?: string | null
          persona_description?: string | null
          persona_fantasy?: string | null
          persona_interests?: string | null
          persona_personality?: string | null
          persona_stage_name?: string | null
          personal_date_of_birth?: string | null
          personal_email?: string | null
          personal_emergency_contact?: string | null
          personal_emergency_phone?: string | null
          personal_full_name?: string | null
          personal_location?: string | null
          personal_nationality?: string | null
          personal_phone_number?: string | null
          pricing_chat?: number | null
          pricing_custom_content?: number | null
          pricing_ppv_photo?: number | null
          pricing_ppv_video?: number | null
          pricing_sexting?: number | null
          pricing_subscription?: number | null
          scripts_greeting?: string | null
          scripts_ppv?: string | null
          scripts_renewal?: string | null
          scripts_sexting?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body_distinctive_features?: string | null
          body_eye_color?: string | null
          body_hair_color?: string | null
          body_height?: number | null
          body_piercings?: string | null
          body_tattoos?: string | null
          body_type?: string | null
          body_weight?: number | null
          boundaries_additional_notes?: string | null
          boundaries_comfortable_with?: string[] | null
          boundaries_hard_limits?: string | null
          boundaries_soft_limits?: string | null
          commitments_agreements?: string[] | null
          commitments_questions?: string | null
          completed_steps?: number[] | null
          content_equipment_needs?: string | null
          content_photo_count?: number | null
          content_shooting_preferences?: string | null
          content_themes?: string | null
          content_video_count?: number | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_completed?: boolean | null
          persona_backstory?: string | null
          persona_description?: string | null
          persona_fantasy?: string | null
          persona_interests?: string | null
          persona_personality?: string | null
          persona_stage_name?: string | null
          personal_date_of_birth?: string | null
          personal_email?: string | null
          personal_emergency_contact?: string | null
          personal_emergency_phone?: string | null
          personal_full_name?: string | null
          personal_location?: string | null
          personal_nationality?: string | null
          personal_phone_number?: string | null
          pricing_chat?: number | null
          pricing_custom_content?: number | null
          pricing_ppv_photo?: number | null
          pricing_ppv_video?: number | null
          pricing_sexting?: number | null
          pricing_subscription?: number | null
          scripts_greeting?: string | null
          scripts_ppv?: string | null
          scripts_renewal?: string | null
          scripts_sexting?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      studio_shoots: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          notes: string | null
          shoot_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          shoot_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          shoot_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "studio_shoots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_commitments: {
        Row: {
          content_type: string
          created_at: string
          description: string
          id: string
          is_completed: boolean
          length: string | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type: string
          created_at?: string
          description: string
          id?: string
          is_completed?: boolean
          length?: string | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string
          id?: string
          is_completed?: boolean
          length?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_commitments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
