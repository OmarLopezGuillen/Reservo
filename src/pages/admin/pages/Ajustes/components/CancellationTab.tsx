"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, Shield } from "lucide-react"
import { useEffect } from "react"
import { type Resolver, useForm } from "react-hook-form"
import * as z from "zod"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { CancellationPolicyCard } from "@/components/CancelationCard"
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

const cancellationSchema = z.object({
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

type CancellationFormSchema = typeof cancellationSchema
type CancellationFormData = z.infer<CancellationFormSchema>

export function CancellationTab() {
	const user = useAuthUser()
	const { clubsByIdQuery } = useClubsById(user.clubId!)
	const { data: club, isLoading, isError } = clubsByIdQuery
	const { updateClub } = useClubsMutation()

	const form = useForm<CancellationFormData>({
		resolver: zodResolver(cancellationSchema) as Resolver<CancellationFormData>,
	})

	const watchedValues = form.watch()

	useEffect(() => {
		if (club) {
			form.reset({
				cancelHoursBefore: club.cancelHoursBefore ?? 24,
				penaltyPercentage: club.penaltyPercentage ?? 100,
				cancellationBlockHours: club.cancellationBlockHours ?? 2,
			})
		}
	}, [club, form])

	const handleSave = (data: CancellationFormData) => {
		if (!club) return

		const clubData = {
			cancel_hours_before: data.cancelHoursBefore,
			penalty_percentage: data.penaltyPercentage,
			cancellation_block_hours: data.cancellationBlockHours,
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
		return (
			<div className="text-destructive p-4 bg-destructive/10 rounded-md">
				Error al cargar la política de cancelación.
			</div>
		)
	}

	return (
		<form onSubmit={form.handleSubmit(handleSave)} noValidate>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Política de cancelación
					</CardTitle>
					<CardDescription>
						Define las reglas para cancelaciones y modificaciones
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="hours">
							Horas mínimas para cancelación gratuita
						</Label>
						<Input
							id="hours"
							type="number"
							min="0"
							max="24"
							{...form.register("cancelHoursBefore")}
						/>
						{form.formState.errors.cancelHoursBefore && (
							<p className="text-sm text-destructive">
								{form.formState.errors.cancelHoursBefore.message}
							</p>
						)}
						<p className="text-sm text-muted-foreground">
							Los clientes pueden cancelar gratis hasta 24 horas antes
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="penalty">
							Penalización por cancelación tardía (%)
						</Label>
						<Input
							id="penalty"
							type="number"
							min="0"
							max="100"
							{...form.register("penaltyPercentage")}
						/>
						{form.formState.errors.penaltyPercentage && (
							<p className="text-sm text-destructive">
								{form.formState.errors.penaltyPercentage.message}
							</p>
						)}
						<p className="text-sm text-muted-foreground">
							Porcentaje del importe que se retiene en cancelaciones tardías
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="lockout">
							Horas antes del inicio para bloqueo de cancelación
						</Label>
						<Input
							id="lockout"
							type="number"
							min="0"
							max="24"
							{...form.register("cancellationBlockHours")}
						/>
						{form.formState.errors.cancellationBlockHours && (
							<p className="text-sm text-destructive">
								{form.formState.errors.cancellationBlockHours.message}
							</p>
						)}
						<p className="text-sm text-muted-foreground">
							Horas antes del inicio de la reserva en las que se bloquea la
							cancelación
						</p>
					</div>

					<CancellationPolicyCard
						cancelHoursBefore={watchedValues.cancelHoursBefore ?? 24}
						penaltyPercentage={watchedValues.penaltyPercentage ?? 100}
						cancellationBlockHours={watchedValues.cancellationBlockHours ?? 2}
					/>
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={updateClub.isPending}>
						<Save className="h-4 w-4 mr-2" />
						{updateClub.isPending ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
