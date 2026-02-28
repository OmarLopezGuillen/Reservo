import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import { z } from "zod"
import { useAuthActions } from "@/auth/hooks/useAuthActions"
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
import { ROUTES } from "@/constants/ROUTES"

const forgotSchema = z.object({
	email: z.string().email("Introduce un email válido"),
})

type ForgotSchema = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
	const { resetPassword } = useAuthActions()
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	const form = useForm<ForgotSchema>({
		resolver: zodResolver(forgotSchema),
		defaultValues: {
			email: "",
		},
	})

	async function onSubmit(values: ForgotSchema) {
		setError(null)

		try {
			await resetPassword(values.email)
			setSuccess(true)
		} catch (err: any) {
			setError("No se pudo enviar el enlace. Inténtalo de nuevo.")
			console.error("Forgot password error:", err)
		}
	}

	return (
		<div className="min-h-svh flex flex-col justify-center max-w-md mx-auto px-2">
			<Card className=" w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
						<Mail className="h-6 w-6 text-primary" />
					</div>
					<CardTitle>Recuperar contraseña</CardTitle>
					<CardDescription>
						Introduce tu email y te enviaremos un enlace para restablecerla
					</CardDescription>
				</CardHeader>

				<CardContent>
					{success ? (
						<div className="space-y-4 text-center">
							<Alert>
								<Mail className="h-4 w-4" />
								<AlertTitle>Email enviado</AlertTitle>
								<AlertDescription>
									Si el correo existe, recibirás instrucciones para restablecer
									tu contraseña.
								</AlertDescription>
							</Alert>
						</div>
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								{error && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>Error</AlertTitle>
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
														type="email"
														placeholder="tu@mail.com"
														autoComplete="email"
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
											? "Enviando..."
											: "Enviar enlace"}
									</Button>
								</div>
							</form>
						</Form>
					)}

					{/* 👇 SIEMPRE visible */}
					<div className="mt-6 text-center text-sm">
						<Link
							to={ROUTES.LOGIN}
							className="underline underline-offset-4 hover:text-primary transition"
						>
							Volver al login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
