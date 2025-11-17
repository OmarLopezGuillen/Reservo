import { ArrowLeft, CreditCard, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router" // Importar useSearchParams
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useBookingsMutation } from "@/hooks/useBookingsMutations"
import type { BookingsInsert } from "@/models/dbTypes"
import type { UISlot } from "@/models/slots.model"
import { ROUTES } from "@/ROUTES"
import BookingSummary from "./components/BookingSummary"

const CrearReserva = () => {
	const user = useAuthUser()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const slotParam = searchParams.get("slot")
	const { createBooking } = useBookingsMutation()
	const [selectedSlot, setSelectedSlot] = useState<UISlot>()

	useEffect(() => {
		if (slotParam) {
			try {
				const parsedSlot: UISlot = JSON.parse(
					decodeURIComponent(slotParam),
					(key, value) => {
						if (key === "startTime" || key === "endTime") return new Date(value)
						return value
					},
				)
				setSelectedSlot(parsedSlot)
			} catch (error) {
				console.error("Error al parsear el slot de la URL:", error)
				navigate(ROUTES.HOME, { replace: true })
			}
		} else {
			// Si no hay slot en la URL, redirigir al home
			navigate(ROUTES.HOME, { replace: true })
		}
	}, [slotParam, navigate]) // Dependencia para que se ejecute cuando cambie el parámetro 'slot'
	const [acceptsTerms, setAcceptsTerms] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)

	const handleConfirmBooking = async () => {
		if (!selectedSlot) {
			console.error("Intento de confirmar reserva sin un slot seleccionado.")
			return
		}

		setIsProcessing(true)

		try {
			// TODO: Integrar con pasarela de pago (Stripe, PayPal, etc.)

			const Booking: BookingsInsert = {
				club_id: selectedSlot.clubId,
				court_id: selectedSlot.courtId,
				price: selectedSlot.price,
				start_time: selectedSlot.startTime.toISOString(),
				date: selectedSlot.date,
				end_time: selectedSlot.endTime.toISOString(),
				user_id: user.id,
				accepts_maketing: false, // TODO: Rellenar con datos reales
				accepts_whatsup: false, // TODO: Rellenar con datos reales
				deposit_percentage: 0,
				payment_mode: "none",
				payment_status: "pending",
				status: "confirmed",
			}
			const newBooking = await createBooking.mutateAsync(Booking)
			const encodedBooking = encodeURIComponent(JSON.stringify(newBooking))
			navigate(`${ROUTES.CREAR_RESERVA.EXITO}?booking=${encodedBooking}`, {
				replace: true,
			})
		} catch (err) {
			alert(
				`Ocurrió un error inesperado al confirmar la reserva. Inténtalo de nuevo más tarde.\n${err}`,
			)
		} finally {
			setIsProcessing(false)
		}
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" asChild>
							<Link to={ROUTES.HOME}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Volver
							</Link>
						</Button>
						<h1 className="text-2xl font-bold">Confirmar reserva</h1>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Payment Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Payment Method */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CreditCard className="h-5 w-5" />
									Método de pago
								</CardTitle>
								<CardDescription>
									El pago se realiza en las instalaciones
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="p-4 border rounded-lg bg-muted/50 text-center">
									<Info className="h-8 w-8 mx-auto mb-2 text-primary" />
									<h3 className="font-semibold">Pago en pista</h3>
									<p className="text-sm text-muted-foreground mt-1">
										El importe total se abonará en persona el día de la reserva.
										<br />
										Se acepta pago en efectivo y con tarjeta.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Cancellation Policy */}
						<Card>
							<CardHeader>
								<CardTitle>Política de cancelación</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3 text-sm">
									<p>
										<strong>Cancelación gratuita:</strong> Hasta 24 horas antes
										del inicio
									</p>
									<p>
										<strong>Cancelación tardía:</strong> Penalización del 100%
										del importe total
									</p>
									<p className="text-muted-foreground">
										Puedes modificar o cancelar tu reserva desde tu email de
										confirmación
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Terms Acceptance */}
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-start space-x-2">
									<Checkbox
										id="terms"
										checked={acceptsTerms}
										onCheckedChange={(checked) => setAcceptsTerms(!!checked)}
										className="cursor-pointer"
									/>
									<Label htmlFor="terms" className="text-sm leading-relaxed">
										Acepto los{" "}
										<Link
											to={ROUTES.LEGAL.TERMINOS}
											className="underline hover:text-primary"
										>
											términos y condiciones
										</Link>
										, la{" "}
										<Link
											to={ROUTES.LEGAL.PRIVACIDAD}
											className="underline hover:text-primary"
										>
											política de privacidad
										</Link>{" "}
										y la política de cancelación descrita arriba.
									</Label>
								</div>
							</CardContent>
						</Card>

						<Button
							className="w-full cursor-pointer"
							size="lg"
							onClick={handleConfirmBooking}
							disabled={!selectedSlot || !acceptsTerms || isProcessing}
						>
							{isProcessing ? "Procesando reserva..." : "Confirmar reserva"}
						</Button>
					</div>

					{/* Summary */}
					<div className="lg:col-span-1">
						<BookingSummary selectedSlot={selectedSlot!} />
					</div>
				</div>
			</div>
		</div>
	)
}
export default CrearReserva
