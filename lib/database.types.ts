// Auto-generated types from Supabase schema
// Re-run: npx supabase gen types typescript --project-id YOUR_ID > lib/database.types.ts

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          display_name: string
          bio: string | null
          avatar_url: string | null
          cover_color_1: string
          cover_color_2: string
          accent_color: string
          theme: string
          is_published: boolean
          views: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at' | 'views'> & { id?: string }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      links: {
        Row: {
          id: string
          profile_id: string
          title: string
          url: string
          subtitle: string | null
          icon: string
          type: string
          is_active: boolean
          click_count: number
          position: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['links']['Row'], 'id' | 'created_at' | 'click_count'> & { id?: string }
        Update: Partial<Database['public']['Tables']['links']['Insert']>
      }
      link_events: {
        Row: {
          id: string
          link_id: string
          profile_id: string
          event_type: 'click' | 'view'
          referrer: string | null
          country: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['link_events']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
