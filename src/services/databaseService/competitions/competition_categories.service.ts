import { supabase } from "@/lib/supabase"
import type { CompetitionCategory } from "@/models/competition.model"
import type {
	CompetitionCategoriesInsert,
	CompetitionCategoriesUpdate,
} from "@/models/dbTypes"
import {
	competitionCategoriesAdapter,
	competitionCategoryAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "competition_categories"

export async function getCompetitionCategoryById(
	id: string,
): Promise<CompetitionCategory> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return competitionCategoryAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting competition category by id:", error.message)
		} else {
			console.error("Error getting competition category by id:", error)
		}
		throw new Error("No se pudo obtener la categoría de la competición.")
	}
}

export async function getCompetitionCategoriesByCompetitionId(
	competitionId: string,
) {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("competition_id", competitionId)

		if (error) throw error
		return competitionCategoriesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition categories by competition id:",
				error.message,
			)
		} else {
			console.error(
				"Error getting competition categories by competition id:",
				error,
			)
		}
		throw new Error("No se pudieron obtener las categorías de la competición.")
	}
}

export async function createCompetitionCategory(
	category: CompetitionCategoriesInsert,
): Promise<CompetitionCategory> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(category)
			.select()
			.single()

		if (error) throw error
		return competitionCategoryAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating competition category:", error.message)
		} else {
			console.error("Error creating competition category:", error)
		}
		throw new Error("No se pudo crear la categoría de la competición.")
	}
}

export async function updateCompetitionCategory(
	id: string,
	category: CompetitionCategoriesUpdate,
): Promise<CompetitionCategory> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(category)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return competitionCategoryAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating competition category:", error.message)
		} else {
			console.error("Error updating competition category:", error)
		}
		throw new Error("No se pudo actualizar la categoría de la competición.")
	}
}

export async function deleteCompetitionCategory(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)

		if (error) throw error
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting competition category:", error.message)
		} else {
			console.error("Error deleting competition category:", error)
		}
		throw new Error("No se pudo eliminar la categoría de la competición.")
	}
	return true
}
