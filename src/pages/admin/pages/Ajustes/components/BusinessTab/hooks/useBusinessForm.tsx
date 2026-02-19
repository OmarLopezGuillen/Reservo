import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { useClubsMutation } from "@/hooks/useClubsMutations"
import { useClubsById } from "@/hooks/useClubsQuery"

export const businessSchema = z.object({
	name: z.string().min(1, "El nombre es obligatorio"),
	email: z.email("Email no válido"),
	address: z.string().min(1, "La dirección es obligatoria"),
	phone: z.string().min(1, "El teléfono es obligatorio"),
	whatsappNumber: z.string().optional(),
})

export type BusinessFormData = z.infer<typeof businessSchema>

export function useBusinessForm() {
	const user = useAuthUser()

	const { clubsByIdQuery } = useClubsById(user.clubId!)
	const { data: club, isLoading, isError } = clubsByIdQuery

	const { updateClub } = useClubsMutation()

	const form = useForm<BusinessFormData>({
		resolver: zodResolver(businessSchema),
	})

	// cargar datos iniciales
	useEffect(() => {
		if (!club) return

		form.reset({
			name: club.name,
			email: club.email,
			address: club.address,
			phone: club.phone,
			whatsappNumber: club.whatsappNumber,
		})
	}, [club, form])

	const onSubmit = (data: BusinessFormData) => {
		if (!club) return

		updateClub.mutate({
			id: club.id,
			clubData: {
				name: data.name,
				email: data.email,
				address: data.address,
				phone: data.phone,
				whatsapp_number: data.whatsappNumber,
			},
		})
	}

	return {
		form,
		club,
		isLoading,
		isError,
		onSubmit,
		isSaving: updateClub.isPending,
	}
}
