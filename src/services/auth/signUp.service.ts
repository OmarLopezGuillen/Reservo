import { supabase } from "@/lib/supabase"

type SignUpOptions = {
	data?: {
		full_name?: string
		phone_number?: string
	}
}

interface Props {
	email: string
	password: string
	options?: SignUpOptions
}

export async function signUp({ email, password, options }: Props) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options,
	})

	if (error) {
		console.error("Error logging out:", error.message)
		throw Error("No se pudo iniciar sessión")
	}

	return { data, error }
}
