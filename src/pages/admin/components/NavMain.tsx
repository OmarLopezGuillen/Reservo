import type { LucideIcon } from "lucide-react"
import { NavLink } from "react-router"
import { buttonVariants } from "@/components/ui/button"
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: LucideIcon
	}[]
}) {
	const { setOpenMobile } = useSidebar()
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<NavLink
								to={item.url}
								onClick={() => setOpenMobile(false)}
								className={({ isActive }) =>
									cn(
										buttonVariants({
											variant: "ghost",
											size: "default",
										}),
										"w-full justify-start transition-colors",
										isActive && "bg-accent text-accent-foreground",
									)
								}
							>
								{item.icon && <item.icon className="mr-2 h-4 w-4" />}
								<span>{item.title}</span>
							</NavLink>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
