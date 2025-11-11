import { useParams } from "react-router"

const ReservaId = () => {
	const { reservaId } = useParams()
	return <div>Reserva {reservaId}</div>
}
export default ReservaId
