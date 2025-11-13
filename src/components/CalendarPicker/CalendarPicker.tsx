import { format, isSameDay, isSameMonth, isSameWeek, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
	type SelectMode,
	useCalendarPicker,
} from "@/components/CalendarPicker/hooks/useCalendarPicker"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { WEEKDAYS_SHORT } from "@/models/calendar.model"

interface Props {
	selectedDate: Date
	onSelectDate: (date: Date) => void
	onCancel: () => void
	selectMode?: SelectMode
}

/**
 * Componente `CalendarPicker`
 *
 * Muestra un calendario interactivo que permite seleccionar una fecha o una semana,
 * navegar entre meses y acceder rápidamente al día actual.
 *
 * ### Características:
 * - Navegación por meses mediante botones.
 * - Resalta el día actual y la fecha seleccionada.
 * - Permite cambiar entre modo de selección de día o semana.
 * - Incluye acciones rápidas ("Hoy" y "Cerrar").
 *
 * @component
 *
 * @example
 * ```tsx
 * <CalendarPicker
 *   selectedDate={new Date()}
 *   onSelectDate={(date) => console.log(date)}
 *   onCancel={() => console.log("cerrado")}
 *   selectMode="week"
 * />
 * ```
 *
 */
export const CalendarPicker = ({
	selectedDate,
	onSelectDate,
	onCancel,
	selectMode = "day",
}: Props) => {
	const {
		days,
		calendarMonth,
		handleNextMonth,
		handlePrevMonth,
		handleSetToday,
		handleDateSelect,
	} = useCalendarPicker(selectedDate, onSelectDate)

	return (
		<div className="p-4 space-y-4">
			{/* Calendar Header */}
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					size="icon"
					onClick={handlePrevMonth}
					className="h-8 w-8"
				>
					<ChevronLeft className="w-4 h-4" />
				</Button>
				<h3 className="text-sm font-semibold text-slate-900">
					{calendarMonth.toLocaleDateString("es-ES", {
						month: "long",
						year: "numeric",
					})}
				</h3>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleNextMonth}
					className="h-8 w-8"
				>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</div>

			{/* Days of week */}
			<div className="grid grid-cols-7 gap-1 text-center">
				{WEEKDAYS_SHORT.map((weekday) => (
					<div
						key={weekday}
						className="text-xs font-medium text-slate-500 py-2"
					>
						{weekday}
					</div>
				))}
			</div>

			{/* Calendar Days */}
			<div className="grid grid-cols-7 gap-1">
				{days.map((day) => {
					const isSelected =
						selectMode === "week"
							? isSameWeek(day, selectedDate, { weekStartsOn: 1 })
							: isSameDay(day, selectedDate)

					const inCurrentMonth = isSameMonth(day, calendarMonth)
					const today = isToday(day)

					return (
						<button
							key={day.toISOString()}
							onClick={() => handleDateSelect(day)}
							className={cn(
								"h-9 rounded-lg text-sm font-medium transition-all",
								!inCurrentMonth && "text-slate-400",
								today &&
									"bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold",
								isSelected &&
									"bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
							)}
						>
							{format(day, "d", { locale: es })}
						</button>
					)
				})}
			</div>

			{/* Quick actions */}
			<div className="pt-3 border-t border-slate-200 flex justify-between">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleSetToday}
					className="text-xs hover:bg-blue-50 hover:text-blue-600"
				>
					Hoy
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={onCancel}
					className="text-xs hover:bg-slate-100"
				>
					Cerrar
				</Button>
			</div>
		</div>
	)
}
