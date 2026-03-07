import { useQueryClient } from "@tanstack/react-query"
import { Bell, Check, ChevronRight, Loader2, MessageSquareText, UserPlus2, X } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuthStore } from "@/auth/stores/auth.store"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCompetitionTeamInvitesMutation } from "@/hooks/competitions/useCompetitionTeamInvitesMutations"
import { markAllNotificationsRead } from "@/services/databaseService/competitions/RPC/markAllNotificationsRead"
import { getPendingInvitesByEmail } from "@/services/databaseService/competitions/competition_team_invites.service"
import { markNotificationRead } from "@/services/databaseService/competitions/RPC/markNotificationRead"
import { markThreadNotificationsRead } from "@/services/databaseService/competitions/RPC/markThreadNotificationsRead"
import type { Tables } from "@/services/types/database"
import { getNotificationsQueryKey } from "../hook/useNotifications"

type NotificationItem = Tables<"notifications">
type PendingInvite = Awaited<ReturnType<typeof getPendingInvitesByEmail>>[number]

interface NotificationDropdownProps {
	children: React.ReactNode
	invites: PendingInvite[]
	isLoadingInvites?: boolean
	notifications: NotificationItem[]
}

function formatNotificationDate(date: string) {
	const parsed = new Date(date)
	const diffMs = Date.now() - parsed.getTime()
	const diffMinutes = Math.floor(diffMs / 60000)

	if (diffMinutes < 1) return "Ahora"
	if (diffMinutes < 60) return `Hace ${diffMinutes} min`

	const diffHours = Math.floor(diffMinutes / 60)
	if (diffHours < 24) return `Hace ${diffHours} h`

	const diffDays = Math.floor(diffHours / 24)
	if (diffDays < 7) return `Hace ${diffDays} d`

	return parsed.toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "short",
	})
}

export function NotificationDropdown({
	children,
	invites,
	isLoadingInvites = false,
	notifications,
}: NotificationDropdownProps) {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const userId = useAuthStore((state) => state.user?.id ?? null)
	const unreadCount = notifications.filter(
		(notification) => !notification.is_read,
	).length
	const inviteCount = invites.length
	const totalCount = unreadCount + inviteCount
	const { acceptTeamInvite, updateCompetitionTeamInvite } =
		useCompetitionTeamInvitesMutation()
	const isProcessingInvite =
		acceptTeamInvite.isPending || updateCompetitionTeamInvite.isPending

	const invalidateNotifications = async () => {
		await queryClient.invalidateQueries({
			queryKey: getNotificationsQueryKey(userId),
		})
	}

	const handleClick = async (notification: NotificationItem) => {
		try {
			if (notification.entity_type === "chat_thread") {
				await markThreadNotificationsRead(notification.entity_id)
			} else {
				await markNotificationRead(notification.id)
			}

			await invalidateNotifications()

			if (notification.entity_type === "chat_thread") {
				navigate(`/chats/${notification.entity_id}`)
			}
		} catch {}
	}

	const handleMarkAllRead = async () => {
		try {
			await markAllNotificationsRead()
			await invalidateNotifications()
		} catch {}
	}

	const handleAcceptInvite = (token: string) => {
		acceptTeamInvite.mutate({ token })
	}

	const handleDeclineInvite = (inviteId: string) => {
		updateCompetitionTeamInvite.mutate({
			id: inviteId,
			inviteData: { status: "declined" as const },
		})
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-[min(24rem,calc(100vw-1rem))] rounded-2xl border-border/60 p-0 shadow-xl"
			>
				<div className="bg-gradient-to-b from-slate-50 to-background">
					<DropdownMenuLabel className="flex items-center justify-between gap-3 px-4 py-3">
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700">
								<Bell className="h-4 w-4" />
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-semibold text-foreground">
									Notificaciones
								</span>
								<span className="text-xs font-normal text-muted-foreground">
									{totalCount > 0
										? `${totalCount} elementos pendientes`
										: "Todo al dia"}
								</span>
							</div>
						</div>

						<div className="flex items-center gap-2">
							{unreadCount > 0 && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-8 rounded-full px-3 text-[11px] font-semibold text-sky-700 hover:bg-sky-50 hover:text-sky-800"
									onClick={handleMarkAllRead}
								>
									Marcar todo
								</Button>
							)}
							<div className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
								{totalCount}
							</div>
						</div>
					</DropdownMenuLabel>
				</div>

				<DropdownMenuSeparator className="mx-0 my-0" />

				{isLoadingInvites && (
					<div className="flex items-center justify-center gap-2 px-6 py-5 text-sm text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						Cargando actividad...
					</div>
				)}

				{!isLoadingInvites && invites.length > 0 && (
					<div className="border-b bg-amber-50/50 p-2">
						<div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
							Invitaciones a equipos
						</div>
						<div className="space-y-2">
							{invites.map((invite) => (
								<div
									key={invite.id}
									className="rounded-xl border border-amber-100 bg-background px-3 py-3"
								>
									<div className="flex items-start gap-3">
										<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
											<UserPlus2 className="h-4 w-4" />
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="line-clamp-1 text-sm font-semibold text-foreground">
														{invite.team?.name ?? "Equipo"}
													</p>
													<p className="mt-1 text-xs text-muted-foreground">
														Competición:{" "}
														{invite.team?.competition?.name ?? "Sin competición"}
													</p>
													{invite.role && (
														<p className="mt-1 text-xs text-muted-foreground">
															Rol: {invite.role}
														</p>
													)}
												</div>
												<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
													Nueva
												</span>
											</div>

											<div className="mt-3 flex gap-2">
												<Button
													size="sm"
													className="h-8 flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
													onClick={() => handleAcceptInvite(invite.token)}
													disabled={isProcessingInvite}
												>
													<Check className="mr-1.5 h-4 w-4" />
													Aceptar
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="h-8 flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
													onClick={() => handleDeclineInvite(invite.id)}
													disabled={isProcessingInvite}
												>
													<X className="mr-1.5 h-4 w-4" />
													Rechazar
												</Button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{!isLoadingInvites && notifications.length === 0 && invites.length === 0 && (
					<div className="flex flex-col items-center justify-center px-6 py-10 text-center">
						<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
							<Bell className="h-5 w-5" />
						</div>
						<div className="text-sm font-medium text-foreground">
							No hay actividad pendiente
						</div>
						<div className="mt-1 text-xs text-muted-foreground">
							Cuando haya notificaciones o invitaciones apareceran aqui.
						</div>
					</div>
				)}

				{notifications.length > 0 && (
					<div className="max-h-[26rem] overflow-y-auto p-2">
						<div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
							Notificaciones
						</div>
						{notifications.map((notification) => (
							<DropdownMenuItem
								key={notification.id}
								onClick={() => handleClick(notification)}
								className="group mb-1 min-h-20 cursor-pointer items-start rounded-xl border border-transparent px-3 py-3 transition-all hover:border-slate-200 hover:bg-slate-50 focus:border-slate-200 focus:bg-slate-50"
							>
								<div className="flex w-full items-start gap-3">
									<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
										<MessageSquareText className="h-4 w-4" />
									</div>

									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-3">
											<div className="flex items-center gap-2">
												<span className="line-clamp-1 text-sm font-semibold text-foreground">
													{notification.title}
												</span>
												{!notification.is_read && (
													<span className="relative flex h-3 w-3 shrink-0">
														<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
														<span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500" />
													</span>
												)}
											</div>
											<span className="shrink-0 text-[11px] text-muted-foreground">
												{formatNotificationDate(notification.created_at)}
											</span>
										</div>

										<p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
											{notification.body}
										</p>

										<div className="mt-2 flex items-center justify-between gap-2">
											<div className="flex items-center gap-2">
												<span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
													{notification.entity_type === "chat_thread"
														? "Chat"
														: notification.type}
												</span>
												{!notification.is_read && (
													<span className="text-[11px] font-medium text-sky-700">
														Nueva
													</span>
												)}
											</div>
											<ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600" />
										</div>
									</div>
								</div>
							</DropdownMenuItem>
						))}
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
