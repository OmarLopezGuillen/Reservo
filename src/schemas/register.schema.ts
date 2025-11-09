import z from "zod"

export const registerFormSchema = z
	.object({
		name: z.string().min(1, "El nombre es obligatorio"),
		email: z.email("El email no es válido").min(1, "El email es obligatorio"),
		phone: z.string().optional(),
		password: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
		confirmPassword: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
