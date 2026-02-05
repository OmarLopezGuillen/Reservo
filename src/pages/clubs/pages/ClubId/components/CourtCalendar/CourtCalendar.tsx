import type { BookingCalendar } from "@/models/booking.model"
import type { BusinessDay } from "@/models/business.model"
import type { Court } from "@/models/court.model"
import CourtCalendarBase from "../../../../../../components/CourtCalendarBase/CourtCalendarBase"

interface CourtCalendarProps {
	courts: Court[]
	clubId: string
	bookings: BookingCalendar[]
	clubHours: BusinessDay[] | undefined
}

export default function CourtCalendar({
	courts,
	clubId,
	bookings,
	clubHours,
}: CourtCalendarProps) {
	return (
		<CourtCalendarBase
			mode="booking"
			title="Reserva tu pista"
			clubId={clubId}
			courts={courts}
			bookings={bookings}
			clubHours={clubHours}
		/>
	)
}
