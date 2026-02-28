type UpcomingMatchesHeaderProps = {
	title: string
}

export const UpcomingMatchesHeader = ({
	title,
}: UpcomingMatchesHeaderProps) => {
	return (
		<div className="space-y-1">
			<h2 className="text-2xl font-semibold">{title}</h2>
			<p className="text-sm text-muted-foreground">
				Partidos programados de tus ligas.
			</p>
		</div>
	)
}
