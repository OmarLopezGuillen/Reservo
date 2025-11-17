import { Separator } from "@radix-ui/react-separator"
import { ArrowLeft, Building, Calendar, Clock, MapPin } from "lucide-react"
import { useMemo } from "react"
import { Link } from "react-router"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useMyBookings } from "@/hooks/useBookingsQuery"
import {
	formatDateWeekDayMonthShort,
	formatPrice,
	formatTimeToHourMinute,
} from "@/lib/utils"
import type { Booking, BookingManagement } from "@/models/booking.model"
import { ROUTES } from "@/ROUTES"

const Reservas = () => {
	const { myBookingsQuery } = useMyBookings()
	const {
		data: bookings,
		isLoading: isLoadingBookings,
		isError,
		error,
	} = myBookingsQuery
	console.log("Bookings:", bookings)

	const { completedBookings, otherBookings } = useMemo(() => {
		const completed = bookings?.filter((b) => b.status === "completed") ?? []
		const other = bookings?.filter((b) => b.status !== "completed") ?? []
		return { completedBookings: completed, otherBookings: other }
	}, [bookings])

	if (!bookings && isLoadingBookings) {
		return (
			<div className="flex justify-center mt-8">
				<Spinner />
			</div>
		)
	}

	const renderBookingCard = (b: BookingManagement, isCompleted = false) => {
		const statusEl =
			b.status === "confirmed" ? (
				<Badge className="bg-green-600 text-white hover:bg-green-600">
					Confirmada
				</Badge>
			) : b.status === "pending" ? (
				<Badge variant="secondary">Pendiente</Badge>
			) : b.status === "cancelled" ? (
				<Badge variant="destructive">Cancelada</Badge>
			) : (
				<Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
					Completada
				</Badge>
			)

		return (
			<Card
				key={b.id}
				className={`group transition-all hover:shadow-md ${
					isCompleted ? "opacity-70" : ""
				}`}
			>
				<CardHeader className="flex flex-row items-center justify-between">
					<div className="space-y-1.5">
						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<Building className="h-3 w-3" />
							{b.club.name}
						</p>
						<CardTitle className="text-lg">{b.court.name ?? "Pista"}</CardTitle>
						<CardDescription className="flex items-center gap-4 flex-wrap pt-1">
							<span className="inline-flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								{formatDateWeekDayMonthShort(b.date)}
							</span>
							<span className="inline-flex items-center gap-1 font-mono">
								<Clock className="h-4 w-4" />
								{formatTimeToHourMinute(b.startTime)} –{" "}
								{formatTimeToHourMinute(b.endTime)}
							</span>
							<span className="inline-flex items-center gap-1">
								<MapPin className="h-4 w-4" />
								{b.court.type === "indoor" ? "Cubierta" : "Exterior"}
							</span>
						</CardDescription>
					</div>

					<div className="flex items-center gap-2">
						{statusEl}
						<Badge variant="outline" className="font-mono">
							{b.checkInCode}
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<div className="flex items-center justify-between">
						<div className="text-sm text-muted-foreground">
							Total:{" "}
							<span className="font-semibold text-foreground">
								{formatPrice(b.price)}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<Button asChild={!isCompleted} size="sm" disabled={isCompleted}>
								{isCompleted ? (
									<span>Gestionar</span>
								) : (
									<Link to={ROUTES.RESERVAS.ID(b.id)}>Gestionar</Link>
								)}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" asChild>
							<Link to={ROUTES.HOME}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Volver
							</Link>
						</Button>
						<h1 className="text-2xl font-bold">Mis reservas</h1>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8 max-w-3xl">
				{/* Estado de carga / error */}
				{isError && (
					<Alert variant="destructive" className="mb-6">
						<AlertDescription>{error?.message}</AlertDescription>
					</Alert>
				)}

				{!isLoadingBookings && !isError && bookings?.length === 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Aún no tienes reservas</CardTitle>
							<CardDescription>
								Cuando reserves, aparecerán aquí.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild>
								<Link to={ROUTES.CLUBS.ROOT}>Reservar ahora</Link>
							</Button>
						</CardContent>
					</Card>
				)}

				{/* Lista de reservas */}
				{!isLoadingBookings && bookings && bookings.length > 0 && (
					<div className="space-y-4">
						{otherBookings.map((b) => renderBookingCard(b))}
						{completedBookings.length > 0 && otherBookings.length > 0 && (
							<Separator className="my-8" />
						)}
						{completedBookings.length > 0 && (
							<>
								<h2 className="text-lg font-semibold text-muted-foreground">
									Reservas completadas
								</h2>
								{completedBookings.map((b) => renderBookingCard(b, true))}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default Reservas
