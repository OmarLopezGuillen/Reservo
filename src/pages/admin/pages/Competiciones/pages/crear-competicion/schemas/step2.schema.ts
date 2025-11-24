import { z } from "zod"
import { CompetitionRoundTypeConst, PlayoffTypeConst } from "@/models/dbTypes"

export const step2Schema = z
	.object({
		// General
		maxTeamsPerCategory: z.coerce
			.number()
			.min(2, "Debe haber al menos 2 equipos"),
		pointsWin: z.coerce.number().min(0),
		pointsDraw: z.coerce.number().min(0),
		pointsLoss: z.coerce.number().min(0),
		allowDraws: z.boolean().default(true),

		// League specific
		roundType: z
			.enum(CompetitionRoundTypeConst as unknown as [string, ...string[]], {
				message: "Selecciona el tipo de ronda.",
			})
			.optional(),

		minAvailabilityDays: z.coerce
			.number()
			.min(1, "Mínimo 1 día")
			.max(7, "Máximo 7 días")
			.optional(),
		minAvailabilityHoursPerDay: z.coerce
			.number()
			.min(1, "Mínimo 1 hora")
			.max(24, "Máximo 24 horas")
			.optional(),

		// Playoff specific
		hasPlayoff: z.boolean().default(false),
		playoffTeams: z.coerce.number().optional(),
		playoffType: z
			.enum(PlayoffTypeConst as unknown as [string, ...string[]], {
				message: "Selecciona el tipo de playoff.",
			})
			.optional(),
	})
	.superRefine((data, ctx) => {
		if (data.hasPlayoff && !data.playoffTeams) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Debes seleccionar el número de equipos para el playoff.",
				path: ["playoffTeams"],
			})
		}
		if (data.hasPlayoff && !data.playoffType) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Debes seleccionar el tipo de playoff.",
				path: ["playoffType"],
			})
		}
	})

export type Step2Data = z.infer<typeof step2Schema>
