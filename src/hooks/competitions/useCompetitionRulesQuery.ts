import { useQuery } from "@tanstack/react-query"
import {
	getCompetitionRuleById,
	getCompetitionRulesByCompetitionId,
} from "@/services/databaseService/competitions/competition_rules.service"

export const COMPETITION_RULES_QUERY_KEY = "competition_rules"

export const useCompetitionRulesByCompetitionId = (competitionId?: string) => {
	const competitionRulesQuery = useQuery({
		queryKey: [COMPETITION_RULES_QUERY_KEY, "competition", competitionId],
		queryFn: () => getCompetitionRulesByCompetitionId(competitionId!),
		enabled: !!competitionId,
	})
	return { competitionRulesQuery }
}

export const useCompetitionRuleById = (id: string | null) => {
	const competitionRuleByIdQuery = useQuery({
		queryKey: [COMPETITION_RULES_QUERY_KEY, id],
		queryFn: () => getCompetitionRuleById(id!),
		enabled: !!id,
	})
	return { competitionRuleByIdQuery }
}
