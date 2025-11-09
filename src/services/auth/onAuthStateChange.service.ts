import type { AuthChangeEvent, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export const onAuthStateChange = (
	callback: (event: AuthChangeEvent, session: Session | null) => void,
) => {
	const {
		data: { subscription },
	} = supabase.auth.onAuthStateChange(callback)

	return subscription
}
