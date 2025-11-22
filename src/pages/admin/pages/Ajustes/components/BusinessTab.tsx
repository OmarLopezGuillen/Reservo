"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Building, Loader2, Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useAuthUser } from "@/auth/hooks/useAuthUser"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useClubsMutation } from "@/hooks/useClubsMutations"
import { useClubsById } from "@/hooks/useClubsQuery"

const businessSchema = z.object({
	name: z.string().min(1, "El nombre es obligatorio"),
	email: z.email("Email no válido"),
	address: z.string().min(1, "La dirección es obligatoria"),
	phone: z.string().min(1, "El teléfono es obligatorio"),
	whatsappNumber: z.string().optional(),
})

type BusinessFormData = z.infer<typeof businessSchema>

export default function BusinessTab() {
	const user = useAuthUser()
	const { clubsByIdQuery } = useClubsById(user.clubId!)
	const { data: club, isLoading, isError } = clubsByIdQuery
	const { updateClub } = useClubsMutation()

	const businessForm = useForm<BusinessFormData>({
		resolver: zodResolver(businessSchema),
	})

	useEffect(() => {
		if (club) {
			businessForm.reset({
				name: club.name,
				email: club.email,
				address: club.address,
				phone: club.phone,
				whatsappNumber: club.whatsappNumber,
			})
		}
	}, [club, businessForm])

	const handleBusinessSave = (data: BusinessFormData) => {
		if (!club) return

		const clubData = {
			name: data.name,
			email: data.email,
			address: data.address,
			phone: data.phone,
			whatsapp_number: data.whatsappNumber,
		}

		updateClub.mutate({ id: club.id, clubData })
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-48">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	if (isError) {
		return <div>Error al cargar los datos del club.</div>
	}

	return (
		<div className="space-y-6">
			<form onSubmit={businessForm.handleSubmit(handleBusinessSave)}>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Building className="h-5 w-5" />
							Información del negocio
						</CardTitle>
						<CardDescription>Datos básicos de tu club de pádel</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Nombre del club</Label>
								<Input id="name" {...businessForm.register("name")} />
								{businessForm.formState.errors.name && (
									<p className="text-sm text-destructive">
										{businessForm.formState.errors.name.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email de contacto</Label>
								<Input
									id="email"
									type="email"
									{...businessForm.register("email")}
								/>
								{businessForm.formState.errors.email && (
									<p className="text-sm text-destructive">
										{businessForm.formState.errors.email.message}
									</p>
								)}
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="address">Dirección</Label>
							<Input id="address" {...businessForm.register("address")} />
							{businessForm.formState.errors.address && (
								<p className="text-sm text-destructive">
									{businessForm.formState.errors.address.message}
								</p>
							)}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="phone">Teléfono</Label>
								<Input id="phone" {...businessForm.register("phone")} />
								{businessForm.formState.errors.phone && (
									<p className="text-sm text-destructive">
										{businessForm.formState.errors.phone.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
								<Input
									id="whatsapp"
									{...businessForm.register("whatsappNumber")}
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" disabled={updateClub.isPending}>
							<Save className="h-4 w-4 mr-2" />
							{updateClub.isPending ? "Guardando..." : "Guardar Cambios"}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	)
}
