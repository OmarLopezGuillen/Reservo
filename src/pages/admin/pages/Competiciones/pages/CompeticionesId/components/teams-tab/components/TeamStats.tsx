import { Card, CardContent } from "@/components/ui/card"

interface TeamStatsProps {
	stats: {
		total: number
		enrolled: number
		pending: number
		withdrawn: number
	}
}

export const TeamStats = ({ stats }: TeamStatsProps) => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Card>
				<CardContent className="pt-6">
					<div className="text-2xl font-bold">{stats.total}</div>
					<p className="text-xs text-muted-foreground">Total Equipos</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="pt-6">
					<div className="text-2xl font-bold text-green-600">
						{stats.enrolled}
					</div>
					<p className="text-xs text-muted-foreground">Completos</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="pt-6">
					<div className="text-2xl font-bold text-yellow-600">
						{stats.pending}
					</div>
					<p className="text-xs text-muted-foreground">Pendientes</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="pt-6">
					<div className="text-2xl font-bold text-red-600">
						{stats.withdrawn}
					</div>
					<p className="text-xs text-muted-foreground">Cancelados</p>
				</CardContent>
			</Card>
		</div>
	)
}
