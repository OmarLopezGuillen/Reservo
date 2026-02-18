import {
	AlertCircle,
	ArrowLeft,
	MapPin,
	Search,
	TrendingUp,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants/ROUTES"
import { useClubs } from "@/hooks/useClubsQuery"
import { ClubCard } from "./components/ClubCard"

const Clubs = () => {
	const [searchTerm, setSearchTerm] = useState("")
	const { clubsQuery } = useClubs()
	const { data: clubs, isLoading, isError, error } = clubsQuery

	const filteredClubs = useMemo(() => {
		if (!clubs) return []
		return clubs.filter((club) =>
			club.name.toLowerCase().includes(searchTerm.toLowerCase()),
		)
	}, [clubs, searchTerm])

	return (
		<div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background">
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" asChild>
							<Link to={ROUTES.HOME}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Volver
							</Link>
						</Button>
						<h1 className="text-2xl font-bold">Clubes</h1>
					</div>
				</div>
			</header>
			<div className="container mx-auto px-4 py-12 max-w-7xl">
				<header className="mb-12 space-y-6">
					<div className="space-y-3">
						<div className="flex items-center gap-2 text-sm font-medium text-primary">
							<TrendingUp className="h-4 w-4" />
							<span>Encuentra tu pista perfecta</span>
						</div>
						<h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
							Descubre los mejores{" "}
							<span className="text-primary">clubes de pádel</span>
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
							Reserva tu cancha en los mejores clubes de tu ciudad. Compara
							instalaciones, horarios y precios en un solo lugar.
						</p>
					</div>

					<div className="relative max-w-2xl">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Buscar por nombre del club..."
							className="w-full pl-12 pr-4 py-6 text-base bg-card border-2 focus:border-primary shadow-sm rounded-xl"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						{searchTerm && (
							<div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
								{filteredClubs.length}{" "}
								{filteredClubs.length === 1 ? "resultado" : "resultados"}
							</div>
						)}
					</div>
				</header>

				<main>
					{isLoading && (
						<div className="flex flex-col items-center justify-center mt-24 gap-4">
							<Spinner className="h-12 w-12 text-primary" />
							<p className="text-muted-foreground">Cargando clubes...</p>
						</div>
					)}

					{isError && (
						<Alert variant="destructive" className="max-w-lg mx-auto mt-12">
							<AlertCircle className="h-5 w-5" />
							<AlertTitle className="text-lg font-semibold">
								Error al cargar los clubes
							</AlertTitle>
							<AlertDescription className="text-sm">
								{error?.message ||
									"No se pudieron obtener los datos. Por favor, inténtalo de nuevo más tarde."}
							</AlertDescription>
						</Alert>
					)}

					{clubs && filteredClubs.length === 0 && searchTerm && (
						<div className="flex flex-col items-center justify-center mt-24 gap-4 text-center">
							<div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
								<MapPin className="h-10 w-10 text-muted-foreground" />
							</div>
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-foreground">
									No encontramos clubes
								</h3>
								<p className="text-muted-foreground max-w-md text-pretty">
									No hay clubes que coincidan con "{searchTerm}". Intenta con
									otro nombre o explora todos los clubes disponibles.
								</p>
							</div>
						</div>
					)}

					{clubs && filteredClubs.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							{filteredClubs.map((club) => (
								<ClubCard key={club.id} club={club} />
							))}
						</div>
					)}
				</main>
			</div>
		</div>
	)
}

export default Clubs
