import type { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ParticipantField } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/components/BookingDialog/components/ParticipantField"
import type { BookingFormValues } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/schemas/bookingForm"

interface PaymentsSectionProps {
	fields: Array<{ id: string }>
	control: ReturnType<typeof useForm<BookingFormValues>>["control"]
	onMarkAllPaid: () => void
	baseId: string
}

export function PaymentsSection({
	fields,
	control,
	onMarkAllPaid,
	baseId,
}: PaymentsSectionProps) {
	return (
		<div
			className="space-y-3 border rounded-md p-3"
			role="group"
			aria-labelledby={`${baseId}-payments-label`}
		>
			<div className="flex justify-between items-center">
				<Label id={`${baseId}-payments-label`}>
					Participantes y estado de pago
				</Label>
				<Button
					type="button"
					size="sm"
					variant="secondary"
					onClick={onMarkAllPaid}
				>
					Marcar todo pagado
				</Button>
			</div>

			<div className="space-y-2">
				{fields.map((field, index) => (
					<ParticipantField
						key={field.id}
						index={index}
						fieldId={`${baseId}-participant-${index}`}
						control={control}
						isFirstParticipant={index === 0}
					/>
				))}
			</div>
		</div>
	)
}
