import { MessageSquare } from "lucide-react"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useChatThreads } from "@/hooks/competitions/useChatThreadsQuery"
import { chatColumns } from "./components/columns"

export default function Chats() {
	const { chatThreadsQuery } = useChatThreads()
	const [onlyAlerts, setOnlyAlerts] = useState(false)

	const chats = chatThreadsQuery.data ?? []

	const filtered = useMemo(() => {
		if (!onlyAlerts) return chats
		return chats.filter((c) => c.needsAdminAttention)
	}, [chats, onlyAlerts])

	if (chatThreadsQuery.isLoading) return <div>Cargando chats...</div>
	if (chatThreadsQuery.isError) return <div>Error cargando los chats</div>

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5" />
					Chats
				</CardTitle>

				<div className="flex items-center gap-2 pt-2">
					<Switch checked={onlyAlerts} onCheckedChange={setOnlyAlerts} />
					<Label>Solo con aviso @admin</Label>
				</div>
			</CardHeader>

			<CardContent>
				<DataTable
					columns={chatColumns}
					data={filtered}
					filterKey="name"
					filterPlaceholder="Buscar por nombre del chat..."
				/>
			</CardContent>
		</Card>
	)
}
