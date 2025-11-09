import { zodResolver } from "@hookform/resolvers/zod"
import { Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
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
import { type LoginFormSchema, loginFormSchema } from "@/schemas/login.schema"

export default function LoginForm() {
	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	async function onSubmit(values: LoginFormSchema) {
		try {
			// Assuming an async login function
			console.log(values)
			/* toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      ) */
		} catch (error) {
			console.error("Form submission error", error)
		}
	}

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
							<Button type="submit" className="w-full">
								Iniciar sesión
							</Button>
						</div>
					</form>
				</Form>
				<div className="mt-4 text-center text-sm">
					¿No tienes una cuenta?{" "}
					<Link to={ROUTES.REGISTER} className="underline">
						Regístrate
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
