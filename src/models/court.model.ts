import type { TypeCourt } from "./dbTypes"

export interface Court {
	id: string
	clubId: string
	name: string
	description: string | null
	type: TypeCourt
	price: number
	color: string | null
	isActive: boolean
	createdAt: string
	slotDurationMinutes: number
	slotStartOffsetMinutes: number
}
