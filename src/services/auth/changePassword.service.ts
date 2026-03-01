import { supabase } from "@/lib/supabase"

interface Props {
	password: string
}

export const changePassword = async ({ password }: Props) => {
	const { data, error } = await supabase.auth.updateUser({
		password,
	})
	if (error) {
		console.error("Error password change:", error.message)
		throw Error("No se pudo cambiar la contraseña")
	}

	return { data, error }
}
