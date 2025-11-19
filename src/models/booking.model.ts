import type { BusinessData } from "./business.model"
import type { Court } from "./court.model"
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
	endTime: Date
	id: string
	note: string | null
	paymentMode: PaymentMode
	paymentStatus: PaymentStatus
	price: number
	startTime: Date
	status: StatusBooking
	updatedAt: string | null
	userId: string | null
}

export interface BookingManagement extends Booking {
	court: Court
	club: BusinessData
}

export interface BookingCalendar {
	id: string
	courtId: string
	clubId: string
	startTime: Date
	endTime: Date
	date: string
	status: StatusBooking
	isMine: boolean
}
