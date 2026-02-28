import { zodResolver } from "@hookform/resolvers/zod"
import { addMinutes, differenceInMinutes, format } from "date-fns"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { useBookingsMutation } from "@/hooks/useBookingsMutations"
import { useCourts } from "@/hooks/useCourtsQuery"
import type { Booking } from "@/models/booking.model"
import type { BookingsInsert, BookingsUpdate } from "@/models/dbTypes"
import {
	type BookingFormValues,
	type BookingSlot,
	bookingFormSchema,
} from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/BookingDialog/schemas/bookingForm"

interface BookingFormProps {
	slot: BookingSlot | null
	clubId: string
	onClose: () => void
	booking: Booking | null
}

function createDefaultPeople(): BookingFormValues["people"] {
	return Array.from({ length: 4 }, () => ({
		name: "",
		paid: false,
	}))
}

function parseBookingNote(note: string | null | undefined) {
	if (!note)
		return { clientName: "", clientPhone: "", clientEmail: "", payments: null }

	try {
		const noteData = JSON.parse(note)
		return {
			clientName: noteData.clientName ?? "",
			clientPhone: noteData.clientPhone ?? "",
			clientEmail: noteData.clientEmail ?? "",
			payments: noteData.payments ?? null,
		}
	} catch {
		return {
			clientName: note,
			clientPhone: "",
			clientEmail: "",
			payments: null,
		}
	}
}

function getDefaultFormValues(
	booking: Booking | null,
	slot: BookingSlot | null,
) {
	if (!booking) {
		const isACourt = slot?.courtId !== "multiple-courts-selected"

		return {
			courtId: isACourt && slot ? slot.courtId : "",
			people: [
				{ name: "", paid: false },
				{ name: "", paid: false },
				{ name: "", paid: false },
				{ name: "", paid: false },
			],
		}
	}

	const { clientName, clientPhone, clientEmail, payments } = parseBookingNote(
		booking?.note,
	)

	const duration = booking
		? differenceInMinutes(
				new Date(booking.endTime),
				new Date(booking.startTime),
			)
		: 90

	const people =
		payments && payments.length === 4 ? payments : createDefaultPeople()

	// Si hay pagos, el primer participante debe tener el nombre del cliente
	if (people[0] && clientName) {
		people[0].name = clientName
	}

	return {
		courtId: booking?.courtId ?? "",
		duration,
		userName: clientName ?? "",
		userPhone: clientPhone ?? "",
		userEmail: clientEmail ?? "",
		people,
	}
}

export const useBookingForm = ({
	clubId,
	slot,
	onClose,
	booking,
}: BookingFormProps) => {
	const [showPayments, setShowPayments] = useState(!!booking?.id)

	const { updateBooking } = useBookingsMutation()

	const defaultValues = getDefaultFormValues(booking, slot)

	const user = useAuthUser()
	const { courtsQuery } = useCourts(user.clubId!)
	const courts = courtsQuery.data

	const { createBooking } = useBookingsMutation()

	const form = useForm<BookingFormValues>({
		resolver: zodResolver(bookingFormSchema),
		defaultValues,
	})

	const { control, setValue, watch } = form

	const { fields } = useFieldArray({
		control,
		name: "people",
	})

	const userName = watch("userName")
	const duration = watch("duration")

	const markAllPaid = useCallback(() => {
		fields.forEach((_, index) => {
			setValue(`people.${index}.paid`, true)
		})
	}, [fields, setValue])

	useEffect(() => {
		setValue("people.0.name", userName)
	}, [userName, setValue])

	const endTime = useMemo(
		() => (slot ? addMinutes(slot.date, duration) : null),
		[slot, duration],
	)

	const handleCreateChanges = useCallback(
		(data: BookingFormValues) => {
			if (!slot || !endTime) return

			const selectedCourt = courts?.find((c) => c.id === data.courtId)

			if (!selectedCourt) {
				console.error("No se ha seleccionado una pista válida.")
				return
			}

			const allPaid = data.people.every((person) => person.paid === true)

			const booking: BookingsInsert = {
				club_id: clubId,
				court_id: data.courtId!,
				price: selectedCourt.price,
				start_time: slot.date.toISOString(),
				date: format(slot.date, "yyyy-MM-dd"),
				end_time: endTime.toISOString(),
				user_id: user.id,
				accepts_maketing: false,
				accepts_whatsup: false,
				deposit_percentage: 0,
				payment_mode: "none",
				payment_status: allPaid ? "paid" : "pending",
				status: "confirmed",
				note: JSON.stringify({
					clientName: data.userName,
					clientPhone: data.userPhone,
					clientEmail: data.userEmail,
					payments: data.people,
				}),
			}

			createBooking.mutate(booking, {
				onSuccess: () => onClose(),
			})
		},
		[slot, endTime, courts, clubId, user.id, createBooking],
	)
	const handleSaveChanges = useCallback(
		(data: BookingFormValues) => {
			if (!booking || !endTime) return

			const allPaid = data.people.every((person) => person.paid === true)

			const bookingData: BookingsUpdate = {
				court_id: data.courtId,
				end_time: endTime.toISOString(),
				payment_status: allPaid ? "paid" : "pending",
				note: JSON.stringify({
					clientName: data.userName,
					clientPhone: data.userPhone,
					clientEmail: data.userEmail,
					payments: data.people,
				}),
			}

			updateBooking.mutate(
				{ id: booking.id, bookingData },
				{ onSuccess: () => onClose() },
			)
		},
		[booking, endTime, updateBooking, onClose],
	)

	const handleCancelBooking = useCallback(() => {
		if (!booking) return

		updateBooking.mutate(
			{
				id: booking.id,
				bookingData: { status: "cancelled" },
			},
			{
				onSuccess: () => {
					onClose()
				},
			},
		)
	}, [booking, updateBooking, onClose])

	const onSubmit = booking?.id ? handleSaveChanges : handleCreateChanges

	return {
		showPayments,
		setShowPayments,
		form,
		courts,
		control,
		fields,
		markAllPaid,
		onSubmit,
		handleCancelBooking,
	}
}
