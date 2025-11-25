"use client"

import { Calendar, Clock, MapPin, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

interface MatchesTabProps {
	competitionId: string
}

const MatchesTab = ({ competitionId }: MatchesTabProps) => {
	// Mock data for demonstration
	const matches = [
		{
			id: "1",
			date: "2024-02-15",
			time: "18:00",
			court: "Pista 1",
			team1: "Los Tigres",
			team2: "Los Leones",
			score: "6-4, 3-6, 6-3",
			status: "completed",
		},
		{
			id: "2",
			date: "2024-02-16",
			time: "19:00",
			court: "Pista 2",
			team1: "Las Águilas",
			team2: "Los Halcones",
			score: null,
			status: "scheduled",
		},
		{
			id: "3",
			date: "2024-02-17",
			time: "18:30",
			court: "Pista 1",
			team1: "Los Tigres",
			team2: "Las Águilas",
			score: "4-6, 6-2, 2-1",
			status: "in_progress",
		},
	]

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "completed":
				return <Badge variant="outline">Finalizado</Badge>
			case "in_progress":
				return <Badge>En Juego</Badge>
			case "scheduled":
				return <Badge variant="secondary">Programado</Badge>
			default:
				return <Badge variant="secondary">{status}</Badge>
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Calendario de Partidos</CardTitle>
							<CardDescription>
								Gestiona y programa los partidos de la competición
							</CardDescription>
						</div>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Nuevo Partido
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{matches.map((match) => (
							<Card key={match.id}>
								<CardContent className="pt-6">
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-4 mb-3">
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Calendar className="h-4 w-4" />
													{new Date(match.date).toLocaleDateString("es-ES", {
														weekday: "long",
														day: "numeric",
														month: "long",
													})}
												</div>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Clock className="h-4 w-4" />
													{match.time}
												</div>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<MapPin className="h-4 w-4" />
													{match.court}
												</div>
												{getStatusBadge(match.status)}
											</div>

											<div className="flex items-center gap-4">
												<div className="flex-1 text-right">
													<p className="font-medium">{match.team1}</p>
												</div>
												<div className="px-4">
													<p className="text-2xl font-bold">
														{match.score || "vs"}
													</p>
												</div>
												<div className="flex-1">
													<p className="font-medium">{match.team2}</p>
												</div>
											</div>
										</div>

										<div className="ml-4">
											<Button variant="outline" size="sm">
												Ver Detalles
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default MatchesTab
