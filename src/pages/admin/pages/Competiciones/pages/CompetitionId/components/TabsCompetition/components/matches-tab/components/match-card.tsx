import { Calendar, Clock, MapPin } from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCreateMatchChatThreadMutation } from "@/hooks/competitions/useChatThreadsMutation"
import { useChatThreadByMatchId } from "@/hooks/competitions/useChatThreadsQuery"
import { useCompetitionTeamById } from "@/hooks/competitions/useCompetitionTeamsQuery"
import { useCourtById } from "@/hooks/useCourtsQuery"
import type { Match } from "@/models/competition.model"
import { ROUTES } from "@/ROUTES"

// This is a temporary type to avoid errors locally.
// The user has a different type for Match in their local environment.
type MatchWithSets = Omit<Match, "scoreHome" | "scoreAway"> & {
	scoreHome: { sets: number[] } | null
	scoreAway: { sets: number[] } | null
}

interface MatchCardProps {
	match: MatchWithSets
	noLocationText?: string
	noDateText?: string
}

export function MatchCard({
	match,
	noLocationText = "No asignado",
	noDateText = "Por definir",
}: MatchCardProps) {
	const navigate = useNavigate()

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

	if (!match) return null

	const homeTeamName =
		homeTeamQuery.data?.name || `Equipo ${match.homeTeamId.slice(0, 6)}`
	const awayTeamName =
		awayTeamQuery.data?.name || `Equipo ${match.awayTeamId.slice(0, 6)}`
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

	const setsHome = match.scoreHome?.sets || []
	const setsAway = match.scoreAway?.sets || []

	const isHomeWinner = match.winnerTeamId === match.homeTeamId
	const isAwayWinner = match.winnerTeamId === match.awayTeamId

	//TODO: REVISAR LOS NAVIGATES
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
			{/* Header */}
			<div className="p-4 border-b">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="text-xs">
							Jornada {match.round}
						</Badge>
						{match.kind !== "regular" && (
							<Badge variant="secondary" className="text-xs capitalize">
								{match.kind === "playoff" ? "Playoff" : "Final"}
							</Badge>
						)}
					</div>
					<Badge variant="outline" className="text-xs capitalize">
						{match.status}
					</Badge>
					{threadByMatchQuery.isLoading ? (
						<Button size="sm" variant="outline" disabled>
							Chat...
						</Button>
					) : threadId ? (
						<Button size="sm" variant="outline" onClick={handleGoToChat}>
							Ir al chat
						</Button>
					) : (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button size="sm" variant="outline">
									Crear chat
								</Button>
							</AlertDialogTrigger>

							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Crear chat del partido</AlertDialogTitle>
									<AlertDialogDescription>
										Se creará un chat con los integrantes de ambos equipos. Los
										administradores del club podrán ver y participar en el chat.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel>Cancelar</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleCreateChat}
										disabled={createThreadMutation.isPending}
									>
										{createThreadMutation.isPending ? "Creando..." : "Aceptar"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</div>
			</div>
			{/* Main Content */}
			<div className="p-4 flex-1">
				<div className="flex items-center justify-between gap-4">
					<div className="flex-1 min-w-0">
						{/* Home Team Row */}
						<div className="flex items-center gap-3 py-1.5">
							<span
								className={`flex-1 text-sm uppercase tracking-wide truncate ${
									isHomeWinner
										? "font-bold text-foreground"
										: "font-medium text-muted-foreground"
								}`}
							>
								{homeTeamName}
							</span>

							<div className="flex gap-1.5">
								{setsHome?.map((set, index) => (
									<span
										key={index}
										className={`w-7 h-7 flex items-center justify-center text-sm border rounded`}
									>
										{set}
									</span>
								))}
							</div>
						</div>

						{/* Away Team Row */}
						<div className="flex items-center gap-3 py-1.5">
							<span
								className={`flex-1 text-sm uppercase tracking-wide truncate ${
									isAwayWinner
										? "font-bold text-foreground"
										: "font-medium text-muted-foreground"
								}`}
							>
								{awayTeamName}
							</span>

							<div className="flex gap-1.5">
								{setsAway?.map((set, index) => (
									<span
										key={index}
										className={`w-7 h-7 flex items-center justify-center text-sm border rounded `}
									>
										{set}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="p-4 border-t text-sm text-muted-foreground">
				<div className="flex flex-col sm:flex-row justify-between gap-1">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4 shrink-0" />
						{formattedDate ? (
							<span className="capitalize">{formattedDate}</span>
						) : (
							<span className="italic">{noDateText}</span>
						)}
						{formattedTime && (
							<>
								<span className="mx-1">·</span>
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4 shrink-0" />
									<span>{formattedTime}</span>
								</div>
							</>
						)}
					</div>
					<div className="flex items-center gap-1">
						<MapPin className="h-4 w-4 shrink-0" />
						{courtName ? (
							<span className="font-medium text-foreground">{courtName}</span>
						) : (
							<span className="italic">{noLocationText}</span>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
