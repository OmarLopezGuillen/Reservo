import { Badge } from "@/components/ui/badge"
import type { BookingManagement } from "@/models/booking.model"

interface BookingStatusBadgeProps {
	status: BookingManagement["status"]
}

const statusMap: Record<
	BookingManagement["status"],
	{ text: string; variant: "destructive" | "success" | "info" | "warning" }
> = {
	cancelled: { text: "Cancelada", variant: "destructive" },
	confirmed: { text: "Confirmada", variant: "success" },
	completed: { text: "Completada", variant: "info" },
	pending: { text: "Pendiente", variant: "warning" },
}

export const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
	const { text, variant } = statusMap[status] || {}
	return <Badge variant={variant}>{text}</Badge>
}
