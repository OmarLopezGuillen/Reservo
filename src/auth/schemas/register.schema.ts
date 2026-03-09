import { z } from "zod"
import { passwordSchema } from "@/auth/schemas/password.schema"

export const registerFormSchema = z
	.object({
		name: z.string().min(1, "El nombre es obligatorio"),
		email: z.email("El email no es válido").min(1, "El email es obligatorio"),
		phone: z.string().min(1, "El teléfono es obligatorio"),
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Debes confirmar la contraseña"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
