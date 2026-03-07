import { supabase } from "@/lib/supabase"

export interface MarkThreadReadParams {
	threadId: string
}

export async function markThreadRead({
	threadId,
}: MarkThreadReadParams): Promise<void> {
	try {
		const { error } = await supabase.rpc("mark_thread_read", {
			p_thread_id: threadId,
		})

		if (error) throw error
	} catch (error) {
		console.error("Error marking thread as read:", error)
		throw error
	}
}
