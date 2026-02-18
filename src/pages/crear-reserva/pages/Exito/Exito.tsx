import {
	Calendar,
	CheckCircle,
	Clock,
	Download,
	MapPin,
	MessageCircle,
	QrCode,
	Share2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/constants/ROUTES"
import { useCourtById } from "@/hooks/useCourtsQuery"
import {
	formatDateWeekDayMonthShort,
	formatPhoneForDisplay,
	formatPrice,
	formatTimeToHourMinute,
} from "@/lib/utils"
import type { Booking } from "@/models/booking.model"
import CopyToClipboard from "./components/CopyToClipboard"

const Exito = () => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const [booking, setBooking] = useState<Booking | null>(null)

	const { courtByIdQuery } = useCourtById(booking?.courtId ?? "")
	const { data: court, isLoading: isLoadingCourt } = courtByIdQuery

	const user = useAuthUser()

	useEffect(() => {
		const bookingParam = searchParams.get("booking")
		if (bookingParam) {
			const decodedBooking = JSON.parse(decodeURIComponent(bookingParam))
			setBooking(decodedBooking)
		} else {
			// Si no hay datos de reserva, redirigir al inicio
			navigate(ROUTES.HOME)
		}
	}, [searchParams, navigate])

	const handleDownloadCalendar = () => {}

	const handleShareWhatsApp = () => {}

	if (isLoadingCourt || !booking) {
		return <div>Cargando detalles de la reserva...</div>
	}

	const paidNow =
		booking.paymentMode === "full"
			? booking.price
			: booking.paymentMode === "deposit"
				? booking.price * ((booking.depositPercentage ?? 0) / 100)
				: 0
	const dueLater = booking.price - paidNow

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center space-x-2">
							<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-sm">
									R
								</span>
							</div>
							<span className="text-xl font-semibold">Reservo</span>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto space-y-6">
					{/* Success Message */}
					<Card>
						<CardContent className="pt-6">
							<div className="text-center space-y-4">
								<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
									<CheckCircle className="h-8 w-8 text-green-600" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-green-600">
										¡Reserva confirmada!
									</h1>
									<p className="text-muted-foreground">
										Tu pista está reservada. Te hemos enviado la confirmación
										por email.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Booking Details */}
					<Card>
						<CardHeader>
							<CardTitle>Detalles de la reserva</CardTitle>
							<CardDescription>
								Guarda esta información para el día de tu reserva
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<Calendar className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="font-medium">Fecha</p>
										<p className="text-sm text-muted-foreground">
											{formatDateWeekDayMonthShort(booking.date)}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<Clock className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="font-medium">Horario</p>

										<p className="text-sm text-muted-foreground">
											{formatTimeToHourMinute(booking.startTime)} -{" "}
											{formatTimeToHourMinute(booking.endTime)}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<MapPin className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="font-medium">Pista</p>
										<p className="text-sm text-muted-foreground">
											{court?.name} •{" "}
											{court?.type === "indoor" ? "Cubierta" : "Exterior"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<QrCode className="h-5 w-5 text-muted-foreground" />
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
									<p>{user.user_metadata.name}</p>
									<p className="text-muted-foreground">{user.email}</p>
									<p className="text-muted-foreground">
										{formatPhoneForDisplay("123456789")}
									</p>
									{booking.acceptsWhatsup && (
										<Badge variant="outline" className="text-xs">
											WhatsApp habilitado
										</Badge>
									)}
									{booking.acceptsMaketing && (
										<Badge variant="outline" className="text-xs ml-2">
											Marketing habilitado
										</Badge>
									)}
								</div>
							</div>

							<Separator />

							<div className="flex justify-between items-center">
								<span className="font-medium">Total pagado:</span>
								<span className="text-lg font-bold">
									{formatPrice(paidNow ?? 0)}
								</span>
							</div>

							<div className="flex justify-between items-center text-sm text-muted-foreground">
								<span>Pendiente en pista:</span>
								<span className="font-semibold">{formatPrice(dueLater)}</span>
							</div>

							<div className="text-xs text-muted-foreground">
								<p>ID de reserva: {booking.id}</p>
								<div className="flex items-center gap-2">
									<span>Estado:</span>
									{booking.status === "confirmed" && (
										<Badge
											variant="outline"
											className="text-green-700 border-green-600 bg-green-50"
										>
											Confirmada
										</Badge>
									)}
									{booking.status === "pending" && (
										<Badge
											variant="outline"
											className="text-orange-700 border-orange-600 bg-orange-50"
										>
											Pendiente
										</Badge>
									)}
									{booking.status === "cancelled" && (
										<Badge
											variant="outline"
											className="text-red-700 border-red-600 bg-red-50"
										>
											Cancelada
										</Badge>
									)}
									{booking.status === "completed" && (
										<Badge
											variant="outline"
											className="text-green-700 border-green-600 bg-green-50"
										>
											Completada
										</Badge>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Button
							onClick={handleDownloadCalendar}
							variant="outline"
							className="w-full bg-transparent"
						>
							<Download className="h-4 w-4 mr-2" />
							Añadir al calendario
						</Button>

						<Button
							onClick={handleShareWhatsApp}
							variant="outline"
							className="w-full bg-transparent"
						>
							<MessageCircle className="h-4 w-4 mr-2" />
							Compartir por WhatsApp
						</Button>

						<Button asChild variant="outline" className="w-full bg-transparent">
							<Link to={`/reserva/${booking.id}`}>
								<Share2 className="h-4 w-4 mr-2" />
								Gestionar reserva
							</Link>
						</Button>
					</div>

					{/* Important Info */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Información importante</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex items-start gap-2">
								<div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
								<p>Llega 10 minutos antes de tu horario reservado</p>
							</div>
							<div className="flex items-start gap-2">
								<div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
								<p>
									Presenta tu código de acceso{" "}
									<strong>{booking.checkInCode}</strong> en recepción
								</p>
							</div>
							<div className="flex items-start gap-2">
								<div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
								<p>
									Puedes modificar o cancelar tu reserva hasta 24 horas antes
								</p>
							</div>
							<div className="flex items-start gap-2">
								<div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
								<p>En caso de lluvia, las pistas cubiertas están disponibles</p>
							</div>
						</CardContent>
					</Card>

					{/* Back to Home */}
					<div className="text-center">
						<Button asChild size="lg">
							<Link to={ROUTES.HOME}>Volver al inicio</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Exito
