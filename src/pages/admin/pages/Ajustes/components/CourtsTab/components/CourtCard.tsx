import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Court } from "@/models/court.model"
import { Edit, Eye, EyeOff, MapPin, Trash2 } from "lucide-react"

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
		<Card className="flex flex-col h-full">
			<CardContent className="p-4 sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between h-full">
					{/* Court Info */}
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
						<div className="flex items-start gap-4">
							<MapPin className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
							<div className="flex flex-col gap-1">
								{/* Name and Price */}
								<div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
									<h3 className="text-lg font-semibold">{court.name}</h3>
									<p className="text-sm text-muted-foreground sm:text-base">
										({court.price}€)
									</p>
								</div>
								{/* Color, Type, and Status */}
								<div className="flex items-center gap-2 flex-wrap">
									<div
										className="h-4 w-4 rounded-full border"
										style={{ backgroundColor: court.color || "#000" }}
									/>
									<Badge
										variant={court.type === "indoor" ? "default" : "outline"}
									>
										{court.type === "indoor" ? "Cubierta" : "Exterior"}
									</Badge>
									<Badge variant={court.isActive ? "default" : "secondary"}>
										{court.isActive ? "Activa" : "Inactiva"}
									</Badge>
								</div>
								{court.description && (
									<p className="text-sm text-muted-foreground mt-1">
										{court.description}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={() => onToggleActive(court)}>
							{court.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							<span className="sr-only">{court.isActive ? "Desactivar" : "Activar"}</span>
						</Button>
						<Button variant="ghost" size="icon" onClick={() => onEdit(court)}>
							<Edit className="h-4 w-4" />
							<span className="sr-only">Editar</span>
						</Button>
						<Button variant="ghost" size="icon" onClick={() => onDelete(court.id)} className="hover:text-destructive">
							<Trash2 className="h-4 w-4" />
							<span className="sr-only">Eliminar</span>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}