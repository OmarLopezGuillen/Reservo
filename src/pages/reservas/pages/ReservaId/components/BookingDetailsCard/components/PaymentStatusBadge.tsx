import { Badge } from "@/components/ui/badge"
import type { BookingManagement } from "@/models/booking.model"

interface PaymentStatusBadgeProps {
	status: BookingManagement["paymentStatus"]
}

const statusMap: Record<
	BookingManagement["paymentStatus"],
	{ text: string; variant: "success" | "warning" | "info" }
> = {
	paid: { text: "Pagado", variant: "success" },
	pending: { text: "Pendiente de pago", variant: "warning" },
	refunded: { text: "Reembolsado", variant: "info" },
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
	const { text, variant } = statusMap[status]
	return <Badge variant={variant}>{text}</Badge>
}
