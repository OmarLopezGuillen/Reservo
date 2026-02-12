import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { useChatThreads } from "@/hooks/competitions/useChatThreadsQuery"
import { chatColumns } from "./components/columns"

export default function Chats() {
	const { chatThreadsQuery } = useChatThreads()
	const chats = chatThreadsQuery.data ?? []

	if (chatThreadsQuery.isLoading) return <div>Cargando chats...</div>
	if (chatThreadsQuery.isError) return <div>Error cargando tus chats</div>

	return (
		<div className="min-h-svh w-full flex items-center justify-center px-4">
			<div className="w-full max-w-5xl">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageSquare className="h-5 w-5" />
							Mis chats
						</CardTitle>
					</CardHeader>

					<CardContent>
						<DataTable
							columns={chatColumns}
							data={chats}
							filterKey="name"
							filterPlaceholder="Buscar por nombre del chat..."
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
