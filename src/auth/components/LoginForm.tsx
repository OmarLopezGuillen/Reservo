import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router"
import { useAuthActions } from "@/auth/hooks/useAuthActions"
import {
	type LoginFormSchema,
	loginFormSchema,
} from "@/auth/schemas/login.schema"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { ROUTES } from "@/constants/ROUTES"
import { sanitizeRedirect } from "../helpers"

export default function LoginForm() {
	const { logIn } = useAuthActions()
	const [error, setError] = useState<string | null>(null)

	const navigate = useNavigate()
	const location = useLocation()

	// Leer ?redirect= de la URL si viene
	const searchParams = new URLSearchParams(location.search)
	const redirect = searchParams.get("redirect")

	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	async function onSubmit(values: LoginFormSchema) {
		setError(null)
		try {
			const { email, password } = values
			await logIn({ email, password })

			// Si logIn no lanza error, navegamos:
			const safeRedirect = sanitizeRedirect(redirect)
			navigate(safeRedirect || ROUTES.HOME, { replace: true })
		} catch (error: any) {
			setError("No se pudo iniciar sesión. Por favor, inténtalo de nuevo.")
			console.error("Login error:", error)
		}
	}

	// Para mantener el redirect cuando el usuario pasa a "Regístrate"
	const safeRedirect = sanitizeRedirect(redirect)
	const registerUrl = safeRedirect
		? `${ROUTES.REGISTER}?redirect=${encodeURIComponent(safeRedirect)}`
		: ROUTES.REGISTER

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
					<Mail className="h-6 w-6 text-primary" />
				</div>
				<CardTitle>Acceder al sistema</CardTitle>
				<CardDescription>
					Ingresa tu email y contraseña para acceder
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error de autenticación</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="email">Email</FormLabel>
										<FormControl>
											<Input
												id="email"
												placeholder="tu@mail.com"
												type="email"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<div className="flex justify-between items-center">
											<FormLabel htmlFor="password">Contraseña</FormLabel>
											<Link
												to={ROUTES.HOME}
												className="ml-auto inline-block text-sm underline"
											>
												¿Has olvidado la contraseña?
											</Link>
										</div>
										<FormControl>
											<PasswordInput
												id="password"
												placeholder="******"
												autoComplete="current-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting
									? "Iniciando sesión..."
									: "Iniciar sesión"}
							</Button>
						</div>
					</form>
				</Form>
				<div className="mt-4 text-center text-sm">
					¿No tienes una cuenta?{" "}
					<Link to={registerUrl} className="underline">
						Regístrate
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
