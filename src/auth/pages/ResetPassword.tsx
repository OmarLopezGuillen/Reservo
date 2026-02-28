import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircle2, Lock } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
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
import { PasswordInput } from "@/components/ui/password-input"
import { ROUTES } from "@/constants/ROUTES"

const resetSchema = z
	.object({
		password: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	})

type ResetSchema = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
	const { updatePassword } = useAuthActions()
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)
	const navigate = useNavigate()

	const form = useForm<ResetSchema>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	})

	async function onSubmit(values: ResetSchema) {
		setError(null)

		try {
			await updatePassword(values.password)
			setSuccess(true)

			// Redirigir después de 2s (opcional)
			setTimeout(() => {
				navigate(ROUTES.LOGIN)
			}, 2000)
		} catch (err: any) {
			setError("No se pudo actualizar la contraseña.")
			console.error("Reset password error:", err)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
						<Lock className="h-6 w-6 text-primary" />
					</div>
					<CardTitle>Restablecer contraseña</CardTitle>
					<CardDescription>Introduce tu nueva contraseña</CardDescription>
				</CardHeader>

				<CardContent>
					{success ? (
						<div className="space-y-4 text-center">
							<Alert>
								<CheckCircle2 className="h-4 w-4" />
								<AlertTitle>Contraseña actualizada</AlertTitle>
								<AlertDescription>
									Tu contraseña ha sido actualizada correctamente.
								</AlertDescription>
							</Alert>

							<Link
								to={ROUTES.LOGIN}
								className="text-sm underline underline-offset-4"
							>
								Ir al login
							</Link>
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
										name="password"
										render={({ field }) => (
											<FormItem className="grid gap-2">
												<FormLabel>Nueva contraseña</FormLabel>
												<FormControl>
													<PasswordInput
														placeholder="******"
														autoComplete="new-password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem className="grid gap-2">
												<FormLabel>Confirmar contraseña</FormLabel>
												<FormControl>
													<PasswordInput
														placeholder="******"
														autoComplete="new-password"
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
											? "Actualizando..."
											: "Actualizar contraseña"}
									</Button>
								</div>
							</form>
						</Form>
					)}

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
