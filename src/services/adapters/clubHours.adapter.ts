import type { BusinessDay, TimeRange } from "@/models/business.model"
import { WEEKDAYS } from "@/models/calendar.model"
import type { ClubHoursRow } from "@/models/dbTypes"

// Función auxiliar para formatear la hora "HH:MM:SS" -> "HH:MM"
const formatTime = (time: string | null): string | null => {
	if (!time) return null
	return time.slice(0, 5) // "09:00:00" → "09:00"
}

// Convierte una lista de registros a BusinessDay[]
export const clubHoursAdapter = (
	clubHoursDB: ClubHoursRow[],
): BusinessDay[] => {
	const groupedByDay = new Map<string, ClubHoursRow[]>()

	// Agrupa por día (numérico)
	for (const row of clubHoursDB) {
		const existing = groupedByDay.get(row.weekday) || []
		existing.push(row)
		groupedByDay.set(row.weekday, existing)
	}

	// Convierte cada grupo a BusinessDay
	return Array.from(groupedByDay.entries()).map(([weekday, rows]) => {
		const weekdayName = WEEKDAYS[Number(weekday)]

		const isClosed = rows.every((r) => !r.is_open)

		return {
			weekday: weekdayName,
			hours: isClosed
				? []
				: rows
						.filter((r) => r.is_open && r.open_time && r.close_time)
						.map(
							(r) =>
								({
									start: formatTime(r.open_time!)!,
									end: formatTime(r.close_time!)!,
								}) as TimeRange,
						),
			closed: isClosed,
		}
	})
}
