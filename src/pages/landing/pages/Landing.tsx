import { CalendarDays, Users, Zap } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { ROUTES } from "@/ROUTES"

const Landing = () => {
	return (
		<div className="min-h-screen">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-sm">
									R
								</span>
							</div>
							<span className="text-xl font-semibold">Reservo</span>
						</div>
						<nav className="hidden md:flex items-center space-x-6">
							<Link
								to={ROUTES.LOGIN}
								className="text-sm font-medium hover:text-primary transition-colors"
							>
								Acceder
							</Link>
							<Button asChild>
								<Link to={ROUTES.REGISTER}>Registrar mi negocio</Link>
							</Button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 lg:py-32 relative overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
							Gestiona tu negocio de pistas deportivas sin esfuerzo
						</h1>
						<p className="text-xl text-muted-foreground text-balance mb-8">
							Reservo es el software de gestión y reservas online que te ayuda a
							optimizar tu tiempo y aumentar tus ingresos.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg" className="text-lg px-8">
								<Link to={ROUTES.REGISTER}>Empieza ahora</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="py-20 bg-muted/50">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">
							¿Por qué elegir Reservo?
						</h2>
						<p className="text-lg text-muted-foreground">
							La forma más fácil de gestionar tus reservas de pádel
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
									<Zap className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Reserva instantánea</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Tus clientes reservan en menos de 2 minutos. Sin llamadas, sin
									esperas.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
									<CalendarDays className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Disponibilidad en tiempo real</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Tu calendario se actualiza al momento, evitando overbooking y
									confusiones.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
									<Users className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Gestión fácil</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Administra tus pistas, horarios y clientes desde un único
									panel de control.
								</CardDescription>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
						<p className="text-lg text-muted-foreground mb-8">
							Digitaliza tu negocio y ofrece la mejor experiencia a tus
							clientes.
						</p>
						<Button asChild size="lg" className="text-lg px-8">
							<Link to={ROUTES.REGISTER}>Crear mi cuenta</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Landing
