import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import RegisterForm from "@/auth/components/RegisterForm"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/ROUTES"

const Register = () => {
	return (
		<div className="min-h-svh flex flex-col items-center justify-center max-w-md mx-auto px-2">
			<Button variant="ghost" asChild className="mb-4 self-start mt-2">
				<Link to={ROUTES.HOME}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Volver al inicio
				</Link>
			</Button>
			<RegisterForm />
		</div>
	)
}
export default Register
