import { useQueryClient } from "@tanstack/react-query"
import { ArrowDown, ChevronLeft } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useParams } from "react-router"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants/ROUTES"
import { useSendChatMessage } from "@/hooks/competitions/useChatMutaiton"
import {
	CHAT_MESSAGES_QUERY_KEY,
	useChatMessages,
	useChatThread,
} from "@/hooks/competitions/useChatQuery"
import { useBookingsCalendar } from "@/hooks/useBookingsQuery"
import { useClubHours } from "@/hooks/useClubHoursQuery"
import { useCourts } from "@/hooks/useCourtsQuery"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { ChatRulesBanner } from "./components/ChatRulesBanner"
import { MatchReschedulePanel } from "./components/MatchReschedulePanel/MatchReschedulePanel"

export default function ChatThreadPage() {
	const { chatId } = useParams<{ chatId: string }>()
	const threadId = chatId!

	const queryClient = useQueryClient()

	const user = useAuthUser()
	const { courtsQuery } = useCourts(user.clubId!)
	const { data: courts, isLoading } = courtsQuery

	const { threadQuery } = useChatThread(threadId)
	const { messagesQuery } = useChatMessages(threadId)
	const { sendMessageMutation } = useSendChatMessage(threadId)

	const [myUserId, setMyUserId] = useState<string | null>(null)
	const [text, setText] = useState("")

	const scrollRef = useRef<HTMLDivElement | null>(null)
	const [showScrollButton, setShowScrollButton] = useState(false)
	const [unreadCount, setUnreadCount] = useState(0)
	const isAtBottomRef = useRef(true)
	const [hasInitialized, setHasInitialized] = useState(false)
	const prevLengthRef = useRef(0)

	const { bookingCalendarQuery } = useBookingsCalendar(user.clubId!)
	const bookings = bookingCalendarQuery.data ?? []

	const { clubHoursQuery } = useClubHours(user.clubId!)
	const { data: clubHours } = clubHoursQuery

	const messages = messagesQuery.data ?? []

	const location = useLocation()

	const backRoute =
		location.state?.from === "admin" ? ROUTES.ADMIN.CHAT : ROUTES.CHATS.ROOT

	const scrollToBottom = (smooth = true) => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: smooth ? "smooth" : "auto",
			})
		}
	}

	const handleScroll = () => {
		if (!scrollRef.current) return
		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
		const isAtBottom = scrollHeight - scrollTop - clientHeight <= 100
		isAtBottomRef.current = isAtBottom

		if (isAtBottom) {
			setUnreadCount(0)
			setShowScrollButton(false)
		} else {
			setShowScrollButton(true)
		}
	}

	// cargar mi user id una vez
	useEffect(() => {
		const run = async () => {
			const { data } = await supabase.auth.getUser()
			setMyUserId(data.user?.id ?? null)
		}
		void run()
	}, [])

	useEffect(() => {
		const run = async () => {
			try {
				await supabase.rpc("clear_chat_thread_admin_attention", {
					p_thread_id: threadId,
				})
			} catch {
				// si no es admin, fallará: lo ignoras
			}
		}
		void run()
	}, [threadId])

	// realtime: escuchar inserts en chat_messages de este thread
	useEffect(() => {
		if (!threadId) return

		const channel = supabase
			.channel(`chat_messages:${threadId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "chat_messages",
					filter: `thread_id=eq.${threadId}`,
				},
				(payload) => {
					const newRow = payload.new

					const newMsg = {
						id: newRow.id,
						threadId: newRow.thread_id,
						userId: newRow.user_id,
						body: newRow.body,
						createdAt: newRow.created_at,
					}

					queryClient.setQueryData(
						[CHAT_MESSAGES_QUERY_KEY, threadId],
						(old: any) => {
							const prev = Array.isArray(old) ? old : []
							if (prev.find((m) => m.id === newMsg.id)) return prev

							return [...prev, newMsg]
						},
					)
				},
			)
			.subscribe((status) => {
				console.log("Realtime chat status:", status)
			})

		return () => {
			channel.unsubscribe()
		}
	}, [threadId, queryClient])

	// Control de scroll y mensajes nuevos
	useEffect(() => {
		if (!messagesQuery.isSuccess) return

		const currentLength = messages.length
		const previousLength = prevLengthRef.current

		// guardar longitud actual
		prevLengthRef.current = currentLength

		// primera carga
		if (!hasInitialized) {
			scrollToBottom(false)
			setHasInitialized(true)
			return
		}

		// si no hay nuevos mensajes reales
		if (currentLength <= previousLength) return

		const lastMessage = messages[currentLength - 1]
		const isMine = myUserId && lastMessage.userId === myUserId

		if (isMine || isAtBottomRef.current) {
			requestAnimationFrame(() => scrollToBottom(true))
		} else {
			setUnreadCount((prev) => prev + (currentLength - previousLength))
		}
	}, [messages, messagesQuery.isSuccess, myUserId, hasInitialized])

	const title = useMemo(
		() => threadQuery.data?.name ?? "Chat",
		[threadQuery.data?.name],
	)

	const onSend = async () => {
		const body = text.trim()
		if (!body || sendMessageMutation.isPending) return

		try {
			await sendMessageMutation.mutateAsync(body)
			setText("")
			scrollToBottom(true)
		} catch (e) {
			console.error(e)
		}
	}

	if (threadQuery.isLoading) return <div>Cargando chat...</div>
	if (threadQuery.isError) return <div>Error cargando el chat</div>
	if (!threadQuery.data) return null

	return (
		<Card className="h-screen flex flex-col relative">
			<CardHeader className="border-b">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to={backRoute}>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Volver atrás
						</Link>
					</Button>

					<CardTitle className="truncate">{title}</CardTitle>
				</div>
				<div className="w-full overflow-x-auto">
					<MatchReschedulePanel
						threadId={threadId}
						matchId={threadQuery.data.matchId}
						courts={courts ?? []}
						bookings={bookings ?? []}
						clubHours={clubHours}
					/>
				</div>
			</CardHeader>

			<CardContent
				ref={scrollRef}
				onScroll={handleScroll}
				className="flex-1 overflow-auto p-4 space-y-3"
			>
				{messagesQuery.isLoading && <div>Cargando mensajes...</div>}
				{messagesQuery.isError && <div>Error cargando mensajes</div>}

				{messagesQuery.isSuccess && (
					<div className="space-y-2">
						<ChatRulesBanner threadId={threadId} className="mb-2" />
						{messages.map((m) => {
							const isMine = myUserId && m.userId === myUserId
							return (
								<div
									key={m.id}
									className={cn(
										"flex",
										isMine ? "justify-end" : "justify-start",
									)}
								>
									<div
										className={cn(
											"max-w-[78%] rounded-2xl px-3 py-2 text-sm border",
											isMine
												? "bg-primary text-primary-foreground border-primary"
												: "bg-background",
										)}
									>
										{/* Nombre solo si NO es mío */}
										{!isMine && m.senderName && (
											<div className="text-[12px] font-semibold mb-1 text-muted-foreground">
												{m.senderName}
											</div>
										)}
										<div className="whitespace-pre-wrap break-words">
											{m.body}
										</div>
										<div
											className={cn(
												"mt-1 text-[11px] opacity-70",
												isMine
													? "text-primary-foreground"
													: "text-muted-foreground",
											)}
										>
											{new Date(m.createdAt).toLocaleTimeString("es-ES", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</CardContent>

			{showScrollButton && unreadCount > 0 && (
				<div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
					<Button
						variant="secondary"
						size="sm"
						className="shadow-lg rounded-full gap-2 transition-all duration-200 hover:scale-105"
						onClick={() => {
							scrollToBottom(true)
							setUnreadCount(0)
						}}
					>
						<ArrowDown className="h-4 w-4" />
						{unreadCount} mensaje{unreadCount !== 1 ? "s" : ""} nuevo
						{unreadCount !== 1 ? "s" : ""}
					</Button>
				</div>
			)}

			<div className="p-3 flex gap-2">
				<Input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Escribe un mensaje..."
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault()
							void onSend()
						}
					}}
					disabled={sendMessageMutation.isPending}
				/>
				<Button
					onClick={onSend}
					disabled={sendMessageMutation.isPending || !text.trim()}
				>
					Enviar
				</Button>
			</div>
		</Card>
	)
}
