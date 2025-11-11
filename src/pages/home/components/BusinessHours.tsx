import { useClubHours } from "@/hooks/useClubHoursQuery"
import type { TimeRange } from "@/models/business.model"

export interface BusinessHoursProps {
	businessId?: string
}

const formatHours = (hours: TimeRange[]) => {
	if (hours.length === 0) return "Cerrado"

	return hours.map((range, index) => (
		<div key={index} className="mb-1 font-mono">
			{range.start} - {range.end}
		</div>
	))
}

export function BusinessHours({ businessId }: BusinessHoursProps) {
	const { clubHoursQuery } = useClubHours(businessId)

	const schedule = clubHoursQuery.data
	const isLoading = clubHoursQuery.isLoading
	const isError = clubHoursQuery.isError

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
