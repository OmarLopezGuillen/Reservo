import { Loader2, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { CompetitionCategory } from "@/models/competition.model"

interface CategoriesTableProps {
	categories: CompetitionCategory[]
	isLoading: boolean
	onEdit: (category: CompetitionCategory) => void
	onDelete: (id: string) => void
	onView?: (category: CompetitionCategory) => void
	defaultMaxTeams?: number
}

export const CategoriesTable = ({
	categories,
	isLoading,
	onEdit,
	onDelete,
	onView,
	defaultMaxTeams,
}: CategoriesTableProps) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Nombre</TableHead>
					<TableHead>Descripción</TableHead>
					<TableHead>Equipos Máx.</TableHead>
					<TableHead className="text-right">Acciones</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading ? (
					<TableRow>
						<TableCell
							colSpan={5}
							className="text-center h-24 text-muted-foreground"
						>
							<div className="flex justify-center items-center">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Cargando categorías...
							</div>
						</TableCell>
					</TableRow>
				) : categories.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={5}
							className="text-center h-24 text-muted-foreground"
						>
							No hay categorías definidas.
						</TableCell>
					</TableRow>
				) : (
					categories.map((category) => (
						<TableRow
							key={category.id}
							onClick={() => onView?.(category)}
							className={cn(onView && "cursor-pointer")}
						>
							<TableCell className="font-medium">{category.name}</TableCell>
							<TableCell>{category.description || "—"}</TableCell>
							<TableCell>{category.maxTeams || defaultMaxTeams}</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-2">
									<Button
										aria-label="Editar categoría"
										variant="ghost"
										size="icon"
										onClick={
											onView
												? (e) => {
														e.stopPropagation()
														onEdit(category)
													}
												: () => onEdit(category)
										}
									>
										<Pencil className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive hover:text-destructive"
										aria-label="Eliminar categoría"
										onClick={
											onView
												? (e) => {
														e.stopPropagation()
														onDelete(category.id)
													}
												: () => onDelete(category.id)
										}
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	)
}
