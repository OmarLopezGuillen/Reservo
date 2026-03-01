import { format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CourtBlockVisual } from "./CourtBlockCard"

export type PaymentParticipant = {
	name: string
	paid: boolean
}

interface CourtBlockInfoDialogProps {
	courtBlock: CourtBlockVisual | null
	courtName: string
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	onSavePayments: (
		courtBlockId: string,
		payments: PaymentParticipant[],
	) => Promise<void>
	isSaving: boolean
}

const createDefaultParticipants = (
	courtBlock: CourtBlockVisual,
): PaymentParticipant[] => {
	const defaults: PaymentParticipant[] = [
		{ name: "", paid: false },
		{ name: "", paid: false },
		{ name: "", paid: false },
		{ name: "", paid: false },
	]

	if (courtBlock.homeTeamName) defaults[0].name = courtBlock.homeTeamName
	if (courtBlock.awayTeamName) defaults[1].name = courtBlock.awayTeamName

	return defaults
}

export const CourtBlockInfoDialog = ({
	courtBlock,
	courtName,
	isOpen,
	onOpenChange,
	onSavePayments,
	isSaving,
}: CourtBlockInfoDialogProps) => {
	const matchLabel = useMemo(() => {
		if (!courtBlock) return "Partido no identificado"
		if (courtBlock.homeTeamName && courtBlock.awayTeamName) {
			return `${courtBlock.homeTeamName} vs ${courtBlock.awayTeamName}`
		}
		return "Partido no identificado"
	}, [courtBlock])

	const [participants, setParticipants] = useState<PaymentParticipant[]>([])
	const [showPayments, setShowPayments] = useState(false)

	useEffect(() => {
		if (!courtBlock) return
		setParticipants(
			courtBlock.payments?.length === 4
				? courtBlock.payments
				: createDefaultParticipants(courtBlock),
		)
		setShowPayments(!!courtBlock.payments)
	}, [courtBlock])

	if (!courtBlock) return null

	const updateParticipant = (
		index: number,
		patch: Partial<PaymentParticipant>,
	) => {
		setParticipants((current) =>
			current.map((participant, currentIndex) =>
				currentIndex === index ? { ...participant, ...patch } : participant,
			),
		)
	}

	const markAllPaid = () => {
		setParticipants((current) =>
			current.map((participant) => ({ ...participant, paid: true })),
		)
	}

	const handleSave = async () => {
		try {
			await onSavePayments(courtBlock.id, participants)
			onOpenChange(false)
		} catch {
			// El toast de error se gestiona en la mutación.
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Partido de competición</DialogTitle>
					<DialogDescription>
						Detalle del partido asociado a la pista.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2 text-sm">
					<div>
						<strong>Pista:</strong> {courtName}
					</div>
					<div>
						<strong>Horario:</strong> {format(courtBlock.startTime, "HH:mm")} -{" "}
						{format(courtBlock.endTime, "HH:mm")}
					</div>
					<div>
						<strong>Motivo:</strong> {courtBlock.reason}
					</div>
					<div>
						<strong>Competición:</strong>{" "}
						{courtBlock.competitionName ?? "No disponible"}
					</div>
					<div>
						<strong>Jornada:</strong>{" "}
						{courtBlock.matchday ?? courtBlock.round ?? "No disponible"}
					</div>
					<div>
						<strong>Partido:</strong> {matchLabel}
					</div>
				</div>

				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={() => setShowPayments((current) => !current)}
				>
					{showPayments ? "Ocultar gestión de pagos" : "Gestionar pagos por persona"}
				</Button>

				{showPayments && (
					<div className="space-y-3 border rounded-md p-3">
						<div className="flex justify-between items-center">
							<Label>Participantes y estado de pago</Label>
							<Button
								type="button"
								size="sm"
								variant="secondary"
								onClick={markAllPaid}
							>
								Marcar todo pagado
							</Button>
						</div>

						<div className="space-y-2">
							{participants.map((participant, index) => (
								<div key={`participant-${index}`} className="flex items-center gap-3">
									<Input
										value={participant.name}
										onChange={(event) =>
											updateParticipant(index, { name: event.target.value })
										}
										placeholder={`Jugador ${index + 1}`}
									/>
									<div className="flex items-center gap-2 shrink-0">
										<Checkbox
											id={`participant-paid-${index}`}
											checked={participant.paid}
											onCheckedChange={(checked) =>
												updateParticipant(index, { paid: !!checked })
											}
										/>
										<Label htmlFor={`participant-paid-${index}`}>Pagado</Label>
									</div>
								</div>
							))}
						</div>

						<Button
							type="button"
							className="w-full"
							onClick={handleSave}
							disabled={isSaving}
						>
							{isSaving ? "Guardando..." : "Guardar pagos"}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
