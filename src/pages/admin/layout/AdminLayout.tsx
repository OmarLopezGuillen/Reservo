import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { Suspense } from "react"
import { Outlet, useLocation } from "react-router"
import { Loading } from "@/components/Loading"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/pages/admin/layout/components/AppSidebar/AppSidebar"

const AdminLayout = () => {
	const location = useLocation()

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
					</div>
				</header>

				<Suspense key={location.pathname} fallback={<Loading />}>
					<div className="mx-2">
						<NuqsAdapter>
							<Outlet />
						</NuqsAdapter>
					</div>
				</Suspense>
			</SidebarInset>
		</SidebarProvider>
	)
}

export default AdminLayout
