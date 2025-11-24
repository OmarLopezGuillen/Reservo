import { useQuery } from "@tanstack/react-query"
import type { CompetitionsType } from "@/models/dbTypes"
import {
	getCompetitionRuleTemplateById,
	getCompetitionRuleTemplateByType,
	getCompetitionRuleTemplates,
} from "@/services/databaseService/competitions/competition_rule_templates.service"

export const COMPETITION_RULE_TEMPLATES_QUERY_KEY =
	"competition_rule_templates"

export const useCompetitionRuleTemplates = () => {
	const competitionRuleTemplatesQuery = useQuery({
		queryKey: [COMPETITION_RULE_TEMPLATES_QUERY_KEY],
		queryFn: getCompetitionRuleTemplates,
	})
	return { competitionRuleTemplatesQuery }
}

export const useCompetitionRuleTemplateById = (id: string | null) => {
	const competitionRuleTemplateByIdQuery = useQuery({
		queryKey: [COMPETITION_RULE_TEMPLATES_QUERY_KEY, id],
		queryFn: () => getCompetitionRuleTemplateById(id!),
		enabled: !!id,
	})
	return { competitionRuleTemplateByIdQuery }
}

export const useCompetitionRuleTemplateByType = (
	type: CompetitionsType | null,
) => {
	const competitionRuleTemplateByTypeQuery = useQuery({
		queryKey: [COMPETITION_RULE_TEMPLATES_QUERY_KEY, "type", type],
		queryFn: () => getCompetitionRuleTemplateByType(type!),
		enabled: !!type,
	})
	return { competitionRuleTemplateByTypeQuery }
}
