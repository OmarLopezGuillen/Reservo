import { Loader2, Save, Shield } from "lucide-react"

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
import { useCancellationForm } from "@/pages/admin/pages/Ajustes/components/CancellationTab/hooks/useCancellationForm"

export function CancellationTab() {
	const { form, watchedValues, onSubmit, isLoading, isError, isSaving } =
		useCancellationForm()

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
		<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Política de cancelación
					</CardTitle>

					<CardDescription>
						Define las reglas para cancelaciones
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<CancellationPolicyCard
						cancelHoursBefore={watchedValues.cancelHoursBefore ?? 24}
						penaltyPercentage={watchedValues.penaltyPercentage ?? 100}
						cancellationBlockHours={watchedValues.cancellationBlockHours ?? 2}
					/>

					<div className="space-y-2">
						<Label>Horas cancelación gratuita</Label>
						<Input type="number" {...form.register("cancelHoursBefore")} />
					</div>

					<div className="space-y-2">
						<Label>Penalización (%)</Label>
						<Input type="number" {...form.register("penaltyPercentage")} />
					</div>

					<div className="space-y-2">
						<Label>Bloqueo cancelación (horas)</Label>
						<Input type="number" {...form.register("cancellationBlockHours")} />
					</div>
				</CardContent>

				<CardFooter>
					<Button type="submit" disabled={isSaving}>
						<Save className="h-4 w-4 mr-2" />
						{isSaving ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
