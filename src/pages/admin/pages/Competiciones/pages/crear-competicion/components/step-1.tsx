import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { useAuthStore } from "@/auth/stores/auth.store"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Competition } from "@/models/competition.model"
import type { CompetitionsInsert, CompetitionsType } from "@/models/dbTypes"
import { type Step1Data, step1Schema } from "../schemas/step1.schema"
import CompetitionTypeSelect from "./CompetitionTypeSelect"

interface Step1Props {
	defaultValues: Partial<Competition>
	onNext: (data: CompetitionsInsert) => void
	isSaving?: boolean
}

const Step1 = ({ defaultValues, onNext, isSaving }: Step1Props) => {
	const { user } = useAuthStore()
	const form = useForm<Step1Data>({
		resolver: zodResolver(step1Schema),
		defaultValues: {
			name: defaultValues.name || "",
			description: defaultValues.description || "",
			type: defaultValues.type || "league",
			registrationDates:
				defaultValues.registrationStartsAt && defaultValues.registrationEndsAt
					? {
							from: new Date(defaultValues.registrationStartsAt),
							to: new Date(defaultValues.registrationEndsAt),
						}
					: undefined,
			competitionDates:
				defaultValues.startDate && defaultValues.endDate
					? {
							from: new Date(defaultValues.startDate),
							to: new Date(defaultValues.endDate),
						}
					: undefined,
		},
	})

	const onSubmit = (data: Step1Data) => {
		onNext({
			name: data.name,
			description: data.description,
			type: data.type as CompetitionsType,
			registration_starts_at: data.registrationDates.from.toISOString(),
			registration_ends_at: data.registrationDates.to.toISOString(),
			start_date: data.competitionDates.from.toISOString(),
			end_date: data.competitionDates.to.toISOString(),
			club_id: user!.clubId!,
			status: "draft",
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo de Competición *</FormLabel>
								<FormControl>
									<CompetitionTypeSelect
										value={field.value as CompetitionsType}
										onValueChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nombre *</FormLabel>
								<FormControl>
									<Input placeholder="Ej: Liga de Otoño 2025" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descripción (Opcional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Detalles sobre la competición..."
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="registrationDates"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Período de Inscripción *</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!field.value?.from && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{field.value?.from && field.value?.to ? (
													<>
														{format(field.value.from, "dd MMM yyyy", {
															locale: es,
														})}{" "}
														-{" "}
														{format(field.value.to, "dd MMM yyyy", {
															locale: es,
														})}
													</>
												) : (
													<span>Selecciona las fechas</span>
												)}
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="range"
											selected={field.value}
											onSelect={field.onChange}
											numberOfMonths={2}
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>
									Cuándo se pueden inscribir los jugadores
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="competitionDates"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Fechas de la Competición *</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!field.value?.from && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{field.value?.from && field.value?.to ? (
													<>
														{format(field.value.from, "dd MMM yyyy", {
															locale: es,
														})}{" "}
														-{" "}
														{format(field.value.to, "dd MMM yyyy", {
															locale: es,
														})}
													</>
												) : (
													<span>Selecciona las fechas</span>
												)}
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="range"
											selected={field.value}
											onSelect={field.onChange}
											numberOfMonths={2}
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>Duración del torneo o liga</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end pt-4">
					<Button type="submit" disabled={isSaving}>
						{isSaving ? "Guardando..." : "Continuar"}
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default Step1
