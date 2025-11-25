import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBookingsMutation } from "@/hooks/useBookingsMutations"
import type { Booking } from "@/models/booking.model"
import type { BookingsUpdate } from "@/models/dbTypes"

interface EditBookingDialogProps {
	booking: Booking | null
	isOpen: boolean
	onOpenChange: (open: boolean) => void
}

export function EditBookingDialog({
	booking,
	isOpen,
	onOpenChange,
}: EditBookingDialogProps) {
	const { updateBooking, deleteBooking } = useBookingsMutation()
	const [userName, setUserName] = useState("")
	const [userPhone, setUserPhone] = useState("")

	useEffect(() => {
		if (booking) {
			let clientName = ""
			let clientPhone = ""

			if (booking.note) {
				try {
					const noteData = JSON.parse(booking.note)
					clientName = noteData.clientName || ""
					clientPhone = noteData.clientPhone || ""
				} catch (error) {
					// Si la nota no es un JSON, la mostramos como nombre de cliente para compatibilidad con datos antiguos.
					clientName = booking.note
				}
			}

			setUserName(clientName || "")
			setUserPhone(clientPhone || "")
		}
	}, [booking])

	if (!booking) return null

	const handleSaveChanges = () => {
		const bookingData: BookingsUpdate = {
			note: JSON.stringify({ clientName: userName, clientPhone: userPhone }),
		}
		updateBooking.mutate({ id: booking.id, bookingData })
		onOpenChange(false)
	}

	const handleCancelBooking = () => {
		if (
			window.confirm(
				"¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.",
			)
		) {
			updateBooking.mutate({
				id: booking.id,
				bookingData: { status: "cancelled" },
			})
			onOpenChange(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Reserva</DialogTitle>
					<DialogDescription>
						Reserva para el{" "}
						<span className="font-semibold text-foreground">
							{format(booking.startTime, "eeee dd 'de' MMMM 'a las' HH:mm")}
						</span>
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="userName">Nombre del cliente</Label>
						<Input
							id="userName"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="userPhone">Teléfono</Label>
						<Input
							id="userPhone"
							value={userPhone}
							onChange={(e) => setUserPhone(e.target.value)}
						/>
					</div>
				</div>

				<DialogFooter className="sm:justify-between">
					<Button
						variant="destructive"
						onClick={handleCancelBooking}
						disabled={deleteBooking.isPending}
					>
						Cancelar Reserva
					</Button>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cerrar
						</Button>
						<Button
							onClick={handleSaveChanges}
							disabled={updateBooking.isPending}
						>
							Guardar Cambios
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
