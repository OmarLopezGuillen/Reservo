import { useQuery } from "@tanstack/react-query"
import {
	getCompetitionParticipantById,
	getCompetitionParticipantsByCompetitionId,
} from "@/services/databaseService/competitions/competition_participants.service"

export const COMPETITION_PARTICIPANTS_QUERY_KEY = "competition_participants"

export const useCompetitionParticipantsByCompetitionId = (
	competitionId?: string,
) => {
	const competitionParticipantsQuery = useQuery({
		queryKey: [
			COMPETITION_PARTICIPANTS_QUERY_KEY,
			"competition",
			competitionId,
		],
		queryFn: () =>
			getCompetitionParticipantsByCompetitionId(competitionId!),
		enabled: !!competitionId,
	})
	return { competitionParticipantsQuery }
}

export const useCompetitionParticipantById = (id: string | null) => {
	const competitionParticipantByIdQuery = useQuery({
		queryKey: [COMPETITION_PARTICIPANTS_QUERY_KEY, id],
		queryFn: () => getCompetitionParticipantById(id!),
		enabled: !!id,
	})
	return { competitionParticipantByIdQuery }
}
