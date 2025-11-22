import {
	addDays,
	addWeeks,
	format,
	startOfWeek,
	subDays,
	subWeeks,
} from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { CalendarPicker } from "@/components/CalendarPicker/CalendarPicker"
import { Button } from "@/components/ui/button"
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useCourts } from "@/hooks/useCourtsQuery"
import { useCourtsStore } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/store/courtsSelectedStore"
import {
	useCurrentDayQueryState,
	useViewModeQueryState,
} from "@/pages/admin/pages/Calendar/hooks/useCalendarQueryState"
import { useAuthUser } from "@/auth/hooks/useAuthUser"

export const HeaderCalendar = () => {
	const { viewMode, setViewMode } = useViewModeQueryState()
	const { currentDate, setCurrentDate } = useCurrentDayQueryState()
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const user = useAuthUser()
	
	const { courtsQuery } = useCourts(user.clubId!)
	const courts = courtsQuery.data

	const courtsSelected = useCourtsStore((state) => state.courtsSelected)
	const setCourtsSelected = useCourtsStore((state) => state.setCourtsSelected)

	useEffect(() => {
		if (!courtsQuery.isLoading && courts) {
			const defaultValues = courts.map((court) => court.id)
			setCourtsSelected(defaultValues)
		}
	}, [courtsQuery.isLoading])

	const handleSelectDate = (date: Date) => {
		setCurrentDate(date)
		setIsPopoverOpen(false)
	}

	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
	return (
		<div className="pb-2">
			{/* Controls */}
			<div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap items-center">
				{/* Date Navigation */}
				<div className="flex items-center gap-2 mx-auto md:mx-0">
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentDate(
								viewMode === "week"
									? subWeeks(currentDate, 1)
									: subDays(currentDate, 1),
							)
						}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="min-w-[200px] bg-transparent"
							>
								<CalendarDays className="h-4 w-4 mr-2" />
								{viewMode === "week"
									? `${format(weekStart, "d MMM", { locale: es })} - ${format(
											addDays(weekStart, 6),
											"d MMM yyyy",
											{ locale: es },
										)}`
									: format(currentDate, "PPP", { locale: es })}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80 p-0" align="center">
							<CalendarPicker
								selectedDate={currentDate}
								onSelectDate={handleSelectDate}
								onCancel={() => setIsPopoverOpen(false)}
								selectMode={viewMode}
							/>
						</PopoverContent>
					</Popover>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentDate(
								viewMode === "week"
									? addWeeks(currentDate, 1)
									: addDays(currentDate, 1),
							)
						}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>

				{/* Filters */}

				<div className="flex-1 flex gap-2 flex-wrap justify-center sm:justify-start">
					<Select
						value={viewMode}
						onValueChange={(value: "week" | "day") => setViewMode(value)}
					>
						<SelectTrigger className="w-full max-w-[150px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="week">Semana</SelectItem>
							<SelectItem value="day">Día</SelectItem>
						</SelectContent>
					</Select>
					<MultiSelect
						values={courtsSelected}
						onValuesChange={setCourtsSelected}
					>
						<MultiSelectTrigger className="w-full max-w-[400px]">
							<MultiSelectValue
								placeholder="Selecciona las pistas"
								overflowBehavior="cutoff"
							/>
						</MultiSelectTrigger>
						<MultiSelectContent search={false} className="w-full max-w-[400px]">
							{courts?.map((court) => (
								<MultiSelectItem value={court.id} key={court.id}>
									{court.name}
								</MultiSelectItem>
							))}
						</MultiSelectContent>
					</MultiSelect>
				</div>
			</div>
		</div>
	)
}
