import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import { useAuthActions } from "@/auth/hooks/useAuthActions"
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
import { ROUTES } from "@/ROUTES"
import {
	type RegisterFormSchema,
	registerFormSchema,
} from "@/schemas/register.schema"

export default function RegisterForm() {
	const { signUp } = useAuthActions()

	const form = useForm<RegisterFormSchema>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		},
	})

	async function onSubmit(values: RegisterFormSchema) {
		try {
			const { email, password } = values
			await signUp({ email, password })
		} catch (error) {
			console.error("Form submission error", error)
		}
	}

	return (
		<Card className="w-full max-w-md mb-4">
			<CardHeader className="text-center">
				<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
					<UserPlus className="h-6 w-6 text-primary" />
				</div>
				<CardTitle>Crear una cuenta</CardTitle>
				<CardDescription>Introduce tus datos para registrarte</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid gap-4">
							{/* Name Field */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="name">Nombre completo</FormLabel>
										<FormControl>
											<Input
												id="name"
												placeholder="Nombre y apellidos"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email Field */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="email">Email</FormLabel>
										<FormControl>
											<Input
												id="email"
												placeholder="nombre@ejemplo.com"
												type="email"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Phone Field */}
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="phone">Teléfono (opcional)</FormLabel>
										<FormControl>
											<Input
												id="phone"
												placeholder="600123456"
												type="tel"
												autoComplete="tel"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password Field */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="password">Contraseña</FormLabel>
										<FormControl>
											<PasswordInput
												id="password"
												placeholder="******"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Confirm Password Field */}
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="confirmPassword">
											Confirmar contraseña
										</FormLabel>
										<FormControl>
											<PasswordInput
												id="confirmPassword"
												placeholder="******"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full">
								Crear cuenta
							</Button>
						</div>
					</form>
				</Form>
				<div className="mt-4 text-center text-sm">
					¿Ya tienes una cuenta?{" "}
					<Link to={ROUTES.LOGIN} className="underline">
						Inicia sesión
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
