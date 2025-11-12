import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { getInitials } from "@/lib/utils"
import type { Profile } from "@/models/profile.model"

export function NavUser({ profile }: { profile: Profile }) {
	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex gap-2 m-2">
				<Avatar className="h-8 w-8 rounded-lg grayscale">
					<AvatarImage src={profile.avatarUrl} alt={profile.name} />
					<AvatarFallback className="rounded-full">
						{getInitials(profile.name)}
					</AvatarFallback>
				</Avatar>
				<div className="grid flex-1 text-left text-sm leading-tight gap-1">
					<span className="truncate font-medium">{profile.name}</span>

					<span className="text-muted-foreground truncate text-xs">
						{profile.email}
					</span>
					<Badge variant="secondary" className="capitalize">
						{profile.userRole}
					</Badge>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
