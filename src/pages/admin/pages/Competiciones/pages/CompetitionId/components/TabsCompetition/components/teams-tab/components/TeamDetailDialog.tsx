import { CheckCircle, Clock, RefreshCw } from "lucide-react"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useCompetitionTeamInvitesByTeamId } from "@/hooks/competitions/useCompetitionTeamInvitesQuery"
import { useTeamAvailabilitiesByTeamId } from "@/hooks/competitions/useTeamAvailabilitiesQuery"
import { WEEKDAYS } from "@/models/calendar.model"
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"

interface TeamDetailDialogProps {
	team: CompetitionTeamWithMemberAndAvailability | null
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	getCategoryName: (categoryId: string) => string
	getStatusBadge: (status: string) => React.ReactNode
}

export const TeamDetailDialog = ({
	team,
	isOpen,
	onOpenChange,
	getCategoryName,
	getStatusBadge,
}: TeamDetailDialogProps) => {
	const { competitionTeamInvitesQuery } = useCompetitionTeamInvitesByTeamId(
		team?.id,
	)
	const { teamAvailabilitiesQuery } = useTeamAvailabilitiesByTeamId(team?.id)

	const groupedAvailabilities = useMemo(() => {
		const data = teamAvailabilitiesQuery.data ?? []

		const map = new Map<
			number,
			{ weekday: number; slots: { start: string; end: string }[] }
		>()

		for (const a of data) {
			const weekdayNumber = Number(a.weekday)

			let entry = map.get(weekdayNumber)

			if (!entry) {
				entry = { weekday: weekdayNumber, slots: [] }
				map.set(weekdayNumber, entry)
			}

			// Aquí TypeScript ya sabe que entry no es undefined
			entry.slots.push({
				start: a.startTime,
				end: a.endTime,
			})
		}

		// ordenar por weekday (0 → 6)
		return Array.from(map.values()).sort((a, b) => a.weekday - b.weekday)
	}, [teamAvailabilitiesQuery.data])

	const handleSentInvitation = () => {
		//TODO: Implementar reenvío de invitación
		console.log("Invitación enviada de nuevo")
	}
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{team?.name}</DialogTitle>
					<DialogDescription>
						Detalles del equipo e invitaciones pendientes
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">Estado</span>
						{team && getStatusBadge(team.status)}
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">Categoría</span>
						<span className="font-medium">
							{team && getCategoryName(team.categoryId)}
						</span>
					</div>

					<div className="border-t pt-4">
						<h4 className="font-medium mb-3">Jugadores</h4>
						<div className="space-y-3">
							{team?.members.map((member, index) => (
								<div key={member.id} className="bg-muted p-3 rounded-lg">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium">
												{member.profile?.name || `Jugador ${index + 1}`}
											</p>
											<p className="text-sm text-muted-foreground">
												{member.profile?.email || "Email pendiente"}
											</p>
											<p className="text-sm text-muted-foreground">
												{member.profile?.phone || "Teléfono pendiente"}
											</p>
										</div>
										<Badge variant="outline">Jugador {index + 1}</Badge>
									</div>
								</div>
							))}
							{(!team || team.members.length < 2) &&
								Array.from({
									length: 2 - (team?.members.length || 0),
								}).map((_, index) => (
									<div
										key={`placeholder-${index}`}
										className="bg-muted p-3 rounded-lg opacity-60"
									>
										<p className="text-sm text-muted-foreground">
											Jugador {index + (team?.members.length || 0) + 1}{" "}
											pendiente
										</p>
									</div>
								))}
						</div>
					</div>

					{competitionTeamInvitesQuery.data &&
						competitionTeamInvitesQuery.data.length > 0 && (
							<div className="border-t pt-4">
								<h4 className="font-medium mb-3">Invitaciones</h4>
								<div className="space-y-2">
									{competitionTeamInvitesQuery.data.map((inv) => (
										<div
											key={inv.id}
											className="flex items-center justify-between bg-muted p-3 rounded-lg"
										>
											<div>
												<p className="text-sm font-medium">{inv.email}</p>
												<p className="text-xs text-muted-foreground">
													Expira:
													{new Date(inv.expiresAt).toLocaleDateString()}
												</p>
											</div>
											<div className="flex items-center gap-2">
												{inv.status === "pending" ? (
													<>
														<Badge variant="secondary">
															<Clock className="h-3 w-3 mr-1" />
															Pendiente
														</Badge>
														<Button
															variant="ghost"
															size="sm"
															onClick={handleSentInvitation}
														>
															<RefreshCw className="h-4 w-4" />
														</Button>
													</>
												) : inv.status === "accepted" ? (
													<Badge className="bg-green-100 text-green-800">
														<CheckCircle className="h-3 w-3 mr-1" />
														Aceptada
													</Badge>
												) : (
													<Badge variant="destructive">Expirada</Badge>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
				</div>
				{/* DISPONIBILIDAD */}
				<div className="border-t pt-4">
					<h4 className="font-medium mb-3">Disponibilidad horaria</h4>

					{teamAvailabilitiesQuery.isLoading && (
						<div className="text-sm text-muted-foreground">
							Cargando disponibilidad...
						</div>
					)}

					{teamAvailabilitiesQuery.isSuccess &&
						groupedAvailabilities.length === 0 && (
							<div className="text-sm text-muted-foreground">
								Este equipo no ha configurado disponibilidad.
							</div>
						)}

					{teamAvailabilitiesQuery.isSuccess &&
						groupedAvailabilities.length > 0 && (
							<div className="space-y-3">
								{groupedAvailabilities.map((day) => (
									<div key={day.weekday} className="bg-muted p-3 rounded-lg">
										<div className="font-medium text-sm mb-1">
											{WEEKDAYS[Number(day.weekday)]}
										</div>

										<div className="space-y-1">
											{day.slots.map((slot, index) => (
												<div
													key={index}
													className="text-sm text-muted-foreground"
												>
													{slot.start} - {slot.end}
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cerrar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
