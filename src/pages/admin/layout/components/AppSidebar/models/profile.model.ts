import type { Role } from "@/models/ROLES.model"

export interface Profile {
	id: string
	name: string
	email: string
	avatarUrl?: string
	userRole: Role
}
