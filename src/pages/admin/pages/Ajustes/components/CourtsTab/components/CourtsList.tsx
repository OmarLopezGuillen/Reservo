import type { Court } from "@/models/court.model"
import { Loader2 } from "lucide-react"
import { CourtCard } from "./CourtCard"

interface CourtsListProps {
	courts: Court[] | undefined
	isLoading: boolean
	onToggleActive: (court: Court) => void
	onEditCourt: (court: Court) => void
	onDeleteCourt: (id: string) => void
}

export function CourtsList({
	courts,
	isLoading,
	onToggleActive,
	onEditCourt,
	onDeleteCourt,
}: CourtsListProps) {
	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-48">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{courts?.map((court) => (
				<CourtCard
					key={court.id}
					court={court}
					onToggleActive={onToggleActive}
					onEdit={onEditCourt}
					onDelete={onDeleteCourt}
				/>
			))}
		</div>
	)
}