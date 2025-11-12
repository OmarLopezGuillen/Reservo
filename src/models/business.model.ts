export interface TimeRange {
	start: string
	end: string
}

export interface BusinessDay {
	weekday: string
	hours: TimeRange[]
	closed?: boolean
}

export interface BusinessData {
	id: string
	address: string
	phone: string
	email: string
	name: string
	whatsappNumber: string
}
