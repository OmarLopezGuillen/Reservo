export type UISlot = {
	id: string
	date: string // YYYY-MM-DD
	courtId: string
	courtName: string
	courtType: "indoor" | "outdoor"
	price: number
	startTime: string // "HH:mm" local
	endTime: string // "HH:mm" local
	startTstz: string // ISO
	endTstz: string // ISO
	duration: number // minutos
}
