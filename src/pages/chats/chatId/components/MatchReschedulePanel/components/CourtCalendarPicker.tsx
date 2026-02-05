import CourtCalendarBase, {
	type PickedOption,
} from "@/components/CourtCalendarBase/CourtCalendarBase"
import type { BookingCalendar } from "@/models/booking.model"
import type { BusinessDay } from "@/models/business.model"
import type { Court } from "@/models/court.model"

interface CourtCalendarPickerProps {
	courts: Court[]
	bookings: BookingCalendar[]
	clubHours: BusinessDay[] | undefined
	durationMinutes?: number // default 90
	onPickOption: (opt: PickedOption) => void
	selectedOptions?: PickedOption[]
	disabled?: boolean
	maxDate?: Date
}

export function CourtCalendarPicker({
	courts,
	bookings,
	clubHours,
	durationMinutes = 90,
	onPickOption,
	selectedOptions = [],
	disabled,
	maxDate,
}: CourtCalendarPickerProps) {
	return (
		<CourtCalendarBase
			mode="picker"
			title="Selecciona franjas disponibles"
			courts={courts}
			bookings={bookings}
			clubHours={clubHours}
			durationMinutes={durationMinutes}
			onPickOption={onPickOption}
			selectedOptions={selectedOptions}
			disabled={disabled}
			maxDate={maxDate}
		/>
	)
}
