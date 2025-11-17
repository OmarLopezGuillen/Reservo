export interface CancellationRules {
	hoursUntilBooking: number
	canCancel: boolean
	canCancelFree: boolean
	isLateCancellation: boolean
	cancellationFee: number
	refundAmount: number
}
