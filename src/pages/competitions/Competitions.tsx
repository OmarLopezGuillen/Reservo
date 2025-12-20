import { Calendar, Loader2, Shield, Trophy } from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useAllCompetitions } from "@/hooks/competitions/useCompetitionsQuery"
import { ROUTES } from "@/ROUTES"
import { TeamInvitations } from "./TeamInvitations"

const Competitions = () => {
	const { allCompetitionsQuery } = useAllCompetitions()
	const { data: competitions = [], isLoading } = allCompetitionsQuery

	if (isLoading) {
		return (
			<div className="container mx-auto flex h-96 items-center justify-center py-10">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (competitions.length === 0) {
		return (
			<div className="container mx-auto py-10 text-center">
				<Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h2 className="text-2xl font-bold">No hay competiciones disponibles</h2>
				<p className="text-muted-foreground">Vuelve a intentarlo más tarde.</p>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-10">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Competiciones Disponibles</h1>
				<TeamInvitations />
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{competitions.map((competition) => (
					<Card key={competition.id} className="flex flex-col">
						<CardHeader>
							<div className="flex items-start justify-between">
								<CardTitle className="text-lg">{competition.name}</CardTitle>
								<Badge
									variant={
										competition.status === "published" ? "success" : "default"
									}
								>
									{competition.status === "published"
										? "Abierta"
										: "En progreso"}
								</Badge>
							</div>
							<CardDescription className="flex items-center pt-1">
								<Shield className="mr-2 h-4 w-4" />
								{competition.name}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-grow space-y-4">
							<div className="flex items-center text-sm text-muted-foreground">
								<Trophy className="mr-2 h-4 w-4" />
								<span>Tipo: {competition.type}</span>
							</div>
							<div className="flex items-center text-sm text-muted-foreground">
								<Calendar className="mr-2 h-4 w-4" />
								<span>
									Inicio:{" "}
									{competition.startDate
										? new Date(competition.startDate).toLocaleDateString(
												"es-ES",
											)
										: "N/A"}
								</span>
							</div>
						</CardContent>
						<CardFooter>
							<Button asChild className="w-full">
								<Link to={ROUTES.COMPETITIONS.ID(competition.id)}>
									Ver Detalles
								</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
export default Competitions
