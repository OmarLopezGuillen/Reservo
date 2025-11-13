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
import { useState } from "react"
import { CalendarPicker } from "@/components/CalendarPicker/CalendarPicker"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

export const HeaderCalendar = () => {
	const [viewMode, setViewMode] = useState<"week" | "day">("week")
	const [currentDate, setCurrentDate] = useState(new Date())
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)

	const handleSelectDate = (date: Date) => {
		setCurrentDate(date)
		setIsPopoverOpen(false)
	}

	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
	return (
		<div className="m-2">
			{/* Controls */}
			<div className="flex flex-col sm:flex-col gap-4 ">
				{/* Date Navigation */}
				<div className="flex items-center gap-2 mx-auto">
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
				{/* 				<div className="flex items-center gap-2">
					<Select value={selectedCourt} onValueChange={setSelectedCourt}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Filtrar por pista" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todas las pistas</SelectItem>
							{courts?.map((court: any) => (
								<SelectItem key={court.id} value={court.id}>
									{court.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={viewMode}
						onValueChange={(value: "week" | "day") => setViewMode(value)}
					>
						<SelectTrigger className="w-full sm:w-[120px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="week">Semana</SelectItem>
							<SelectItem value="day">Día</SelectItem>
						</SelectContent>
					</Select>
				</div> */}
			</div>
		</div>
	)
}
