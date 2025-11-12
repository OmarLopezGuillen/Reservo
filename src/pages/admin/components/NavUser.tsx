import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getInitials } from "@/lib/utils"
import type { Profile } from "@/models/profile.model"

export function NavUser({ profile }: { profile: Profile }) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg grayscale">
						<AvatarImage src={profile.avatarUrl} alt={profile.name} />
						<AvatarFallback className="rounded-full">
							{getInitials(profile.name)}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{profile.name}</span>
						<span className="text-muted-foreground truncate text-xs">
							{profile.email}
						</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
