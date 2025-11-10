export interface TimeRange {
	start: string
	end: string
}

export interface BusinessDay {
	day: string
	hours: TimeRange[]
	closed?: boolean
}
