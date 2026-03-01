import { supabase } from "@/lib/supabase"
import type { CourtBlocksRow, CourtBlocksUpdate } from "@/models/dbTypes"

export type CourtBlockWithContext = CourtBlocksRow & {
	match: {
		away_team: { name: string } | null
		competition: { name: string } | null
		home_team: { name: string } | null
		id: string
		matchday: number
		round: number
	} | null
}

export async function getCourtBlocksByCourtIds(
	courtIds: string[],
): Promise<CourtBlockWithContext[]> {
	if (courtIds.length === 0) return []

	try {
		const { data, error } = await supabase
			.from("court_blocks")
			.select(`
				*,
				match:matches!court_blocks_match_id_fkey(
					id,
					round,
					matchday,
					competition:competitions!matches_competition_id_fkey(name),
					home_team:competition_teams!matches_home_team_id_fkey(name),
					away_team:competition_teams!matches_away_team_id_fkey(name)
				)
			`)
			.in("court_id", courtIds)

		if (error) throw error

		return (data ?? []) as CourtBlockWithContext[]
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching court blocks:", error.message)
		} else {
			console.error("Error fetching court blocks:", error)
		}
		throw new Error("No se pudieron obtener los bloqueos de pista.")
	}
}

export async function updateCourtBlock(
	id: string,
	courtBlockData: CourtBlocksUpdate,
): Promise<CourtBlocksRow> {
	try {
		const { data, error } = await supabase
			.from("court_blocks")
			.update(courtBlockData)
			.eq("id", id)
			.select("*")
			.single()

		if (error) throw error

		return data as CourtBlocksRow
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating court block:", error.message)
		} else {
			console.error("Error updating court block:", error)
		}
		throw new Error("No se pudo actualizar el bloqueo de pista.")
	}
}
