import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useCompetitionCategoriesMutation } from "@/hooks/competitions/useCompetitionCategoriesMutations"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import type { CompetitionCategory } from "@/models/competition.model"
import type {
	CompetitionCategoriesInsert,
	CompetitionCategoriesUpdate,
} from "@/models/dbTypes"
import DialogCrearCategoria from "./DialogCrearCategoria"

interface Step3Props {
	competitionId?: string
	defaultMaxTeams: number
	onNext: () => void
	onBack: () => void
}

const Step3 = ({
	competitionId,
	defaultMaxTeams,
	onNext,
	onBack,
}: Step3Props) => {
	const { competitionCategoriesQuery } =
		useCompetitionCategoriesByCompetitionId(competitionId)
	const { data: categories = [], isLoading } = competitionCategoriesQuery

	const {
		createCompetitionCategory,
		updateCompetitionCategory,
		deleteCompetitionCategory,
	} = useCompetitionCategoriesMutation()

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingCategory, setEditingCategory] =
		useState<CompetitionCategory | null>(null)

	const handleOpenDialog = () => {
		setEditingCategory(null)
		setIsDialogOpen(true)
	}

	const handleEdit = (category: CompetitionCategory) => {
		setEditingCategory(category)
		setIsDialogOpen(true)
	}

	const handleDelete = (categoryId: string) => {
		if (
			!window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")
		)
			return

		deleteCompetitionCategory.mutate(categoryId)
	}

	const handleSaveCategory = async (
		data: CompetitionCategoriesInsert | CompetitionCategoriesUpdate,
	) => {
		if (!competitionId) return

		if (editingCategory) {
			updateCompetitionCategory.mutate({
				id: editingCategory.id,
				categoryData: data as CompetitionCategoriesUpdate,
			})
		} else {
			createCompetitionCategory.mutate({
				...data,
				competition_id: competitionId,
			} as CompetitionCategoriesInsert)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h3 className="text-lg font-medium">Categorías</h3>
					<p className="text-sm text-muted-foreground">
						Define las divisiones o niveles de tu competición
					</p>
				</div>
				<Button onClick={handleOpenDialog}>
					<Plus className="mr-2 size-4" />
					Añadir Categoría
				</Button>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nombre</TableHead>
							<TableHead>Descripción</TableHead>
							<TableHead>Equipos Máx.</TableHead>
							<TableHead>Nivel</TableHead>
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
									No hay categorías definidas. Añade al menos una para
									continuar.
								</TableCell>
							</TableRow>
						) : (
							categories.map((category) => (
								<TableRow key={category.id}>
									<TableCell className="font-medium">{category.name}</TableCell>
									<TableCell>{category.description || "—"}</TableCell>
									<TableCell>{category.maxTeams || defaultMaxTeams}</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleEdit(category)}
											>
												<Pencil className="size-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive hover:text-destructive"
												onClick={() => handleDelete(category.id)}
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
			</div>

			<div className="flex justify-between pt-4">
				<Button variant="outline" onClick={onBack}>
					Anterior
				</Button>
				<Button
					onClick={onNext}
					disabled={categories.length === 0 || isLoading}
				>
					Continuar
				</Button>
			</div>

			<DialogCrearCategoria
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSave={handleSaveCategory}
				defaultValues={editingCategory ?? undefined}
				defaultMaxTeams={defaultMaxTeams}
			/>
		</div>
	)
}

export default Step3
