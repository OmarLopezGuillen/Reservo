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
			profiles: {
				Row: {
					created_at: string
					email: string
					name: string
					phone: string | null
					user_id: string
				}
				Insert: {
					created_at?: string
					email: string
					name: string
					phone?: string | null
					user_id: string
				}
				Update: {
					created_at?: string
					email?: string
					name?: string
					phone?: string | null
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
					club_id: string
					court_id: string
					date: string
					end_time: string
					id: string
					is_mine: boolean
					start_time: string
					status: Database["public"]["Enums"]["status_booking"]
				}
				Insert: {
					club_id?: string | null
					court_id?: string | null
					date?: string | null
					end_time?: string | null
					id?: string | null
					is_mine?: never
					start_time?: string | null
					status?: Database["public"]["Enums"]["status_booking"] | null
				}
				Update: {
					club_id?: string | null
					court_id?: string | null
					date?: string | null
					end_time?: string | null
					id?: string | null
					is_mine?: never
					start_time?: string | null
					status?: Database["public"]["Enums"]["status_booking"] | null
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
		}
		Functions: {
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
			complete_finished_bookings: {
				Args: { batch_limit?: number }
				Returns: number
			}
			custom_access_token_hook: { Args: { event: Json }; Returns: Json }
			gen_checkin_code: { Args: { len?: number }; Returns: string }
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
			app_role: "admin" | "owner" | "user"
			payment_status: "pending" | "paid" | "refunded"
			position: "first" | "second"
			status_booking: "pending" | "confirmed" | "cancelled" | "completed"
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
			],
			app_role: ["admin", "owner", "user"],
			payment_status: ["pending", "paid", "refunded"],
			position: ["first", "second"],
			status_booking: ["pending", "confirmed", "cancelled", "completed"],
			type_court: ["indoor", "outdoor"],
			type_payment_mode: ["deposit", "none", "full", "both"],
			weekday: ["0", "1", "2", "3", "4", "5", "6"],
		},
	},
} as const
