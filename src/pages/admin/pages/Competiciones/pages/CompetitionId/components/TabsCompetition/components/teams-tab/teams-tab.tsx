"use client"

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table"
import {
	ArrowUpDown,
	CheckCircle,
	ChevronDown,
	Clock,
	Filter,
	Loader2,
	MoreHorizontal,
	Search,
	Trash2,
	Users,
	XCircle,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useCompetitionTeamsMutation } from "@/hooks/competitions/useCompetitionTeamsMutations"
import { useCompetitionTeamsByCompetitionId } from "@/hooks/competitions/useCompetitionTeamsQuery"
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"
import { CreateTeamDialog } from "./components/CreateTeamDialog"
import { TeamDetailDialog } from "./components/TeamDetailDialog"
import { TeamStats } from "./components/TeamStats"

interface TeamsAdminTabProps {
	competitionId: string
}

const TeamsAdminTab = ({ competitionId }: TeamsAdminTabProps) => {
	const { competitionTeamsQuery } =
		useCompetitionTeamsByCompetitionId(competitionId)

	const { competitionCategoriesQuery } =
		useCompetitionCategoriesByCompetitionId(competitionId)

	const { updateCompetitionTeam, deleteCompetitionTeam } =
		useCompetitionTeamsMutation()

	// Filtros UI (buscador + selects)
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState<string>("all")
	const [statusFilter, setStatusFilter] = useState<string>("all")

	// Estados para TanStack Table
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

	// Diálogo detalle equipo
	const [selectedTeam, setSelectedTeam] =
		useState<CompetitionTeamWithMemberAndAvailability | null>(null)
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

	const handleViewTeamDetail = (
		team: CompetitionTeamWithMemberAndAvailability,
	) => {
		setSelectedTeam(team)
		setIsDetailDialogOpen(true)
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "enrolled":
				return (
					<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
						<CheckCircle className="h-3 w-3 mr-1" />
						Completo
					</Badge>
				)
			case "pending":
				return (
					<Badge variant="secondary">
						<Clock className="h-3 w-3 mr-1" />
						Pendiente
					</Badge>
				)
			case "withdrawn":
				return (
					<Badge variant="destructive">
						<XCircle className="h-3 w-3 mr-1" />
						Cancelado
					</Badge>
				)
			default:
				return <Badge variant="outline">{status}</Badge>
		}
	}

	const getCategoryName = (categoryId: string) => {
		return (
			competitionCategoriesQuery.data?.find((c) => c.id === categoryId)?.name ||
			"Sin categoría"
		)
	}

	const teams = competitionTeamsQuery.data || []

	const teamStats = useMemo(() => {
		return {
			total: teams.length,
			enrolled: teams.filter((t) => t.status === "enrolled").length,
			pending: teams.filter((t) => t.status === "pending").length,
			withdrawn: teams.filter((t) => t.status === "withdrawn").length,
		}
	}, [teams])

	// Definición de columnas para TanStack Table
	const columns: ColumnDef<CompetitionTeamWithMemberAndAvailability>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					Equipo
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<span className="font-medium">{row.getValue("name") as string}</span>
			),
		},
		{
			accessorKey: "categoryId",
			header: "Categoría",
			cell: ({ row }) => getCategoryName(row.original.categoryId),
		},
		{
			id: "players",
			header: "Jugadores",
			cell: ({ row }) => `${row.original.members.length} / 2`,
			enableSorting: false,
		},
		{
			id: "availability",
			header: "Disponibilidad",
			cell: ({ row }) =>
				row.original.availabilities.length > 0 ? (
					<CheckCircle className="h-5 w-5 text-green-500" />
				) : (
					<XCircle className="h-5 w-5 text-red-500" />
				),
			enableSorting: false,
		},
		{
			accessorKey: "status",
			header: "Estado",
			cell: ({ row }) => getStatusBadge(row.original.status),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const team = row.original
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleViewTeamDetail(team)}>
								<Users className="h-4 w-4 mr-2" />
								Ver detalles
							</DropdownMenuItem>
							{team.status === "pending" && (
								<DropdownMenuItem
									onClick={() =>
										updateCompetitionTeam.mutate({
											id: team.id,
											teamData: { status: "withdrawn" },
										})
									}
								>
									<XCircle className="h-4 w-4 mr-2" />
									Retirar equipo
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => deleteCompetitionTeam.mutate(team.id)}
								className="text-red-600"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Eliminar
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	]

	const table = useReactTable({
		data: teams,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	})

	const isLoading =
		competitionTeamsQuery.isLoading || competitionCategoriesQuery.isLoading

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		)
	}

	const hasAnyTeams = teams.length > 0
	const hasFiltersApplied =
		searchQuery !== "" || selectedCategory !== "all" || statusFilter !== "all"
	const hasResults = table.getRowModel().rows.length > 0

	return (
		<div className="space-y-6">
			<TeamStats stats={teamStats} />

			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<CardTitle>Gestión de Equipos</CardTitle>
							<CardDescription>
								Administra los equipos inscritos en la competición
							</CardDescription>
						</div>
						<CreateTeamDialog
							competitionId={competitionId}
							categories={competitionCategoriesQuery.data || []}
						/>
					</div>
				</CardHeader>

				<CardContent>
					{/* Filtros superiores */}
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar por nombre de equipo..."
								value={searchQuery}
								onChange={(e) => {
									const value = e.target.value
									setSearchQuery(value)
									table.getColumn("name")?.setFilterValue(value)
								}}
								className="pl-10"
							/>
						</div>

						<Select
							value={selectedCategory}
							onValueChange={(value) => {
								setSelectedCategory(value)
								table
									.getColumn("categoryId")
									?.setFilterValue(value === "all" ? undefined : value)
							}}
						>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue placeholder="Categoría" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todas las categorías</SelectItem>
								{competitionCategoriesQuery.data?.map((cat) => (
									<SelectItem key={cat.id} value={cat.id}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={statusFilter}
							onValueChange={(value) => {
								setStatusFilter(value)
								table
									.getColumn("status")
									?.setFilterValue(value === "all" ? undefined : value)
							}}
						>
							<SelectTrigger className="w-full md:w-40">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Estado" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos</SelectItem>
								<SelectItem value="enrolled">Inscritos</SelectItem>
								<SelectItem value="pending">Pendientes</SelectItem>
								<SelectItem value="withdrawn">Retirados</SelectItem>
							</SelectContent>
						</Select>

						{/* Visibilidad de columnas */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full md:w-auto md:ml-auto"
								>
									Columnas
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id === "name"
												? "Equipo"
												: column.id === "categoryId"
													? "Categoría"
													: column.id === "players"
														? "Jugadores"
														: column.id === "availability"
															? "Disponibilidad"
															: column.id === "status"
																? "Estado"
																: column.id}
										</DropdownMenuCheckboxItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Tabla / estados vacíos */}
					{!hasResults ? (
						<div className="text-center py-12">
							<Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium">No hay equipos</h3>
							<p className="text-muted-foreground">
								{hasAnyTeams && hasFiltersApplied
									? "No se encontraron equipos con los filtros aplicados"
									: "Crea el primer equipo para comenzar"}
							</p>
						</div>
					) : (
						<>
							<div className="overflow-hidden rounded-md border">
								<Table>
									<TableHeader>
										{table.getHeaderGroups().map((headerGroup) => (
											<TableRow key={headerGroup.id}>
												{headerGroup.headers.map((header) => (
													<TableHead key={header.id}>
														{header.isPlaceholder
															? null
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
													</TableHead>
												))}
											</TableRow>
										))}
									</TableHeader>
									<TableBody>
										{table.getRowModel().rows.map((row) => (
											<TableRow key={row.id}>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							{/* Paginación */}
							<div className="flex items-center justify-between py-4">
								<p className="text-sm text-muted-foreground">
									{table.getFilteredRowModel().rows.length} equipo(s)
									encontrados
								</p>
								<div className="space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
									>
										Anterior
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
									>
										Siguiente
									</Button>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			<TeamDetailDialog
				isOpen={isDetailDialogOpen}
				onOpenChange={setIsDetailDialogOpen}
				team={selectedTeam}
				getCategoryName={getCategoryName}
				getStatusBadge={getStatusBadge}
			/>
		</div>
	)
}

export default TeamsAdminTab
