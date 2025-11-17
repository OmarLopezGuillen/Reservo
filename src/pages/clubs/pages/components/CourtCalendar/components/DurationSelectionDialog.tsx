import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

interface DurationSelectionDialogProps {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	selectedSlot: {
		courtName: string
		hour: number
		halfHour: "first" | "second"
	} | null
	availableDurations: { duration: number; available: boolean }[]
	onDurationSelect: (duration: number) => void
	getTimeRange: (hour: number, halfHour: "first" | "second") => string
}

export function DurationSelectionDialog({
	isOpen,
	onOpenChange,
	selectedSlot,
	availableDurations,
	onDurationSelect,
	getTimeRange,
}: DurationSelectionDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="space-y-3">
					<DialogTitle className="text-xl font-semibold">
						Duración de la reserva
					</DialogTitle>
					<DialogDescription className="text-base" asChild>
						{selectedSlot && (
							<div className="space-y-1">
								<div className="font-semibold text-slate-900">
									{selectedSlot.courtName}
								</div>
								<div className="text-sm text-slate-600">
									{getTimeRange(selectedSlot.hour, selectedSlot.halfHour)}
								</div>
							</div>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-3 py-4">
					<Button
						variant="outline"
						className="h-14 text-base font-semibold transition-all bg-transparent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
						onClick={() => onDurationSelect(90)}
						disabled={
							!availableDurations.find((d) => d.duration === 90)?.available
						}
					>
						90 minutos
						<span className="text-sm font-normal text-slate-500 ml-2">
							(1h 30min)
						</span>
					</Button>
					{!availableDurations.find((d) => d.duration === 90)?.available && (
						<Alert className="border-amber-200 bg-amber-50">
							<AlertCircle className="h-4 w-4 text-amber-600" />
							<AlertDescription className="text-xs text-amber-800">
								No hay disponibilidad para 90 minutos desde esta hora (hay
								reservas que se solaparían)
							</AlertDescription>
						</Alert>
					)}

					<Button
						variant="outline"
						className="h-14 text-base font-semibold transition-all bg-transparent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
						onClick={() => onDurationSelect(120)}
						disabled={
							!availableDurations.find((d) => d.duration === 120)?.available
						}
					>
						120 minutos
						<span className="text-sm font-normal text-slate-500 ml-2">
							(2h)
						</span>
					</Button>
					{!availableDurations.find((d) => d.duration === 120)?.available && (
						<Alert className="border-amber-200 bg-amber-50">
							<AlertCircle className="h-4 w-4 text-amber-600" />
							<AlertDescription className="text-xs text-amber-800">
								No hay disponibilidad para 120 minutos desde esta hora (hay
								reservas que se solaparían)
							</AlertDescription>
						</Alert>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
