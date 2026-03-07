import { useAuthStore } from "@/auth/stores/auth.store"
import { Notification } from "@/components/Notifications/Notifications"
import { cn } from "@/lib/utils"

interface AppHeaderActionsProps {
	className?: string
	variant?: "default" | "header"
}

export function AppHeaderActions({
	className,
	variant = "header",
}: AppHeaderActionsProps) {
	const user = useAuthStore((state) => state.user)

	if (!user) return null

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Notification variant={variant} />
		</div>
	)
}
