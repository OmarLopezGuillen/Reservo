import { Phone } from "lucide-react"
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
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"

interface TeamCardProps {
	team: CompetitionTeamWithMemberAndAvailability
}

const statusVariant = {
	inscrito: "default",
	solicitud: "secondary",
	rechazado: "destructive",
} as const

const formatTime = (time: string) => time.substring(0, 5)

export const TeamCard = ({ team }: TeamCardProps) => {
	const player1 = team.members.find((m) => m.role === "player1")?.profile
	const player2 = team.members.find((m) => m.role === "player2")?.profile
	const substitute = team.members.find((m) => m.role === "substitute")?.profile
	console.log("Team: ", team)
	const captainName = player1?.name ?? "—"
	const p1Name = player1?.name ?? "—"
	const p1Phone = player1?.phone ?? "—"
	const p2Name = player2?.name ?? "—"
	const p2Phone = player2?.phone ?? "—"

	const availabilities = team.availabilities ?? []

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<CardTitle>{team.name}</CardTitle>
						<CardDescription>Capitán: {captainName}</CardDescription>
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
				<div className="p-3 bg-muted/50 rounded-md">
					<p className="font-semibold">Jugador 1</p>
					<p>{p1Name}</p>

					<div className="mt-1 flex items-center gap-2 text-muted-foreground">
						<Phone className="h-4 w-4" />
						<span>{p1Phone ?? "—"}</span>
					</div>
				</div>

				<div className="p-3 bg-muted/50 rounded-md">
					<p className="font-semibold">Jugador 2</p>
					<p>{p2Name}</p>

					<div className="mt-1 flex items-center gap-2 text-muted-foreground">
						<Phone className="h-4 w-4" />
						<span>{p2Phone ?? "—"}</span>
					</div>
				</div>

				{/* Availability */}
				<div>
					<h4 className="font-semibold mb-2">Disponibilidad</h4>

					{availabilities.length > 0 ? (
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
