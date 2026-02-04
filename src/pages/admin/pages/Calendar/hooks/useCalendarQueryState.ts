import { parseAsIsoDate, parseAsStringLiteral, useQueryState } from "nuqs"

export const useViewModeQueryState = () => {
	const selectModes = ["week", "day"] as const

	const [viewMode, setViewMode] = useQueryState(
		"viewMode",
		parseAsStringLiteral(selectModes).withDefault("week"),
	)
	return { viewMode, setViewMode }
}

export const useCurrentDayQueryState = () => {
	const today = new Date().setHours(0, 0, 0, 0)
	const [currentDate, setCurrentDate] = useQueryState(
		"date",
		parseAsIsoDate.withDefault(new Date(today)),
	)
	return { currentDate, setCurrentDate }
}
