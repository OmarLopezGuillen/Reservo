import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { type Resolver, useForm } from "react-hook-form"
import * as z from "zod"

import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { useAjustesClubMutation } from "../../../hooks/useAjustesClubMutation"
import { useAjustesClubQuery } from "../../../hooks/useAjustesClubQuery"

export const cancellationSchema = z.object({
	cancelHoursBefore: z.coerce
		.number()
		.min(0, "Debe ser un número positivo")
		.max(24, "Máximo 24h"),

	penaltyPercentage: z.coerce
		.number()
		.min(0, "Mínimo 0")
		.max(100, "Máximo 100%"),

	cancellationBlockHours: z.coerce
		.number()
		.min(0, "Debe ser un número positivo")
		.max(24, "Máximo 24h"),
})

export type CancellationFormData = z.infer<typeof cancellationSchema>

export function useCancellationForm() {
	const user = useAuthUser()

	const { clubQuery } = useAjustesClubQuery(user.clubId)
	const { data: club, isLoading, isError } = clubQuery

	const { updateClub } = useAjustesClubMutation()

	const form = useForm<CancellationFormData>({
		resolver: zodResolver(cancellationSchema) as Resolver<CancellationFormData>,
	})

	const watchedValues = form.watch()

	useEffect(() => {
		if (!club) return

		form.reset({
			cancelHoursBefore: club.cancelHoursBefore ?? 24,
			penaltyPercentage: club.penaltyPercentage ?? 100,
			cancellationBlockHours: club.cancellationBlockHours ?? 2,
		})
	}, [club, form])

	const onSubmit = (data: CancellationFormData) => {
		if (!club) return

		updateClub.mutate({
			id: club.id,
			clubData: {
				cancel_hours_before: data.cancelHoursBefore,
				penalty_percentage: data.penaltyPercentage,
				cancellation_block_hours: data.cancellationBlockHours,
			},
		})
	}

	return {
		form,
		watchedValues,
		onSubmit,
		isLoading,
		isError,
		isSaving: updateClub.isPending,
	}
}
