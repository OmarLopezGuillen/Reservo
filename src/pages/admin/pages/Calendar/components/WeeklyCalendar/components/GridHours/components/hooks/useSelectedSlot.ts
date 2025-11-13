import { useState } from "react"

const START_HOUR = 5
const END_HOUR = 22
const TIME_SLOTS = Array.from(
	{ length: (END_HOUR - START_HOUR) * 2 },
	(_, i) => {
		const totalMinutes = START_HOUR * 60 + i * 30
		return totalMinutes
	},
)

const hourGroups = TIME_SLOTS.reduce(
	(acc, time) => {
		const hour = Math.floor(time / 60)
		if (!acc[hour]) acc[hour] = []
		acc[hour].push(time)
		return acc
	},
	{} as Record<number, number[]>,
)

export const useSelectedSlot = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)

	const handleCloseDialog = () => {
		setIsDialogOpen(false)
		setSelectedSlot(null)
	}

	const handleSlotClick = (day: Date) => {
		setSelectedSlot(day)
		setIsDialogOpen(true)
	}

	return {
		isDialogOpen,
		selectedSlot,
		handleCloseDialog,
		handleSlotClick,
		hourGroups,
	}
}
