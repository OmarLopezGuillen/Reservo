import { supabase } from "@/lib/supabase"
import type { CompetitionRule } from "@/models/competition.model"
import type {
	CompetitionRulesInsert,
	CompetitionRulesUpdate,
} from "@/models/dbTypes"
import {
	competitionRuleAdapter,
	competitionRulesAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "competition_rules"

export async function getCompetitionRuleById(
	id: string,
): Promise<CompetitionRule> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return competitionRuleAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting competition rule by id:", error.message)
		} else {
			console.error("Error getting competition rule by id:", error)
		}
		throw new Error("No se pudo obtener la regla de la competición.")
	}
}

export async function getCompetitionRulesByCompetitionId(
	competitionId: string,
): Promise<CompetitionRule[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("competition_id", competitionId)

		if (error) throw error
		return competitionRulesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition rules by competition id:",
				error.message,
			)
		} else {
			console.error("Error getting competition rules by competition id:", error)
		}
		throw new Error("No se pudieron obtener las reglas de la competición.")
	}
}

export async function createCompetitionRule(
	rule: CompetitionRulesInsert,
): Promise<CompetitionRule> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(rule)
			.select()
			.single()

		if (error) throw error
		return competitionRuleAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating competition rule:", error.message)
		} else {
			console.error("Error creating competition rule:", error)
		}
		throw new Error("No se pudo crear la regla de la competición.")
	}
}

export async function updateCompetitionRule(
	id: string,
	rule: CompetitionRulesUpdate,
): Promise<CompetitionRule> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(rule)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return competitionRuleAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating competition rule:", error.message)
		} else {
			console.error("Error updating competition rule:", error)
		}
		throw new Error("No se pudo actualizar la regla de la competición.")
	}
}

export async function deleteCompetitionRule(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
		if (error) throw error
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting competition rule:", error.message)
		} else {
			console.error("Error deleting competition rule:", error)
		}
		throw new Error("No se pudo eliminar la regla de la competición.")
	}
	return true
}
