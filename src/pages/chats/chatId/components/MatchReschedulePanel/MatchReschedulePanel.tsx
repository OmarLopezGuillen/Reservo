import { useMemo, useState } from "react"
import type { PickedOption } from "@/components/CourtCalendarBase/CourtCalendarBase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { useMatchById } from "@/hooks/competitions/useMatchesQuery"
import {
	useCreateProposal,
	useVoteOption,
} from "@/hooks/competitions/useMatchSchedulingMutation"
import {
	useProposals,
	useRequiredVoters,
} from "@/hooks/competitions/useMatchSchedulingQuery"
import type { BookingCalendar } from "@/models/booking.model"
import type { BusinessDay } from "@/models/business.model"
import type { Court } from "@/models/court.model"
import { CourtCalendarPicker } from "./components/CourtCalendarPicker"

const MATCH_DURATION_MIN = 90

const addDays = (d: Date, days: number) => {
	const x = new Date(d)
	x.setDate(x.getDate() + days)
	return x
}

const endOfDay = (d: Date) => {
	const x = new Date(d)
	x.setHours(23, 59, 59, 999)
	return x
}

// roundWeekStartDate puede venir "2026-02-02" (DATE) o ISO
const parseRoundWeekStart = (s: string) => {
	// Si es DATE "YYYY-MM-DD", lo tratamos como local:
	if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T00:00:00`)
	return new Date(s)
}

export function MatchReschedulePanel({
	threadId,
	matchId,
	courts,
	bookings,
	clubHours,
}: {
	threadId: string
	matchId: string
	courts: Court[]
	bookings: BookingCalendar[]
	clubHours: BusinessDay[] | undefined
}) {
	const { matchByIdQuery } = useMatchById(matchId)

	const matchStartTime = matchByIdQuery.data?.startTime ?? null
	const roundWeekStartDate = matchByIdQuery.data?.roundWeekStartDate ?? null

	const { requiredVotersQuery } = useRequiredVoters(threadId)
	const required = requiredVotersQuery.data ?? 0

	const { proposalsQuery } = useProposals(threadId)
	const proposals = proposalsQuery.data ?? []

	const { createProposalMutation } = useCreateProposal(threadId)
	const { voteOptionMutation } = useVoteOption(threadId)

	const [open, setOpen] = useState(false)
	const [pickedOptions, setPickedOptions] = useState<PickedOption[]>([])

	// 👇 estados de UI
	const [showActive, setShowActive] = useState(true)
	const [showHistory, setShowHistory] = useState(false)

	const activeProposal = proposals.find((p) => p.status === "open")
	const oldProposals = proposals.filter((p) => p.status !== "open")

	const canCreate = pickedOptions.length > 0

	const nowMs = Date.now()

	const isLocked24h = useMemo(() => {
		if (!matchStartTime) return false
		const startMs = Date.parse(matchStartTime)
		if (Number.isNaN(startMs)) return false
		return startMs - nowMs < 24 * 60 * 60 * 1000
	}, [matchStartTime, nowMs])

	const maxRescheduleDate = useMemo(() => {
		if (!roundWeekStartDate) return undefined

		const weekStart = parseRoundWeekStart(roundWeekStartDate) // lunes 00:00
		// Semana actual: weekStart..weekStart+6
		// Semana siguiente: weekStart+7..weekStart+13  ✅ permitimos hasta el final de ese domingo
		return endOfDay(addDays(weekStart, 13))
	}, [roundWeekStartDate])

	const onCreateProposal = async () => {
		if (!canCreate) return

		await createProposalMutation.mutateAsync({
			matchId,
			options: pickedOptions.map((o) => ({
				courtId: o.courtId,
				startTime: o.startTime,
				endTime: o.endTime,
			})),
		})

		setPickedOptions([])
		setOpen(false)
	}

	const getCourtName = (id: string) =>
		courts.find((c) => c.id === id)?.name ?? "Pista"

	return (
		<Card className="p-3 space-y-4 w-full max-w-5xl mx-auto">
			{/* HEADER */}
			<div className="flex items-center justify-between">
				<div className="font-medium">Reprogramación</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button size="sm" variant="outline" disabled={isLocked24h}>
							Nueva propuesta
						</Button>
					</DialogTrigger>

					<DialogContent className="max-h-[90vh] overflow-y-auto w-full sm:max-w-6xl">
						<DialogHeader>
							<DialogTitle>Nueva propuesta</DialogTitle>
						</DialogHeader>

						<CourtCalendarPicker
							courts={courts}
							bookings={bookings}
							clubHours={clubHours}
							durationMinutes={MATCH_DURATION_MIN}
							selectedOptions={pickedOptions}
							disabled={isLocked24h}
							maxDate={maxRescheduleDate}
							onPickOption={(opt) => {
								setPickedOptions((prev) => {
									const exists = prev.find(
										(p) =>
											p.courtId === opt.courtId &&
											p.startTime === opt.startTime,
									)
									if (exists) return prev
									return [...prev, opt]
								})
							}}
						/>

						{isLocked24h && (
							<div className="text-sm text-red-600">
								⚠️ Queda menos de 24h del partido. No se puede reprogramar.
							</div>
						)}

						{pickedOptions.length > 0 && (
							<div className="space-y-2 mt-4">
								<div className="text-sm font-medium">
									Franjas seleccionadas:
								</div>
								{pickedOptions.map((o, i) => (
									<div
										key={i}
										className="flex items-center justify-between text-sm border rounded p-2"
									>
										<div>
											{getCourtName(o.courtId)} ·{" "}
											{new Date(o.startTime).toLocaleString("es-ES")}
										</div>

										<Button
											size="sm"
											variant="ghost"
											onClick={() =>
												setPickedOptions((prev) =>
													prev.filter((_, idx) => idx !== i),
												)
											}
										>
											Quitar
										</Button>
									</div>
								))}
							</div>
						)}

						<DialogFooter>
							<Button variant="outline" onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button
								onClick={onCreateProposal}
								disabled={!canCreate || createProposalMutation.isPending}
							>
								Crear propuesta
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* ===== PROPUESTA ACTIVA ===== */}
			{activeProposal && (
				<div className="rounded-md border">
					<button
						onClick={() => setShowActive((v) => !v)}
						className="w-full flex items-center justify-between p-3 text-left"
					>
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">Propuesta activa</span>
							<Badge className="capitalize">open</Badge>
						</div>
						<span className="text-xs text-muted-foreground">
							{showActive ? "Ocultar" : "Mostrar"}
						</span>
					</button>

					{showActive && (
						<div className="space-y-2 px-3 pb-3">
							{activeProposal.options.map((o) => {
								const yes = o.votes.filter((v) => v.vote).length

								return (
									<div
										key={o.id}
										className="rounded-md border p-2 flex items-center justify-between"
									>
										<div>
											<div className="text-sm font-medium">
												{new Date(o.startTime).toLocaleString("es-ES")}
											</div>
											<div className="text-xs text-muted-foreground">
												{getCourtName(o.courtId)} · ✅ {yes}/{required}
											</div>
										</div>

										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={() =>
													voteOptionMutation.mutate({
														optionId: o.id,
														vote: true,
													})
												}
											>
												✅
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													voteOptionMutation.mutate({
														optionId: o.id,
														vote: false,
													})
												}
											>
												❌
											</Button>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			)}

			{/* ===== HISTORIAL ===== */}
			{oldProposals.length > 0 && (
				<div className="rounded-md border">
					<button
						onClick={() => setShowHistory((v) => !v)}
						className="w-full flex items-center justify-between p-3 text-left"
					>
						<div className="text-sm font-medium">
							Historial de propuestas ({oldProposals.length})
						</div>
						<span className="text-xs text-muted-foreground">
							{showHistory ? "Ocultar" : "Mostrar"}
						</span>
					</button>

					{showHistory && (
						<div className="space-y-3 px-3 pb-3">
							{oldProposals.map((p) => (
								<div
									key={p.id}
									className="rounded-md border p-3 space-y-2 opacity-60"
								>
									<Badge
										variant={
											p.status === "accepted" ? "default" : "destructive"
										}
										className="capitalize"
									>
										{p.status}
									</Badge>

									{p.options.map((o) => (
										<div key={o.id} className="text-sm text-muted-foreground">
											{getCourtName(o.courtId)} ·{" "}
											{new Date(o.startTime).toLocaleString("es-ES")}
										</div>
									))}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</Card>
	)
}
