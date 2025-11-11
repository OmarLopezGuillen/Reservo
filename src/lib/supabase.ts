import { createClient } from "@supabase/supabase-js"
import { requiredEnv } from "@/lib/utils"
import type { Database } from "@/services/types/database"

const SUPABASE_URL = requiredEnv(
	"VITE_SUPABASE_URL",
	import.meta.env.VITE_SUPABASE_URL,
)
const SUPABASE_ANON_KEY = requiredEnv(
	"VITE_SUPABASE_PUBLISHABLE_KEY",
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)

export const supabase = createClient<Database>(
	SUPABASE_URL,
	SUPABASE_ANON_KEY,
	{
		auth: {
			persistSession: true, // guarda sesión en storage
			autoRefreshToken: true, // refresca tokens automáticamente
			detectSessionInUrl: true, // maneja redirects OAuth
		},
	},
)
