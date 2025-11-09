import { supabase } from "@/lib/supabase"

interface Props {
	email: string
	password: string
}

export const logIn = async ({ email, password }: Props) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		console.error("Error logging out:", error.message)
		throw Error("No se pudo iniciar sessión")
	}

	//TODO. A: Se tiene un error de CORS

	/* 			await fetch(`${SUPABASE_URL}/functions/v1/attach-tenant`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.session.access_token}`,
					"x-tenant-host": window.location.host,
				},
			})

			await supabase.auth.refreshSession() */

	return { data, error }
}
