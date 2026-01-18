import { useState } from "react"
import { useParams } from "react-router"
import { CategoriesTable } from "@/components/CategoriesTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MatchesTab from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/matches-tab"
import OverviewTab from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/overview-tab"
import RulesTab from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/rules-tab"
import StandingsTab from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/standings-tab"
import TeamsAdminTab from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/teams-tab/teams-tab"

function TabsCompetition() {
	const [activeTab, setActiveTab] = useState("matches")
	const { competicionId } = useParams<{ competicionId: string }>()
	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			<TabsList className="w-full justify-start">
				<TabsTrigger value="teams">Equipos</TabsTrigger>
				<TabsTrigger value="matches">Partidos</TabsTrigger>
				{/* 				<TabsTrigger value="overview">General</TabsTrigger>
				<TabsTrigger value="categories">Categorías</TabsTrigger>
				<TabsTrigger value="rules">Normas</TabsTrigger> */}
				{/* 				<TabsTrigger value="standings">Clasificación</TabsTrigger> */}
			</TabsList>

			<TabsContent value="teams" className="mt-6">
				<TeamsAdminTab competitionId={competicionId!} />
			</TabsContent>

			{/* 			<TabsContent value="overview" className="mt-6">
				<OverviewTab competition={competition} categories={categories} />
			</TabsContent>

			<TabsContent value="categories" className="mt-6">
				<CategoriesTable competition={competition} />
			</TabsContent>

			

			<TabsContent value="rules" className="mt-6">
				<RulesTab competition={competition} />
			</TabsContent> */}

			<TabsContent value="matches" className="mt-6">
				<MatchesTab />
			</TabsContent>

			{/* 			<TabsContent value="standings" className="mt-6">
				<StandingsTab competitionId={competition.id} />
			</TabsContent> */}
		</Tabs>
	)
}
export default TabsCompetition
