import {
	CalendarCheck2,
	CalendarDays,
	LayoutDashboard,
	LogIn,
	Menu,
	MessageCircle,
	Trophy,
	X,
} from "lucide-react"

import { useState } from "react"
import { Link } from "react-router"

import { useAuthActions } from "@/auth/hooks/useAuthActions"
import { useAuthStore } from "@/auth/stores/auth.store"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/constants/ROUTES"
import { ROLES } from "@/models/ROLES.model"

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
	const { user } = useAuthStore()
	const role = user?.userRole
	const { signOut } = useAuthActions()

	const handleClick = () => {
		onClick?.()
	}

	if (user) {
		return (
			<>
				<Link onClick={handleClick} to={ROUTES.RESERVAS.ROOT}>
					Mis reservas
				</Link>

				<Link onClick={handleClick} to={ROUTES.MIS_LIGAS}>
					Mis ligas
				</Link>

				{role && [ROLES.ADMIN, ROLES.OWNER].includes(role) && (
					<Link onClick={handleClick} to={ROUTES.ADMIN.ROOT}>
						Administración
					</Link>
				)}

				<Button
					variant="destructive"
					onClick={() => {
						signOut()
						handleClick()
					}}
				>
					Cerrar sesión
				</Button>
			</>
		)
	}

	return (
		<>
			<Link onClick={handleClick} to={ROUTES.CREAR_RESERVA.ROOT}>
				Reservar
			</Link>

			<Button asChild onClick={handleClick}>
				<Link to={ROUTES.ADMIN.ROOT}>Iniciar sesión</Link>
			</Button>
		</>
	)
}

const ActionCard = ({
	icon: Icon,
	title,
	description,
	to,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: No hace falta
	icon: any
	title: string
	description: string
	to: string
}) => {
	return (
		<Link to={to} className="block">
			<Card className="active:scale-[0.98] transition-all h-full">
				<CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
					<div className="bg-primary/10 p-3 rounded-lg shrink-0">
						<Icon className="h-5 w-5 text-primary" />
					</div>

					<CardTitle className="text-base">{title}</CardTitle>
				</CardHeader>

				<CardContent className="pt-0">
					<p className="text-muted-foreground text-sm">{description}</p>
				</CardContent>
			</Card>
		</Link>
	)
}

const Home = () => {
	const { user } = useAuthStore()
	const role = user?.userRole

	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<div className="min-h-screen flex flex-col bg-background">
			{/* Header */}

			<header className="border-b sticky top-0 bg-background z-50">
				<div className="container mx-auto px-4 h-14 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">R</span>
						</div>

						<span className="font-semibold text-base">Reservo</span>
					</div>

					{/* Desktop nav */}

					<div className="hidden md:flex gap-6 items-center text-sm">
						<NavLinks />
					</div>

					{/* Mobile button */}

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						{menuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
				</div>

				{/* Mobile menu */}

				{menuOpen && (
					<div className="border-t md:hidden">
						<div className="px-4 py-4 flex flex-col gap-4 text-sm font-medium">
							<NavLinks onClick={() => setMenuOpen(false)} />
						</div>
					</div>
				)}
			</header>

			{/* Main */}

			<main className="flex-1">
				<div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
					<h1 className="text-xl md:text-3xl font-bold">Bienvenido</h1>

					<p className="text-muted-foreground text-sm md:text-base mt-1 mb-6">
						Accede rápidamente
					</p>

					{/* Grid */}

					<div
						className="
						grid
						grid-cols-1
						sm:grid-cols-2
						lg:grid-cols-3
						gap-3
						md:gap-6
					"
					>
						{role && [ROLES.ADMIN, ROLES.OWNER].includes(role) && (
							<ActionCard
								icon={LayoutDashboard}
								title="Administración"
								description="Panel admin"
								to={ROUTES.ADMIN.ROOT}
							/>
						)}

						<ActionCard
							icon={CalendarDays}
							title="Reservar pista"
							description="Buscar disponibilidad"
							to={ROUTES.CLUBS.ROOT}
						/>

						{user && (
							<ActionCard
								icon={CalendarCheck2}
								title="Mis reservas"
								description="Gestionar reservas"
								to={ROUTES.RESERVAS.ROOT}
							/>
						)}

						{user && (
							<ActionCard
								icon={Trophy}
								title="Mis ligas"
								description="Ver ligas"
								to={ROUTES.MIS_LIGAS}
							/>
						)}

						{!user && (
							<ActionCard
								icon={LogIn}
								title="Iniciar sesión"
								description="Acceder"
								to={ROUTES.ADMIN.ROOT}
							/>
						)}
					</div>
				</div>
			</main>

			{/* WhatsApp FAB */}

			<a
				href="https://wa.me/1234567890"
				target="_blank"
				rel="noopener noreferrer"
				className="
					fixed
					bottom-5
					right-5
					bg-[#25D366]
					text-white
					p-4
					rounded-full
					shadow-lg
					active:scale-90
					transition
				"
			>
				<MessageCircle className="h-6 w-6" />
			</a>

			<footer className="bg-muted/50 mb-4">
				<div className="container mx-auto px-4 py-12  max-w-7xl">
					<Separator className="my-4" />

					<div className="mx-auto">
						<div className="flex items-center space-x-2 mb-4">
							<div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-xs">
									R
								</span>
							</div>
							<span className="font-semibold">Reservo</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Sistema de reservas y gestión de ligas de pádel
						</p>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default Home
