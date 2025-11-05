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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      car_listings: {
        Row: {
          an_fabricatie: number
          capacitate_motor: string | null
          caroserie: string | null
          categoria_vehicului: string | null
          coming_soon_position: number | null
          created_at: string
          created_by: string | null
          culoare: string | null
          cutie_viteze: string
          descriere: string | null
          descriere_en: string | null
          descriere_ro: string | null
          descriere_ru: string | null
          greutatea_masinii: number | null
          id: string
          images: string[] | null
          images_order: Json | null
          is_coming_soon: boolean | null
          is_price_negotiable: boolean
          is_top_offer: boolean | null
          kilometraj: number | null
          marca: string
          model: string
          pret: number
          pret_in_cuvinte: string | null
          pret_total: number | null
          putere: string | null
          sarcina_incarcata: number | null
          status: string | null
          tip_motor: string
          top_offer_position: number | null
          tractiune: string | null
          updated_at: string
          video_url: string | null
          vin: string | null
        }
        Insert: {
          an_fabricatie: number
          capacitate_motor?: string | null
          caroserie?: string | null
          categoria_vehicului?: string | null
          coming_soon_position?: number | null
          created_at?: string
          created_by?: string | null
          culoare?: string | null
          cutie_viteze: string
          descriere?: string | null
          descriere_en?: string | null
          descriere_ro?: string | null
          descriere_ru?: string | null
          greutatea_masinii?: number | null
          id?: string
          images?: string[] | null
          images_order?: Json | null
          is_coming_soon?: boolean | null
          is_price_negotiable?: boolean
          is_top_offer?: boolean | null
          kilometraj?: number | null
          marca: string
          model: string
          pret: number
          pret_in_cuvinte?: string | null
          pret_total?: number | null
          putere?: string | null
          sarcina_incarcata?: number | null
          status?: string | null
          tip_motor: string
          top_offer_position?: number | null
          tractiune?: string | null
          updated_at?: string
          video_url?: string | null
          vin?: string | null
        }
        Update: {
          an_fabricatie?: number
          capacitate_motor?: string | null
          caroserie?: string | null
          categoria_vehicului?: string | null
          coming_soon_position?: number | null
          created_at?: string
          created_by?: string | null
          culoare?: string | null
          cutie_viteze?: string
          descriere?: string | null
          descriere_en?: string | null
          descriere_ro?: string | null
          descriere_ru?: string | null
          greutatea_masinii?: number | null
          id?: string
          images?: string[] | null
          images_order?: Json | null
          is_coming_soon?: boolean | null
          is_price_negotiable?: boolean
          is_top_offer?: boolean | null
          kilometraj?: number | null
          marca?: string
          model?: string
          pret?: number
          pret_in_cuvinte?: string | null
          pret_total?: number | null
          putere?: string | null
          sarcina_incarcata?: number | null
          status?: string | null
          tip_motor?: string
          top_offer_position?: number | null
          tractiune?: string | null
          updated_at?: string
          video_url?: string | null
          vin?: string | null
        }
        Relationships: []
      }
      car_sales: {
        Row: {
          car_id: string
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          payment_method: string | null
          sale_date: string
          sale_price: number
          updated_at: string | null
        }
        Insert: {
          car_id: string
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          sale_date: string
          sale_price: number
          updated_at?: string | null
        }
        Update: {
          car_id?: string
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          sale_date?: string
          sale_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_sales_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_sales_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      car_views: {
        Row: {
          car_id: string
          id: string
          ip_address: unknown
          page_type: string | null
          referrer: string | null
          session_id: string | null
          viewed_at: string | null
          visitor_id: string
        }
        Insert: {
          car_id: string
          id?: string
          ip_address?: unknown
          page_type?: string | null
          referrer?: string | null
          session_id?: string | null
          viewed_at?: string | null
          visitor_id: string
        }
        Update: {
          car_id?: string
          id?: string
          ip_address?: unknown
          page_type?: string | null
          referrer?: string | null
          session_id?: string | null
          viewed_at?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_views_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      client_access_logs: {
        Row: {
          accessed_at: string
          action: string
          client_id: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accessed_at?: string
          action: string
          client_id: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accessed_at?: string
          action?: string
          client_id?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresa: string
          created_at: string
          id: string
          idnp: string
          nume_cumparator: string
          nume_prenume_cumparator: string
          telefon: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adresa: string
          created_at?: string
          id?: string
          idnp: string
          nume_cumparator: string
          nume_prenume_cumparator: string
          telefon: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adresa?: string
          created_at?: string
          id?: string
          idnp?: string
          nume_cumparator?: string
          nume_prenume_cumparator?: string
          telefon?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          car_id: string
          client_id: string
          contract_date: string
          contract_number: string
          created_at: string
          id: string
          template_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          car_id: string
          client_id: string
          contract_date: string
          contract_number: string
          created_at?: string
          id?: string
          template_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          car_id?: string
          client_id?: string
          contract_date?: string
          contract_number?: string
          created_at?: string
          id?: string
          template_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_contracts_car_id"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracts_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registration_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: []
      }
      sensitive_data_access_log: {
        Row: {
          accessed_at: string | null
          action: string
          id: string
          ip_address: unknown
          table_name: string
          user_id: string | null
        }
        Insert: {
          accessed_at?: string | null
          action: string
          id?: string
          ip_address?: unknown
          table_name: string
          user_id?: string | null
        }
        Update: {
          accessed_at?: string | null
          action?: string
          id?: string
          ip_address?: unknown
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      test_drive_requests: {
        Row: {
          car_id: string
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string
          preferred_date: string
          status: string
          updated_at: string
        }
        Insert: {
          car_id: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone: string
          preferred_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          car_id?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          preferred_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_analytics: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          page_path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          visited_at: string | null
          visitor_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          page_path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          visited_at?: string | null
          visitor_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          visited_at?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_codes: { Args: never; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_admin_for_sensitive_data: { Args: never; Returns: boolean }
      mask_sensitive_data: {
        Args: { original_text: string; show_length?: number }
        Returns: string
      }
      number_to_words_ro: { Args: { num: number }; Returns: string }
      validate_idnp_format: { Args: { idnp_value: string }; Returns: boolean }
      validate_phone_format: { Args: { phone_value: string }; Returns: boolean }
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
