"use client"

import {
	Award,
	Calendar,
	Clock,
	FileText,
	Settings,
	Target,
	Trophy,
	Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type {
	Competition,
	CompetitionCategory,
} from "@/models/competition.model"

interface OverviewTabProps {
	competition: Competition
	categories: CompetitionCategory[]
}

const OverviewTab = ({ competition, categories }: OverviewTabProps) => {
	return (
		<div className="grid gap-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Categorías</CardTitle>
						<Trophy className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{categories.length}</div>
						<p className="text-xs text-muted-foreground">
							Divisiones configuradas
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Equipos por Categoría
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{competition.maxTeamsPerCategory}
						</div>
						<p className="text-xs text-muted-foreground">Máximo permitido</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Playoff</CardTitle>
						<Award className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{competition.hasPlayoff ? "Sí" : "No"}
						</div>
						<p className="text-xs text-muted-foreground">
							{competition.hasPlayoff
								? `${competition.playoffTeams} equipos clasifican`
								: "Sin playoff"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* General Info */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Información General
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Tipo
							</label>
							<p className="text-base capitalize">
								{competition.type === "league" ? "Liga" : "Americano"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Formato de Ronda
							</label>
							<p className="text-base">
								{competition.roundType === "single_round_robin"
									? "Ida"
									: competition.roundType === "double_round_robin"
										? "Ida y Vuelta"
										: "No especificado"}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex items-start gap-3">
							<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Periodo de Inscripción
								</label>
								<p className="text-base">
									{competition.registrationStartsAt
										? new Date(
												competition.registrationStartsAt,
											).toLocaleDateString()
										: "No definido"}{" "}
									-{" "}
									{competition.registrationEndsAt
										? new Date(
												competition.registrationEndsAt,
											).toLocaleDateString()
										: "No definido"}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Fechas de Competición
								</label>
								<p className="text-base">
									{competition.startDate
										? new Date(competition.startDate).toLocaleDateString()
										: "No definido"}{" "}
									-{" "}
									{competition.endDate
										? new Date(competition.endDate).toLocaleDateString()
										: "No definido"}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Scoring Configuration */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Sistema de Puntuación
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
							<span className="text-3xl font-bold text-green-600">
								{competition.pointsWin}
							</span>
							<span className="text-sm text-muted-foreground mt-1">
								Puntos por Victoria
							</span>
						</div>
						<div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
							<span className="text-3xl font-bold text-yellow-600">
								{competition.pointsDraw}
							</span>
							<span className="text-sm text-muted-foreground mt-1">
								Puntos por Empate
							</span>
						</div>
						<div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
							<span className="text-3xl font-bold text-red-600">
								{competition.pointsLoss}
							</span>
							<span className="text-sm text-muted-foreground mt-1">
								Puntos por Derrota
							</span>
						</div>
					</div>
					<div className="mt-4">
						<Badge variant={competition.allowDraws ? "default" : "secondary"}>
							{competition.allowDraws ? "Empates permitidos" : "Sin empates"}
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Availability Requirements */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Requisitos de Disponibilidad
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Días mínimos por semana
							</label>
							<p className="text-2xl font-bold">
								{competition.minAvailabilityDays}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Horas mínimas por día
							</label>
							<p className="text-2xl font-bold">
								{competition.minAvailabilityHoursPerDay}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Playoff Configuration */}
			{competition.hasPlayoff && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Settings className="h-5 w-5" />
							Configuración de Playoff
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Equipos clasificados
								</label>
								<p className="text-2xl font-bold">{competition.playoffTeams}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Tipo de playoff
								</label>
								<p className="text-base capitalize">
									{competition.playoffType === "single_elimination"
										? "Eliminación Directa"
										: competition.playoffType === "double_elimination"
											? "Doble Eliminación"
											: competition.playoffType === "final_match"
												? "Partido Final"
												: "No especificado"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default OverviewTab
