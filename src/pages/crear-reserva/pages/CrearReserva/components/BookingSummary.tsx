import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatDate, formatPrice } from "@/lib/utils"
import type { UISlot } from "@/models/UI.models"

interface BookingSummaryProps {
	selectedSlot: UISlot | null
	onSubmit: () => void
}

const BookingSummary = ({ selectedSlot, onSubmit }: BookingSummaryProps) => {
	return (
		<Card className="sticky top-4">
			<CardHeader>
				<CardTitle>Resumen de reserva</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{selectedSlot ? (
					<>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Fecha:</span>
								<span className="font-medium">
									{formatDate(selectedSlot.date)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Horario:</span>
								<span className="font-medium">
									{selectedSlot.startTime} - {selectedSlot.endTime}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Pista:</span>
								<span className="font-medium">{selectedSlot.courtName}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Duración:</span>
								<span className="font-medium">{selectedSlot.duration} min</span>
							</div>
						</div>

						<div className="border-t pt-4">
							<div className="flex justify-between text-lg font-semibold">
								<span>Total:</span>
								<span>{formatPrice(selectedSlot.price)}</span>
							</div>
						</div>

						<Button
							className="w-full cursor-pointer"
							size="lg"
							onClick={onSubmit}
						>
							Continuar
						</Button>
					</>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>Selecciona un horario para continuar</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default BookingSummary
