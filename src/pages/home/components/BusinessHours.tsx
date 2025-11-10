import type { BusinessDay, TimeRange } from "@/models/business.model"

export interface BusinessHoursProps {
	schedule: BusinessDay[]
}

export function BusinessHours({ schedule }: BusinessHoursProps) {
	const formatHours = (hours: TimeRange[]) => {
		if (hours.length === 0) return "Cerrado"

		return hours.map((range) => `${range.start} - ${range.end}`).join(" y ")
	}

	return (
		<div className="space-y-3">
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
