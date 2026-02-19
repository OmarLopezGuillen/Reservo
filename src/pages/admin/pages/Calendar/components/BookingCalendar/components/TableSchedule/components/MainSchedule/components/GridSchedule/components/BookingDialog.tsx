import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useMemo } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import type { Booking } from "@/models/booking.model"
import BookingForm from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/components/BookingDialog/components/BookingForm"
import type { BookingSlot } from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/schemas/bookingForm"

interface BookingDialogProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	slot: BookingSlot | null
	clubId: string
	booking: Booking | null
}

export function BookingDialog({
	isOpen,
	onOpenChange,
	slot,
	clubId,
	booking,
}: BookingDialogProps) {
	const formattedDate = useMemo(
		() =>
			slot
				? format(slot.date, "eeee dd 'de' MMMM 'a las' HH:mm", { locale: es })
				: "",
		[slot],
	)

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90dvh] overflow-auto">
				<DialogHeader>
					<DialogTitle>
						{booking?.id ? "Editar reserva" : "Crear nueva reserva"}
					</DialogTitle>
					<DialogDescription>
						Estás creando una reserva para el{" "}
						<span className="font-semibold text-foreground">
							{formattedDate}
						</span>
					</DialogDescription>
				</DialogHeader>

				<BookingForm
					slot={slot}
					clubId={clubId}
					onClose={() => onOpenChange(false)}
					booking={booking}
				/>
			</DialogContent>
		</Dialog>
	)
}
