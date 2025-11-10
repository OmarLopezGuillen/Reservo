import type { BusinessDay, TimeRange } from "@/models/business.model"

export interface BusinessHoursProps {
	businessId: string
}

const schedule: BusinessDay[] = [
	{
		day: "Lunes",
		hours: [
			{ start: "08:00", end: "13:00" },
			{ start: "15:00", end: "21:00" },
		],
	},
	{
		day: "Martes",
		hours: [
			{ start: "08:00", end: "13:00" },
			{ start: "15:00", end: "21:00" },
		],
	},
	{
		day: "Miércoles",
		hours: [
			{ start: "08:00", end: "13:00" },
			{ start: "15:00", end: "21:00" },
		],
	},
	{
		day: "Jueves",
		hours: [
			{ start: "08:00", end: "13:00" },
			{ start: "15:00", end: "21:00" },
		],
	},
	{
		day: "Viernes",
		hours: [
			{ start: "08:00", end: "13:00" },
			{ start: "15:00", end: "21:00" },
		],
	},
	{
		day: "Sábado",
		hours: [{ start: "09:00", end: "14:00" }],
	},
	{
		day: "Domingo",
		closed: true,
		hours: [],
	},
	{
		day: "*Festivos",
		closed: true,
		hours: [],
	},
]

const formatHours = (hours: TimeRange[]) => {
	if (hours.length === 0) return "Cerrado"

	return hours.map((range) => `${range.start} - ${range.end}`).join(" y ")
}

export function BusinessHours({ businessId }: BusinessHoursProps) {
	console.log(businessId)
	const isLoading = false
	const isError = false

	if (isLoading)
		return <p className="text-sm text-muted-foreground">Cargando...</p>
	if (isError || !schedule)
		return <p className="text-sm text-muted-foreground">No disponible</p>

	return (
		<div className="space-y-2">
			{schedule.map((item) => (
				<div
					key={item.day}
					className="flex flex-wrap items-center justify-between py-2 border-b border-border last:border-b-0"
				>
					<span className="text-sm font-medium text-foreground">
						{item.day}
					</span>
					<span className="text-sm text-muted-foreground font-mono">
						{item.closed ? "Cerrado" : formatHours(item.hours)}
					</span>
				</div>
			))}
		</div>
	)
}
