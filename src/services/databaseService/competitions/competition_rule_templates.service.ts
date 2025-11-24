import { supabase } from "@/lib/supabase"
import type { CompetitionRuleTemplate } from "@/models/competition.model"
import type {
	CompetitionRuleTemplatesInsert,
	CompetitionRuleTemplatesUpdate,
	CompetitionsType,
} from "@/models/dbTypes"
import {
	competitionRuleTemplateAdapter,
	competitionRuleTemplatesAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "competition_rule_templates"

export async function getCompetitionRuleTemplateById(
	id: string,
): Promise<CompetitionRuleTemplate> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return competitionRuleTemplateAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition rule template by id:",
				error.message,
			)
		} else {
			console.error("Error getting competition rule template by id:", error)
		}
		throw new Error("No se pudo obtener la plantilla de reglas.")
	}
}

export async function getCompetitionRuleTemplateByType(
	type: CompetitionsType,
): Promise<CompetitionRuleTemplate> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("type", type)
			.single()

		if (error) throw error
		return competitionRuleTemplateAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition rule template by type:",
				error.message,
			)
		} else {
			console.error("Error getting competition rule template by type:", error)
		}
		throw new Error("No se pudo obtener la plantilla de reglas por tipo.")
	}
}

export async function getCompetitionRuleTemplates(): Promise<
	CompetitionRuleTemplate[]
> {
	try {
		const { data, error } = await supabase.from(TABLE_NAME).select("*")

		if (error) throw error
		return competitionRuleTemplatesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting competition rule templates:", error.message)
		} else {
			console.error("Error getting competition rule templates:", error)
		}
		throw new Error("No se pudieron obtener las plantillas de reglas.")
	}
}

export async function createCompetitionRuleTemplate(
	template: CompetitionRuleTemplatesInsert,
): Promise<CompetitionRuleTemplate> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(template)
			.select()
			.single()

		if (error) throw error
		return competitionRuleTemplateAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating competition rule template:", error.message)
		} else {
			console.error("Error creating competition rule template:", error)
		}
		throw new Error("No se pudo crear la plantilla de reglas.")
	}
}

export async function updateCompetitionRuleTemplate(
	id: string,
	template: CompetitionRuleTemplatesUpdate,
): Promise<CompetitionRuleTemplate> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(template)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return competitionRuleTemplateAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating competition rule template:", error.message)
		} else {
			console.error("Error updating competition rule template:", error)
		}
		throw new Error("No se pudo actualizar la plantilla de reglas.")
	}
}

export async function deleteCompetitionRuleTemplate(
	id: string,
): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)

		if (error) throw error
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting competition rule template:", error.message)
		} else {
			console.error("Error deleting competition rule template:", error)
		}
		throw new Error("No se pudo eliminar la plantilla de reglas.")
	}
	return true
}
