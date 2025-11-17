import { AlertTriangle, ArrowLeft, CheckCircle, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useBookingsMutation } from "@/hooks/useBookingsMutations"
import { useMyBookingById } from "@/hooks/useBookingsQuery"
import { ROUTES } from "@/ROUTES"
import { BookingDetailsCard } from "./components/BookingDetailsCard/BookingDetailsCard"
import { CancellationPolicyCard } from "./components/CancelationCard"
import { CancelBookingDialog } from "./components/CancelBookingDialog"
import { useCancellationRules } from "./hooks/useCancellationRules"

const ReservaId = () => {
	const { reservaId } = useParams()
	const [showCancelDialog, setShowCancelDialog] = useState(false)
	const user = useAuthUser()
	const { myBookingQuery } = useMyBookingById(reservaId!)
	const {
		data: booking,
		isLoading: isBookingLoading,
		isError: isBookingError,
		error: bookingError,
	} = myBookingQuery

	const { updateBooking } = useBookingsMutation()

	const {
		mutate: cancelBookingMutation,
		isPending: isCancelling,
		isError: isCancelError,
		error: cancelError,
	} = updateBooking

	const handleConfirmCancel = () => {
		if (!booking) return

		cancelBookingMutation(
			{
				id: booking.id,
				bookingData: {
					status: "cancelled",
					updated_at: new Date().toISOString(),
				},
			},
			{
				onSuccess: () => {
					setShowCancelDialog(false)
				},
			},
		)
	}

	const cancellationRules = useCancellationRules(booking)
	const { hoursUntilBooking, canCancel } = cancellationRules

	if (isBookingLoading) {
		return (
			<div className="flex justify-center mt-10">
				<Spinner />
			</div>
		)
	}

	if (isBookingError || !booking) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Reserva no encontrada</h1>
					<p className="text-muted-foreground mb-4">
						{bookingError?.message ??
							"La reserva no existe o ha sido eliminada."}
					</p>
					<Button asChild>
						<Link to={ROUTES.RESERVAS.ROOT}>Volver a mis reservas</Link>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" asChild>
							<Link to={ROUTES.RESERVAS.ROOT}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Volver
							</Link>
						</Button>
						<h1 className="text-2xl font-bold">Gestionar reserva</h1>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto space-y-6">
					{/* Avisos de estado */}
					{booking.status === "cancelled" && (
						<Alert className="border-red-200 bg-red-50">
							<AlertTriangle className="h-4 w-4 text-red-600" />
							<AlertDescription className="text-red-800">
								Esta reserva ha sido cancelada. Si necesitas ayuda, contacta con
								nosotros.
							</AlertDescription>
						</Alert>
					)}

					{booking.status === "confirmed" &&
						hoursUntilBooking < 2 &&
						hoursUntilBooking > 0 && (
							<Alert className="border-green-200 bg-green-50">
								<CheckCircle className="h-4 w-4 text-green-600" />
								<AlertDescription className="text-green-800">
									Tu reserva es muy pronto. ¡No olvides llegar 10 minutos antes!
								</AlertDescription>
							</Alert>
						)}

					{/* Detalle */}
					<BookingDetailsCard
						booking={booking}
						user={{ email: user.email!, phone: "user.phone" }}
					/>

					{/* Acciones */}
					{booking.status === "confirmed" && (
						<Button
							variant="outline"
							onClick={() => setShowCancelDialog(true)}
							disabled={!canCancel}
							className="w-full text-destructive hover:text-destructive cursor-pointer"
						>
							<Trash2 className="h-4 w-4 mr-2" /> Cancelar reserva
						</Button>
					)}

					{/* Política */}
					<CancellationPolicyCard booking={booking} />
				</div>
			</div>

			{/* Cancel Dialog */}
			<CancelBookingDialog
				open={showCancelDialog}
				onOpenChange={setShowCancelDialog}
				onConfirm={handleConfirmCancel}
				booking={booking}
				cancellationRules={cancellationRules}
				isCancelling={isCancelling}
				isCancelError={isCancelError}
				cancelError={cancelError}
			/>
		</div>
	)
}

export default ReservaId
