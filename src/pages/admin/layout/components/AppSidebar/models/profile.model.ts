import type { Role } from "@/models/roles.model"

export interface Profile {
	id: string
	name: string
	email: string
	avatarUrl?: string
	userRole: Role
}
