import { Loader2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { Court } from "@/models/court.model"
import type { courtSchema } from "../CourtsTab"

type CourtFormData = z.output<typeof courtSchema>

interface CourtFormDialogProps {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	editingCourt: Court | null
	form: UseFormReturn<CourtFormData>
	onSubmit: (data: CourtFormData) => void
	isSubmitting: boolean
}

export function CourtFormDialog({
	isOpen,
	onOpenChange,
	editingCourt,
	form,
	onSubmit,
	isSubmitting,
}: CourtFormDialogProps) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isValid },
	} = form

	const watchedType = watch("type")
	const watchedIsActive = watch("isActive")

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editingCourt ? "Editar pista" : "Crear nueva pista"}
					</DialogTitle>
					<DialogDescription>
						{editingCourt
							? "Modifica los datos de la pista"
							: "Añade una nueva pista al sistema"}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Nombre de la pista</Label>
						<Input
							id="name"
							placeholder="Ej: Pista 1"
							{...register("name")}
							className={errors.name ? "border-destructive" : ""}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="type">Tipo de pista</Label>
							<Select
								value={watchedType}
								onValueChange={(value: "indoor" | "outdoor") =>
									setValue("type", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona tipo" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="indoor">Cubierta</SelectItem>
									<SelectItem value="outdoor">Exterior</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="price">Precio(€)</Label>
							<Input
								id="price"
								type="number"
								placeholder="Ej: 20€"
								{...register("price")}
								className={errors.price ? "border-destructive" : ""}
							/>
							{errors.price && (
								<p className="text-sm text-destructive">
									{errors.price.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="slotDurationMinutes">
								Duración del slot (min)
							</Label>
							<Input
								id="slotDurationMinutes"
								type="number"
								min={30}
								step={30}
								{...register("slotDurationMinutes", { valueAsNumber: true })}
								className={
									errors.slotDurationMinutes ? "border-destructive" : ""
								}
							/>
							{errors.slotDurationMinutes && (
								<p className="text-sm text-destructive">
									{errors.slotDurationMinutes.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="slotStartOffsetMinutes">
								Desfase inicio (min)
							</Label>
							<Input
								id="slotStartOffsetMinutes"
								type="number"
								min={0}
								step={15}
								{...register("slotStartOffsetMinutes", { valueAsNumber: true })}
								className={
									errors.slotStartOffsetMinutes ? "border-destructive" : ""
								}
							/>
							{errors.slotStartOffsetMinutes && (
								<p className="text-sm text-destructive">
									{errors.slotStartOffsetMinutes.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="color">Color</Label>
							<Input
								id="color"
								type="color"
								{...register("color")}
								className="p-1 h-10 w-full"
							/>
							{errors.color && (
								<p className="text-sm text-destructive">
									{errors.color.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Descripción (opcional)</Label>
						<Textarea
							id="description"
							placeholder="Ej: Pista cubierta con césped artificial premium"
							{...register("description")}
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="active"
							checked={watchedIsActive}
							onCheckedChange={(checked) => setValue("isActive", checked)}
							className="cursor-pointer"
						/>
						<Label htmlFor="active">Pista activa</Label>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="cursor-pointer"
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={!isValid || isSubmitting}>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{editingCourt ? "Guardar cambios" : "Crear pista"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
