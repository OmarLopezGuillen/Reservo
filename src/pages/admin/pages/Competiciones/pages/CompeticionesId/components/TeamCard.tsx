import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useTeamAvailabilitiesByTeamId } from "@/hooks/competitions/useTeamAvailabilitiesQuery"
import type { CompetitionTeam } from "@/models/competition.model"

interface TeamCardProps {
	team: CompetitionTeam
}

const statusVariant = {
	inscrito: "default",
	solicitud: "secondary",
	rechazado: "destructive",
} as const

const formatTime = (time: string) => time.substring(0, 5)

export const TeamCard = ({ team }: TeamCardProps) => {
	const { data: availabilities = [], isLoading } =
		useTeamAvailabilitiesByTeamId(team.id).teamAvailabilitiesQuery

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<CardTitle>{team.name}</CardTitle>
						<CardDescription>Capitán: {team.player1Name}</CardDescription>
					</div>
					<Badge
						variant={
							statusVariant[team.status as keyof typeof statusVariant] ??
							"outline"
						}
					>
						{team.status}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Players Info */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
					<div className="p-3 bg-muted/50 rounded-md">
						<p className="font-semibold">Jugador 1</p>
						<p>{team.player1Name}</p>
						<p className="text-muted-foreground">{team.player1Phone}</p>
					</div>
					<div className="p-3 bg-muted/50 rounded-md">
						<p className="font-semibold">Jugador 2</p>
						<p>{team.player2Name}</p>
						<p className="text-muted-foreground">{team.player2Phone}</p>
					</div>
				</div>

				{/* Availability */}
				<div>
					<h4 className="font-semibold mb-2">Disponibilidad</h4>
					{isLoading ? (
						<div className="flex items-center text-muted-foreground">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Cargando disponibilidad...
						</div>
					) : availabilities.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Día</TableHead>
									<TableHead>Desde</TableHead>
									<TableHead>Hasta</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{availabilities.map((av) => (
									<TableRow key={av.id}>
										<TableCell className="capitalize">{av.weekday}</TableCell>
										<TableCell>{formatTime(av.startTime)}</TableCell>
										<TableCell>{formatTime(av.endTime)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<p className="text-sm text-muted-foreground">
							No hay disponibilidad registrada para este equipo.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
