import type { Court } from "@/models/court.model"
import type { CourtsRow } from "@/models/dbTypes"

export const courtAdapter = (courtDB: CourtsRow): Court => {
	return {
		id: courtDB.id,
		clubId: courtDB.club_id,
		name: courtDB.name,
		description: courtDB.description,
		type: courtDB.type,
		price: courtDB.price,
		color: courtDB.color,
		isActive: courtDB.is_active,
		createdAt: courtDB.created_at,
		slotDurationMinutes: courtDB.slot_duration_minutes,
		slotStartOffsetMinutes: courtDB.slot_start_offset_minutes,
	}
}

export const courtsAdapter = (courtsDB: CourtsRow[]): Court[] => {
	return [...courtsDB]
		.sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		)
		.map((court) => courtAdapter(court))
}
