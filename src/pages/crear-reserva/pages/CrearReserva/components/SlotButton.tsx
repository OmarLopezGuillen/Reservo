import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import type { SlotStatus } from "@/models/Slots.model"
import { getSlotColor } from "./CourtCalendar"

interface SlotButtonProps {
	courtId: string
	courtName: string
	hour: number
	halfHour: "first" | "second"
	status: SlotStatus
	isHourOpen: boolean
	onSlotClick: (
		courtId: string,
		courtName: string,
		hour: number,
		halfHour: "first" | "second",
	) => void
	getTimeRange: (hour: number, halfHour: "first" | "second") => string
}

export function SlotButton({
	courtId,
	courtName,
	hour,
	halfHour,
	status,
	isHourOpen,
	onSlotClick,
	getTimeRange,
}: SlotButtonProps) {
	const isDisabled =
		status === "not-available" || status === "past" || status === "your-booking"

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					className={`w-1/2 h-16 transition-all duration-200 ${halfHour === "first" ? "border-r border-border" : ""} ${getSlotColor(status)}`}
					onClick={() => onSlotClick(courtId, courtName, hour, halfHour)}
					disabled={isDisabled}
				/>
			</TooltipTrigger>
			<TooltipContent
				side="top"
				className="bg-slate-900 text-white border-slate-800"
			>
				<div className="space-y-1">
					<p className="font-semibold text-sm">{courtName}</p>
					<p className="text-xs text-slate-300">
						{getTimeRange(hour, halfHour)}
					</p>
					<p className="text-xs">
						{status === "available" && "✓ Disponible"}
						{status === "not-available" && !isHourOpen && "✕ Cerrado"}
						{status === "not-available" && isHourOpen && "✕ No disponible"}
						{status === "your-booking" && "★ Tu reserva"}
						{status === "past" && "⌚ Hora pasada"}
					</p>
				</div>
			</TooltipContent>
		</Tooltip>
	)
}
