"use client"

import { Minus, TrendingDown, TrendingUp, Trophy } from "lucide-react"
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

interface StandingsTabProps {
	competitionId: string
}

const StandingsTab = ({ competitionId }: StandingsTabProps) => {
	// Mock data for demonstration
	const standings = [
		{
			position: 1,
			team: "Los Tigres",
			played: 8,
			won: 7,
			drawn: 0,
			lost: 1,
			points: 21,
			goalsFor: 42,
			goalsAgainst: 18,
			trend: "up",
		},
		{
			position: 2,
			team: "Las Águilas",
			played: 8,
			won: 6,
			drawn: 1,
			lost: 1,
			points: 19,
			goalsFor: 38,
			goalsAgainst: 22,
			trend: "up",
		},
		{
			position: 3,
			team: "Los Leones",
			played: 8,
			won: 5,
			drawn: 2,
			lost: 1,
			points: 17,
			goalsFor: 35,
			goalsAgainst: 20,
			trend: "same",
		},
		{
			position: 4,
			team: "Los Halcones",
			played: 8,
			won: 4,
			drawn: 1,
			lost: 3,
			points: 13,
			goalsFor: 28,
			goalsAgainst: 26,
			trend: "down",
		},
		{
			position: 5,
			team: "Los Lobos",
			played: 8,
			won: 2,
			drawn: 2,
			lost: 4,
			points: 8,
			goalsFor: 22,
			goalsAgainst: 32,
			trend: "down",
		},
	]

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "up":
				return <TrendingUp className="h-4 w-4 text-green-600" />
			case "down":
				return <TrendingDown className="h-4 w-4 text-red-600" />
			default:
				return <Minus className="h-4 w-4 text-muted-foreground" />
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="h-5 w-5" />
						Tabla de Clasificación
					</CardTitle>
					<CardDescription>
						Posiciones actuales de la competición
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[60px]">Pos.</TableHead>
								<TableHead>Equipo</TableHead>
								<TableHead className="text-center">PJ</TableHead>
								<TableHead className="text-center">G</TableHead>
								<TableHead className="text-center">E</TableHead>
								<TableHead className="text-center">P</TableHead>
								<TableHead className="text-center">GF</TableHead>
								<TableHead className="text-center">GC</TableHead>
								<TableHead className="text-center">Dif.</TableHead>
								<TableHead className="text-center font-bold">Pts</TableHead>
								<TableHead className="text-center">Tendencia</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{standings.map((standing) => (
								<TableRow key={standing.position}>
									<TableCell className="font-bold">
										<div className="flex items-center gap-2">
											{standing.position}
											{standing.position <= 4 && (
												<Badge
													variant="secondary"
													className="h-2 w-2 p-0 rounded-full bg-green-600"
												/>
											)}
										</div>
									</TableCell>
									<TableCell className="font-medium">{standing.team}</TableCell>
									<TableCell className="text-center">
										{standing.played}
									</TableCell>
									<TableCell className="text-center">{standing.won}</TableCell>
									<TableCell className="text-center">
										{standing.drawn}
									</TableCell>
									<TableCell className="text-center">{standing.lost}</TableCell>
									<TableCell className="text-center">
										{standing.goalsFor}
									</TableCell>
									<TableCell className="text-center">
										{standing.goalsAgainst}
									</TableCell>
									<TableCell className="text-center font-medium">
										{standing.goalsFor - standing.goalsAgainst > 0 ? "+" : ""}
										{standing.goalsFor - standing.goalsAgainst}
									</TableCell>
									<TableCell className="text-center font-bold">
										{standing.points}
									</TableCell>
									<TableCell className="text-center">
										{getTrendIcon(standing.trend)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Badge
								variant="secondary"
								className="h-3 w-3 p-0 rounded-full bg-green-600"
							/>
							<span>Clasificados para playoff</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default StandingsTab
