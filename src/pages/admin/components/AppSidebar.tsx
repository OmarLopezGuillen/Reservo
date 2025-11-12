import {
	BarChart3,
	Calendar,
	File,
	Files,
	ListChecks,
	Trophy,
	Users,
} from "lucide-react"
import type * as React from "react"
import { useAuthUser } from "@/auth/hooks/useAuthUser"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import type { Profile } from "@/models/profile.model"
import { NavMain } from "@/pages/admin/components/NavMain"
import { NavUser } from "@/pages/admin/components/NavUser"
import { ROUTES } from "@/ROUTES"

const navMain = [
	{
		title: "Calendario",
		url: ROUTES.ADMIN.CALENDAR,
		icon: Calendar,
		isActive: true,
		items: [], //? Si hay subrutas se colocan aquí
	},
	{
		title: "Ajustes",
		url: ROUTES.ADMIN.AJUSTES,
		icon: ListChecks,
		isActive: true,
		items: [], //? Si hay subrutas se colocan aquí
	},
	{
		title: "Ligas",
		url: ROUTES.ADMIN.LIGA,
		icon: Trophy,
		isActive: true,
		items: [], //? Si hay subrutas se colocan aquí
	},
	{
		title: "Lista de espera",
		url: ROUTES.ADMIN.LISTA_ESPERA,
		icon: Users,
		isActive: true,
		items: [], //? Si hay subrutas se colocan aquí
	},
	{
		title: "Recursos",
		url: ROUTES.ADMIN.RECURSOS,
		icon: Files,
		isActive: true,
		items: [], //? Si hay subrutas se colocan aquí
	},
	{
		title: "Reportes",
		url: ROUTES.ADMIN.REPORTES,
		icon: File,
		isActive: true,
		items: [], //? Si hay subrutas se colocan aquí
	},
	{
		title: "Estadísticas",
		url: ROUTES.ADMIN.ESTADISTICAS,
		icon: BarChart3,
		isActive: true,
		items: [], //? Si hay subrutas se colocan aquí
	},
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const user = useAuthUser()

	//TODO. A: Objener los datos del profile
	const profile: Profile = {
		email: user.email ?? "",
		name: "Aridane Rodríguez",
		avatarUrl: "",
		id: user.id,
		userRole: user.userRole ?? "user",
	}

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<div className="flex items-center space-x-2">
					<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-sm">R</span>
					</div>
					<span className="text-xl font-semibold">GoReservo</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser profile={profile} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
