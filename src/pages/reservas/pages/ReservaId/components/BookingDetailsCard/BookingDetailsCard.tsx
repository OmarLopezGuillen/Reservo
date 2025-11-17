import { Separator } from "@radix-ui/react-separator"
import { Building, Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	formatDateWeekDayMonthShort,
	formatPrice,
	formatTimeToHourMinute,
} from "@/lib/utils"
import type { BookingManagement } from "@/models/booking.model"
import CopyToClipboard from "@/pages/crear-reserva/pages/Exito/components/CopyToClipboard"
import { BookingStatusBadge } from "./components/BookingStatusBadge"
import { PaymentStatusBadge } from "./components/PaymentStatusBadge"

const BookingDetailItem = ({
	icon: Icon,
	label,
	children,
}: {
	icon: React.ElementType
	label: string
	children: React.ReactNode
}) => (
	<div className="flex items-center gap-3">
		<Icon className="h-5 w-5 text-muted-foreground" />
		<div>
			<p className="font-medium">{label}</p>
			<p className="text-sm text-muted-foreground">{children}</p>
		</div>
	</div>
)

export const BookingDetailsCard = ({
	booking,
	user,
}: {
	booking: BookingManagement
	user: { email: string; phone: string }
}) => (
	<Card>
		<CardHeader>
			<div className="flex items-center justify-between">
				<CardTitle>Detalles de la reserva</CardTitle>
				<BookingStatusBadge status={booking.status} />
			</div>
		</CardHeader>
		<CardContent className="space-y-4">
			<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
				<Building className="h-5 w-5 text-muted-foreground" />
				<div>
					<p className="font-medium">Club</p>
					<p className="text-sm text-muted-foreground">{booking.club.name}</p>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<BookingDetailItem icon={Calendar} label="Fecha">
					{formatDateWeekDayMonthShort(booking.date)}
				</BookingDetailItem>
				<BookingDetailItem icon={Clock} label="Horario">
					{formatTimeToHourMinute(booking.startTime)} -{" "}
					{formatTimeToHourMinute(booking.endTime)}
				</BookingDetailItem>
				<BookingDetailItem icon={MapPin} label="Pista">
					{booking.court.name} •{" "}
					{booking.court.type === "indoor" ? "Cubierta" : "Exterior"}
				</BookingDetailItem>
				<div className="flex items-center gap-3">
					<div className="h-5 w-5" />
					<div>
						<p className="font-medium">Código de acceso</p>
						<CopyToClipboard textToCopy={booking.checkInCode} />
					</div>
				</div>
			</div>
			<Separator />
			<div className="space-y-2">
				<h4 className="font-medium">Datos del cliente</h4>
				<div className="text-sm space-y-1">
					<p className="text-muted-foreground">Email: {user.email}</p>
					<p className="text-muted-foreground">Teléfono: {user.phone}</p>
				</div>
			</div>
			<Separator />
			<div className="space-y-2">
				<div className="flex justify-between items-center">
					<span className="font-medium">Total:</span>
					<span className="text-lg font-bold">
						{formatPrice(booking.price)}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Estado de pago:</span>
					<PaymentStatusBadge status={booking.paymentStatus} />
				</div>
			</div>
		</CardContent>
	</Card>
)
