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
          {
            foreignKeyName: "content_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_access_levels: {
        Row: {
          access_level: string | null
          created_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      creator_applications: {
        Row: {
          admin_notes: string | null
          application_status: string | null
          approval_email_sent_at: string | null
          created_at: string | null
          email: string
          experience_level: string
          id: string
          name: string
          phone: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          application_status?: string | null
          approval_email_sent_at?: string | null
          created_at?: string | null
          email: string
          experience_level: string
          id?: string
          name: string
          phone: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          application_status?: string | null
          approval_email_sent_at?: string | null
          created_at?: string | null
          email?: string
          experience_level?: string
          id?: string
          name?: string
          phone?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_contracts: {
        Row: {
          contract_signed: boolean | null
          contract_template_url: string | null
          created_at: string | null
          id: string
          signed_at: string | null
          signed_contract_url: string | null
          template_uploaded_at: string | null
          updated_at: string | null
          uploaded_by: string | null
          user_id: string
        }
        Insert: {
          contract_signed?: boolean | null
          contract_template_url?: string | null
          created_at?: string | null
          id?: string
          signed_at?: string | null
          signed_contract_url?: string | null
          template_uploaded_at?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          user_id: string
        }
        Update: {
          contract_signed?: boolean | null
          contract_template_url?: string | null
          created_at?: string | null
          id?: string
          signed_at?: string | null
          signed_contract_url?: string | null
          template_uploaded_at?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_contracts_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_contracts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_meetings: {
        Row: {
          application_id: string | null
          assigned_manager_id: string | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          meeting_date: string | null
          meeting_link: string | null
          meeting_location: string | null
          meeting_notes: string | null
          meeting_time: string | null
          meeting_type: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_id?: string | null
          assigned_manager_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_date?: string | null
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_notes?: string | null
          meeting_time?: string | null
          meeting_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_id?: string | null
          assigned_manager_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_date?: string | null
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_notes?: string | null
          meeting_time?: string | null
          meeting_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_meetings_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "creator_applications"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_availability: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          is_available: boolean | null
          manager_id: string
          meeting_duration_minutes: number | null
          specific_date: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          is_available?: boolean | null
          manager_id: string
          meeting_duration_minutes?: number | null
          specific_date?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          manager_id?: string
          meeting_duration_minutes?: number | null
          specific_date?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      onboarding_data: {
        Row: {
          backstory_alter_ego: string | null
          backstory_amsterdam_goals: string | null
          backstory_becoming: string | null
          backstory_career_story: string | null
          backstory_character_secret: string | null
          backstory_colors: string[] | null
          backstory_confident_spot: string | null
          backstory_content_expression: string | null
          backstory_how_changed: string | null
          backstory_lighting: string | null
          backstory_moment_changed_you: string | null
          backstory_neighborhood: string | null
          backstory_past_shaped_you: string | null
          backstory_persona_sentence: string | null
          backstory_rld_atmosphere: string[] | null
          backstory_rld_fascination: string | null
          backstory_rld_feeling: string | null
          backstory_time_of_night: string | null
          backstory_vulnerable_spot: string | null
          backstory_what_brought_you: string | null
          backstory_what_you_love: string | null
          backstory_years_in_amsterdam: string | null
          backstory_years_working_centrum: string | null
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
          business_phone: string | null
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
          social_telegram: string | null
          social_tiktok: string | null
          social_twitter: string | null
          social_youtube: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backstory_alter_ego?: string | null
          backstory_amsterdam_goals?: string | null
          backstory_becoming?: string | null
          backstory_career_story?: string | null
          backstory_character_secret?: string | null
          backstory_colors?: string[] | null
          backstory_confident_spot?: string | null
          backstory_content_expression?: string | null
          backstory_how_changed?: string | null
          backstory_lighting?: string | null
          backstory_moment_changed_you?: string | null
          backstory_neighborhood?: string | null
          backstory_past_shaped_you?: string | null
          backstory_persona_sentence?: string | null
          backstory_rld_atmosphere?: string[] | null
          backstory_rld_fascination?: string | null
          backstory_rld_feeling?: string | null
          backstory_time_of_night?: string | null
          backstory_vulnerable_spot?: string | null
          backstory_what_brought_you?: string | null
          backstory_what_you_love?: string | null
          backstory_years_in_amsterdam?: string | null
          backstory_years_working_centrum?: string | null
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
          business_phone?: string | null
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
          social_telegram?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backstory_alter_ego?: string | null
          backstory_amsterdam_goals?: string | null
          backstory_becoming?: string | null
          backstory_career_story?: string | null
          backstory_character_secret?: string | null
          backstory_colors?: string[] | null
          backstory_confident_spot?: string | null
          backstory_content_expression?: string | null
          backstory_how_changed?: string | null
          backstory_lighting?: string | null
          backstory_moment_changed_you?: string | null
          backstory_neighborhood?: string | null
          backstory_past_shaped_you?: string | null
          backstory_persona_sentence?: string | null
          backstory_rld_atmosphere?: string[] | null
          backstory_rld_fascination?: string | null
          backstory_rld_feeling?: string | null
          backstory_time_of_night?: string | null
          backstory_vulnerable_spot?: string | null
          backstory_what_brought_you?: string | null
          backstory_what_you_love?: string | null
          backstory_years_in_amsterdam?: string | null
          backstory_years_working_centrum?: string | null
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
          business_phone?: string | null
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
          social_telegram?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          name: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          resource?: string
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
      role_audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          performed_by: string | null
          reason: string | null
          role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          performed_by?: string | null
          reason?: string | null
          role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          performed_by?: string | null
          reason?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          target_user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          granted: boolean
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          granted?: boolean
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          granted?: boolean
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      can_modify_role: {
        Args: {
          _admin_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _target_user_id: string
        }
        Returns: boolean
      }
      generate_invoice_number: { Args: never; Returns: string }
      get_admin_count: { Args: never; Returns: number }
      get_super_admin_count: { Args: never; Returns: number }
      get_user_permissions: {
        Args: { _user_id: string }
        Returns: {
          action: string
          description: string
          permission_name: string
          resource: string
        }[]
      }
      has_permission: {
        Args: { _permission_name: string; _user_id: string }
        Returns: boolean
      }
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
      app_role: "admin" | "manager" | "creator" | "super_admin"
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
      app_role: ["admin", "manager", "creator", "super_admin"],
      support_ticket_status: ["open", "in_progress", "resolved"],
    },
  },
} as const
