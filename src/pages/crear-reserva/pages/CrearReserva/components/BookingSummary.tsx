import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarSeparator } from "@/components/ui/sidebar"
import {
	formatDateWeekDayMonthShort,
	formatPrice,
	formatTimeToHourMinute,
} from "@/lib/utils"
import type { UISlot } from "@/models/slots.model"

interface BookingSummaryProps {
	selectedSlot: UISlot | null
}

const BookingSummary = ({ selectedSlot }: BookingSummaryProps) => {
	return (
		<Card className="sticky top-4">
			<CardHeader>
				<CardTitle>Resumen final</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{selectedSlot ? (
					<>
						{/* Detalles de la reserva */}
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Fecha:</span>
								<span className="font-medium">
									{formatDateWeekDayMonthShort(selectedSlot.date)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Horario:</span>
								<span className="font-medium">
									{formatTimeToHourMinute(selectedSlot.startTime)} -{" "}
									{formatTimeToHourMinute(selectedSlot.endTime)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Duración:</span>
								<span className="font-medium">{selectedSlot.duration} min</span>
							</div>
						</div>

						<SidebarSeparator />

						{/* Precios */}
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Precio pista:</span>
								<span>{formatPrice(selectedSlot.price)}</span>
							</div>
						</div>

						<SidebarSeparator />

						<div className="space-y-2">
							<div className="flex justify-between text-lg font-semibold">
								<span>Total en pista:</span>
								<span>{formatPrice(selectedSlot.price)}</span>
							</div>

							<strong className="text-xs text-muted-foreground">
								Sin pago por adelantado
							</strong>
						</div>
					</>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						Cargando detalles de la reserva...
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default BookingSummary
