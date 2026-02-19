import { Building, Loader2, Save } from "lucide-react"

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
import { useBusinessForm } from "@/pages/admin/pages/Ajustes/components/BusinessTab/hooks/useBusinessForm"

export default function BusinessTab() {
	const { form, isLoading, isError, onSubmit, isSaving } = useBusinessForm()

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
		<form onSubmit={form.handleSubmit(onSubmit)}>
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
							<Label>Nombre del club</Label>
							<Input {...form.register("name")} />
							{form.formState.errors.name && (
								<p className="text-sm text-destructive">
									{form.formState.errors.name.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label>Email</Label>
							<Input type="email" {...form.register("email")} />
							{form.formState.errors.email && (
								<p className="text-sm text-destructive">
									{form.formState.errors.email.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Dirección</Label>
						<Input {...form.register("address")} />
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Teléfono</Label>
							<Input {...form.register("phone")} />
						</div>

						<div className="space-y-2">
							<Label>WhatsApp</Label>
							<Input {...form.register("whatsappNumber")} />
						</div>
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
