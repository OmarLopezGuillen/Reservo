import { ChevronRight, MapPin } from "lucide-react"
import { Link } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import type { BusinessData } from "@/models/business.model"
import { ROUTES } from "@/ROUTES"

interface ClubCardProps {
	club: BusinessData
}

export const ClubCard = ({ club }: ClubCardProps) => {
	return (
		<Link
			to={ROUTES.CLUBS.ID(club.id)}
			className="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl block"
		>
			<Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 border-2 overflow-hidden bg-card">
				<div className="relative h-48 bg-gradient-to-br from-primary/90 via-accent/80 to-primary/70 overflow-hidden">
					<img
						src={`/padel-court-modern-.jpg?height=200&width=400&query=padel+court+modern+${encodeURIComponent(club.name)}`}
						alt={`${club.name} - Cancha de pádel`}
						className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
					<div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
						<span className="text-xs font-semibold text-primary">
							Reserva ya
						</span>
					</div>
				</div>

				<CardContent className="p-6 space-y-3">
					<h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 text-balance">
						{club.name}
					</h3>

					<div className="flex items-start gap-2 text-sm text-muted-foreground">
						<MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
						<span className="line-clamp-2 leading-relaxed">{club.address}</span>
					</div>

					<div className="pt-2 flex items-center justify-between text-sm font-medium text-primary group-hover:gap-2 transition-all">
						<span>Ver disponibilidad</span>
						<ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
