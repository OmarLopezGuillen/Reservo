import { supabase } from "@/lib/supabase"

export async function markNotificationRead(
	notificationId: string,
): Promise<void> {
	const { error } = await supabase.rpc("mark_notification_read", {
		p_notification_id: notificationId,
	})
	if (error) throw error
}
