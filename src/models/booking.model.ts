import type { PaymentMode, PaymentStatus, StatusBooking } from "./dbTypes"

export interface Booking {
	acceptsMaketing: boolean
	acceptsWhatsup: boolean
	checkInCode: string
	clubId: string
	courtId: string
	createdAt: string
	date: string // "yyyy-MM-dd"
	depositPercentage: number
	endTime: Date // "HH:mm"
	id: string
	note: string | null
	paymentMode: PaymentMode
	paymentStatus: PaymentStatus
	price: number
	startTime: Date // "HH:mm"
	status: StatusBooking
	updatedAt: string | null
	userId: string | null
}
