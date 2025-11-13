import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	startOfMonth,
	startOfWeek,
} from "date-fns"
import { useState } from "react"

export type SelectMode = "day" | "week"

/**
 * Hook que gestiona la lógica de un calendario mensual.
 *
 * Permite navegar entre meses, seleccionar días o semanas, y acceder rápidamente al día actual.
 *
 */
export const useCalendarPicker = (
	selectedDate: Date,
	onSelectDate: (date: Date) => void,
) => {
	const [calendarMonth, setCalendarMonth] = useState(selectedDate)

	const handlePrevMonth = () => {
		const newMonth = new Date(calendarMonth)
		newMonth.setMonth(newMonth.getMonth() - 1)
		setCalendarMonth(newMonth)
	}
	const handleNextMonth = () => {
		const newMonth = new Date(calendarMonth)
		newMonth.setMonth(newMonth.getMonth() + 1)
		setCalendarMonth(newMonth)
	}

	const handleSetToday = () => {
		const today = new Date()
		onSelectDate(today)
		setCalendarMonth(today)
	}

	const handleDateSelect = (day: Date) => {
		onSelectDate(day)
		setCalendarMonth(day)
	}

	const monthStart = startOfMonth(calendarMonth)
	const monthEnd = endOfMonth(calendarMonth)
	const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
	const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
	const days = eachDayOfInterval({ start: startDate, end: endDate })

	return {
		days,
		calendarMonth,
		handlePrevMonth,
		handleNextMonth,
		handleSetToday,
		handleDateSelect,
	}
}
