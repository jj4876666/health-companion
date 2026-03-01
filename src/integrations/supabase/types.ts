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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      allergies: {
        Row: {
          allergen: string
          allergy_type: string
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          reactions: string[] | null
          severity: string
        }
        Insert: {
          allergen: string
          allergy_type: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          reactions?: string[] | null
          severity: string
        }
        Update: {
          allergen?: string
          allergy_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          reactions?: string[] | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action_description: string
          action_type: string
          created_at: string
          facility_name: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          officer_name: string | null
          patient_id: string | null
          performed_by: string | null
        }
        Insert: {
          action_description: string
          action_type: string
          created_at?: string
          facility_name?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          officer_name?: string | null
          patient_id?: string | null
          performed_by?: string | null
        }
        Update: {
          action_description?: string
          action_type?: string
          created_at?: string
          facility_name?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          officer_name?: string | null
          patient_id?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          facility_name: string
          id: string
          is_approved: boolean | null
          patient_id: string
          requesting_officer_id: string | null
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          facility_name: string
          id?: string
          is_approved?: boolean | null
          patient_id: string
          requesting_officer_id?: string | null
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          facility_name?: string
          id?: string
          is_approved?: boolean | null
          patient_id?: string
          requesting_officer_id?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_codes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_codes_requesting_officer_id_fkey"
            columns: ["requesting_officer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          donor_id: string | null
          donor_name: string | null
          id: string
          is_public: boolean | null
          message: string | null
          payment_method: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          donor_id?: string | null
          donor_name?: string | null
          id?: string
          is_public?: boolean | null
          message?: string | null
          payment_method: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          donor_id?: string | null
          donor_name?: string | null
          id?: string
          is_public?: boolean | null
          message?: string | null
          payment_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      immunizations: {
        Row: {
          administered_by: string | null
          batch_number: string | null
          created_at: string
          date_administered: string
          facility_name: string | null
          id: string
          next_dose_date: string | null
          notes: string | null
          patient_id: string
          vaccine_name: string
        }
        Insert: {
          administered_by?: string | null
          batch_number?: string | null
          created_at?: string
          date_administered: string
          facility_name?: string | null
          id?: string
          next_dose_date?: string | null
          notes?: string | null
          patient_id: string
          vaccine_name: string
        }
        Update: {
          administered_by?: string | null
          batch_number?: string | null
          created_at?: string
          date_administered?: string
          facility_name?: string | null
          id?: string
          next_dose_date?: string | null
          notes?: string | null
          patient_id?: string
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "immunizations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          created_at: string
          data: Json | null
          description: string | null
          facility_name: string | null
          id: string
          officer_name: string | null
          patient_id: string
          record_date: string
          record_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          description?: string | null
          facility_name?: string | null
          id?: string
          officer_name?: string | null
          patient_id: string
          record_date?: string
          record_type: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          description?: string | null
          facility_name?: string | null
          id?: string
          officer_name?: string | null
          patient_id?: string
          record_date?: string
          record_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_reminders: {
        Row: {
          created_at: string
          id: string
          medication_id: string
          missed: boolean | null
          notes: string | null
          patient_id: string
          scheduled_time: string
          taken_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id: string
          missed?: boolean | null
          notes?: string | null
          patient_id: string
          scheduled_time: string
          taken_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string
          missed?: boolean | null
          notes?: string | null
          patient_id?: string
          scheduled_time?: string
          taken_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_reminders_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_reminders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          drug_name: string
          end_date: string | null
          facility_name: string | null
          frequency: string
          id: string
          is_active: boolean | null
          patient_id: string
          prescribed_by: string | null
          schedule: Json | null
          side_effects: string[] | null
          start_date: string
          updated_at: string
          warnings: string[] | null
        }
        Insert: {
          created_at?: string
          dosage: string
          drug_name: string
          end_date?: string | null
          facility_name?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          patient_id: string
          prescribed_by?: string | null
          schedule?: Json | null
          side_effects?: string[] | null
          start_date: string
          updated_at?: string
          warnings?: string[] | null
        }
        Update: {
          created_at?: string
          dosage?: string
          drug_name?: string
          end_date?: string | null
          facility_name?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          patient_id?: string
          prescribed_by?: string | null
          schedule?: Json | null
          side_effects?: string[] | null
          start_date?: string
          updated_at?: string
          warnings?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_orders: {
        Row: {
          created_at: string
          delivery_address: string | null
          emec_id: string
          id: string
          items: Json
          patient_id: string
          pharmacy_name: string
          prescription_url: string | null
          status: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_address?: string | null
          emec_id: string
          id?: string
          items: Json
          patient_id: string
          pharmacy_name: string
          prescription_url?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_address?: string | null
          emec_id?: string
          id?: string
          items?: Json
          patient_id?: string
          pharmacy_name?: string
          prescription_url?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          address: string | null
          age_category: Database["public"]["Enums"]["age_category"] | null
          avatar_url: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          emec_id: string
          emergency_contact: Json | null
          full_name: string
          gender: string | null
          height: number | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          language: string | null
          license_number: string | null
          parent_email: string | null
          parent_phone: string | null
          parent_user_id: string | null
          phone: string | null
          premium_expiry: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          account_type?: string | null
          address?: string | null
          age_category?: Database["public"]["Enums"]["age_category"] | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emec_id: string
          emergency_contact?: Json | null
          full_name: string
          gender?: string | null
          height?: number | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          language?: string | null
          license_number?: string | null
          parent_email?: string | null
          parent_phone?: string | null
          parent_user_id?: string | null
          phone?: string | null
          premium_expiry?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          account_type?: string | null
          address?: string | null
          age_category?: Database["public"]["Enums"]["age_category"] | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emec_id?: string
          emergency_contact?: Json | null
          full_name?: string
          gender?: string | null
          height?: number | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          language?: string | null
          license_number?: string | null
          parent_email?: string | null
          parent_phone?: string | null
          parent_user_id?: string | null
          phone?: string | null
          premium_expiry?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          facility_name: string | null
          facility_verified: boolean | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          facility_name?: string | null
          facility_verified?: boolean | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          facility_name?: string | null
          facility_verified?: boolean | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_emec_id: { Args: never; Returns: string }
      get_profile_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      age_category: "infant" | "child" | "teen" | "adult"
      app_role: "admin" | "parent" | "child" | "adult"
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
      age_category: ["infant", "child", "teen", "adult"],
      app_role: ["admin", "parent", "child", "adult"],
    },
  },
} as const
