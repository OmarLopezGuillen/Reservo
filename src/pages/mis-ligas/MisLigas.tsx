import { Calendar, Loader2, Shield, Trophy } from "lucide-react"
import { Link, useNavigate } from "react-router"
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
import { formatDateShort } from "@/lib/utils"
import { TeamInvitations } from "@/pages/mis-ligas/components/TeamInvitations"
import { ROUTES } from "@/ROUTES"

const MisLigas = () => {
	const { allCompetitionsQuery } = useAllCompetitions()
	const { data: competitions = [], isLoading } = allCompetitionsQuery
	const navigate = useNavigate()

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
				<button
					onClick={() => navigate("/mis-ligas")}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
				>
					← Volver a mis ligas
				</button>
				<Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h2 className="text-2xl font-bold">No hay competiciones disponibles</h2>
				<p className="text-muted-foreground">Vuelve a intentarlo más tarde.</p>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-10">
			<div className="flex items-center justify-between mb-8">
				<button
					onClick={() => navigate("/")}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
				>
					← Volver
				</button>
				<h1 className="text-3xl font-bold">Mis Ligas</h1>

				<TeamInvitations />
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{competitions.map((competition) => (
					<CompetitionCard key={competition.id} competition={competition} />
				))}
			</div>
		</div>
	)
}

export default MisLigas

const CompetitionCard = ({ competition }: { competition: any }) => (
	<Card className="flex flex-col">
		<CardHeader>
			<div className="flex items-start justify-between">
				<CardTitle className="text-lg">{competition.name}</CardTitle>
			</div>
			<CardDescription className="flex items-center pt-1">
				<Shield className="mr-2 h-4 w-4" />
				{competition.description || "Sin descripción disponible"}
			</CardDescription>
		</CardHeader>
		<CardContent className="grow space-y-2">
			<div className="flex items-center text-sm text-muted-foreground">
				<Calendar className="mr-2 h-4 w-4" />
				<span>Inicio: {formatDateShort(competition.startDate)}</span>
			</div>
		</CardContent>
		<CardFooter>
			<Button asChild className="w-full">
				<Link to={ROUTES.COMPETITIONS.ID(competition.id)}>Ver Detalles</Link>
			</Button>
		</CardFooter>
	</Card>
)
