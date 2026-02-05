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
      bookings: {
        Row: {
          accepts_maketing: boolean
          accepts_whatsup: boolean
          check_in_code: string
          club_id: string
          court_id: string
          created_at: string
          date: string
          deposit_percentage: number
          end_time: string
          id: string
          note: string | null
          payment_mode: Database["public"]["Enums"]["type_payment_mode"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          price: number
          start_time: string
          status: Database["public"]["Enums"]["status_booking"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accepts_maketing: boolean
          accepts_whatsup: boolean
          check_in_code?: string
          club_id: string
          court_id: string
          created_at?: string
          date: string
          deposit_percentage: number
          end_time: string
          id?: string
          note?: string | null
          payment_mode: Database["public"]["Enums"]["type_payment_mode"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          price: number
          start_time: string
          status: Database["public"]["Enums"]["status_booking"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accepts_maketing?: boolean
          accepts_whatsup?: boolean
          check_in_code?: string
          club_id?: string
          court_id?: string
          created_at?: string
          date?: string
          deposit_percentage?: number
          end_time?: string
          id?: string
          note?: string | null
          payment_mode?: Database["public"]["Enums"]["type_payment_mode"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          price?: number
          start_time?: string
          status?: Database["public"]["Enums"]["status_booking"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          body: string
          created_at: string
          edited_at: string | null
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          edited_at?: string | null
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      chat_thread_members: {
        Row: {
          joined_at: string
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          role?: string
          thread_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_thread_members_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          club_id: string
          created_at: string
          created_by: string
          id: string
          match_id: string
          name: string
          needs_admin_attention: boolean
          needs_admin_attention_at: string | null
          needs_admin_attention_by: string | null
          needs_admin_attention_message_id: string | null
        }
        Insert: {
          club_id: string
          created_at?: string
          created_by: string
          id?: string
          match_id: string
          name: string
          needs_admin_attention?: boolean
          needs_admin_attention_at?: string | null
          needs_admin_attention_by?: string | null
          needs_admin_attention_message_id?: string | null
        }
        Update: {
          club_id?: string
          created_at?: string
          created_by?: string
          id?: string
          match_id?: string
          name?: string
          needs_admin_attention?: boolean
          needs_admin_attention_at?: string | null
          needs_admin_attention_by?: string | null
          needs_admin_attention_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_threads_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_threads_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      club_hours: {
        Row: {
          close_time: string | null
          club_id: string
          created_at: string
          id: string
          is_open: boolean
          open_time: string | null
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          close_time?: string | null
          club_id?: string
          created_at?: string
          id?: string
          is_open: boolean
          open_time?: string | null
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          close_time?: string | null
          club_id?: string
          created_at?: string
          id?: string
          is_open?: boolean
          open_time?: string | null
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "club_hours_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          address: string
          cancel_hours_before: number
          cancellation_block_hours: number
          created_at: string
          currency: string
          deposit_percentage: number
          domain: string
          email: string
          id: string
          name: string
          payment_mode: Database["public"]["Enums"]["type_payment_mode"]
          penalty_percentage: number
          phone: string
          timezone: string
          whatsapp_number: string
        }
        Insert: {
          address: string
          cancel_hours_before: number
          cancellation_block_hours: number
          created_at?: string
          currency: string
          deposit_percentage: number
          domain: string
          email: string
          id?: string
          name: string
          payment_mode: Database["public"]["Enums"]["type_payment_mode"]
          penalty_percentage: number
          phone: string
          timezone: string
          whatsapp_number: string
        }
        Update: {
          address?: string
          cancel_hours_before?: number
          cancellation_block_hours?: number
          created_at?: string
          currency?: string
          deposit_percentage?: number
          domain?: string
          email?: string
          id?: string
          name?: string
          payment_mode?: Database["public"]["Enums"]["type_payment_mode"]
          penalty_percentage?: number
          phone?: string
          timezone?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      competition_categories: {
        Row: {
          competition_id: string
          created_at: string
          description: string | null
          id: string
          max_teams: number | null
          name: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          description?: string | null
          id?: string
          max_teams?: number | null
          name: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          description?: string | null
          id?: string
          max_teams?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_categories_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_participants: {
        Row: {
          competition_categories_id: string
          competition_id: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          rules_accepted_at: string
          status: Database["public"]["Enums"]["status_registration"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          competition_categories_id: string
          competition_id: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          rules_accepted_at: string
          status: Database["public"]["Enums"]["status_registration"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          competition_categories_id?: string
          competition_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          rules_accepted_at?: string
          status?: Database["public"]["Enums"]["status_registration"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_participants_competition_categories_id_fkey"
            columns: ["competition_categories_id"]
            isOneToOne: false
            referencedRelation: "competition_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_participants_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_rule_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          type: Database["public"]["Enums"]["competitions_type"]
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          type: Database["public"]["Enums"]["competitions_type"]
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          type?: Database["public"]["Enums"]["competitions_type"]
        }
        Relationships: []
      }
      competition_rules: {
        Row: {
          competition_id: string
          content: string
          created_at: string
          id: string
          template_id: string | null
          updated_at: string | null
          version: number
        }
        Insert: {
          competition_id: string
          content: string
          created_at?: string
          id?: string
          template_id?: string | null
          updated_at?: string | null
          version?: number
        }
        Update: {
          competition_id?: string
          content?: string
          created_at?: string
          id?: string
          template_id?: string | null
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "competition_rules_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "competition_rule_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_team_invites: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          role: Database["public"]["Enums"]["member_team_role"]
          status: Database["public"]["Enums"]["status_invitation"]
          team_id: string
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          role: Database["public"]["Enums"]["member_team_role"]
          status?: Database["public"]["Enums"]["status_invitation"]
          team_id: string
          token: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["member_team_role"]
          status?: Database["public"]["Enums"]["status_invitation"]
          team_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "competition_team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_team_members: {
        Row: {
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["member_team_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role: Database["public"]["Enums"]["member_team_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["member_team_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "competition_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_team_members_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      competition_teams: {
        Row: {
          category_id: string
          competition_id: string
          created_at: string
          created_by: string
          id: string
          name: string
          rules_accepted_at: string
          status: Database["public"]["Enums"]["status_registration"]
        }
        Insert: {
          category_id: string
          competition_id: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          rules_accepted_at?: string
          status: Database["public"]["Enums"]["status_registration"]
        }
        Update: {
          category_id?: string
          competition_id?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          rules_accepted_at?: string
          status?: Database["public"]["Enums"]["status_registration"]
        }
        Relationships: [
          {
            foreignKeyName: "competition_teams_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "competition_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_teams_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          allow_draws: boolean
          club_id: string
          created_at: string
          description: string | null
          end_date: string
          has_playoff: boolean
          id: string
          max_teams_per_category: number
          min_availability_days: number
          min_availability_hours_per_day: number
          name: string
          playoff_teams: number | null
          playoff_type: Database["public"]["Enums"]["playoff_type"] | null
          points_draw: number
          points_loss: number
          points_win: number
          registration_ends_at: string | null
          registration_starts_at: string | null
          round_type:
            | Database["public"]["Enums"]["competition_round_type"]
            | null
          rules_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["competitions_status"]
          type: Database["public"]["Enums"]["competitions_type"]
          updated_at: string | null
        }
        Insert: {
          allow_draws?: boolean
          club_id: string
          created_at?: string
          description?: string | null
          end_date: string
          has_playoff?: boolean
          id?: string
          max_teams_per_category?: number
          min_availability_days?: number
          min_availability_hours_per_day?: number
          name: string
          playoff_teams?: number | null
          playoff_type?: Database["public"]["Enums"]["playoff_type"] | null
          points_draw?: number
          points_loss?: number
          points_win?: number
          registration_ends_at?: string | null
          registration_starts_at?: string | null
          round_type?:
            | Database["public"]["Enums"]["competition_round_type"]
            | null
          rules_id?: string | null
          start_date: string
          status: Database["public"]["Enums"]["competitions_status"]
          type: Database["public"]["Enums"]["competitions_type"]
          updated_at?: string | null
        }
        Update: {
          allow_draws?: boolean
          club_id?: string
          created_at?: string
          description?: string | null
          end_date?: string
          has_playoff?: boolean
          id?: string
          max_teams_per_category?: number
          min_availability_days?: number
          min_availability_hours_per_day?: number
          name?: string
          playoff_teams?: number | null
          playoff_type?: Database["public"]["Enums"]["playoff_type"] | null
          points_draw?: number
          points_loss?: number
          points_win?: number
          registration_ends_at?: string | null
          registration_starts_at?: string | null
          round_type?:
            | Database["public"]["Enums"]["competition_round_type"]
            | null
          rules_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["competitions_status"]
          type?: Database["public"]["Enums"]["competitions_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_rules_id_fkey"
            columns: ["rules_id"]
            isOneToOne: false
            referencedRelation: "competition_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      court_blocks: {
        Row: {
          court_id: string
          created_at: string
          end_time: string
          id: string
          match_id: string | null
          reason: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          court_id: string
          created_at?: string
          end_time: string
          id?: string
          match_id?: string | null
          reason: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          court_id?: string
          created_at?: string
          end_time?: string
          id?: string
          match_id?: string | null
          reason?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "court_blocks_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "court_blocks_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          club_id: string
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          type: Database["public"]["Enums"]["type_court"]
        }
        Insert: {
          club_id: string
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price: number
          type: Database["public"]["Enums"]["type_court"]
        }
        Update: {
          club_id?: string
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          type?: Database["public"]["Enums"]["type_court"]
        }
        Relationships: [
          {
            foreignKeyName: "court_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      match_schedule_option_votes: {
        Row: {
          option_id: string
          user_id: string
          vote: boolean
          voted_at: string
        }
        Insert: {
          option_id: string
          user_id: string
          vote: boolean
          voted_at?: string
        }
        Update: {
          option_id?: string
          user_id?: string
          vote?: boolean
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_schedule_option_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "match_schedule_proposal_options"
            referencedColumns: ["id"]
          },
        ]
      }
      match_schedule_proposal_options: {
        Row: {
          court_id: string
          created_at: string
          end_time: string
          id: string
          proposal_id: string
          start_time: string
          status: string
        }
        Insert: {
          court_id: string
          created_at?: string
          end_time: string
          id?: string
          proposal_id: string
          start_time: string
          status?: string
        }
        Update: {
          court_id?: string
          created_at?: string
          end_time?: string
          id?: string
          proposal_id?: string
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_schedule_proposal_options_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_schedule_proposal_options_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "match_schedule_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      match_schedule_proposals: {
        Row: {
          accepted_option_id: string | null
          created_at: string
          created_by: string
          id: string
          match_id: string
          resolved_at: string | null
          status: string
          thread_id: string
        }
        Insert: {
          accepted_option_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          match_id: string
          resolved_at?: string | null
          status?: string
          thread_id: string
        }
        Update: {
          accepted_option_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          match_id?: string
          resolved_at?: string | null
          status?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_schedule_proposals_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_schedule_proposals_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_team_id: string
          category_id: string
          competition_id: string
          confirmed_at: string | null
          court_id: string | null
          created_at: string
          end_time: string | null
          home_team_id: string
          id: string
          kind: Database["public"]["Enums"]["kind_matches"]
          matchday: number
          playoff_round: Database["public"]["Enums"]["playoff_round"] | null
          reported_at: string | null
          round: number
          round_week_start_date: string
          score_away: Json | null
          score_home: Json | null
          start_time: string | null
          status: Database["public"]["Enums"]["status_matches"]
          updated_at: string | null
          winner_team_id: string | null
        }
        Insert: {
          away_team_id: string
          category_id: string
          competition_id: string
          confirmed_at?: string | null
          court_id?: string | null
          created_at?: string
          end_time?: string | null
          home_team_id: string
          id?: string
          kind: Database["public"]["Enums"]["kind_matches"]
          matchday: number
          playoff_round?: Database["public"]["Enums"]["playoff_round"] | null
          reported_at?: string | null
          round: number
          round_week_start_date: string
          score_away?: Json | null
          score_home?: Json | null
          start_time?: string | null
          status: Database["public"]["Enums"]["status_matches"]
          updated_at?: string | null
          winner_team_id?: string | null
        }
        Update: {
          away_team_id?: string
          category_id?: string
          competition_id?: string
          confirmed_at?: string | null
          court_id?: string | null
          created_at?: string
          end_time?: string | null
          home_team_id?: string
          id?: string
          kind?: Database["public"]["Enums"]["kind_matches"]
          matchday?: number
          playoff_round?: Database["public"]["Enums"]["playoff_round"] | null
          reported_at?: string | null
          round?: number
          round_week_start_date?: string
          score_away?: Json | null
          score_home?: Json | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["status_matches"]
          updated_at?: string | null
          winner_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "competition_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "competition_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "competition_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "competition_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          name: string
          phone: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      team_availabilities: {
        Row: {
          created_at: string
          end_time: string
          id: string
          start_time: string
          team_id: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          team_id: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          team_id?: string
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "team_availabilities_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_availabilities_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_club_roles: {
        Row: {
          club_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          club_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          club_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_club_roles_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      bookings_calendar: {
        Row: {
          club_id: string | null
          court_id: string | null
          date: string | null
          end_time: string | null
          id: string | null
          is_mine: boolean | null
          source: string | null
          start_time: string | null
          status: string | null
        }
        Relationships: []
      }
      competition_standings: {
        Row: {
          category_id: string | null
          competition_id: string | null
          drawn: number | null
          games_against: number | null
          games_diff: number | null
          games_for: number | null
          lost: number | null
          played: number | null
          points: number | null
          position: number | null
          sets_against: number | null
          sets_diff: number | null
          sets_for: number | null
          team_id: string | null
          team_name: string | null
          won: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_teams_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "competition_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_teams_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_team_invite: { Args: { p_token: string }; Returns: Json }
      admin_create_team_with_emails: {
        Args: {
          p_category_id: string
          p_competition_id: string
          p_email_player1: string
          p_email_player2: string
          p_team_name: string
        }
        Returns: Json
      }
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      check_role: {
        Args: { role_name: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      clear_chat_thread_admin_attention: {
        Args: { p_thread_id: string }
        Returns: undefined
      }
      complete_finished_bookings: {
        Args: { batch_limit?: number }
        Returns: number
      }
      create_match_chat_thread: {
        Args: { p_match_id: string }
        Returns: string
      }
      create_match_schedule_proposal: {
        Args: { p_match_id: string; p_options: Json; p_thread_id: string }
        Returns: string
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      gen_checkin_code: { Args: { len?: number }; Returns: string }
      vote_match_schedule_option: {
        Args: { p_option_id: string; p_vote: boolean }
        Returns: Json
      }
    }
    Enums: {
      app_permission:
        | "bookings.read"
        | "bookings.create"
        | "bookings.update"
        | "bookings.delete"
        | "club_hours.read"
        | "club_hours.create"
        | "club_hours.update"
        | "club_hours.delete"
        | "clubs.read"
        | "clubs.create"
        | "clubs.update"
        | "clubs.delete"
        | "courts.read"
        | "courts.create"
        | "courts.update"
        | "courts.delete"
        | "chat_threads.read"
        | "chat_threads.create"
        | "chat_threads.update"
        | "chat_threads.delete"
      app_role: "admin" | "owner" | "user"
      competition_round_type: "single_round_robin" | "double_round_robin"
      competitions_status:
        | "draft"
        | "published"
        | "in_progress"
        | "closed"
        | "finished"
      competitions_type: "league" | "americano" | "tournament"
      kind_matches: "regular" | "playoff"
      member_team_role: "player1" | "player2" | "substitute"
      payment_status: "pending" | "paid" | "refunded"
      playoff_round: "round_of_16" | "quarterfinal" | "semifinal" | "final"
      playoff_type: "single_elimination" | "double_elimination" | "final_match"
      position: "first" | "second"
      status_booking: "pending" | "confirmed" | "cancelled" | "completed"
      status_invitation: "pending" | "accepted" | "expired"
      status_matches:
        | "pending"
        | "scheduled"
        | "played"
        | "cancelled"
        | "walkover"
      status_registration:
        | "pending"
        | "enrolled"
        | "rejected"
        | "withdrawn"
        | "completed"
      type_court: "indoor" | "outdoor"
      type_payment_mode: "deposit" | "none" | "full" | "both"
      weekday: "0" | "1" | "2" | "3" | "4" | "5" | "6"
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
      app_permission: [
        "bookings.read",
        "bookings.create",
        "bookings.update",
        "bookings.delete",
        "club_hours.read",
        "club_hours.create",
        "club_hours.update",
        "club_hours.delete",
        "clubs.read",
        "clubs.create",
        "clubs.update",
        "clubs.delete",
        "courts.read",
        "courts.create",
        "courts.update",
        "courts.delete",
        "chat_threads.read",
        "chat_threads.create",
        "chat_threads.update",
        "chat_threads.delete",
      ],
      app_role: ["admin", "owner", "user"],
      competition_round_type: ["single_round_robin", "double_round_robin"],
      competitions_status: [
        "draft",
        "published",
        "in_progress",
        "closed",
        "finished",
      ],
      competitions_type: ["league", "americano", "tournament"],
      kind_matches: ["regular", "playoff"],
      member_team_role: ["player1", "player2", "substitute"],
      payment_status: ["pending", "paid", "refunded"],
      playoff_round: ["round_of_16", "quarterfinal", "semifinal", "final"],
      playoff_type: ["single_elimination", "double_elimination", "final_match"],
      position: ["first", "second"],
      status_booking: ["pending", "confirmed", "cancelled", "completed"],
      status_invitation: ["pending", "accepted", "expired"],
      status_matches: [
        "pending",
        "scheduled",
        "played",
        "cancelled",
        "walkover",
      ],
      status_registration: [
        "pending",
        "enrolled",
        "rejected",
        "withdrawn",
        "completed",
      ],
      type_court: ["indoor", "outdoor"],
      type_payment_mode: ["deposit", "none", "full", "both"],
      weekday: ["0", "1", "2", "3", "4", "5", "6"],
    },
  },
} as const
