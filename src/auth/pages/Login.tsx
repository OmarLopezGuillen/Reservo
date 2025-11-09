import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import LoginForm from "@/auth/components/LoginForm"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/ROUTES"

const Login = () => {
	return (
		<div className="h-screen flex flex-col justify-center max-w-md mx-auto">
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
