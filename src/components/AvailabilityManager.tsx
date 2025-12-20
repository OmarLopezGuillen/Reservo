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

interface AvailabilityManagerProps {
	availabilities: TeamAvailability[]
	setAvailabilities: React.Dispatch<React.SetStateAction<TeamAvailability[]>>
}

const weekdays = [
	{ value: 0, label: "Lunes" },
	{ value: 1, label: "Martes" },
	{ value: 2, label: "Miércoles" },
	{ value: 3, label: "Jueves" },
	{ value: 4, label: "Viernes" },
	{ value: 5, label: "Sábado" },
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
		field: keyof TeamAvailability,
		value: string | number,
	) => {
		const newAvailabilities = [...availabilities]
		const availabilityToUpdate = { ...newAvailabilities[index] }

		if (field === "weekday") {
			availabilityToUpdate.weekday = value as TeamAvailability["weekday"]
		} else if (field === "startTime" || field === "endTime") {
			availabilityToUpdate[field] = value as string
		}

		newAvailabilities[index] = availabilityToUpdate
		setAvailabilities(newAvailabilities)
	}

	return (
		<div className="space-y-4 rounded-lg border p-4">
			<div className="flex items-center justify-between">
				<Label>Disponibilidad Horaria</Label>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleAddAvailability}
				>
					<PlusCircle className="mr-2 h-4 w-4" />
					Añadir Tramo
				</Button>
			</div>
			<div className="space-y-3">
				{availabilities.map((avail, index) => (
					<div key={index} className="grid grid-cols-4 gap-2 items-end">
						<div className="space-y-1 col-span-2 md:col-span-1">
							<Label htmlFor={`weekday-${index}`} className="text-xs">
								Día
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
						<div className="space-y-1">
							<Label htmlFor={`start-time-${index}`} className="text-xs">
								Inicio
							</Label>
							<Input
								id={`start-time-${index}`}
								type="time"
								value={avail.startTime}
								onChange={(e) =>
									handleAvailabilityChange(index, "startTime", e.target.value)
								}
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
									handleAvailabilityChange(index, "endTime", e.target.value)
								}
							/>
						</div>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => handleRemoveAvailability(index)}
							className="text-muted-foreground hover:text-red-500"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				))}
				{availabilities.length === 0 && (
					<p className="text-center text-sm text-muted-foreground py-2">
						Añade tramos de disponibilidad para el equipo.
					</p>
				)}
			</div>
		</div>
	)
}
