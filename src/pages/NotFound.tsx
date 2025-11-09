import { ArrowLeft, Home, Search } from "lucide-react"
import { Link } from "react-router"
import { ROUTES } from "@/ROUTES"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

const NotFound = () => {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-md space-y-6">
				<Card>
					<CardHeader className="text-center">
						<div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
							<Search className="h-8 w-8 text-muted-foreground" />
						</div>
						<CardTitle className="text-2xl">Página no encontrada</CardTitle>
						<CardDescription>
							La página que buscas no existe o ha sido movida
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-center text-6xl font-bold text-muted-foreground/20 pb-6">
							404
						</div>

						<div className="space-y-2">
							<Button asChild className="w-full">
								<Link to={ROUTES.HOME}>
									<Home className="h-4 w-4 mr-2" />
									Volver al inicio
								</Link>
							</Button>
							<Button
								variant="outline"
								asChild
								className="w-full bg-transparent"
							>
								<Link to={ROUTES.CREAR_RESERVA.ROOT}>
									<ArrowLeft className="h-4 w-4 mr-2" />
									Hacer una reserva
								</Link>
							</Button>
						</div>

						<div className="text-center text-sm text-muted-foreground space-y-2">
							<p>¿Necesitas ayuda?</p>
							<p>
								Contacta con nosotros en{" "}
								<a
									href="mailto:info@reservo.es"
									className="text-primary hover:underline"
								>
									info@reservo.es
								</a>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
export default NotFound
