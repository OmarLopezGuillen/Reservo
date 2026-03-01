import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { CourtBlocksUpdate } from "@/models/dbTypes"
import { updateCourtBlock } from "@/services/databaseService/courtBlocks.service"
import { COURT_BLOCKS_QUERY_KEY } from "./useCourtBlocksQuery"

export const useCourtBlocksMutations = () => {
	const queryClient = useQueryClient()

	const updateCourtBlockMutation = useMutation({
		mutationFn: ({
			id,
			courtBlockData,
		}: {
			id: string
			courtBlockData: CourtBlocksUpdate
		}) => updateCourtBlock(id, courtBlockData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [COURT_BLOCKS_QUERY_KEY] })
			toast.success("Pagos del partido actualizados.")
		},
		onError: (error) => {
			console.error("Error updating court block:", error)
			toast.error("No se pudieron guardar los pagos del partido.")
		},
	})

	return {
		updateCourtBlock: updateCourtBlockMutation,
	}
}
