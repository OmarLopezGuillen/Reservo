"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { CategoriesTable } from "@/components/CategoriesTable"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useCompetitionCategoriesMutation } from "@/hooks/competitions/useCompetitionCategoriesMutations"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import type {
	Competition,
	CompetitionCategory,
} from "@/models/competition.model"
import type {
	CompetitionCategoriesInsert,
	CompetitionCategoriesUpdate,
} from "@/models/dbTypes"
import DialogCrearCategoria from "../../crear-competicion/components/DialogCrearCategoria"

interface CategoriesTabProps {
	competition: Competition
}

const CategoriesTab = ({ competition }: CategoriesTabProps) => {
	const { data: categories = [], isLoading } =
		useCompetitionCategoriesByCompetitionId(
			competition.id,
		).competitionCategoriesQuery

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

	const handleDelete = (id: string) => {
		if (
			window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")
		) {
			deleteCompetitionCategory.mutate(id)
		}
	}

	const handleSaveCategory = (
		data: CompetitionCategoriesInsert | CompetitionCategoriesUpdate,
	) => {
		if (editingCategory) {
			updateCompetitionCategory.mutate({
				id: editingCategory.id,
				categoryData: data,
			})
		} else {
			createCompetitionCategory.mutate({
				...data,
				competition_id: competition.id,
			} as CompetitionCategoriesInsert)
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Categorías de Competición</CardTitle>
							<CardDescription>
								Gestiona las divisiones y niveles de tu competición
							</CardDescription>
						</div>
						<Button onClick={handleOpenDialog}>
							<Plus className="mr-2 h-4 w-4" />
							Nueva Categoría
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<CategoriesTable
						categories={categories}
						isLoading={isLoading}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</CardContent>
			</Card>
			<DialogCrearCategoria
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSave={handleSaveCategory}
				defaultValues={editingCategory ?? undefined}
				defaultMaxTeams={competition.maxTeamsPerCategory || 8}
			/>
		</div>
	)
}

export default CategoriesTab
