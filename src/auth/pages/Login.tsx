import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import LoginForm from "@/auth/components/LoginForm"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/ROUTES"

const Login = () => {
	return (
		<div className="min-h-svh flex flex-col justify-center max-w-md mx-auto px-2">
			<Button variant="ghost" asChild className="mb-4 self-start">
				<Link to={ROUTES.HOME}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Volver al inicio
				</Link>
			</Button>
			<LoginForm />
		</div>
	)
}
export default Login
