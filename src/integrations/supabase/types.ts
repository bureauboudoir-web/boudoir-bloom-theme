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
      content_uploads: {
        Row: {
          commitment_id: string | null
          content_type: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          length: string | null
          marketing_notes: string | null
          shoot_id: string | null
          status: string | null
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          commitment_id?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          length?: string | null
          marketing_notes?: string | null
          shoot_id?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          commitment_id?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          length?: string | null
          marketing_notes?: string | null
          shoot_id?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_uploads_commitment_id_fkey"
            columns: ["commitment_id"]
            isOneToOne: false
            referencedRelation: "weekly_commitments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_uploads_shoot_id_fkey"
            columns: ["shoot_id"]
            isOneToOne: false
            referencedRelation: "studio_shoots"
            referencedColumns: ["id"]
          },
        ]
      }
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
      invoices: {
        Row: {
          admin_payment_confirmed_at: string | null
          amount: number
          created_at: string
          created_by_user_id: string | null
          creator_payment_confirmed_at: string | null
          currency: string
          description: string
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          payment_method: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_payment_confirmed_at?: string | null
          amount: number
          created_at?: string
          created_by_user_id?: string | null
          creator_payment_confirmed_at?: string | null
          currency?: string
          description: string
          due_date: string
          id?: string
          invoice_date: string
          invoice_number: string
          notes?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_payment_confirmed_at?: string | null
          amount?: number
          created_at?: string
          created_by_user_id?: string | null
          creator_payment_confirmed_at?: string | null
          currency?: string
          description?: string
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id?: string
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
          fan_platform_fansly: string | null
          fan_platform_onlyfans: string | null
          fan_platform_other: string | null
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
          social_instagram: string | null
          social_tiktok: string | null
          social_twitter: string | null
          social_youtube: string | null
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
          fan_platform_fansly?: string | null
          fan_platform_onlyfans?: string | null
          fan_platform_other?: string | null
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
          social_instagram?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
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
          fan_platform_fansly?: string | null
          fan_platform_onlyfans?: string | null
          fan_platform_other?: string | null
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
          social_instagram?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
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
          profile_picture_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      studio_shoots: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          description: string | null
          id: string
          location: string | null
          marketing_notes: string | null
          notes: string | null
          shoot_date: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          marketing_notes?: string | null
          notes?: string | null
          shoot_date: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          marketing_notes?: string | null
          notes?: string | null
          shoot_date?: string
          status?: string | null
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
      support_tickets: {
        Row: {
          admin_response: string | null
          attachment_url: string | null
          created_at: string
          creator_viewed_response_at: string | null
          id: string
          message: string
          responded_at: string | null
          status: Database["public"]["Enums"]["support_ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          attachment_url?: string | null
          created_at?: string
          creator_viewed_response_at?: string | null
          id?: string
          message: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["support_ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          attachment_url?: string | null
          created_at?: string
          creator_viewed_response_at?: string | null
          id?: string
          message?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["support_ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_commitments: {
        Row: {
          content_type: string
          content_type_category: string | null
          created_at: string
          created_by_user_id: string | null
          description: string
          id: string
          is_completed: boolean
          length: string | null
          marketing_notes: string | null
          notes: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type: string
          content_type_category?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description: string
          id?: string
          is_completed?: boolean
          length?: string | null
          marketing_notes?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string
          content_type_category?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description?: string
          id?: string
          is_completed?: boolean
          length?: string | null
          marketing_notes?: string | null
          notes?: string | null
          status?: string | null
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
      generate_invoice_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_overdue_invoices: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "manager" | "creator"
      support_ticket_status: "open" | "in_progress" | "resolved"
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
    Enums: {
      app_role: ["admin", "manager", "creator"],
      support_ticket_status: ["open", "in_progress", "resolved"],
    },
  },
} as const
