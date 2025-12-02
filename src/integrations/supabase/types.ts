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
      access_level_audit_log: {
        Row: {
          created_at: string | null
          from_level: string
          granted_by: string | null
          granted_by_role: Database["public"]["Enums"]["app_role"] | null
          id: string
          method: string | null
          reason: string | null
          to_level: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          from_level: string
          granted_by?: string | null
          granted_by_role?: Database["public"]["Enums"]["app_role"] | null
          id?: string
          method?: string | null
          reason?: string | null
          to_level: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          from_level?: string
          granted_by?: string | null
          granted_by_role?: Database["public"]["Enums"]["app_role"] | null
          id?: string
          method?: string | null
          reason?: string | null
          to_level?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          creator_id: string | null
          id: string
          title: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          creator_id?: string | null
          id?: string
          title: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          creator_id?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_templates_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          content_text: string | null
          created_at: string | null
          id: string
          item_type: string
          starter_pack_id: string
        }
        Insert: {
          content_text?: string | null
          created_at?: string | null
          id?: string
          item_type: string
          starter_pack_id: string
        }
        Update: {
          content_text?: string | null
          created_at?: string | null
          id?: string
          item_type?: string
          starter_pack_id?: string
        }
        Relationships: []
      }
      content_library: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          file_url: string | null
          id: string
          title: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          file_url?: string | null
          id?: string
          title?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title?: string | null
          type?: string
        }
        Relationships: []
      }
      content_uploads: {
        Row: {
          commitment_id: string | null
          content_category: string | null
          content_type: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_size: number | null
          file_url: string
          hashtags: string[] | null
          id: string
          is_featured: boolean | null
          length: string | null
          marketing_notes: string | null
          platform_type: string | null
          shoot_id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          uploaded_at: string | null
          usage_rights: string | null
          user_id: string
        }
        Insert: {
          commitment_id?: string | null
          content_category?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          hashtags?: string[] | null
          id?: string
          is_featured?: boolean | null
          length?: string | null
          marketing_notes?: string | null
          platform_type?: string | null
          shoot_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          usage_rights?: string | null
          user_id: string
        }
        Update: {
          commitment_id?: string | null
          content_category?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          hashtags?: string[] | null
          id?: string
          is_featured?: boolean | null
          length?: string | null
          marketing_notes?: string | null
          platform_type?: string | null
          shoot_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          usage_rights?: string | null
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
      contract_templates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          template_content: string
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          template_content: string
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          template_content?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      creator_access_levels: {
        Row: {
          access_level: string | null
          created_at: string | null
          grant_method: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          grant_method?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          grant_method?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      creator_accounts: {
        Row: {
          account_name: string | null
          category: string
          created_at: string | null
          created_by: string | null
          email: string | null
          gdrive_folder_id: string | null
          id: string
          last_verified_at: string | null
          notes: string | null
          password_encrypted: string | null
          phone: string | null
          platform_name: string
          profile_url: string | null
          purpose: string | null
          recovery_info: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          account_name?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          gdrive_folder_id?: string | null
          id?: string
          last_verified_at?: string | null
          notes?: string | null
          password_encrypted?: string | null
          phone?: string | null
          platform_name: string
          profile_url?: string | null
          purpose?: string | null
          recovery_info?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          account_name?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          gdrive_folder_id?: string | null
          id?: string
          last_verified_at?: string | null
          notes?: string | null
          password_encrypted?: string | null
          phone?: string | null
          platform_name?: string
          profile_url?: string | null
          purpose?: string | null
          recovery_info?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      creator_applications: {
        Row: {
          admin_notes: string | null
          admin_notes_history: Json | null
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
          admin_notes_history?: Json | null
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
          admin_notes_history?: Json | null
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
      creator_content_preferences: {
        Row: {
          accent_color: string | null
          created_at: string | null
          creator_id: string
          id: string
          notes: string | null
          primary_color: string | null
          sample_image_urls: string | null
          secondary_color: string | null
          updated_at: string | null
          vibe: string | null
        }
        Insert: {
          accent_color?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          notes?: string | null
          primary_color?: string | null
          sample_image_urls?: string | null
          secondary_color?: string | null
          updated_at?: string | null
          vibe?: string | null
        }
        Update: {
          accent_color?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          notes?: string | null
          primary_color?: string | null
          sample_image_urls?: string | null
          secondary_color?: string | null
          updated_at?: string | null
          vibe?: string | null
        }
        Relationships: []
      }
      creator_contracts: {
        Row: {
          contract_data: Json | null
          contract_signed: boolean | null
          contract_template_url: string | null
          contract_version: string | null
          created_at: string | null
          digital_signature_agency: string | null
          digital_signature_creator: string | null
          generated_pdf_url: string | null
          generation_status: string | null
          id: string
          signature_date: string | null
          signed_at: string | null
          signed_contract_url: string | null
          template_uploaded_at: string | null
          template_version: string | null
          updated_at: string | null
          uploaded_by: string | null
          user_id: string
        }
        Insert: {
          contract_data?: Json | null
          contract_signed?: boolean | null
          contract_template_url?: string | null
          contract_version?: string | null
          created_at?: string | null
          digital_signature_agency?: string | null
          digital_signature_creator?: string | null
          generated_pdf_url?: string | null
          generation_status?: string | null
          id?: string
          signature_date?: string | null
          signed_at?: string | null
          signed_contract_url?: string | null
          template_uploaded_at?: string | null
          template_version?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          user_id: string
        }
        Update: {
          contract_data?: Json | null
          contract_signed?: boolean | null
          contract_template_url?: string | null
          contract_version?: string | null
          created_at?: string | null
          digital_signature_agency?: string | null
          digital_signature_creator?: string | null
          generated_pdf_url?: string | null
          generation_status?: string | null
          id?: string
          signature_date?: string | null
          signed_at?: string | null
          signed_contract_url?: string | null
          template_uploaded_at?: string | null
          template_version?: string | null
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
      creator_gdrive_folders: {
        Row: {
          accounts_folder_id: string | null
          content_folder_id: string | null
          contracts_folder_id: string | null
          created_at: string | null
          id: string
          invoices_folder_id: string | null
          last_sync_at: string | null
          meeting_notes_folder_id: string | null
          profile_docs_folder_id: string | null
          root_folder_id: string
          root_folder_url: string
          sync_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accounts_folder_id?: string | null
          content_folder_id?: string | null
          contracts_folder_id?: string | null
          created_at?: string | null
          id?: string
          invoices_folder_id?: string | null
          last_sync_at?: string | null
          meeting_notes_folder_id?: string | null
          profile_docs_folder_id?: string | null
          root_folder_id: string
          root_folder_url: string
          sync_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accounts_folder_id?: string | null
          content_folder_id?: string | null
          contracts_folder_id?: string | null
          created_at?: string | null
          id?: string
          invoices_folder_id?: string | null
          last_sync_at?: string | null
          meeting_notes_folder_id?: string | null
          profile_docs_folder_id?: string | null
          root_folder_id?: string
          root_folder_url?: string
          sync_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      creator_meetings: {
        Row: {
          action_items: Json | null
          application_id: string | null
          assigned_manager_id: string | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_recurring: boolean | null
          meeting_agenda: string | null
          meeting_date: string | null
          meeting_link: string | null
          meeting_location: string | null
          meeting_notes: string | null
          meeting_purpose: string | null
          meeting_time: string | null
          meeting_type: string | null
          parent_meeting_id: string | null
          participant_user_id: string | null
          previous_meeting_date: string | null
          previous_meeting_time: string | null
          priority: string | null
          recurrence_pattern: string | null
          reschedule_new_date: string | null
          reschedule_new_time: string | null
          reschedule_reason: string | null
          reschedule_requested: boolean | null
          reschedule_requested_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_items?: Json | null
          application_id?: string | null
          assigned_manager_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_recurring?: boolean | null
          meeting_agenda?: string | null
          meeting_date?: string | null
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_notes?: string | null
          meeting_purpose?: string | null
          meeting_time?: string | null
          meeting_type?: string | null
          parent_meeting_id?: string | null
          participant_user_id?: string | null
          previous_meeting_date?: string | null
          previous_meeting_time?: string | null
          priority?: string | null
          recurrence_pattern?: string | null
          reschedule_new_date?: string | null
          reschedule_new_time?: string | null
          reschedule_reason?: string | null
          reschedule_requested?: boolean | null
          reschedule_requested_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_items?: Json | null
          application_id?: string | null
          assigned_manager_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_recurring?: boolean | null
          meeting_agenda?: string | null
          meeting_date?: string | null
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_notes?: string | null
          meeting_purpose?: string | null
          meeting_time?: string | null
          meeting_type?: string | null
          parent_meeting_id?: string | null
          participant_user_id?: string | null
          previous_meeting_date?: string | null
          previous_meeting_time?: string | null
          priority?: string | null
          recurrence_pattern?: string | null
          reschedule_new_date?: string | null
          reschedule_new_time?: string | null
          reschedule_reason?: string | null
          reschedule_requested?: boolean | null
          reschedule_requested_at?: string | null
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
          {
            foreignKeyName: "creator_meetings_parent_meeting_id_fkey"
            columns: ["parent_meeting_id"]
            isOneToOne: false
            referencedRelation: "creator_meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assigned_manager"
            columns: ["assigned_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          application_id: string | null
          created_at: string
          email_data: Json | null
          email_type: string
          error_message: string | null
          failed_at: string | null
          id: string
          last_retry_at: string | null
          link_clicked_at: string | null
          link_used_at: string | null
          max_retries: number
          password_reset_expires_at: string | null
          recipient_email: string
          recipient_name: string | null
          retry_count: number
          sent_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          email_data?: Json | null
          email_type: string
          error_message?: string | null
          failed_at?: string | null
          id?: string
          last_retry_at?: string | null
          link_clicked_at?: string | null
          link_used_at?: string | null
          max_retries?: number
          password_reset_expires_at?: string | null
          recipient_email: string
          recipient_name?: string | null
          retry_count?: number
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string
          email_data?: Json | null
          email_type?: string
          error_message?: string | null
          failed_at?: string | null
          id?: string
          last_retry_at?: string | null
          link_clicked_at?: string | null
          link_used_at?: string | null
          max_retries?: number
          password_reset_expires_at?: string | null
          recipient_email?: string
          recipient_name?: string | null
          retry_count?: number
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "creator_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      external_api_keys: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_preview: string | null
          label: string
          last_used_at: string | null
          revoked_at: string | null
          revoked_by: string | null
          scope: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_preview?: string | null
          label: string
          last_used_at?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          scope?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_preview?: string | null
          label?: string
          last_used_at?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          scope?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_api_keys_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fastcast_content_settings: {
        Row: {
          bb_api_url: string | null
          created_at: string | null
          external_api_key: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bb_api_url?: string | null
          created_at?: string | null
          external_api_key?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bb_api_url?: string | null
          created_at?: string | null
          external_api_key?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gdrive_file_syncs: {
        Row: {
          created_at: string | null
          error_message: string | null
          file_type: string | null
          gdrive_file_id: string
          gdrive_file_url: string | null
          gdrive_folder_id: string
          id: string
          last_synced_at: string | null
          source_bucket: string
          source_file_name: string
          source_path: string
          sync_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          file_type?: string | null
          gdrive_file_id: string
          gdrive_file_url?: string | null
          gdrive_folder_id: string
          id?: string
          last_synced_at?: string | null
          source_bucket: string
          source_file_name: string
          source_path: string
          sync_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          file_type?: string | null
          gdrive_file_id?: string
          gdrive_file_url?: string | null
          gdrive_folder_id?: string
          id?: string
          last_synced_at?: string | null
          source_bucket?: string
          source_file_name?: string
          source_path?: string
          sync_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      google_drive_connections: {
        Row: {
          access_token: string
          created_at: string | null
          folder_id: string | null
          id: string
          last_sync_at: string | null
          refresh_token: string
          sync_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          folder_id?: string | null
          id?: string
          last_sync_at?: string | null
          refresh_token: string
          sync_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          folder_id?: string | null
          id?: string
          last_sync_at?: string | null
          refresh_token?: string
          sync_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invitation_tokens: {
        Row: {
          application_id: string | null
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          application_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_tokens_application_id_fkey"
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
      marketing_hooks: {
        Row: {
          created_at: string | null
          created_by: string | null
          creator_id: string | null
          engagement_rate: number | null
          hook_text: string
          id: string
          is_trending: boolean | null
          platform: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          creator_id?: string | null
          engagement_rate?: number | null
          hook_text: string
          id?: string
          is_trending?: boolean | null
          platform?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          creator_id?: string | null
          engagement_rate?: number | null
          hook_text?: string
          id?: string
          is_trending?: boolean | null
          platform?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_hooks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_hooks_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_history: {
        Row: {
          created_at: string
          description: string
          id: string
          is_read: boolean
          notification_type: string
          priority: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_read?: boolean
          notification_type: string
          priority?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_read?: boolean
          notification_type?: string
          priority?: string
          read_at?: string | null
          title?: string
          user_id?: string
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
          section_brand_alignment: Json | null
          section_creative_boundaries: Json | null
          section_creator_story: Json | null
          section_engagement_style: Json | null
          section_fan_expectations: Json | null
          section_fetish_interests: Json | null
          section_market_positioning: Json | null
          section_visual_identity: Json | null
          social_instagram: string | null
          social_telegram: string | null
          social_tiktok: string | null
          social_twitter: string | null
          social_youtube: string | null
          step1_private_info: Json | null
          step10_commitments: Json | null
          step11_commitments: Json | null
          step2_body_info: Json | null
          step2_brand_identity: Json | null
          step3_amsterdam_story: Json | null
          step4_persona: Json | null
          step5_boundaries: Json | null
          step6_pricing: Json | null
          step7_messaging: Json | null
          step8_content_preferences: Json | null
          step8_socials: Json | null
          step9_market_positioning: Json | null
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
          section_brand_alignment?: Json | null
          section_creative_boundaries?: Json | null
          section_creator_story?: Json | null
          section_engagement_style?: Json | null
          section_fan_expectations?: Json | null
          section_fetish_interests?: Json | null
          section_market_positioning?: Json | null
          section_visual_identity?: Json | null
          social_instagram?: string | null
          social_telegram?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          step1_private_info?: Json | null
          step10_commitments?: Json | null
          step11_commitments?: Json | null
          step2_body_info?: Json | null
          step2_brand_identity?: Json | null
          step3_amsterdam_story?: Json | null
          step4_persona?: Json | null
          step5_boundaries?: Json | null
          step6_pricing?: Json | null
          step7_messaging?: Json | null
          step8_content_preferences?: Json | null
          step8_socials?: Json | null
          step9_market_positioning?: Json | null
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
          section_brand_alignment?: Json | null
          section_creative_boundaries?: Json | null
          section_creator_story?: Json | null
          section_engagement_style?: Json | null
          section_fan_expectations?: Json | null
          section_fetish_interests?: Json | null
          section_market_positioning?: Json | null
          section_visual_identity?: Json | null
          social_instagram?: string | null
          social_telegram?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          step1_private_info?: Json | null
          step10_commitments?: Json | null
          step11_commitments?: Json | null
          step2_body_info?: Json | null
          step2_brand_identity?: Json | null
          step3_amsterdam_story?: Json | null
          step4_persona?: Json | null
          step5_boundaries?: Json | null
          step6_pricing?: Json | null
          step7_messaging?: Json | null
          step8_content_preferences?: Json | null
          step8_socials?: Json | null
          step9_market_positioning?: Json | null
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
      ppv_scripts: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          creator_id: string
          id: string
          is_approved: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          creator_id: string
          id?: string
          is_approved?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          creator_id?: string
          id?: string
          is_approved?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ppv_scripts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ppv_scripts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      production_fix_history: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          created_at: string | null
          error_message: string | null
          fix_applied: string
          id: string
          issue_description: string
          issue_type: string
          rollback_data: Json | null
          success: boolean | null
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string | null
          error_message?: string | null
          fix_applied: string
          id?: string
          issue_description: string
          issue_type: string
          rollback_data?: Json | null
          success?: boolean | null
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string | null
          error_message?: string | null
          fix_applied?: string
          id?: string
          issue_description?: string
          issue_type?: string
          rollback_data?: Json | null
          success?: boolean | null
        }
        Relationships: []
      }
      production_test_status: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          status: string
          test_category: string
          test_item: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status: string
          test_category: string
          test_item: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          test_category?: string
          test_item?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assigned_manager_id: string | null
          created_at: string | null
          creator_status: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          profile_picture_url: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_manager_id?: string | null
          created_at?: string | null
          creator_status?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_manager_id?: string | null
          created_at?: string | null
          creator_status?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
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
      shoot_participants: {
        Row: {
          created_at: string | null
          id: string
          invited_at: string | null
          notified_at: string | null
          responded_at: string | null
          response_status: string | null
          role: string | null
          shoot_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          notified_at?: string | null
          responded_at?: string | null
          response_status?: string | null
          role?: string | null
          shoot_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          notified_at?: string | null
          responded_at?: string | null
          response_status?: string | null
          role?: string | null
          shoot_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shoot_participants_shoot_id_fkey"
            columns: ["shoot_id"]
            isOneToOne: false
            referencedRelation: "studio_shoots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shoot_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      starter_packs: {
        Row: {
          created_at: string | null
          creator_id: string
          id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          id?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      studio_shoots: {
        Row: {
          budget: number | null
          created_at: string
          created_by_user_id: string | null
          crew_size: number | null
          description: string | null
          duration_hours: number | null
          equipment_needed: string | null
          id: string
          location: string | null
          marketing_notes: string | null
          notes: string | null
          photo_staff_name: string | null
          shoot_date: string
          shoot_type: string | null
          special_requirements: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
          video_staff_name: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by_user_id?: string | null
          crew_size?: number | null
          description?: string | null
          duration_hours?: number | null
          equipment_needed?: string | null
          id?: string
          location?: string | null
          marketing_notes?: string | null
          notes?: string | null
          photo_staff_name?: string | null
          shoot_date: string
          shoot_type?: string | null
          special_requirements?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          video_staff_name?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by_user_id?: string | null
          crew_size?: number | null
          description?: string | null
          duration_hours?: number | null
          equipment_needed?: string | null
          id?: string
          location?: string | null
          marketing_notes?: string | null
          notes?: string | null
          photo_staff_name?: string | null
          shoot_date?: string
          shoot_type?: string | null
          special_requirements?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_staff_name?: string | null
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
      sync_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          file_id: string
          id: string
          status: string
          sync_direction: string
          synced_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          file_id: string
          id?: string
          status?: string
          sync_direction: string
          synced_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          file_id?: string
          id?: string
          status?: string
          sync_direction?: string
          synced_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team_creator_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          creator_id: string
          id: string
          is_primary: boolean | null
          notes: string | null
          team_member_id: string
          team_type: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          team_member_id: string
          team_type: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          team_member_id?: string
          team_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_creator_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_creator_assignments_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_creator_assignments_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_notes: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          creator_id: string
          id: string
          is_pinned: boolean | null
          team_type: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          creator_id: string
          id?: string
          is_pinned?: boolean | null
          team_type: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          creator_id?: string
          id?: string
          is_pinned?: boolean | null
          team_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_notes_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          read: boolean | null
          stage: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          read?: boolean | null
          stage: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          read?: boolean | null
          stage?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          created_at: string | null
          creator_id: string
          emotional_category: string | null
          file_name: string | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          updated_at: string | null
          voice_tool_sync_status: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          emotional_category?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          updated_at?: string | null
          voice_tool_sync_status?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          emotional_category?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          updated_at?: string | null
          voice_tool_sync_status?: string | null
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
          assigned_by_name: string | null
          completed_at: string | null
          content_type: string
          content_type_category: string | null
          created_at: string
          created_by_user_id: string | null
          description: string
          due_date: string | null
          estimated_time_hours: number | null
          id: string
          is_completed: boolean
          length: string | null
          marketing_notes: string | null
          notes: string | null
          priority: string | null
          revision_count: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by_name?: string | null
          completed_at?: string | null
          content_type: string
          content_type_category?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description: string
          due_date?: string | null
          estimated_time_hours?: number | null
          id?: string
          is_completed?: boolean
          length?: string | null
          marketing_notes?: string | null
          notes?: string | null
          priority?: string | null
          revision_count?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by_name?: string | null
          completed_at?: string | null
          content_type?: string
          content_type_category?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description?: string
          due_date?: string | null
          estimated_time_hours?: number | null
          id?: string
          is_completed?: boolean
          length?: string | null
          marketing_notes?: string | null
          notes?: string | null
          priority?: string | null
          revision_count?: number | null
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
      app_role:
        | "admin"
        | "manager"
        | "creator"
        | "super_admin"
        | "chatter"
        | "marketing"
        | "studio"
        | "chat_team"
        | "marketing_team"
        | "studio_team"
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
      app_role: [
        "admin",
        "manager",
        "creator",
        "super_admin",
        "chatter",
        "marketing",
        "studio",
        "chat_team",
        "marketing_team",
        "studio_team",
      ],
      support_ticket_status: ["open", "in_progress", "resolved"],
    },
  },
} as const
