import { AlertTriangle, ArrowLeft, Home } from "lucide-react"
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

const Unauthorized = () => {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-md space-y-6">
				<Card>
					<CardHeader className="text-center">
						<div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
							<AlertTriangle className="h-8 w-8 text-destructive" />
						</div>
						<CardTitle>Acceso denegado</CardTitle>
						<CardDescription>
							No tienes permisos para acceder a esta página
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground text-center">
							Si crees que esto es un error, contacta con el administrador del
							sistema.
						</p>
						<div className="flex flex-col gap-2">
							<Button asChild>
								<Link to={ROUTES.HOME}>
									<Home className="h-4 w-4 mr-2" />
									Ir al inicio
								</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link to={ROUTES.LOGIN}>
									<ArrowLeft className="h-4 w-4 mr-2" />
									Iniciar sesión
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
export default Unauthorized
