import { useParams } from "react-router"

const CompetitionId = () => {
	const { competicionId } = useParams<{ competicionId: string }>()
	return <div className="">Competición ID: {competicionId}</div>
}
export default CompetitionId
