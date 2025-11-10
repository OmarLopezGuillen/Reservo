import { Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router"
import { BusinessHours } from "./BusinessHours"

export function Footer() {
	const businessData = {
		id: "1",
		address: "Calle Falsa 123, Padelandia",
		phone: "123-456-7890",
		email: "contacto@reservo.com",
	}
	const isLoading = false
	const isError = false

	const schedule = [
		{
			day: "Lunes",
			hours: [
				{ start: "08:00", end: "13:00" },
				{ start: "15:00", end: "21:00" },
			],
		},
		{
			day: "Martes",
			hours: [
				{ start: "08:00", end: "13:00" },
				{ start: "15:00", end: "21:00" },
			],
		},
		{
			day: "Miércoles",
			hours: [
				{ start: "08:00", end: "13:00" },
				{ start: "15:00", end: "21:00" },
			],
		},
		{
			day: "Jueves",
			hours: [
				{ start: "08:00", end: "13:00" },
				{ start: "15:00", end: "21:00" },
			],
		},
		{
			day: "Viernes",
			hours: [
				{ start: "08:00", end: "13:00" },
				{ start: "15:00", end: "21:00" },
			],
		},
		{
			day: "Sábado",
			hours: [{ start: "09:00", end: "14:00" }],
		},
		{
			day: "Domingo",
			closed: true,
			hours: [],
		},
		{
			day: "*Festivos",
			closed: true,
			hours: [],
		},
	]

	return (
		<footer className="border-t bg-muted/50">
			<div className="container mx-auto px-4 py-12">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center space-x-2 mb-4">
							<div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-xs">
									R
								</span>
							</div>
							<span className="font-semibold">Reservo</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Sistema de reservas para pistas de pádel
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Contacto</h3>
						{isLoading ? (
							<p className="text-sm text-muted-foreground">Cargando...</p>
						) : isError || !businessData ? (
							<p className="text-sm text-muted-foreground">No disponible</p>
						) : (
							<div className="space-y-2 text-sm text-muted-foreground">
								{businessData.address && (
									<p className="flex items-center gap-2">
										<MapPin className="h-4 w-4" /> {businessData.address}
									</p>
								)}
								{businessData.phone && (
									<p className="flex items-center gap-2">
										<Phone className="h-4 w-4" /> {businessData.phone}
									</p>
								)}
								{businessData.email && (
									<p className="flex items-center gap-2">
										<Mail className="h-4 w-4" /> {businessData.email}
									</p>
								)}
							</div>
						)}
					</div>

					<div>
						<h3 className="font-semibold mb-4">Horarios</h3>
						{businessData?.id ? (
							<BusinessHours schedule={schedule} />
						) : (
							<p className="text-sm text-muted-foreground">Cargando...</p>
						)}
					</div>

					<div>
						<h3 className="font-semibold mb-4">Legal</h3>
						<div className="flex flex-col space-y-2 text-sm">
							<Link
								to="/legal/privacidad"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								Política de privacidad
							</Link>
							<Link
								to="/legal/terminos"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								Términos y condiciones
							</Link>
						</div>
					</div>
				</div>

				<div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
					<p>
						&copy; {new Date().getFullYear()} Reservo. Todos los derechos
						reservados.
					</p>
				</div>
			</div>
		</footer>
	)
}
