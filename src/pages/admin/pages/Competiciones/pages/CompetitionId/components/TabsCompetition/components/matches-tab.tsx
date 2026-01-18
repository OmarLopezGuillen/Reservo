import { Plus, Users } from "lucide-react"
import { useParams } from "react-router"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

const MatchesTab = () => {
	const { competicionId } = useParams<{ competicionId: string }>()
	const data = [
		{
			categoryId: "5556f289-1c14-4a53-a4ae-e8cf20aef15c",
			schedule: [
				[
					{
						home: "a5620016-36db-4a36-b37e-58d211db7138",
						away: "677423cc-cf21-466e-8120-cfc8ba6c31e7",
					},
				],
				[
					{
						home: "677423cc-cf21-466e-8120-cfc8ba6c31e7",
						away: "a5620016-36db-4a36-b37e-58d211db7138",
					},
				],
			],
		},
	]
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-1 ">
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
					<div className="space-y-6">
						{data.map((category) => (
							<Card key={category.categoryId}>
								<CardHeader>
									<CardTitle>Categoría {category.categoryId}</CardTitle>
								</CardHeader>

								<CardContent className="space-y-4">
									{category.schedule.map((round, roundIndex) => (
										<div key={roundIndex}>
											<h4 className="mb-2 font-semibold">
												Jornada {roundIndex + 1}
											</h4>

											<ul className="space-y-1 text-sm">
												{round.map((match, matchIndex) => (
													<li
														key={matchIndex}
														className="flex justify-between rounded-md border px-3 py-2"
													>
														<Users />
														<span>{match.home}</span>
														<span className="text-muted-foreground">vs</span>
														<span>{match.away}</span>
														<Users />
													</li>
												))}
											</ul>
										</div>
									))}
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
