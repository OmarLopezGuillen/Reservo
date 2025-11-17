import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BookingManagement } from "@/models/booking.model"
import { CANCELLATION_POLICY_TEXT } from "../reservasId.constants"

export const CancellationPolicyCard = ({
	booking,
}: {
	booking: BookingManagement
}) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg">Política de cancelación</CardTitle>
		</CardHeader>
		<CardContent className="space-y-3 text-sm">
			<div className="flex items-start gap-2">
				<div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0" />
				<p>
					<strong>{CANCELLATION_POLICY_TEXT.FREE}:</strong> Hasta{" "}
					{booking.club.cancelHoursBefore} horas antes del inicio
				</p>
			</div>
			<div className="flex items-start gap-2">
				<div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0" />
				<p>
					<strong>{CANCELLATION_POLICY_TEXT.LATE}:</strong> Penalización del{" "}
					{booking.club.penaltyPercentage}% del importe total
				</p>
			</div>
			<div className="flex items-start gap-2">
				<div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0" />
				<p>
					<strong>{CANCELLATION_POLICY_TEXT.LAST_MINUTE}:</strong> No se permite
					cancelar menos de 1 hora antes del inicio
				</p>
			</div>
		</CardContent>
	</Card>
)
