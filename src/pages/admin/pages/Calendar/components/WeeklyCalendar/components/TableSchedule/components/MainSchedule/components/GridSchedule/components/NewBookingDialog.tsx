import { useAuthUser } from "@/auth/hooks/useAuthUser"
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useBookingsMutation } from "@/hooks/useBookingsMutations"
import { useCourts } from "@/hooks/useCourtsQuery"
import type { BookingsInsert } from "@/models/dbTypes"
import { addMinutes, format } from "date-fns"
import { useEffect, useState } from "react"

interface NewBookingDialogProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	slot: { date: Date; courtId: string } | null
  clubId: string
}

export function NewBookingDialog({
	isOpen,
	onOpenChange,
	slot,
	clubId,
}: NewBookingDialogProps) {
	const user = useAuthUser()
	const { courtsQuery } = useCourts(user.clubId!)
	const courts = courtsQuery.data

	const { createBooking } = useBookingsMutation()
	const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null)
	const [duration, setDuration] = useState(90) // Duración por defecto de 90 min

	useEffect(() => {
		if (slot && slot.courtId !== "multiple-courts-selected") {
			setSelectedCourtId(slot.courtId)
		} else {
			setSelectedCourtId(null) // Resetear si es selección múltiple
		}
		// Resetear duración al abrir un nuevo slot
		setDuration(90)
	}, [slot])

	if (!slot) return null

	const isMultipleCourtSelection = slot.courtId === "multiple-courts-selected"
	const endTime = addMinutes(slot.date, duration)

	const handleSave = () => {
		const selectedCourt = courts?.find((c) => c.id === selectedCourtId)
		if (!selectedCourt) {
			console.error("No se ha seleccionado una pista válida.")
			return
		}

    const booking: BookingsInsert = {
            club_id: clubId,
            court_id: selectedCourtId!,
            price: selectedCourt.price,
            start_time: slot.date.toISOString(),
            date: format(slot.date, "yyyy-MM-dd"),
            end_time: endTime.toISOString(),
            user_id: user.id,
            accepts_maketing: false, 
            accepts_whatsup: false, 
            deposit_percentage: 0,
            payment_mode: "none",
            payment_status: "pending",
            status: "confirmed",
          }

		createBooking.mutate(booking)
		onOpenChange(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Crear nueva reserva</DialogTitle>
					<DialogDescription>
						Estás creando una reserva para el{" "}
						<span className="font-semibold text-foreground">
							{format(slot.date, "eeee dd 'de' MMMM 'a las' HH:mm")}
						</span>
					</DialogDescription>
				</DialogHeader>

				{/* Aquí iría el formulario con react-hook-form y zod */}
				<div className="space-y-4 py-4">
					{isMultipleCourtSelection && (
						<div className="space-y-2">
							<Label htmlFor="court">Pista</Label>
							<Select onValueChange={setSelectedCourtId}>
								<SelectTrigger id="court">
									<SelectValue placeholder="Selecciona una pista" />
								</SelectTrigger>
								<SelectContent>
									{courts?.map((court) => (
										<SelectItem key={court.id} value={court.id}>
											{court.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="duration">Duración</Label>
						<Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
							<SelectTrigger id="duration">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="60">60 min</SelectItem>
								<SelectItem value="90">90 min</SelectItem>
								<SelectItem value="120">120 min</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="userName">Nombre del cliente</Label>
						<Input id="userName" placeholder="Ej: Juan Pérez" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="userPhone">Teléfono</Label>
						<Input id="userPhone" placeholder="Ej: 600 000 000" />
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button
						onClick={handleSave}
						disabled={
							(isMultipleCourtSelection && !selectedCourtId) || createBooking.isPending
						}
					>
						Guardar Reserva
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}