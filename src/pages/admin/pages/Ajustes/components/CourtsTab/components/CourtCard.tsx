import { Edit, Eye, EyeOff, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Court } from "@/models/court.model"

interface CourtCardProps {
	court: Court
	onToggleActive: (court: Court) => void
	onEdit: (court: Court) => void
	onDelete: (id: string) => void
}

export function CourtCard({
	court,
	onToggleActive,
	onEdit,
	onDelete,
}: CourtCardProps) {
	return (
		<Card className="group flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border/60">
			<CardContent className="px-5 sm:px-6 flex flex-col justify-between h-full gap-4">
				{/* Top section */}
				<div className="flex gap-4">
					{/* Color indicator */}
					<div
						className="w-1.5 rounded-full shrink-0"
						style={{ backgroundColor: court.color || "#000" }}
					/>

					{/* Info */}
					<div className="flex flex-col flex-1 gap-1">
						{/* Name and price */}
						<div className="flex flex-col justify-between gap-1">
							<div className="flex items-center justify-between gap-2 flex-wrap">
								<h3 className="text-base sm:text-lg font-semibold leading-none">
									{court.name}
								</h3>

								<span className="text-lg font-bold">{court.price}€</span>
							</div>

							{/* Status badge */}
							<div className="flex items-center flex-wrap gap-1 ">
								<Badge
									variant={court.isActive ? "default" : "secondary"}
									className="text-xs"
								>
									{court.isActive ? "Activa" : "Inactiva"}
								</Badge>
								{/* Type badge */}
								<Badge
									variant={court.type === "indoor" ? "default" : "outline"}
									className="text-xs"
								>
									{court.type === "indoor" ? "Cubierta" : "Exterior"}
								</Badge>
							</div>
						</div>

						{/* Description */}
						{court.description && (
							<p className="text-sm text-muted-foreground mt-2 line-clamp-2">
								{court.description}
							</p>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onToggleActive(court)}
						className="hover:bg-muted"
					>
						{court.isActive ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</Button>

					<Button
						variant="ghost"
						size="icon"
						onClick={() => onEdit(court)}
						className="hover:bg-muted"
					>
						<Edit className="h-4 w-4" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						onClick={() => onDelete(court.id)}
						className="hover:bg-destructive/10 hover:text-destructive"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
