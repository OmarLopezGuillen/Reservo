import { Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useCompetitionCategoriesMutation } from "@/hooks/competitions/useCompetitionCategoriesMutations"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import type { CompetitionCategory } from "@/models/competition.model"
import type {
	CompetitionCategoriesInsert,
	CompetitionCategoriesUpdate,
} from "@/models/dbTypes"
import { CategoriesTable } from "../../../../../../../components/CategoriesTable"
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
				<CategoriesTable
					categories={categories}
					isLoading={isLoading}
					onEdit={handleEdit}
					onDelete={handleDelete}
					defaultMaxTeams={defaultMaxTeams}
				/>
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
