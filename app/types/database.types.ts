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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      forms: {
        Row: {
          assigned_to: Json
          created_at: string | null
          created_by: string
          description: string | null
          fields: Json
          id: string
          is_active: boolean
          title: string
          type: Database["public"]["Enums"]["form_type"]
          updated_at: string | null
        }
        Insert: {
          assigned_to?: Json
          created_at?: string | null
          created_by: string
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean
          title: string
          type: Database["public"]["Enums"]["form_type"]
          updated_at?: string | null
        }
        Update: {
          assigned_to?: Json
          created_at?: string | null
          created_by?: string
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean
          title?: string
          type?: Database["public"]["Enums"]["form_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      localities: {
        Row: {
          created_at: string | null
          id: string
          name: string
          zone_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          zone_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "localities_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean
          message: string
          submission_id: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          submission_id?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          submission_id?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_history: {
        Row: {
          changed_at: string | null
          changed_by: string
          id: string
          rows_snapshot: Json
          submission_id: string
          version: number
        }
        Insert: {
          changed_at?: string | null
          changed_by: string
          id?: string
          rows_snapshot?: Json
          submission_id: string
          version: number
        }
        Update: {
          changed_at?: string | null
          changed_by?: string
          id?: string
          rows_snapshot?: Json
          submission_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "submission_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_history_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_rows: {
        Row: {
          accuracy: number | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          photo_urls: Json
          row_data: Json
          row_index: number
          submission_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          photo_urls?: Json
          row_data?: Json
          row_index: number
          submission_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          photo_urls?: Json
          row_data?: Json
          row_index?: number
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_rows_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          form_id: string
          id: string
          sent_back_at: string | null
          sent_back_by: string | null
          sent_back_note: string | null
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string | null
          submitted_by: string
          version: number
        }
        Insert: {
          form_id: string
          id?: string
          sent_back_at?: string | null
          sent_back_by?: string | null
          sent_back_note?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          submitted_by: string
          version?: number
        }
        Update: {
          form_id?: string
          id?: string
          sent_back_at?: string | null
          sent_back_by?: string | null
          sent_back_note?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          submitted_by?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_sent_back_by_fkey"
            columns: ["sent_back_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_privileges: {
        Row: {
          created_at: string | null
          granted_by: string
          id: string
          privilege: Database["public"]["Enums"]["user_privilege"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          granted_by: string
          id?: string
          privilege: Database["public"]["Enums"]["user_privilege"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          granted_by?: string
          id?: string
          privilege?: Database["public"]["Enums"]["user_privilege"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_privileges_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_privileges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          locality_id: string | null
          must_change_password: boolean
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          supervisor_id: string | null
          updated_at: string | null
          username: string
          zone_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name: string
          id: string
          is_active?: boolean
          last_name: string
          locality_id?: string | null
          must_change_password?: boolean
          phone: string
          role?: Database["public"]["Enums"]["user_role"]
          supervisor_id?: string | null
          updated_at?: string | null
          username: string
          zone_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          locality_id?: string | null
          must_change_password?: boolean
          phone?: string
          role?: Database["public"]["Enums"]["user_role"]
          supervisor_id?: string | null
          updated_at?: string | null
          username?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_locality_id_fkey"
            columns: ["locality_id"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_privilege: {
        Args: { p: Database["public"]["Enums"]["user_privilege"] }
        Returns: boolean
      }
    }
    Enums: {
      form_type: "daily" | "urgent"
      notification_type: "urgent" | "sent_back" | "info"
      submission_status: "submitted" | "sent_back" | "corrected"
      user_privilege: "create_user" | "send_back" | "view_responses"
      user_role: "super_admin" | "admin" | "manager" | "superviseur" | "employe"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      form_type: ["daily", "urgent"],
      notification_type: ["urgent", "sent_back", "info"],
      submission_status: ["submitted", "sent_back", "corrected"],
      user_privilege: ["create_user", "send_back", "view_responses"],
      user_role: ["super_admin", "admin", "manager", "superviseur", "employe"],
    },
  },
} as const
