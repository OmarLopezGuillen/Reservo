import { useParams } from "react-router"

const ClubsId = () => {
	const { clubId } = useParams()
	return <div>Club {clubId}</div>
}
export default ClubsId
