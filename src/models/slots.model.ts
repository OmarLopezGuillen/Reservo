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

export type SlotStatus = "available" | "not-available" | "your-booking" | "past"

export const SLOT_STATUS_STYLES: Record<SlotStatus, string> = {
	available: "bg-white hover:bg-blue-50 cursor-pointer border-border",
	"not-available": "bg-slate-100 cursor-not-allowed",
	"your-booking": "bg-blue-500 hover:bg-blue-600",
	past: "bg-gradient-to-br from-slate-50 to-slate-100 cursor-not-allowed opacity-50 relative overflow-hidden after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_48%,rgba(148,163,184,0.15)_48%,rgba(148,163,184,0.15)_52%,transparent_52%)] after:bg-[length:8px_8px]",
}
