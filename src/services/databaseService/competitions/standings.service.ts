import { supabase } from "@/lib/supabase"
import type { CompetitionStanding } from "@/models/competition.model"
import type { CompetitionStandingsRow } from "@/models/dbTypes"
import { competitionStandingsAdapter } from "@/services/adapters/competitions.adapter"

export async function getCompetitionStandings(
	competitionId: string,
	categoryId: string,
): Promise<CompetitionStanding[]> {
	const { data, error } = await supabase
		.from("competition_standings")
		.select("*")
		.eq("competition_id", competitionId)
		.eq("category_id", categoryId)
		.order("position", { ascending: true })

	if (error) throw error
	return competitionStandingsAdapter((data ?? []) as CompetitionStandingsRow[])
}
