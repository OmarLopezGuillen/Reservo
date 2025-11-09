import * as z from "zod"

export const loginFormSchema = z.object({
	email: z
		.email({ message: "El email no es válido" })
		.min(1, "El email es obligatorio"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>
