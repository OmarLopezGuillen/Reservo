import { z } from "zod"

export const passwordRequirements = [
	{
		label: "Al menos 8 caracteres",
		test: (value: string) => value.length >= 8,
	},
	{
		label: "Una letra mayúscula",
		test: (value: string) => /[A-Z]/.test(value),
	},
	{
		label: "Una letra minúscula",
		test: (value: string) => /[a-z]/.test(value),
	},
	{
		label: "Un número",
		test: (value: string) => /[0-9]/.test(value),
	},
	{
		label: "Un carácter especial",
		test: (value: string) => /[^A-Za-z0-9]/.test(value),
	},
] as const

export const passwordSchema = z
	.string()
	.min(8, "La contraseña debe tener al menos 8 caracteres")
	.regex(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula")
	.regex(/[a-z]/, "La contraseña debe incluir al menos una letra minúscula")
	.regex(/[0-9]/, "La contraseña debe incluir al menos un número")
	.regex(
		/[^A-Za-z0-9]/,
		"La contraseña debe incluir al menos un carácter especial",
	)
