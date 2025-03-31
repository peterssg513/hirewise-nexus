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
          district_size: number | null
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          location: string | null
          meeting_date: string | null
          meeting_scheduled: boolean | null
          name: string
          signup_completed: boolean | null
          signup_progress:
            | Database["public"]["Enums"]["district_signup_status"]
            | null
          state: string | null
          status: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          district_size?: number | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          meeting_date?: string | null
          meeting_scheduled?: boolean | null
          name: string
          signup_completed?: boolean | null
          signup_progress?:
            | Database["public"]["Enums"]["district_signup_status"]
            | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          district_size?: number | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          meeting_date?: string | null
          meeting_scheduled?: boolean | null
          name?: string
          signup_completed?: boolean | null
          signup_progress?:
            | Database["public"]["Enums"]["district_signup_status"]
            | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      evaluation_requests: {
        Row: {
          age: number | null
          created_at: string
          date_of_birth: string | null
          district_id: string | null
          general_education_teacher: string | null
          grade: string | null
          id: string
          legal_name: string | null
          other_relevant_info: string | null
          parents: string | null
          school_id: string | null
          service_type: string | null
          special_education_teachers: string | null
          status: string | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          date_of_birth?: string | null
          district_id?: string | null
          general_education_teacher?: string | null
          grade?: string | null
          id?: string
          legal_name?: string | null
          other_relevant_info?: string | null
          parents?: string | null
          school_id?: string | null
          service_type?: string | null
          special_education_teachers?: string | null
          status?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          date_of_birth?: string | null
          district_id?: string | null
          general_education_teacher?: string | null
          grade?: string | null
          id?: string
          legal_name?: string | null
          other_relevant_info?: string | null
          parents?: string | null
          school_id?: string | null
          service_type?: string | null
          special_education_teachers?: string | null
          status?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_requests_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "active_jobs_with_district"
            referencedColumns: ["district_id"]
          },
          {
            foreignKeyName: "evaluation_requests_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_requests_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          application_id: string
          approved_at: string | null
          created_at: string
          form_data: Json | null
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
          form_data?: Json | null
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
          form_data?: Json | null
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
          benefits: string[] | null
          city: string | null
          country: string | null
          created_at: string
          description: string
          district_id: string
          documents_required: string[] | null
          id: string
          job_type: string | null
          location: string | null
          qualifications: string[] | null
          salary: number | null
          school_id: string | null
          skills_required: string[] | null
          state: string | null
          status: string | null
          timeframe: string | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          description: string
          district_id: string
          documents_required?: string[] | null
          id?: string
          job_type?: string | null
          location?: string | null
          qualifications?: string[] | null
          salary?: number | null
          school_id?: string | null
          skills_required?: string[] | null
          state?: string | null
          status?: string | null
          timeframe?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string
          district_id?: string
          documents_required?: string[] | null
          id?: string
          job_type?: string | null
          location?: string | null
          qualifications?: string[] | null
          salary?: number | null
          school_id?: string | null
          skills_required?: string[] | null
          state?: string | null
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
          {
            foreignKeyName: "jobs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
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
          address: string | null
          availability: string | null
          certification_details: Json | null
          certifications: string[] | null
          city: string | null
          created_at: string
          desired_locations: string[] | null
          education: string | null
          evaluation_types: string[] | null
          experience: string | null
          experience_years: number | null
          id: string
          open_to_relocation: boolean | null
          phone_number: string | null
          profile_picture_url: string | null
          signup_completed: boolean | null
          signup_progress: number | null
          specialties: string[] | null
          state: string | null
          status: string | null
          updated_at: string
          user_id: string
          work_types: string[] | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          availability?: string | null
          certification_details?: Json | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string
          desired_locations?: string[] | null
          education?: string | null
          evaluation_types?: string[] | null
          experience?: string | null
          experience_years?: number | null
          id?: string
          open_to_relocation?: boolean | null
          phone_number?: string | null
          profile_picture_url?: string | null
          signup_completed?: boolean | null
          signup_progress?: number | null
          specialties?: string[] | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          work_types?: string[] | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          availability?: string | null
          certification_details?: Json | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string
          desired_locations?: string[] | null
          education?: string | null
          evaluation_types?: string[] | null
          experience?: string | null
          experience_years?: number | null
          id?: string
          open_to_relocation?: boolean | null
          phone_number?: string | null
          profile_picture_url?: string | null
          signup_completed?: boolean | null
          signup_progress?: number | null
          specialties?: string[] | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          work_types?: string[] | null
          zip_code?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          city: string | null
          created_at: string
          district_id: string
          enrollment_size: number | null
          id: string
          name: string
          state: string | null
          street: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          district_id: string
          enrollment_size?: number | null
          id?: string
          name: string
          state?: string | null
          street?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          district_id?: string
          enrollment_size?: number | null
          id?: string
          name?: string
          state?: string | null
          street?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "active_jobs_with_district"
            referencedColumns: ["district_id"]
          },
          {
            foreignKeyName: "schools_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          current_teacher: string | null
          district_id: string | null
          first_name: string
          grade: string | null
          id: string
          last_name: string
          parent_guardian1_email: string | null
          parent_guardian1_name: string | null
          parent_guardian1_phone: string | null
          parent_guardian2_email: string | null
          parent_guardian2_name: string | null
          parent_guardian2_phone: string | null
          school_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_teacher?: string | null
          district_id?: string | null
          first_name: string
          grade?: string | null
          id?: string
          last_name: string
          parent_guardian1_email?: string | null
          parent_guardian1_name?: string | null
          parent_guardian1_phone?: string | null
          parent_guardian2_email?: string | null
          parent_guardian2_name?: string | null
          parent_guardian2_phone?: string | null
          school_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_teacher?: string | null
          district_id?: string | null
          first_name?: string
          grade?: string | null
          id?: string
          last_name?: string
          parent_guardian1_email?: string | null
          parent_guardian1_name?: string | null
          parent_guardian1_phone?: string | null
          parent_guardian2_email?: string | null
          parent_guardian2_name?: string | null
          parent_guardian2_phone?: string | null
          school_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "active_jobs_with_district"
            referencedColumns: ["district_id"]
          },
          {
            foreignKeyName: "students_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
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
      add_form_data_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
      get_column_info: {
        Args: {
          table_name: string
          column_name: string
        }
        Returns: {
          table_catalog: string
          table_schema: string
          table_name: string
          column_name: string
          data_type: string
        }[]
      }
      log_analytics_event: {
        Args: {
          _event_type: string
          _event_data: Json
        }
        Returns: string
      }
      setup_column_check_function: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      district_signup_status: "basic_info" | "meeting" | "profile" | "completed"
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
