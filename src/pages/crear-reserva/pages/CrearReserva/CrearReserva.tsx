import { ArrowLeft } from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import { useBookings } from "@/hooks/useBookingsQuery"
import { useClubHours } from "@/hooks/useClubHoursQuery"
import { useCourts } from "@/hooks/useCourtsQuery"
import type { UISlot } from "@/models/UI.models"
import { ROUTES } from "@/ROUTES"
import BookingSummary from "./components/BookingSummary"
import CourtCalendar from "./components/CourtCalendar"
import DateNavigator from "./components/DateNavigator"

const CrearReserva = () => {
	const user = useAuthUser()
	// TODO: Traer el id de la URL y si es admin de la variable club_id.
	const clubId = "a32a865d-3ecc-448b-a38d-9da8a10cca59"

	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [selectedSlot] = useState<UISlot | null>(null)

	const { bookingsQuery } = useBookings(clubId)
	const { data: bookingsData, isLoading: isLoadingBookings } = bookingsQuery

	const { courtsQuery } = useCourts(clubId)
	const { data: courtsData, isLoading: isLoadingCourts } = courtsQuery

	const { clubHoursQuery } = useClubHours(clubId)
	const { data: clubHoursData, isLoading: isLoadingClubHours } = clubHoursQuery

	const bookings = useMemo(() => bookingsData || [], [bookingsData])
	console.log("Booking: ", bookings)
	const courts = useMemo(() => courtsData || [], [courtsData])

	const handleSubmit = () => {}

	if (isLoadingBookings || isLoadingCourts || isLoadingClubHours) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<p>Cargando horarios...</p>
			</div>
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
						<h1 className="text-2xl font-bold">Reservar pista</h1>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<DateNavigator
							selectedDate={selectedDate}
							onSelectDate={setSelectedDate}
						/>
					</div>

					<div className="lg:col-span-1">
						<BookingSummary
							selectedSlot={selectedSlot}
							onSubmit={handleSubmit}
						/>
					</div>
					<div className="lg:col-span-20">
						<CourtCalendar
							courts={courts}
							bookings={bookings}
							clubHours={clubHoursData}
							currentUserId={user?.id}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
export default CrearReserva
