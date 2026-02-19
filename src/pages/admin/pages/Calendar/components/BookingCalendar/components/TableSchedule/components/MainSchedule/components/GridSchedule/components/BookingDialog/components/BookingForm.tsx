import { Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { Booking } from "@/models/booking.model"
import { PaymentsSection } from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/components/BookingDialog/components/PaymentsSection"
import { useBookingForm } from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/components/BookingDialog/hooks/useBookingForm"
import type { BookingSlot } from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/schemas/bookingForm"

const DURATION_OPTIONS = [
	{ value: 60, label: "60 min" },
	{ value: 90, label: "90 min" },
	{ value: 120, label: "120 min" },
] as const

interface BookingFormProps {
	slot: BookingSlot | null
	clubId: string
	onClose: () => void
	booking: Booking | null
}

export default function BookingForm({
	clubId,
	slot,
	onClose,
	booking,
}: BookingFormProps) {
	const {
		showPayments,
		setShowPayments,
		control,
		form,
		courts,
		fields,
		markAllPaid,
		onSubmit,
		handleCancelBooking,
	} = useBookingForm({ clubId, slot, onClose, booking })

	const isACourt = slot?.courtId !== "multiple-courts-selected"

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 max-w-3xl"
			>
				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={() => setShowPayments((state) => !state)}
				>
					{showPayments
						? "Ocultar gestión de pagos"
						: "Gestionar pagos por persona"}
				</Button>

				{showPayments && (
					<PaymentsSection
						fields={fields}
						baseId="people"
						onMarkAllPaid={markAllPaid}
						control={control}
					/>
				)}
				{/* Campo Pista */}
				<Field>
					<FieldLabel htmlFor="courtId">Pista</FieldLabel>
					<Controller
						control={form.control}
						name="courtId"
						render={({ field }) => (
							<Select
								onValueChange={field.onChange}
								value={field.value}
								disabled={isACourt}
							>
								<SelectTrigger id="courtId">
									<SelectValue placeholder={"Selecionar una pista"} />
								</SelectTrigger>
								<SelectContent>
									{courts?.map((court) => (
										<SelectItem key={court.id} value={court.id}>
											{court.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					<FieldError>{form.formState.errors.courtId?.message}</FieldError>
				</Field>
				{/* Campo Duración */}
				<Field>
					<FieldLabel htmlFor="duration">Duración</FieldLabel>
					<Controller
						control={form.control}
						name="duration"
						render={({ field }) => (
							<Select
								onValueChange={(value) => field.onChange(Number(value))}
								value={field.value ? String(field.value) : ""}
							>
								<SelectTrigger id="duration">
									<SelectValue placeholder="Seleccionar una duración" />
								</SelectTrigger>
								<SelectContent>
									{DURATION_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={String(option.value)}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>

					<FieldError>{form.formState.errors.duration?.message}</FieldError>
				</Field>
				{/* Campo Nombre de la reserva */}
				<Field>
					<FieldLabel htmlFor="userName">Titular de la reserva</FieldLabel>
					<Input
						id="userName"
						placeholder="Titular de la reserva"
						{...form.register("userName")}
					/>
					<FieldError>{form.formState.errors.userName?.message}</FieldError>
				</Field>
				{/* Campo Teléfono */}
				<Field>
					<FieldLabel htmlFor="userPhone">Teléfono</FieldLabel>
					<Input
						id="userPhone"
						placeholder="612 345 678"
						type="tel"
						{...form.register("userPhone")}
					/>
					<FieldError>{form.formState.errors.userPhone?.message}</FieldError>
				</Field>
				{/* Campo Email */}
				<Field>
					<FieldLabel htmlFor="userEmail">Correo electrónico</FieldLabel>
					<Input
						id="userEmail"
						placeholder="Correo del titular"
						type="email"
						{...form.register("userEmail")}
					/>
					<FieldError>{form.formState.errors.userEmail?.message}</FieldError>
				</Field>

				<DialogFooter>
					{booking?.id && (
						<Button
							type="button"
							variant="destructive"
							onClick={handleCancelBooking}
						>
							Cancelar Reserva
						</Button>
					)}
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" disabled={form.formState.isLoading}>
						{form.formState.isLoading ? "Guardando..." : "Guardar Reserva"}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	)
}
