import { ROUTES } from "@/constants/ROUTES"
import { supabase } from "@/lib/supabase"

interface Props {
	email: string
}

export const resetPassword = async ({ email }: Props) => {
	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `http://localhost:5173${ROUTES.RESET_PASSWORD}`,
	})
	if (error) {
		console.error("Error password change:", error.message)
		throw Error("No se pudo cambiar la contraseña")
	}

	return { data, error }
}
