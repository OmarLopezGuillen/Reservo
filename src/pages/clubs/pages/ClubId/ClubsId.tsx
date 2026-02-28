import { ArrowLeft } from "lucide-react"
import { Link, Navigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/ROUTES"
import { useBookingsCalendar } from "@/hooks/useBookingsQuery"
import { useClubHours } from "@/hooks/useClubHoursQuery"
import { useCourts } from "@/hooks/useCourtsQuery"
import CourtCalendar from "./components/CourtCalendar/CourtCalendar"

const ClubsId = () => {
	const { clubId: clubIdFromUrl } = useParams<{ clubId: string }>()

	const clubId = clubIdFromUrl

	const { bookingCalendarQuery } = useBookingsCalendar(clubId)
	const { data: bookingsData, isLoading: isLoadingBookings } =
		bookingCalendarQuery

	const { courtsQuery } = useCourts(clubId)
	const { data: courtsData, isLoading: isLoadingCourts } = courtsQuery

	const { clubHoursQuery } = useClubHours(clubId)
	const { data: clubHoursData, isLoading: isLoadingClubHours } = clubHoursQuery

	if (!clubId) {
		return <Navigate to={ROUTES.NOT_FOUND} replace />
	}

	if (isLoadingBookings || isLoadingCourts || isLoadingClubHours) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<p>Cargando horarios...</p>
			</div>
		)
	}

	if (!courtsData?.length || !clubHoursData) {
		return <Navigate to={ROUTES.NOT_FOUND} replace />
	}

	const bookings = bookingsData || []
	const courts = courtsData || []

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" asChild>
							<Link to={ROUTES.CLUBS.ROOT}>
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
					<div className="lg:col-span-20">
						<CourtCalendar
							courts={courts}
							bookings={bookings}
							clubHours={clubHoursData}
							clubId={clubId}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
export default ClubsId
