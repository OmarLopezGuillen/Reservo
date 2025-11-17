import { useMemo } from "react"
import type { BookingManagement } from "@/models/booking.model"
import type { CancellationRules } from "@/models/calleationRules.model"

export const useCancellationRules = (
	booking: BookingManagement | undefined,
): CancellationRules => {
	return useMemo(() => {
		if (!booking) {
			return {
				hoursUntilBooking: 0,
				canCancel: false,
				canCancelFree: false,
				isLateCancellation: false,
				cancellationFee: 0,
				refundAmount: 0,
			}
		}

		const start = new Date(booking.startTime).getTime()
		const now = Date.now()
		const hoursUntilBooking = (start - now) / 3600000 // ms → hours

		const freeLimit = booking.club.cancelHoursBefore ?? 24
		const penaltyPct = booking.club.penaltyPercentage ?? 0
		const minHoursToCancel = 1 // Fixed business rule

		if (hoursUntilBooking < minHoursToCancel) {
			return {
				hoursUntilBooking,
				canCancel: false,
				canCancelFree: false,
				isLateCancellation: false,
				cancellationFee: 0,
				refundAmount: 0,
			}
		}

		if (hoursUntilBooking >= freeLimit) {
			return {
				hoursUntilBooking,
				canCancel: true,
				canCancelFree: true,
				isLateCancellation: false,
				cancellationFee: 0,
				refundAmount: booking.price,
			}
		}

		const fee = (booking.price * penaltyPct) / 100
		const refund = booking.price - fee

		return {
			hoursUntilBooking,
			canCancel: true,
			canCancelFree: false,
			isLateCancellation: true,
			cancellationFee: fee,
			refundAmount: refund,
		}
	}, [booking])
}
