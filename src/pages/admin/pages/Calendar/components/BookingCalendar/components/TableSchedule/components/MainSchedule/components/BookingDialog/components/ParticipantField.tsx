import { Controller, type useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BookingFormValues } from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/BookingDialog/schemas/bookingForm"

interface ParticipantFieldProps {
	index: number
	fieldId: string
	control: ReturnType<typeof useForm<BookingFormValues>>["control"]
	isFirstParticipant: boolean
}

export function ParticipantField({
	index,
	fieldId,
	control,
	isFirstParticipant,
}: ParticipantFieldProps) {
	const inputId = `${fieldId}-name`
	const checkboxId = `${fieldId}-paid`

	return (
		<div className="flex items-center gap-4 space-y-3">
			<Field>
				<Controller
					control={control}
					name={`people.${index}.name`}
					render={({ field, fieldState }) => (
						<>
							<Input
								{...field}
								id={inputId}
								disabled={isFirstParticipant}
								placeholder={
									isFirstParticipant
										? "Titular de la reserva"
										: `Persona ${index + 1}`
								}
								aria-label={
									isFirstParticipant
										? "Nombre del titular"
										: `Nombre de persona ${index + 1}`
								}
							/>

							<FieldError>{fieldState.error?.message}</FieldError>
						</>
					)}
				/>
			</Field>

			<Field>
				<Controller
					control={control}
					name={`people.${index}.paid`}
					render={({ field, fieldState }) => (
						<>
							<div className="flex items-center gap-2">
								<Checkbox
									id={checkboxId}
									checked={field.value}
									onCheckedChange={field.onChange}
									aria-label={`Marcar como pagado persona ${index + 1}`}
								/>
								<Label
									htmlFor={checkboxId}
									className="cursor-pointer text-sm font-normal whitespace-nowrap"
								>
									Pagado
								</Label>
							</div>

							<FieldError>{fieldState.error?.message}</FieldError>
						</>
					)}
				/>
			</Field>
		</div>
	)
}
