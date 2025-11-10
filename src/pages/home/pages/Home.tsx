import {
	CalendarDays,
	Clock,
	MapPin,
	Menu,
	Star,
	Users,
	Zap,
} from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
/* import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" */
//import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Footer } from "@/pages/home/components/Footer"

const Home = () => {
	/*   const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser() */
	const user = null
	const role = "user" //(user?.app_metadata as any)?.role
	const stars = [1, 2, 3, 4, 5]
	return (
		<div className="min-h-screen">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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
						{/* Desktop navigation */}
						<nav className="hidden md:flex items-center space-x-6">
							{user && (
								<Link
									to="/reserva"
									className="text-sm font-medium hover:text-primary transition-colors"
								>
									Mis reservas
								</Link>
							)}
							<Link
								to="/reservar"
								className="text-sm font-medium hover:text-primary transition-colors"
							>
								Reservar
							</Link>
							{role && ["admin", "owner"].includes(role) && (
								<Link
									to="/admin"
									className="text-sm font-medium hover:text-primary"
								>
									Panel de administración
								</Link>
							)}
							{user ? (
								<form action="/api/auth/signout" method="post">
									<Button
										type="submit"
										variant="destructive"
										className="text-sm font-medium transition-colors cursor-pointer"
									>
										Cerrar sesión
									</Button>
								</form>
							) : (
								<Link
									to="/login"
									className="text-sm font-medium hover:text-primary transition-colors"
								>
									Acceder
								</Link>
							)}
							{/* <ThemeToggle /> */}
						</nav>
						{/* Mobile navigation (Dropdown Menu) */}
						{/* 						<div className="md:hidden">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" aria-label="Open menu">
										<Menu className="h-5 w-5" />
										<ThemeToggle />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									{user && (
										<DropdownMenuItem asChild>
											<Link to="/reserva">Mis reservas</Link>
										</DropdownMenuItem>
									)}
									<DropdownMenuItem asChild>
										<Link to="/reservar">Reservar</Link>
									</DropdownMenuItem>
									{role && ["admin", "owner"].includes(role) && (
										<DropdownMenuItem asChild>
											<Link to="/admin">Panel de administración</Link>
										</DropdownMenuItem>
									)}
									{user ? (
										<DropdownMenuItem asChild>
											<form action="/api/auth/signout" method="post">
												<Button
													type="submit"
													variant="destructive"
													className="w-full"
												>
													Cerrar sesión
												</Button>
											</form>
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem asChild>
											<Link to="/login">Acceder</Link>
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div> */}
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 lg:py-32 relative overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="max-w-2xl">
							<h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
								Reserva tu pista de pádel en segundos
							</h1>
							<p className="text-xl text-muted-foreground text-balance mb-8">
								Sistema de reservas simple y rápido. Elige tu pista, selecciona
								el horario y confirma tu reserva al instante.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button asChild size="lg" className="text-lg px-8">
									<Link to="/reservar">Reservar ahora</Link>
								</Button>
							</div>
						</div>

						<div className="relative">
							<div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
								<img
									src="/modern-padel-court-with-players--professional-spor.jpg"
									alt="Pista de pádel moderna con jugadores profesionales"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="absolute -bottom-6 -left-6 bg-background border rounded-lg p-4 shadow-lg">
								<div className="text-2xl font-bold text-primary">500+</div>
								<div className="text-sm text-muted-foreground">
									Reservas este mes
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
									Reserva tu pista en menos de 2 minutos. Sin llamadas, sin
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
									Ve la disponibilidad actualizada al momento y elige el mejor
									horario para ti.
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
									Modifica o cancela tus reservas desde cualquier dispositivo.
								</CardDescription>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Courts Preview */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">Nuestras pistas</h2>
						<p className="text-lg text-muted-foreground">
							Instalaciones de primera calidad para tu mejor juego
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
						<Card>
							<div className="aspect-video rounded-t-lg overflow-hidden">
								<img
									src="/imagen1.webp"
									alt="Pista de pádel cubierta"
									className="w-full h-full object-cover"
								/>
							</div>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">Pista 1</CardTitle>
									<Badge variant="default">Exterior</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										<span>Césped artificial premium</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4" />
										<span>Disponible 9:00 - 22:00</span>
									</div>
								</div>
								<div className="mt-4 text-lg font-semibold">35€ / 90 min</div>
							</CardContent>
						</Card>

						<Card>
							<div className="aspect-video rounded-t-lg overflow-hidden">
								<img
									src="/imagen2.webp"
									alt="Pista de pádel exterior"
									className="w-full h-full object-cover"
								/>
							</div>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">Pista 2</CardTitle>
									<Badge variant="outline">Exterior</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										<span>Iluminación LED</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4" />
										<span>Disponible 9:00 - 22:00</span>
									</div>
								</div>
								<div className="mt-4 text-lg font-semibold">30€ / 90 min</div>
							</CardContent>
						</Card>

						<Card>
							<div className="aspect-video rounded-t-lg overflow-hidden">
								<img
									src="/imagen3.png"
									alt="Pista de pádel profesional"
									className="w-full h-full object-cover"
								/>
							</div>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">Pista 3</CardTitle>
									<Badge variant="secondary">Cubierta</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										<span>Climatizada</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4" />
										<span>Disponible 9:00 - 22:00</span>
									</div>
								</div>
								<div className="mt-4 text-lg font-semibold">35€ / 90 min</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-20 bg-muted/50">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">
							Lo que dicen nuestros clientes
						</h2>
					</div>

					<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-1 mb-4">
									{stars.map((id) => (
										<Star
											key={id}
											className="h-4 w-4 fill-primary text-primary"
										/>
									))}
								</div>
								<p className="text-muted-foreground mb-4">
									"Súper fácil de usar. Reservé mi pista en menos de un minuto y
									todo funcionó perfecto."
								</p>
								<div className="font-medium">María González</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-1 mb-4">
									{stars.map((id) => (
										<Star
											key={id}
											className="h-4 w-4 fill-primary text-primary"
										/>
									))}
								</div>
								<p className="text-muted-foreground mb-4">
									"Las instalaciones están geniales y el sistema de reservas es
									muy cómodo."
								</p>
								<div className="font-medium">Carlos Ruiz</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4">¿Listo para jugar?</h2>
						<p className="text-lg text-muted-foreground mb-8">
							Reserva tu pista ahora y disfruta del mejor pádel
						</p>
						<Button asChild size="lg" className="text-lg px-8">
							<Link to="/reservar">Reservar pista</Link>
						</Button>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	)
}

export default Home
