import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Clock,
	MapPin,
} from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/ROUTES"
import { useCreateMatchChatThreadMutation } from "@/hooks/competitions/useChatThreadsMutation"
import { useChatThreadByMatchId } from "@/hooks/competitions/useChatThreadsQuery"
import { useCompetitionTeamById } from "@/hooks/competitions/useCompetitionTeamsQuery"
import { useMatchResultMutations } from "@/hooks/competitions/useMatchResultMutations"
import { useCourtById } from "@/hooks/useCourtsQuery"
import type {
	Match,
	MatchResultStatus,
	MatchWithResult,
} from "@/models/competition.model"
import { DisputeDialog } from "./disputeDialog"
import { MatchResultDialog } from "./resultDialog"

type MatchCardMatch = Match | MatchWithResult

interface MatchCardProps {
	match: MatchCardMatch
	noLocationText?: string
	noDateText?: string
}

const hasResultData = (match: MatchCardMatch): match is MatchWithResult =>
	"resultStatus" in match

const parseSets = (score: unknown): number[] => {
	if (!score || typeof score !== "object" || !("sets" in score)) return []
	const sets = (score as { sets?: unknown }).sets
	if (!Array.isArray(sets)) return []
	return sets.filter((set): set is number => typeof set === "number")
}

export function MatchCard({
	match,
	noLocationText = "No asignado",
	noDateText = "Por definir",
}: MatchCardProps) {
	const navigate = useNavigate()
	const user = useAuthUser()

	const { threadByMatchQuery } = useChatThreadByMatchId(match.id)
	const threadId = threadByMatchQuery.data
	const { createThreadMutation } = useCreateMatchChatThreadMutation()

	const { competitionTeamByIdQuery: homeTeamQuery } = useCompetitionTeamById(
		match.homeTeamId,
	)
	const { competitionTeamByIdQuery: awayTeamQuery } = useCompetitionTeamById(
		match.awayTeamId,
	)

	const { courtByIdQuery } = useCourtById(match.courtId)
	const { report, confirm, dispute } = useMatchResultMutations(match.id)

	const homeTeamName = homeTeamQuery.data?.name ?? "Equipo local"
	const awayTeamName = awayTeamQuery.data?.name ?? "Equipo visitante"
	const courtName = courtByIdQuery.data?.name

	const formattedDate = match.startTime
		? new Date(match.startTime).toLocaleDateString("es-ES", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: null

	const formattedTime = match.startTime
		? new Date(match.startTime).toLocaleTimeString("es-ES", {
				hour: "2-digit",
				minute: "2-digit",
			})
		: null

	const setsHome = parseSets(match.scoreHome)
	const setsAway = parseSets(match.scoreAway)
	const resultStatus: MatchResultStatus = hasResultData(match)
		? match.resultStatus
		: "none"
	const reportedByTeamId = hasResultData(match) ? match.reportedByTeamId : null

	const isHomeWinner = match.winnerTeamId === match.homeTeamId
	const isAwayWinner = match.winnerTeamId === match.awayTeamId

	const isHomeMember = homeTeamQuery.data?.members?.some(
		(member) => member.userId === user.id,
	)
	const isAwayMember = awayTeamQuery.data?.members?.some(
		(member) => member.userId === user.id,
	)

	const myTeamId = isHomeMember
		? match.homeTeamId
		: isAwayMember
			? match.awayTeamId
			: null

	const handleGoToChat = () => {
		if (!threadId) return
		navigate(ROUTES.CHATS.ID(threadId))
	}

	const handleCreateChat = async () => {
		const res = await createThreadMutation.mutateAsync(match.id)
		toast.success("Chat creado.")
		navigate(ROUTES.CHATS.ID(res.thread_id))
	}

	return (
		<div className="bg-card border rounded-md hover:shadow-sm transition-shadow flex flex-col max-w-lg">
			<div className="p-4 border-b flex justify-between items-center">
				<Badge variant="outline" className="text-xs">
					Jornada {match.round}
				</Badge>

				{threadId ? (
					<Button size="sm" variant="outline" onClick={handleGoToChat}>
						Ir al chat
					</Button>
				) : (
					<Button size="sm" variant="outline" onClick={handleCreateChat}>
						Crear chat
					</Button>
				)}
			</div>

			<div className="p-4 space-y-2">
				<div className="flex justify-between items-center">
					<span className={isHomeWinner ? "font-bold" : ""}>{homeTeamName}</span>
					<div className="flex gap-1">
						{setsHome.map((set, index) => (
							<span
								key={`${match.id}-home-${index}`}
								className="w-7 h-7 flex items-center justify-center border rounded text-sm"
							>
								{set}
							</span>
						))}
					</div>
				</div>

				<div className="flex justify-between items-center">
					<span className={isAwayWinner ? "font-bold" : ""}>{awayTeamName}</span>
					<div className="flex gap-1">
						{setsAway.map((set, index) => (
							<span
								key={`${match.id}-away-${index}`}
								className="w-7 h-7 flex items-center justify-center border rounded text-sm"
							>
								{set}
							</span>
						))}
					</div>
				</div>
			</div>

			{myTeamId && (
				<div className="border-t p-4 space-y-3">
					{resultStatus === "none" && (
						<MatchResultDialog
							homeTeamName={homeTeamName}
							awayTeamName={awayTeamName}
							onReport={(homeSets, awaySets) =>
								report.mutateAsync({ setsHome: homeSets, setsAway: awaySets })
							}
						/>
					)}

					{resultStatus === "reported" && (
						<>
							{reportedByTeamId === myTeamId ? (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Clock className="h-4 w-4" />
									Pendiente de confirmación del rival
								</div>
							) : (
								<div className="flex gap-2">
									<Button
										size="sm"
										onClick={() => confirm.mutate()}
										disabled={confirm.isPending}
									>
										<CheckCircle2 className="h-4 w-4 mr-1" />
										Confirmar
									</Button>

									<DisputeDialog
										onSubmit={(reason) => dispute.mutateAsync(reason)}
									/>
								</div>
							)}
						</>
					)}

					{resultStatus === "disputed" && (
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-destructive text-sm">
								<AlertCircle className="h-4 w-4" />
								Resultado en disputa
							</div>

							<MatchResultDialog
								homeTeamName={homeTeamName}
								awayTeamName={awayTeamName}
								onReport={(homeSets, awaySets) =>
									report.mutateAsync({ setsHome: homeSets, setsAway: awaySets })
								}
							/>
						</div>
					)}

					{resultStatus === "confirmed" && (
						<div className="flex items-center gap-2 text-green-600 text-sm">
							<CheckCircle2 className="h-4 w-4 shrink-0" />
							Resultado confirmado
						</div>
					)}
				</div>
			)}

			<div className="p-4 border-t text-sm text-muted-foreground flex justify-between flex-wrap gap-4">
				<div className="flex items-center gap-1">
					<Calendar className="h-4 w-4 shrink-0" />
					{formattedDate ?? noDateText}
					{formattedTime && <> · {formattedTime}</>}
				</div>

				<div className="flex items-center gap-1">
					<MapPin className="h-4 w-4" />
					{courtName ?? noLocationText}
				</div>
			</div>
		</div>
	)
}
