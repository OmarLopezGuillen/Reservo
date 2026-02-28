import { ArrowLeft, Calendar, Loader2, Shield, Trophy } from "lucide-react"
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
import { ROUTES } from "@/constants/ROUTES"
import { useAllCompetitions } from "@/hooks/competitions/useCompetitionsQuery"
import { formatDateShort } from "@/lib/utils"
import type { Competition } from "@/models/competition.model"
import { TeamInvitations } from "@/pages/mis-ligas/components/TeamInvitations"
import { UpcomingMatchesSection } from "@/pages/mis-ligas/components/UpcomingMatchesSection/UpcomingMatchesSection"

const MisLigas = () => {
	const { allCompetitionsQuery } = useAllCompetitions()
	const { data: competitions = [], isLoading } = allCompetitionsQuery

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<header className="border-b">
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center gap-4">
							<Button variant="ghost" size="sm" asChild>
								<Link to={ROUTES.HOME}>
									<ArrowLeft className="h-4 w-4 mr-2" />
									Volver
								</Link>
							</Button>
							<h1 className="text-2xl font-bold">Mis ligas</h1>
						</div>
					</div>
				</header>
				<div className="container mx-auto px-4 py-8 flex h-72 items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			</div>
		)
	}

	if (competitions.length === 0) {
		return (
			<div className="min-h-screen bg-background">
				<header className="border-b">
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-4">
								<Button variant="ghost" size="sm" asChild>
									<Link to={ROUTES.HOME}>
										<ArrowLeft className="h-4 w-4 mr-2" />
										Volver
									</Link>
								</Button>
								<h1 className="text-2xl font-bold">Mis ligas</h1>
							</div>
							<TeamInvitations />
						</div>
					</div>
				</header>
				<div className="container mx-auto px-4 py-10 text-center">
					<Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<h2 className="text-2xl font-bold">
						No hay competiciones disponibles
					</h2>
					<p className="text-muted-foreground">
						Vuelve a intentarlo más tarde.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<Button variant="ghost" size="sm" asChild>
								<Link to={ROUTES.HOME}>
									<ArrowLeft className="h-4 w-4 mr-2" />
									Volver
								</Link>
							</Button>
							<h1 className="text-2xl font-bold">Mis ligas</h1>
						</div>
						<TeamInvitations />
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
				<UpcomingMatchesSection
					competitionIds={competitions.map((competition) => competition.id)}
				/>
				<h2 className="text-2xl font-semibold">Mis ligas</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{competitions.map((competition) => (
						<CompetitionCard key={competition.id} competition={competition} />
					))}
				</div>
			</div>
		</div>
	)
}

export default MisLigas

const CompetitionCard = ({ competition }: { competition: Competition }) => (
	<Card className="group flex h-full flex-col overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
		<CardHeader className="gap-3 border-b bg-muted/20 pb-4">
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-2">
					<div className="rounded-full bg-primary/10 p-2 text-primary">
						<Trophy className="h-4 w-4" />
					</div>
					<CardTitle className="text-lg leading-tight">
						{competition.name}
					</CardTitle>
				</div>
				<Badge variant="outline" className="shrink-0">
					{competition.status === "published" ? "Abierta" : "En curso"}
				</Badge>
			</div>
			<CardDescription className="line-clamp-2 text-sm leading-relaxed">
				<div className="flex items-start gap-2">
					<Shield className="mt-0.5 h-4 w-4 shrink-0" />
					<span>{competition.description || "Sin descripción disponible"}</span>
				</div>
			</CardDescription>
		</CardHeader>
		<CardContent className="grow pt-5">
			<div className="rounded-lg border bg-background px-3 py-2">
				<p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
					Inicio
				</p>
				<div className="flex items-center text-sm font-medium">
					<Calendar className="mr-2 h-4 w-4 text-primary" />
					<span>{formatDateShort(competition.startDate)}</span>
				</div>
			</div>
		</CardContent>
		<CardFooter className="pt-2">
			<Button asChild className="w-full" variant="secondary">
				<Link to={ROUTES.COMPETITIONS.ID(competition.id)}>Ver Detalles</Link>
			</Button>
		</CardFooter>
	</Card>
)
