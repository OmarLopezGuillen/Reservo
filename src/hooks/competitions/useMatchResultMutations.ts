// useMatchResultMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export const useMatchResultMutations = (matchId: string) => {
	const qc = useQueryClient()

	const invalidate = () => {
		qc.invalidateQueries({ queryKey: ["matches"] })
		qc.invalidateQueries({ queryKey: ["match", matchId] })
	}

	const report = useMutation({
		mutationFn: async (params: { setsHome: number[]; setsAway: number[] }) => {
			const { error } = await supabase.rpc("report_match_result", {
				p_match_id: matchId,
				p_sets_home: params.setsHome,
				p_sets_away: params.setsAway,
			})
			if (error) throw error
		},
		onSuccess: () => {
			toast.success("Resultado enviado para confirmación.")
			invalidate()
		},
		onError: (e: any) => toast.error(e.message),
	})

	const confirm = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.rpc("confirm_match_result", {
				p_match_id: matchId,
			})
			if (error) throw error
		},
		onSuccess: () => {
			toast.success("Resultado confirmado.")
			invalidate()
		},
		onError: (e: any) => toast.error(e.message),
	})

	const dispute = useMutation({
		mutationFn: async (reason: string) => {
			const { error } = await supabase.rpc("dispute_match_result", {
				p_match_id: matchId,
				p_reason: reason,
			})
			if (error) throw error
		},
		onSuccess: () => {
			toast.warning("Resultado en disputa. Se notificará al admin.")
			invalidate()
		},
		onError: (e: any) => toast.error(e.message),
	})

	return { report, confirm, dispute }
}
