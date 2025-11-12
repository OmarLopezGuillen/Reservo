import {
	BarChart3,
	Calendar,
	File,
	Files,
	Home,
	ListChecks,
	LogOut,
	Trophy,
	Users,
} from "lucide-react"
import type * as React from "react"
import { Link } from "react-router"
import { useAuthActions } from "@/auth/hooks/useAuthActions"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
	const { signOut } = useAuthActions()

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
				<div className="flex items-center space-x-2 p-2">
					<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-sm">R</span>
					</div>
					<span className="text-xl font-semibold">GoReservo Admin</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				<Separator />
				<NavUser profile={profile} />
				<Separator />
				<div className="space-y-2 m-2">
					<Button variant="ghost" className="w-full justify-start" asChild>
						<Link to={ROUTES.HOME}>
							<Home className="mr-3 size-4" />
							Ver sitio público
						</Link>
					</Button>
					<Button
						variant="destructive"
						className="w-full justify-start text-sm font-medium transition-colors cursor-pointer"
						onClick={() => {
							signOut()
						}}
					>
						<LogOut className="mr-3 size-4" />
						Cerrar sesión
					</Button>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
