import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
	createMatchScheduleProposal,
	voteMatchScheduleOption,
} from "@/services/databaseService/competitions/matchScheduling.service"
import { PROPOSALS_QUERY_KEY } from "./useMatchSchedulingQuery"

export function useCreateProposal(threadId: string) {
	const qc = useQueryClient()
	const createProposalMutation = useMutation({
		mutationFn: (args: {
			matchId: string
			options: Array<{ courtId: string; startTime: string; endTime: string }>
		}) =>
			createMatchScheduleProposal({
				threadId,
				matchId: args.matchId,
				options: args.options,
			}),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [PROPOSALS_QUERY_KEY, threadId] })
			toast.success("Propuesta creada.")
		},
		onError: (e) => {
			console.error(e)
			toast.error("No se pudo crear la propuesta.")
		},
	})
	return { createProposalMutation }
}

export function useVoteOption(threadId: string) {
	const qc = useQueryClient()
	const voteOptionMutation = useMutation({
		mutationFn: (args: { optionId: string; vote: boolean }) =>
			voteMatchScheduleOption(args),
		onSuccess: () => {
			// refresca la propuesta (contadores, status accepted/conflict)
			qc.invalidateQueries({ queryKey: [PROPOSALS_QUERY_KEY, threadId] })
			toast.success("Voto registrado.")
		},
		onError: (e) => {
			console.error(e)
			toast.error("No se pudo votar esa opción.")
		},
	})
	return { voteOptionMutation }
}
