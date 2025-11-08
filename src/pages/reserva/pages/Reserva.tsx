import { useParams } from "react-router"

const Reserva = () => {
	const { reservaId } = useParams()
	return <div>Reserva {reservaId}</div>
}
export default Reserva
