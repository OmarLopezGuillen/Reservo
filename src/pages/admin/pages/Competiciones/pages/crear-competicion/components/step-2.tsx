import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { Competition } from "@/models/competition.model"
import type {
	CompetitionRoundType,
	CompetitionsUpdate,
	PlayoffType,
} from "@/models/dbTypes"
import { type Step2Data, step2Schema } from "../schemas/step2.schema"

interface Step2Props {
	defaultValues: Partial<Competition>
	onNext: (data: CompetitionsUpdate) => void
	onBack: () => void
	isSaving?: boolean
}

const Step2 = ({ defaultValues, onNext, onBack, isSaving }: Step2Props) => {
	const isLeague = defaultValues.type === "league"

	const form = useForm({
		resolver: zodResolver(step2Schema),
		defaultValues: {
			roundType: defaultValues.roundType ?? "single_round_robin",
			pointsWin: defaultValues.pointsWin ?? 3,
			pointsDraw: defaultValues.pointsDraw ?? 1,
			pointsLoss: defaultValues.pointsLoss ?? 0,
			allowDraws: defaultValues.allowDraws ?? true,
			minAvailabilityDays: defaultValues.minAvailabilityDays ?? 3,
			minAvailabilityHoursPerDay: defaultValues.minAvailabilityHoursPerDay ?? 4,
			maxTeamsPerCategory: defaultValues.maxTeamsPerCategory ?? 8,
			hasPlayoff: defaultValues.hasPlayoff ?? false,
			playoffTeams: defaultValues.playoffTeams ?? 4,
			playoffType: defaultValues.playoffType ?? "single_elimination",
		},
	})

	// Observamos campos del formulario directamente desde form.control
	const hasPlayoff = useWatch({ control: form.control, name: "hasPlayoff" })
	const allowDraws = useWatch({ control: form.control, name: "allowDraws" })

	const onSubmit = (data: Step2Data) => {
		onNext({
			round_type: data.roundType as CompetitionRoundType,
			points_win: data.pointsWin,
			points_draw: data.pointsDraw,
			points_loss: data.pointsLoss,
			allow_draws: data.allowDraws,
			min_availability_days: data.minAvailabilityDays,
			min_availability_hours_per_day: data.minAvailabilityHoursPerDay,
			max_teams_per_category: data.maxTeamsPerCategory,
			has_playoff: data.hasPlayoff,
			playoff_teams: data.hasPlayoff ? data.playoffTeams : undefined,
			playoff_type: (data.hasPlayoff ? data.playoffType : null) as PlayoffType,
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Formato de Liga */}
				{isLeague && (
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Formato de Liga</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="roundType"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel>Tipo de Ronda</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												value={field.value}
												className="flex flex-col space-y-2"
											>
												<FormItem className="flex items-center space-x-3">
													<FormControl>
														<RadioGroupItem
															value="single_round_robin"
															id="single"
														/>
													</FormControl>
													<FormLabel
														htmlFor="single"
														className="font-normal cursor-pointer"
													>
														Solo ida (Single Round Robin)
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3">
													<FormControl>
														<RadioGroupItem
															value="double_round_robin"
															id="double"
														/>
													</FormControl>
													<FormLabel
														htmlFor="double"
														className="font-normal cursor-pointer"
													>
														Ida y vuelta (Double Round Robin)
													</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="maxTeamsPerCategory"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Máximo Equipos por Categoría</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="2"
												{...field}
												value={
													(field.value as number | string | undefined) ?? ""
												}
												onChange={(e) =>
													field.onChange(Number(e.target.value) || 0)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				)}

				<Separator />

				{/* Sistema de Puntuación */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Sistema de Puntuación</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<FormField
							control={form.control}
							name="pointsWin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Puntos por Victoria</FormLabel>
									<FormControl>
										<Input
											type="number"
											min="0"
											{...field}
											value={(field.value as number | string | undefined) ?? ""}
											onChange={(e) =>
												field.onChange(Number(e.target.value) || 0)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="pointsDraw"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Puntos por Empate</FormLabel>
									<FormControl>
										<Input
											type="number"
											min="0"
											{...field}
											value={(field.value as number | string | undefined) ?? ""}
											onChange={(e) =>
												field.onChange(Number(e.target.value) || 0)
											}
											disabled={!allowDraws}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="pointsLoss"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Puntos por Derrota</FormLabel>
									<FormControl>
										<Input
											type="number"
											min="0"
											{...field}
											value={(field.value as number | string | undefined) ?? ""}
											onChange={(e) =>
												field.onChange(Number(e.target.value) || 0)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="allowDraws"
						render={({ field }) => (
							<FormItem className="flex items-start space-x-3 rounded-md border p-4">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel className="cursor-pointer">
										Permitir Empates
									</FormLabel>
									<FormDescription>
										Habilita la posibilidad de terminar partidos en empate.
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>
				</div>

				<Separator />

				{/* Requisitos de Disponibilidad */}
				{isLeague && (
					<div className="space-y-4">
						<h3 className="text-lg font-medium">
							Requisitos de Disponibilidad
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="minAvailabilityDays"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Días mínimos disponibles (semanal)</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="1"
												max="7"
												{...field}
												value={
													(field.value as number | string | undefined) ?? ""
												}
												onChange={(e) =>
													field.onChange(Number(e.target.value) || 0)
												}
											/>
										</FormControl>
										<FormDescription>
											Mínimo de días que un equipo debe dar disponibilidad.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="minAvailabilityHoursPerDay"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Horas mínimas por día</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="1"
												max="24"
												{...field}
												value={
													(field.value as number | string | undefined) ?? ""
												}
												onChange={(e) =>
													field.onChange(Number(e.target.value) || 0)
												}
											/>
										</FormControl>
										<FormDescription>
											Mínimo de horas consecutivas para jugar.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				)}

				<Separator />

				{/* Configuración de Playoff */}
				{isLeague && (
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="hasPlayoff"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between">
									<h3 className="text-lg font-medium">Fase Final (Playoff)</h3>
									<div className="flex items-center space-x-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												id="hasPlayoff"
											/>
										</FormControl>
										<FormLabel htmlFor="hasPlayoff" className="cursor-pointer">
											Habilitar Playoff
										</FormLabel>
									</div>
								</FormItem>
							)}
						/>

						{hasPlayoff && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
								<FormField
									control={form.control}
									name="playoffTeams"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Equipos clasificados</FormLabel>
											<Select
												onValueChange={(value) => field.onChange(Number(value))}
												value={String(field.value)}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Selecciona cantidad" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="2">2 (Final directa)</SelectItem>
													<SelectItem value="4">4 (Semifinales)</SelectItem>
													<SelectItem value="8">8 (Cuartos)</SelectItem>
													<SelectItem value="16">16 (Octavos)</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="playoffType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tipo de Playoff</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Selecciona formato" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="single_elimination">
														Eliminación directa
													</SelectItem>
													<SelectItem value="final_match">
														Partido único
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
					</div>
				)}

				<div className="flex items-center justify-between pt-4">
					<Button type="button" variant="outline" onClick={onBack}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Anterior
					</Button>
					<Button type="submit" disabled={isSaving}>
						{isSaving ? "Guardando..." : "Continuar"}
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default Step2
