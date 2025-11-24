import { z } from "zod"
import { CompetitionsTypeConst } from "@/models/dbTypes"

export const step1Schema = z
	.object({
		name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
		description: z.string().optional(),

		// Enum: usa as const para tipar correctamente
		type: z.enum(CompetitionsTypeConst as unknown as [string, ...string[]], {
			message: "Selecciona el tipo de competición.",
		}),

		registrationDates: z
			.object({
				from: z.date(),
				to: z.date(),
			})
			.refine((val) => val.from && val.to, {
				message: "Selecciona un período de inscripción completo.",
			}),

		competitionDates: z
			.object({
				from: z.date(),
				to: z.date(),
			})
			.refine((val) => val.from && val.to, {
				message: "Selecciona un período de competición completo.",
			}),
	})
	.refine((data) => data.registrationDates.to > data.registrationDates.from, {
		message:
			"La fecha de fin de inscripción debe ser posterior a la de inicio.",
		path: ["registrationDates"],
	})
	.refine((data) => data.competitionDates.from > data.registrationDates.to, {
		message:
			"La competición debe empezar después de que cierren las inscripciones.",
		path: ["competitionDates"],
	})
	.refine((data) => data.competitionDates.to > data.competitionDates.from, {
		message:
			"La fecha de fin de la competición debe ser posterior a la de inicio.",
		path: ["competitionDates"],
	})

export type Step1Data = z.infer<typeof step1Schema>
