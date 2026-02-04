import { z } from "zod"

export interface BookingSlot {
	date: Date
	courtId: string
}

const personSchema = z.object({
	name: z.string(),
	paid: z.boolean(),
})

export const bookingFormSchema = z
	.object({
		courtId: z
			.string({
				error: "La pista seleccionada no es válida",
			})
			.min(1, "Debes seleccionar una pista"),

		duration: z.number({
			error: "La duración seleccionada no es válida",
		}),

		userName: z
			.string({
				error: "El nombre del titular es obligatorio",
			})
			.min(2, "El nombre debe tener al menos 2 caracteres"),

		userPhone: z
			.string()
			.trim()
			.optional()
			.refine(
				(val) => !val || /^[0-9+\-\s]{6,20}$/.test(val),
				"Introduce un teléfono válido",
			),

		userEmail: z
			.string()
			.trim()
			.optional()
			.refine(
				(val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
				"Introduce un correo electrónico válido",
			),

		people: z
			.array(personSchema, {
				error: "Debe haber exactamente 4 jugadores",
			})
			.length(4, "Debe haber exactamente 4 jugadores"),
	})
	.superRefine((data, ctx) => {
		if (!data.userPhone && !data.userEmail) {
			ctx.addIssue({
				code: "custom",
				message: "Debes indicar al menos un teléfono o un correo electrónico",
				path: ["userPhone"],
			})

			ctx.addIssue({
				code: "custom",
				message: "Debes indicar al menos un teléfono o un correo electrónico",
				path: ["userEmail"],
			})
		}
	})

export type BookingFormValues = z.infer<typeof bookingFormSchema>
