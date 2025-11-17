import type { BookingManagement } from "@/models/booking.model"

export const BOOKING_STATUS_TEXT: Record<BookingManagement["status"], string> =
	{
		confirmed: "Confirmada",
		pending: "Pendiente",
		cancelled: "Cancelada",
		completed: "Completada",
	}

export const BOOKING_STATUS_CLASSES: Record<
	BookingManagement["status"],
	string
> = {
	confirmed: "bg-green-600 text-white hover:bg-green-600",
	pending: "bg-orange-500 text-white hover:bg-orange-500",
	cancelled: "bg-red-600 text-white hover:bg-red-600",
	completed: "bg-emerald-700 text-white hover:bg-emerald-700",
}

export const CANCELLATION_POLICY_TEXT = {
	FREE: "Cancelación gratuita",
	LATE: "Cancelación tardía",
	LAST_MINUTE: "De última hora",
}
