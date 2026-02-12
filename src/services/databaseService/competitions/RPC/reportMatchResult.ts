import { supabase } from "@/lib/supabase"

export async function reportMatchResult(params: {
	matchId: string
	setsHome: number[]
	setsAway: number[]
}) {
	const { data, error } = await supabase.rpc("report_match_result", {
		p_match_id: params.matchId,
		p_sets_home: params.setsHome,
		p_sets_away: params.setsAway,
	})
	if (error) throw error
	return data
}

export async function confirmMatchResult(matchId: string) {
	const { data, error } = await supabase.rpc("confirm_match_result", {
		p_match_id: matchId,
	})
	if (error) throw error
	return data
}

export async function disputeMatchResult(params: {
	matchId: string
	reason: string
}) {
	const { data, error } = await supabase.rpc("dispute_match_result", {
		p_match_id: params.matchId,
		p_reason: params.reason,
	})
	if (error) throw error
	return data
}
