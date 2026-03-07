import { Bell } from "lucide-react"
import { NotificationDropdown } from "./components/NotificationDropdown"
import { useNotifications } from "./hook/useNotifications"

export function Notification() {
	const { data: notifications = [] } = useNotifications()

	const unreadCount = notifications.filter((n) => !n.is_read).length

	return (
		<div className="relative">
			<NotificationDropdown notifications={notifications}>
				<button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground shadow-sm transition-all hover:border-border hover:bg-accent hover:text-foreground">
					<Bell className="h-5 w-5" />

					{unreadCount > 0 && (
						<>
							<span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-sky-500 animate-pulse" />
							<span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-foreground px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-background shadow-sm">
								{unreadCount > 99 ? "99+" : unreadCount}
							</span>
						</>
					)}

					{unreadCount === 0 && (
						<span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500/80" />
					)}

					<span className="sr-only">
						{unreadCount > 0
							? `${unreadCount} notificaciones sin leer`
							: "No hay notificaciones sin leer"}
					</span>
				</button>
			</NotificationDropdown>
		</div>
	)
}
