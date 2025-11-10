import { Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Court {
	img: string
	alt: string
	title: string
	badge: string
	description: string
	price: string
	time: string
}

interface CourtCardProps {
	court: Court
}

export const CourtCard = ({ court }: CourtCardProps) => {
	const { alt, badge, description, img, price, time, title } = court
	return (
		<Card className="pt-0">
			<div className="rounded-t-lg overflow-hidden">
				<img src={img} alt={alt} className="w-full h-full object-cover" />
			</div>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{title}</CardTitle>
					<Badge variant="default">{badge}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4" />
						<span>{description}</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4" />
						<span>Disponible {time}</span>
					</div>
				</div>
				<div className="mt-4 text-lg font-semibold">{price}</div>
			</CardContent>
		</Card>
	)
}
