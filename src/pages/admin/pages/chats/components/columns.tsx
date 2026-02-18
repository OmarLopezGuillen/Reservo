"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, ArrowUpDown } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/ROUTES"

export type ChatThreadRow = {
	id: string
	name: string
	createdAt: string
	needsAdminAttention?: boolean
}

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
		cell: ({ row }) => {
			const needs = !!row.original.needsAdminAttention

			return (
				<div className="flex items-center gap-2">
					{needs && (
						<span className="relative flex h-2.5 w-2.5">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
							<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
						</span>
					)}
					<div className="font-medium">{row.original.name}</div>
				</div>
			)
		},
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
