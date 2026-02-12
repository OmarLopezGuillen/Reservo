"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, ArrowUpDown } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import type { ChatThreadRow } from "@/pages/admin/pages/chats/components/columns"
import { ROUTES } from "@/ROUTES"

export const chatColumns: ColumnDef<ChatThreadRow>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Chat
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Creado
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) =>
			new Date(row.original.createdAt).toLocaleString("es-ES", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			}),
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<Button asChild size="sm" variant="outline">
				<Link to={ROUTES.CHATS.ID(row.original.id)}>
					Abrir <ArrowRight className="ml-1 h-4 w-4" />
				</Link>
			</Button>
		),
	},
]
