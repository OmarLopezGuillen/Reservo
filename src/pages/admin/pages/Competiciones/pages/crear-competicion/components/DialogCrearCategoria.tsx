import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { CompetitionCategory } from "@/models/competition.model"
import type {
	CompetitionCategoriesInsert,
	CompetitionCategoriesUpdate,
} from "@/models/dbTypes"

const categorySchema = z.object({
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	description: z.string().optional(),
	max_teams: z.coerce
		.number()
		.int()
		.min(2, "El número debe ser al menos 2")
		.optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface DialogCrearCategoriaProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (
		data: CompetitionCategoriesInsert | CompetitionCategoriesUpdate,
	) => void
	defaultValues?: Partial<CompetitionCategory>
	defaultMaxTeams: number
}

const DialogCrearCategoria = ({
	open,
	onOpenChange,
	onSave,
	defaultValues,
	defaultMaxTeams,
}: DialogCrearCategoriaProps) => {
	const isEditing = !!defaultValues?.id

	const form = useForm({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: defaultValues?.name ?? "",
			description: defaultValues?.description ?? "",
			max_teams: defaultValues?.maxTeams ?? undefined,
		},
	})
	useEffect(() => {
		if (open) {
			form.reset({
				name: defaultValues?.name ?? "",
				description: defaultValues?.description ?? "",
				max_teams: defaultValues?.maxTeams ?? null,
			})
		}
	}, [open, defaultValues, form])

	const onSubmit = (data: CategoryFormData) => {
		onSave(data)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditing ? "Editar" : "Nueva"} Categoría</DialogTitle>
					<DialogDescription>
						Configura los detalles de esta categoría.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input placeholder="Ej: 1ª Masculina" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción (Opcional)</FormLabel>
									<FormControl>
										<Input placeholder="Ej: Nivel alto" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="max_teams"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Máx. Equipos</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder={String(defaultMaxTeams)}
												{...field}
												value={
													(field.value as number | string | undefined) ?? ""
												}
												onChange={(e) =>
													field.onChange(Number(e.target.value) || undefined)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancelar
							</Button>
							<Button type="submit">Guardar</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
export default DialogCrearCategoria
