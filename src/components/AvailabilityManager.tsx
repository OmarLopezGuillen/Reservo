import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { TeamAvailability } from "@/models/competition.model"

export type TeamAvailabilityDraft = Pick<
	TeamAvailability,
	"weekday" | "startTime" | "endTime"
>

interface AvailabilityManagerProps {
	availabilities: TeamAvailabilityDraft[]
	setAvailabilities: React.Dispatch<React.SetStateAction<TeamAvailabilityDraft[]>>
}

const weekdays = [
	{ value: 0, label: "Lunes" },
	{ value: 1, label: "Martes" },
	{ value: 2, label: "Miercoles" },
	{ value: 3, label: "Jueves" },
	{ value: 4, label: "Viernes" },
	{ value: 5, label: "Sabado" },
	{ value: 6, label: "Domingo" },
]

export const AvailabilityManager = ({
	availabilities,
	setAvailabilities,
}: AvailabilityManagerProps) => {
	const handleAddAvailability = () => {
		setAvailabilities([
			...availabilities,
			{ weekday: "0", startTime: "09:00", endTime: "12:00" },
		])
	}

	const handleRemoveAvailability = (index: number) => {
		setAvailabilities(availabilities.filter((_, i) => i !== index))
	}

	const handleAvailabilityChange = (
		index: number,
		field: keyof TeamAvailabilityDraft,
		value: string | number,
	) => {
		const newAvailabilities = [...availabilities]
		const availabilityToUpdate = { ...newAvailabilities[index] }

		if (field === "weekday") {
			availabilityToUpdate.weekday = value as TeamAvailabilityDraft["weekday"]
		} else if (field === "startTime" || field === "endTime") {
			availabilityToUpdate[field] = value as string
		}

		newAvailabilities[index] = availabilityToUpdate
		setAvailabilities(newAvailabilities)
	}

	return (
		<div className="space-y-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
			<div className="flex flex-col gap-3">
				<div>
					<Label className="text-sm font-semibold text-foreground">
						Disponibilidad Horaria
					</Label>
					<p className="mt-1 text-xs text-muted-foreground">
						Anade los dias y franjas en las que tu equipo puede jugar.
					</p>
				</div>
			</div>

			<div className="space-y-3">
				{availabilities.map((avail, index) => (
					<div
						key={index}
						className="rounded-xl border border-border/70 bg-background p-3 shadow-xs"
					>
						<div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
							<div className="space-y-1">
								<Label htmlFor={`weekday-${index}`} className="text-xs">
									Dia
								</Label>
								<Select
									value={String(avail.weekday)}
									onValueChange={(value) =>
										handleAvailabilityChange(index, "weekday", value)
									}
								>
									<SelectTrigger id={`weekday-${index}`}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{weekdays.map((day) => (
											<SelectItem key={day.value} value={String(day.value)}>
												{day.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-3 md:contents">
								<div className="space-y-1">
									<Label htmlFor={`start-time-${index}`} className="text-xs">
										Inicio
									</Label>
									<Input
										id={`start-time-${index}`}
										type="time"
										value={avail.startTime}
										onChange={(e) =>
											handleAvailabilityChange(
												index,
												"startTime",
												e.target.value,
											)
										}
										className="min-w-0"
									/>
								</div>

								<div className="space-y-1">
									<Label htmlFor={`end-time-${index}`} className="text-xs">
										Fin
									</Label>
									<Input
										id={`end-time-${index}`}
										type="time"
										value={avail.endTime}
										onChange={(e) =>
											handleAvailabilityChange(
												index,
												"endTime",
												e.target.value,
											)
										}
										className="min-w-0"
									/>
								</div>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => handleRemoveAvailability(index)}
								className="w-full justify-center text-muted-foreground hover:text-red-500 md:h-10 md:w-10 md:px-0"
							>
								<Trash2 className="h-4 w-4" />
								<span className="md:hidden">Eliminar tramo</span>
							</Button>
						</div>
					</div>
				))}

				{availabilities.length === 0 && (
					<p className="py-2 text-center text-sm text-muted-foreground">
						Anade tramos de disponibilidad para el equipo.
					</p>
				)}
			</div>

			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={handleAddAvailability}
				className="w-full"
			>
				<PlusCircle className="mr-2 h-4 w-4" />
				Anadir Tramo
			</Button>
		</div>
	)
}
