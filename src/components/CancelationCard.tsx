import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CANCELLATION_POLICY_TEXT } from "../pages/reservas/pages/ReservaId/reservasId.constants"

interface CancellationPolicyCardProps {
	cancelHoursBefore: number
	penaltyPercentage: number
	cancellationBlockHours: number
}

export const CancellationPolicyCard = ({
	cancelHoursBefore,
	penaltyPercentage,
	cancellationBlockHours,
}: CancellationPolicyCardProps) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg">Política de cancelación</CardTitle>
		</CardHeader>
		<CardContent className="space-y-3 text-sm">
			<div className="flex items-start gap-2">
				<div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0" />
				<p>
					<strong>{CANCELLATION_POLICY_TEXT.FREE}:</strong> Hasta{" "}
					{cancelHoursBefore} horas antes del inicio
				</p>
			</div>
			<div className="flex items-start gap-2">
				<div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0" />
				<p>
					<strong>{CANCELLATION_POLICY_TEXT.LATE}:</strong> Penalización del{" "}
					{penaltyPercentage}% del importe total
				</p>
			</div>
			<div className="flex items-start gap-2">
				<div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0" />
				<p>
					<strong>{CANCELLATION_POLICY_TEXT.LAST_MINUTE}:</strong> No se permite
					cancelar menos de {cancellationBlockHours}{" "}
					{cancellationBlockHours === 1 ? "hora" : "horas"} antes del inicio
				</p>
			</div>
		</CardContent>
	</Card>
)
