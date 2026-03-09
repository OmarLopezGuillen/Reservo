import { ROUTES } from "@/constants/ROUTES"
import { supabase } from "@/lib/supabase"

interface Props {
	email: string
}

export const resetPassword = async ({ email }: Props) => {
	const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
	const redirectTo = new URL(ROUTES.RESET_PASSWORD, appUrl).toString()

	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo,
	})
	if (error) {
		console.error("Error password change:", error.message)
		throw Error("No se pudo cambiar la contraseña")
	}

	return { data, error }
}
