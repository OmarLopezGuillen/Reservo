import { Bell } from "lucide-react"
import { useAuthStore } from "@/auth/stores/auth.store"
import { usePendingInvitesForUser } from "@/hooks/competitions/useCompetitionTeamInvitesQuery"
import { cn } from "@/lib/utils"
import { NotificationDropdown } from "./components/NotificationDropdown"
import { useNotifications } from "./hook/useNotifications"

interface NotificationProps {
	variant?: "default" | "header"
}

export function Notification({ variant = "default" }: NotificationProps) {
	const user = useAuthStore((state) => state.user)
	const { data: notifications = [] } = useNotifications()
	const { pendingInvitesQuery } = usePendingInvitesForUser(user?.email)
	const invites = pendingInvitesQuery.data ?? []

	const unreadCount = notifications.filter((n) => !n.is_read).length
	const totalUnreadCount = unreadCount + invites.length
	const isHeaderVariant = variant === "header"

	return (
		<div className="relative">
			<NotificationDropdown
				invites={invites}
				isLoadingInvites={pendingInvitesQuery.isLoading}
				notifications={notifications}
			>
				<button
					className={cn(
						"relative flex items-center justify-center rounded-full border transition-all",
						isHeaderVariant
							? "h-9 w-9 border-border/50 bg-muted/40 text-foreground shadow-none backdrop-blur hover:border-border hover:bg-muted"
							: "h-10 w-10 border-border/60 bg-background/90 text-muted-foreground shadow-sm hover:border-border hover:bg-accent hover:text-foreground",
					)}
				>
					<Bell
						className={cn("h-5 w-5", isHeaderVariant && "h-[18px] w-[18px]")}
					/>

					{totalUnreadCount > 0 && (
						<>
							<span
								className={cn(
									"absolute rounded-full bg-sky-500 animate-pulse",
									isHeaderVariant
										? "right-1 top-1 h-2 w-2"
										: "top-1 right-1 h-2.5 w-2.5",
								)}
							/>
							<span
								className={cn(
									"absolute rounded-full bg-foreground text-center text-[10px] font-semibold leading-none text-background shadow-sm",
									isHeaderVariant
										? "-right-1.5 -top-1 min-w-4 px-1 py-0.5"
										: "-top-1 -right-1 min-w-5 px-1.5 py-0.5",
								)}
							>
								{totalUnreadCount > 99 ? "99+" : totalUnreadCount}
							</span>
						</>
					)}

					<span className="sr-only">
						{totalUnreadCount > 0
							? `${totalUnreadCount} elementos pendientes`
							: "No hay notificaciones ni invitaciones pendientes"}
					</span>
				</button>
			</NotificationDropdown>
		</div>
	)
}
