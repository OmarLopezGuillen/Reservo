import {
	CalendarDays,
	Dumbbell,
	Menu,
	MessageCircle,
	ShoppingBasket,
	Star,
	Users,
	Utensils,
	Zap,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { useAuthActions } from "@/auth/hooks/useAuthActions"
import { useAuthStore } from "@/auth/stores/auth.store"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { ROLES } from "@/models/ROLES.model"
import { CourtCard } from "@/pages/home/components/CourtCard"
import { Footer } from "@/pages/home/components/Footer"
import { ROUTES } from "@/ROUTES"

const NavLinks = () => {
	const { user } = useAuthStore()
	const role = user?.userRole
	const { signOut } = useAuthActions()

	if (user) {
		return (
			<>
				<Link
					to={ROUTES.RESERVAS.ROOT}
					className="text-sm font-medium hover:text-primary transition-colors duration-200"
				>
					Mis reservas
				</Link>
				{role && [ROLES.ADMIN, ROLES.OWNER].includes(role) && (
					<Link
						to={ROUTES.ADMIN.ROOT}
						className="text-sm font-medium hover:text-primary"
					>
						Panel de administración
					</Link>
				)}
				<Button
					onClick={() => signOut()}
					variant="destructive"
					className="text-sm font-medium transition-colors cursor-pointer"
				>
					Cerrar sesión
				</Button>
			</>
		)
	}

	return (
		<>
			<Link
				to={ROUTES.CREAR_RESERVA.ROOT}
				className="text-sm font-medium hover:text-primary transition-colors duration-200"
			>
				Reservar
			</Link>
			<Link
				to={ROUTES.ADMIN.ROOT}
				className="text-sm font-medium bg-primary text-primary-foreground transition-colors duration-200 p-2 rounded-md"
			>
				Iniciar sesión
			</Link>
		</>
	)
}

const Home = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const stars = [1, 2, 3, 4, 5]

	const courts = [
		{
			img: "https://placehold.co/600x400/3b82f6/white?text=Pista+Exterior",
			alt: "Pista de pádel exterior",
			title: "Pista Exterior",
			badge: "Cristal",
			description: "Césped artificial World Padel Tour",
			price: "25€ / 90 min",
			time: "9:00 - 23:00",
		},
		{
			img: "https://placehold.co/600x400/10b981/white?text=Pista+Cubierta",
			alt: "Pista de pádel cubierta",
			title: "Pista Cubierta",
			badge: "Indoor",
			description: "Ideal para días de lluvia o mucho sol",
			price: "30€ / 90 min",
			time: "9:00 - 23:00",
		},
		{
			img: "https://placehold.co/600x400/8b5cf6/white?text=Pista+PRO",
			alt: "Pista de pádel profesional",
			title: "Pista Central PRO",
			badge: "Competición",
			description: "La misma que usan los profesionales",
			price: "35€ / 90 min",
			time: "9:00 - 23:00",
		},
	]

	return (
		<div className="min-h-screen bg-background text-foreground">
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
							<span className="text-xl font-semibold">Padel Club</span>
						</div>
						{/* Desktop Nav */}
						<nav className="hidden md:flex items-center space-x-6">
							<NavLinks />
						</nav>
						{/* Mobile Nav Button */}
						<div className="md:hidden">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
							>
								<Menu className="h-6 w-6" />
								<span className="sr-only">Abrir menú</span>
							</Button>
						</div>
					</div>
				</div>
				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden absolute top-full left-0 w-full bg-background border-b z-50">
						<nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
							<NavLinks />
						</nav>
					</div>
				)}
			</header>

			{/* Hero Section */}
			<section className="py-20 lg:py-32 relative overflow-hidden">
				<div className="container  mx-auto px-4">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="max-w-2xl">
							<h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
								Tu club de pádel de referencia
							</h1>
							<p className="text-xl text-muted-foreground text-balance mb-8">
								Instalaciones de primera, reservas online sencillas y una
								comunidad apasionada. Vive la mejor experiencia de pádel.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button asChild size="lg" className="text-xl px-8">
									<Link to={ROUTES.CLUBS.ROOT}>Reservar ahora</Link>
								</Button>
							</div>
						</div>

						<div className="relative mx-4">
							<div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
								<img
									src="https://placehold.co/800x600/1e40af/white?text=Padel+Club"
									alt="Pista de pádel moderna con jugadores"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="absolute -bottom-6 -left-6 bg-background border rounded-lg p-4 shadow-lg">
								<div className="text-2xl font-bold text-primary">1000+</div>
								<div className="text-sm text-muted-foreground">
									Partidos al mes
								</div>
							</div>
							<div className="absolute -top-6 -right-6 bg-background border rounded-lg p-4 shadow-lg">
								<div className="text-2xl font-bold text-primary">4.9★</div>
								<div className="text-sm text-muted-foreground">
									Valoración media
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 bg-muted">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
						<p className="text-lg text-muted-foreground">
							Ofrecemos una experiencia de pádel inigualable.
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="text-center">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto mb-4">
								<Zap className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Reservas al instante
							</h3>
							<p className="text-muted-foreground">
								Nuestro sistema online te permite reservar pista en segundos,
								sin complicaciones.
							</p>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto mb-4">
								<Users className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Comunidad activa</h3>
							<p className="text-muted-foreground">
								Únete a nuestra comunidad de jugadores, participa en torneos y
								mejora tu nivel.
							</p>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto mb-4">
								<CalendarDays className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Eventos y torneos</h3>
							<p className="text-muted-foreground">
								Organizamos eventos y torneos para todos los niveles. ¡Compite y
								diviértete!
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Courts Preview */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">Nuestras pistas</h2>
						<p className="text-lg text-muted-foreground">
							Instalaciones de primera calidad para tu mejor juego.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
						<CourtCard court={courts[0]} />
						<CourtCard court={courts[1]} />
						<CourtCard court={courts[2]} />
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section id="services" className="py-20 bg-muted">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">Nuestros Servicios</h2>
						<p className="text-lg text-muted-foreground">
							Todo lo que necesitas para disfrutar del pádel al máximo.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
									<Dumbbell className="h-8 w-8" />
								</div>
							</CardHeader>
							<CardContent>
								<h3 className="text-xl font-semibold mb-2">Clases de pádel</h3>
								<p className="text-muted-foreground">
									Mejora tu técnica con nuestros entrenadores certificados.
								</p>
							</CardContent>
						</Card>
						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
									<ShoppingBasket className="h-8 w-8" />
								</div>
							</CardHeader>
							<CardContent>
								<h3 className="text-xl font-semibold mb-2">Tienda deportiva</h3>
								<p className="text-muted-foreground">
									Equípate con las mejores marcas de palas, ropa y accesorios.
								</p>
							</CardContent>
						</Card>
						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
									<Utensils className="h-8 w-8" />
								</div>
							</CardHeader>
							<CardContent>
								<h3 className="text-xl font-semibold mb-2">Cafetería & Bar</h3>
								<p className="text-muted-foreground">
									Relájate después del partido con nuestra selección de bebidas
									y snacks.
								</p>
							</CardContent>
						</Card>
						<Card className="text-center">
							<CardHeader>
								<div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
									<Users className="h-8 w-8" />
								</div>
							</CardHeader>
							<CardContent>
								<h3 className="text-xl font-semibold mb-2">Eventos privados</h3>
								<p className="text-muted-foreground">
									Organiza tus propios torneos o eventos de empresa en nuestro
									club.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">
							Lo que dicen nuestros jugadores
						</h2>
					</div>

					<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						<Card className="flex flex-col justify-between">
							<CardContent className="pt-6">
								<div className="flex items-center gap-1 mb-4">
									{stars.map((id) => (
										<Star
											key={id}
											className="h-5 w-5 fill-primary text-primary"
										/>
									))}
								</div>
								<blockquote className="text-muted-foreground italic">
									"¡El mejor club de la ciudad! Las pistas están impecables y el
									ambiente es genial. El sistema de reservas online es súper
									cómodo."
								</blockquote>
							</CardContent>
							<CardHeader>
								<div className="flex items-center gap-4">
									<img
										src="https://placehold.co/40x40/64748b/white?text=MG"
										alt="Avatar María González"
										className="w-10 h-10 rounded-full"
									/>
									<div>
										<CardTitle className="text-base">María González</CardTitle>
										<CardDescription>Jugadora habitual</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>

						<Card className="flex flex-col justify-between">
							<CardContent className="pt-6">
								<div className="flex items-center gap-1 mb-4">
									{stars.map((id) => (
										<Star
											key={id}
											className="h-5 w-5 fill-primary text-primary"
										/>
									))}
								</div>
								<blockquote className="text-muted-foreground italic">
									"Me apunté a las clases para principiantes y he mejorado
									muchísimo. Los entrenadores son fantásticos y muy pacientes."
								</blockquote>
							</CardContent>
							<CardHeader>
								<div className="flex items-center gap-4">
									<img
										src="https://placehold.co/40x40/64748b/white?text=CR"
										alt="Avatar Carlos Ruiz"
										className="w-10 h-10 rounded-full"
									/>
									<div>
										<CardTitle className="text-base">Carlos Ruiz</CardTitle>
										<CardDescription>Nuevo miembro</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-primary text-primary-foreground">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4">¿Listo para jugar?</h2>
						<p className="text-lg text-primary-foreground/80 mb-8">
							Reserva tu pista ahora y únete a la comunidad de Reservo Padel.
						</p>
						<Button
							asChild
							size="lg"
							variant="secondary"
							className="text-lg px-8 transition-colors duration-200"
						>
							<Link to={ROUTES.CREAR_RESERVA.ROOT}>Reservar pista</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* WhatsApp Floating Button */}
			<a
				href="https://wa.me/1234567890" // <-- Reemplaza con tu número
				target="_blank"
				rel="noopener noreferrer"
				className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center"
				aria-label="Contactar por WhatsApp"
			>
				<MessageCircle className="h-8 w-8" />
			</a>

			<Footer />
		</div>
	)
}

export default Home
