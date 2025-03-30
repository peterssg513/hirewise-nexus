export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          created_at: string
          documents_urls: string[] | null
          id: string
          job_id: string
          notes: string | null
          psychologist_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          documents_urls?: string[] | null
          id?: string
          job_id: string
          notes?: string | null
          psychologist_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          documents_urls?: string[] | null
          id?: string
          job_id?: string
          notes?: string | null
          psychologist_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "active_jobs_with_district"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologists"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      evaluations: {
        Row: {
          application_id: string
          approved_at: string | null
          created_at: string
          id: string
          report_url: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          application_id: string
          approved_at?: string | null
          created_at?: string
          id?: string
          report_url?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          approved_at?: string | null
          created_at?: string
          id?: string
          report_url?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string
          description: string
          district_id: string
          documents_required: string[] | null
          id: string
          location: string | null
          skills_required: string[] | null
          status: string | null
          timeframe: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          district_id: string
          documents_required?: string[] | null
          id?: string
          location?: string | null
          skills_required?: string[] | null
          status?: string | null
          timeframe?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          district_id?: string
          documents_required?: string[] | null
          id?: string
          location?: string | null
          skills_required?: string[] | null
          status?: string | null
          timeframe?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "active_jobs_with_district"
            referencedColumns: ["district_id"]
          },
          {
            foreignKeyName: "jobs_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      psychologists: {
        Row: {
          availability: string | null
          certifications: string[] | null
          created_at: string
          education: string | null
          experience_years: number | null
          id: string
          specialties: string[] | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          certifications?: string[] | null
          created_at?: string
          education?: string | null
          experience_years?: number | null
          id?: string
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          certifications?: string[] | null
          created_at?: string
          education?: string | null
          experience_years?: number | null
          id?: string
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_jobs_with_district: {
        Row: {
          created_at: string | null
          description: string | null
          district_id: string | null
          district_location: string | null
          district_name: string | null
          id: string | null
          location: string | null
          skills_required: string[] | null
          status: string | null
          timeframe: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_to_job: {
        Args: {
          _job_id: string
          _documents_urls?: string[]
          _notes?: string
        }
        Returns: string
      }
      approve_application: {
        Args: {
          application_id: string
        }
        Returns: string
      }
      approve_district: {
        Args: {
          district_id: string
        }
        Returns: undefined
      }
      approve_job: {
        Args: {
          job_id: string
        }
        Returns: undefined
      }
      approve_psychologist: {
        Args: {
          psychologist_id: string
        }
        Returns: undefined
      }
      log_analytics_event: {
        Args: {
          _event_type: string
          _event_data: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
