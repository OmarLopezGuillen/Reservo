import { AnimatePresence, motion } from "framer-motion"
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
import { useCompetitionById } from "@/hooks/competitions/useCompetitionsQuery"
import type { CompetitionCategory } from "@/models/competition.model"
import type {
	CompetitionCategoriesInsert,
	CompetitionCategoriesUpdate,
} from "@/models/dbTypes"
import DialogCrearCategoria from "../../../../../crear-competicion/components/DialogCrearCategoria"
import { CategoryDetailView } from "./components/CategoryDetailView"

interface CategoriesTabProps {
	competitionId: string
}

const CategoriesTab = ({ competitionId }: CategoriesTabProps) => {
	// 1) Cargar competición (para defaultMaxTeams + pasar a detail view)
	const { data: competition, isLoading: isLoadingCompetition } =
		useCompetitionById(competitionId).competitionByIdQuery

	// 2) Cargar categorías por competición
	const { data: categories = [], isLoading: isLoadingCategories } =
		useCompetitionCategoriesByCompetitionId(
			competitionId,
		).competitionCategoriesQuery

	const isLoading = isLoadingCompetition || isLoadingCategories

	const {
		createCompetitionCategory,
		updateCompetitionCategory,
		deleteCompetitionCategory,
	} = useCompetitionCategoriesMutation()

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingCategory, setEditingCategory] =
		useState<CompetitionCategory | null>(null)
	const [selectedCategory, setSelectedCategory] =
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

	const handleViewCategory = (category: CompetitionCategory) => {
		setSelectedCategory(category)
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
				competition_id: competitionId,
			} as CompetitionCategoriesInsert)
		}
	}

	// si por lo que sea no hay competición (id malo), puedes mostrar algo
	if (!isLoading && !competition) {
		return (
			<Card>
				<CardContent className="pt-6 text-muted-foreground">
					No se encontró la competición.
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			<AnimatePresence mode="wait">
				{selectedCategory && competition ? (
					<motion.div
						key="detail"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
					>
						<CategoryDetailView
							competition={competition}
							category={selectedCategory}
							onBack={() => setSelectedCategory(null)}
						/>
					</motion.div>
				) : (
					<motion.div
						key="list"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.2 }}
					>
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Categorías de Competición</CardTitle>
										<CardDescription>
											Gestiona las divisiones y niveles de tu competición
										</CardDescription>
									</div>
									<Button onClick={handleOpenDialog} disabled={!competition}>
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
									onView={handleViewCategory}
									defaultMaxTeams={competition?.maxTeamsPerCategory || 8}
								/>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>

			{isDialogOpen && (
				<DialogCrearCategoria
					open={isDialogOpen}
					onOpenChange={setIsDialogOpen}
					onSave={handleSaveCategory}
					defaultValues={editingCategory ?? undefined}
					defaultMaxTeams={competition?.maxTeamsPerCategory || 8}
				/>
			)}
		</div>
	)
}

export default CategoriesTab
