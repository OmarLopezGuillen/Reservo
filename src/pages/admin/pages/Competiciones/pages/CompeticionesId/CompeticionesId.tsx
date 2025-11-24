import { useParams } from "react-router"

const CompeticionesId = () => {
	const { competicionId } = useParams<{ competicionId: string }>()

	return (
		<div className="min-h-screen bg-background">
			Competicion con id:
			{competicionId}
		</div>
	)
}
export default CompeticionesId
