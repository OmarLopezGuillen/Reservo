import { parseAsIsoDate, parseAsStringLiteral, useQueryState } from "nuqs"
import { useIsMobile } from "@/hooks/use-mobile"

export const useViewModeQueryState = () => {
	const selectModes = ["week", "day"] as const

	const isMobile = useIsMobile()

	const defaultMode = isMobile ? "day" : "week"

	const [viewMode, setViewMode] = useQueryState(
		"viewMode",
		parseAsStringLiteral(selectModes).withDefault(defaultMode),
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
