import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Court } from "@/models/court.model"

interface CourtsStatsProps {
	courts: Court[] | undefined
}

export function CourtsStats({ courts }: CourtsStatsProps) {
	const activeCourts = courts?.filter((c) => c.isActive).length ?? 0
	const outdoorCourts = courts?.filter((c) => c.type === "outdoor").length ?? 0
	const indoorCourts = courts?.filter((c) => c.type === "indoor").length ?? 0

	return (
		<div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Total pistas</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{courts?.length ?? 0}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Pistas activas</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-600">{activeCourts}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">
						Pistas descubiertas
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-blue-600">{outdoorCourts}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Pistas cubiertas</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-blue-600">{indoorCourts}</div>
				</CardContent>
			</Card>
		</div>
	)
}