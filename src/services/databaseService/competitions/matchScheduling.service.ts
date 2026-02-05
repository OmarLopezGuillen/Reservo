import { supabase } from "@/lib/supabase"

export type Proposal = {
	id: string
	threadId: string
	matchId: string
	status: "open" | "accepted" | "cancelled"
	acceptedOptionId: string | null
	createdBy: string
	createdAt: string
}

export type ProposalOption = {
	id: string
	proposalId: string
	courtId: string
	startTime: string
	endTime: string
	status: "open" | "accepted" | "rejected" | "conflict" | "cancelled"
	votes: { userId: string; vote: boolean }[]
}

export type ProposalWithOptions = Proposal & {
	options: ProposalOption[]
}

export async function getRequiredVotersCount(
	threadId: string,
): Promise<number> {
	const { count, error } = await supabase
		.from("chat_thread_members")
		.select("*", { count: "exact", head: true })
		.eq("thread_id", threadId)
		.eq("role", "member")

	if (error) throw error
	return count ?? 0
}

export async function getProposalsByThreadId(
	threadId: string,
): Promise<ProposalWithOptions[]> {
	const { data, error } = await supabase
		.from("match_schedule_proposals")
		.select(`
      id,
      thread_id,
      match_id,
      status,
      accepted_option_id,
      created_by,
      created_at,
      match_schedule_proposal_options (
        id,
        proposal_id,
        court_id,
        start_time,
        end_time,
        status,
        match_schedule_option_votes (
          user_id,
          vote
        )
      )
    `)
		.eq("thread_id", threadId)
		.order("created_at", { ascending: false })

	if (error) throw error

	return (data ?? []).map((p: any) => ({
		id: p.id,
		threadId: p.thread_id,
		matchId: p.match_id,
		status: p.status,
		acceptedOptionId: p.accepted_option_id,
		createdBy: p.created_by,
		createdAt: p.created_at,
		options: (p.match_schedule_proposal_options ?? []).map((o: any) => ({
			id: o.id,
			proposalId: o.proposal_id,
			courtId: o.court_id,
			startTime: o.start_time,
			endTime: o.end_time,
			status: o.status,
			votes: (o.match_schedule_option_votes ?? []).map((v: any) => ({
				userId: v.user_id,
				vote: v.vote,
			})),
		})),
	}))
}

export async function createMatchScheduleProposal(args: {
	threadId: string
	matchId: string
	options: Array<{ courtId: string; startTime: string; endTime: string }>
}): Promise<{ proposal_id: string } | string> {
	const { data, error } = await supabase.rpc("create_match_schedule_proposal", {
		p_thread_id: args.threadId,
		p_match_id: args.matchId,
		p_options: args.options.map((o) => ({
			court_id: o.courtId,
			start_time: o.startTime,
			end_time: o.endTime,
		})),
	})

	if (error) throw error
	return data
}

export async function voteMatchScheduleOption(args: {
	optionId: string
	vote: boolean
}) {
	const { data, error } = await supabase.rpc("vote_match_schedule_option", {
		p_option_id: args.optionId,
		p_vote: args.vote,
	})

	if (error) throw error
	return data
}
