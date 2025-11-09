import { supabase } from "@/lib/supabase"

interface Props {
	email: string
	password: string
}

export async function signUp({ email, password }: Props) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	})

	if (error) {
		console.error("Error logging out:", error.message)
		throw Error("No se pudo iniciar sessión")
	}

	return { data, error }
}
