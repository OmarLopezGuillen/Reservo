import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@radix-ui/react-dialog"
import { Separator } from "@radix-ui/react-separator"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import type { BookingManagement } from "@/models/booking.model"
import type { CancellationRules } from "@/models/calleationRules.model"

export const CancelBookingDialog = ({
	open,
	onOpenChange,
	onConfirm,
	booking,
	cancellationRules,
	isCancelling,
	isCancelError,
	cancelError,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	booking: BookingManagement
	cancellationRules: CancellationRules
	isCancelling: boolean
	isCancelError: boolean
	cancelError: Error | null
}) => {
	const { canCancelFree, cancellationFee, refundAmount } = cancellationRules

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancelar reserva</DialogTitle>
					<DialogDescription>
						¿Estás seguro de que quieres cancelar esta reserva?
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="p-4 bg-muted rounded-lg space-y-2">
						<div className="flex justify-between">
							<span>Importe original:</span>
							<span>{formatPrice(booking.price)}</span>
						</div>
						{!canCancelFree && (
							<div className="flex justify-between text-red-600">
								<span>Penalización ({booking.club.penaltyPercentage}%):</span>
								<span>-{formatPrice(cancellationFee)}</span>
							</div>
						)}
						<Separator />
						<div className="flex justify-between font-semibold">
							<span>Reembolso:</span>
							<span className={canCancelFree ? "text-green-600" : ""}>
								{formatPrice(refundAmount)}
							</span>
						</div>
					</div>

					{!canCancelFree && !cancelError && (
						<Alert>
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								Al cancelar ahora se aplicará una penalización del{" "}
								{booking.club.penaltyPercentage}% por cancelación tardía.
							</AlertDescription>
						</Alert>
					)}

					{isCancelError && (
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								{cancelError?.message ?? "Error al cancelar la reserva."}
							</AlertDescription>
						</Alert>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isCancelling}
						className="cursor-pointer"
					>
						Mantener reserva
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isCancelling}
						className="cursor-pointer"
					>
						{isCancelling ? "Cancelando..." : "Confirmar cancelación"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
