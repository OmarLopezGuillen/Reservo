"use client"

import { Trophy } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useCompetitionStandings } from "@/hooks/competitions/useStandingsQuery"

interface StandingsTabProps {
	competitionId: string
}

const StandingsTab = ({ competitionId }: StandingsTabProps) => {
	const { competitionCategoriesQuery } =
		useCompetitionCategoriesByCompetitionId(competitionId)

	const categories = competitionCategoriesQuery.data ?? []

	const defaultCategoryId = useMemo(
		() => categories[0]?.id ?? null,
		[categories],
	)

	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	)

	// Set por defecto cuando cargan categorías
	useEffect(() => {
		if (!selectedCategoryId && defaultCategoryId) {
			setSelectedCategoryId(defaultCategoryId)
		}
	}, [defaultCategoryId, selectedCategoryId])

	const { standingsQuery } = useCompetitionStandings(
		competitionId,
		selectedCategoryId ?? undefined,
	)

	const standings = standingsQuery.data ?? []

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="gap-3">
					<div className="flex items-center justify-between gap-3">
						<CardTitle className="flex items-center gap-2 min-w-0">
							<Trophy className="h-5 w-5 shrink-0" />
							<span className="truncate">Tabla de Clasificación</span>
						</CardTitle>

						<div className="">
							<Select
								value={selectedCategoryId ?? ""}
								onValueChange={(v) => setSelectedCategoryId(v)}
								disabled={
									competitionCategoriesQuery.isLoading ||
									categories.length === 0
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona una categoría" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<CardDescription>
						Posiciones actuales de la competición
					</CardDescription>
				</CardHeader>

				<CardContent>
					{competitionCategoriesQuery.isLoading && (
						<div>Cargando categorías...</div>
					)}

					{!competitionCategoriesQuery.isLoading && categories.length === 0 && (
						<div>No hay categorías en esta competición.</div>
					)}

					{selectedCategoryId && standingsQuery.isLoading && (
						<div>Cargando clasificación...</div>
					)}

					{selectedCategoryId && standingsQuery.isError && (
						<div>Error cargando la clasificación</div>
					)}

					{selectedCategoryId && standingsQuery.isSuccess && (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[60px]">Pos.</TableHead>
										<TableHead>Equipo</TableHead>
										<TableHead className="text-center">PJ</TableHead>
										<TableHead className="text-center">G</TableHead>
										<TableHead className="text-center">E</TableHead>
										<TableHead className="text-center">P</TableHead>
										<TableHead className="text-center">SF</TableHead>
										<TableHead className="text-center">SC</TableHead>
										<TableHead className="text-center">Dif.</TableHead>
										<TableHead className="text-center font-bold">Pts</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{standings.map((standing) => (
										<TableRow key={standing.teamId}>
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

											<TableCell className="font-medium">
												{standing.teamName}
											</TableCell>

											<TableCell className="text-center">
												{standing.played}
											</TableCell>
											<TableCell className="text-center">
												{standing.won}
											</TableCell>
											<TableCell className="text-center">
												{standing.drawn}
											</TableCell>
											<TableCell className="text-center">
												{standing.lost}
											</TableCell>

											<TableCell className="text-center">
												{standing.setsFor}
											</TableCell>
											<TableCell className="text-center">
												{standing.setsAgainst}
											</TableCell>

											<TableCell className="text-center font-medium">
												{standing.setsDiff > 0 ? "+" : ""}
												{standing.setsDiff}
											</TableCell>

											<TableCell className="text-center font-bold">
												{standing.points}
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
						</>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export default StandingsTab
