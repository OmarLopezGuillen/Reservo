import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { type Resolver, useForm } from "react-hook-form"
import { z } from "zod"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { useCourtsMutation } from "@/hooks/useCourtsMutations"
import { useCourts } from "@/hooks/useCourtsQuery"
import type { Court } from "@/models/court.model"
import { CourtFormDialog } from "./components/CourtFormDialog"
import { CourtsHeader } from "./components/CourtsHeader"
import { CourtsList } from "./components/CourtsList"
import { DeleteCourtDialog } from "./components/DeleteCourtDialog"

export const courtSchema = z.object({
	name: z.string().min(1, "El nombre es obligatorio"),
	type: z.enum(["indoor", "outdoor"]),
	price: z.preprocess(
		(val) => (val === "" ? undefined : Number(val)),
		z.number().min(0, "El precio debe ser positivo"),
	),
	color: z.string().regex(/^#[0-9a-f]{6}$/i, "Color no válido"),
	description: z.string().optional(),
	isActive: z.boolean(),
})

type CourtFormData = z.output<typeof courtSchema>
type CourtFormInput = z.input<typeof courtSchema>

export function CourtsTab() {
	const user = useAuthUser()
	const { courtsQuery } = useCourts(user.clubId!)
	const { data: courts, isLoading, isError } = courtsQuery

	const { createCourt, updateCourt, deleteCourt } = useCourtsMutation()

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isAlertOpen, setIsAlertOpen] = useState(false)
	const [editingCourt, setEditingCourt] = useState<Court | null>(null)
	const [courtToDeleteId, setCourtToDeleteId] = useState<string | null>(null)

	const form = useForm<CourtFormData, CourtFormInput>({
		resolver: zodResolver(courtSchema) as Resolver<
			CourtFormData,
			CourtFormInput
		>,
		defaultValues: {
			name: "",
			type: "indoor",
			price: 20,
			color: "#000000",
			description: "",
			isActive: true,
		},
	})

	const { reset } = form

	useEffect(() => {
		if (editingCourt) {
			reset({
				name: editingCourt.name,
				type: editingCourt.type as "indoor" | "outdoor",
				price: editingCourt.price,
				color: editingCourt.color || "#000000",
				description: editingCourt.description || "",
				isActive: editingCourt.isActive,
			})
		} else {
			reset()
		}
	}, [editingCourt, reset])

	const handleCreateCourt = () => {
		setEditingCourt(null)
		setIsDialogOpen(true)
	}

	const handleEditCourt = (court: Court) => {
		setEditingCourt(court)
		setIsDialogOpen(true)
	}

	const handleToggleActive = (court: Court) => {
		updateCourt.mutate({
			id: court.id,
			courtData: { is_active: !court.isActive },
		})
	}

	const openDeleteConfirmation = (id: string) => {
		setCourtToDeleteId(id)
		setIsAlertOpen(true)
	}

	const handleDeleteCourt = () => {
		if (courtToDeleteId) {
			deleteCourt.mutate(courtToDeleteId, {
				onSuccess: () => setIsAlertOpen(false),
			})
		}
	}

	const onSubmit = (data: CourtFormData) => {
		const { isActive, ...restData } = data
		const courtData = { ...restData, is_active: isActive }

		if (editingCourt) {
			updateCourt.mutate(
				{ id: editingCourt.id, courtData },
				{ onSuccess: () => setIsDialogOpen(false) },
			)
		} else {
			createCourt.mutate(
				{ ...courtData, club_id: user.clubId! },
				{ onSuccess: () => setIsDialogOpen(false) },
			)
		}
	}

	return (
		<div className="space-y-6">
			<CourtsHeader onAddCourt={handleCreateCourt} />

			<CourtsList
				courts={courts}
				isLoading={isLoading}
				isError={isError}
				onToggleActive={handleToggleActive}
				onEditCourt={handleEditCourt}
				onDeleteCourt={openDeleteConfirmation}
			/>

			<CourtFormDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				editingCourt={editingCourt}
				form={form}
				onSubmit={onSubmit}
				isSubmitting={createCourt.isPending || updateCourt.isPending}
			/>

			<DeleteCourtDialog
				isOpen={isAlertOpen}
				onOpenChange={setIsAlertOpen}
				onConfirm={handleDeleteCourt}
				isPending={deleteCourt.isPending}
			/>
		</div>
	)
}
