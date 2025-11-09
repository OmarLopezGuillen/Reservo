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

	const { data: tenantData, error: tenantError } =
		await supabase.functions.invoke("attach-tenant", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${data.session?.access_token}`,
				"x-tenant-host": window.location.host,
			},
		})

	if (tenantError) {
		console.error("Error attaching tenant:", tenantError.message)
		throw new Error("No se pudo asociar el club.")
	}

	if (tenantData?.ok) {
		await supabase.auth.refreshSession()
	}

	return { data, error }
}
