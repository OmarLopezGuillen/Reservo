import { differenceInMinutes, format } from "date-fns"
import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Court } from "@/models/court.model"

interface Booking {
	acceptsMaketing: boolean
	acceptsWhatsup: boolean
	checkInCode: string
	clubId: string
	courtId: string
	createdAt: string
	date: string // "yyyy-MM-dd"
	depositPercentage: number
	endTime: Date
	id: string
	note: string | null
	paymentMode: string
	paymentStatus: string
	price: number
	startTime: Date
	status: string
	updatedAt: string | null
	userId: string | null
}

const getEventHeight = (event: Booking) =>
	differenceInMinutes(event.endTime, event.startTime)

export function EventCard({
	booking,
	court,
}: {
	booking: Booking
	court: Court
}) {
	const height = getEventHeight(booking)

	return (
		<div className="@container w-full overflow-hidden">
			<div
				style={{ height, borderColor: court?.color ?? "" }}
				className="@[150px]:hidden flex flex-col items-center gap-1.5 p-2 rounded-lg bg-card transition-colors cursor-pointer border-2 relative mx-0.5"
			>
				{/* Time range */}
				<div className="text-center">
					<Clock className="h-3 w-3 mx-auto text-muted-foreground mb-0.5" />

					<div className="text-xs text-center leading-tight mt-1 text-muted-foreground">
						{getEventHeight(booking)} min
					</div>
				</div>

				{/* Payment status mini badge */}
				<div
					className={cn(
						"w-2 h-2 rounded-full mt-0.5 absolute top-0.5 right-1",
						booking.paymentStatus === "paid"
							? "bg-green-500"
							: booking.paymentStatus === "pending"
								? "bg-yellow-500"
								: "bg-red-500",
					)}
				/>
			</div>

			<Card
				className="hidden @[150px]:block py-0 border-2 mx-0.5"
				style={{ height, borderColor: court?.color ?? "" }}
			>
				<CardContent className="p-2 h-full">
					<div className="flex items-center justify-between h-full gap-2">
						{/* Left side: Time and Court */}
						<div className="flex flex-col justify-center text-xs leading-tight">
							<div className="font-semibold text-center">
								{format(booking.startTime, "HH:mm")} -{" "}
								{format(booking.endTime, "HH:mm")}
							</div>
							<div className="flex items-center justify-center gap-1 mt-1">
								<Clock className="h-3 w-3 text-muted-foreground" />
								<div className="text-xs text-center leading-tight text-muted-foreground">
									{getEventHeight(booking)} min
								</div>
							</div>
						</div>

						{/* Center: Status indicator */}
						<div className="flex items-center gap-2">
							<div
								className={cn(
									"h-2 w-2 rounded-full shrink-0",
									booking.paymentStatus === "paid"
										? "bg-green-500"
										: "bg-yellow-500",
								)}
							/>
							<div className="text-sm text-center leading-tight text-muted-foreground">
								{booking.paymentStatus === "paid" ? "Pagado" : "No pagado"}
							</div>
						</div>

						{/* Right side: Price */}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
