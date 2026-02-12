import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { AvailabilityManager } from "@/components/AvailabilityManager"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import { useCompetitionTeamsMutation } from "@/hooks/competitions/useCompetitionTeamsMutations"
import { useTeamAvailabilitiesMutation } from "@/hooks/competitions/useTeamAvailabilitiesMutations"
import type {
	CompetitionCategory,
	TeamAvailability,
} from "@/models/competition.model"

interface CreateTeamDialogProps {
	competitionId: string
	categories: CompetitionCategory[]
}

export const CreateTeamDialog = ({
	competitionId,
	categories,
}: CreateTeamDialogProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [newTeamName, setNewTeamName] = useState("")
	const [newTeamCategory, setNewTeamCategory] = useState("")
	const [player1Email, setPlayer1Email] = useState("")
	const [player2Email, setPlayer2Email] = useState("")
	const [substituteEmail, setSubstituteEmail] = useState("")
	const [availabilities, setAvailabilities] = useState<TeamAvailability[]>([])

	const { createTeamByAdmin } = useCompetitionTeamsMutation()
	const { createTeamAvailability } = useTeamAvailabilitiesMutation()

	const resetCreateForm = () => {
		setNewTeamName("")
		setNewTeamCategory("")
		setPlayer1Email("")
		setPlayer2Email("")
		setSubstituteEmail("")
		setAvailabilities([])
	}

	const handleCreateTeam = async () => {
		if (
			!newTeamName.trim() ||
			!newTeamCategory ||
			!player1Email.trim() ||
			!player2Email.trim()
		) {
			toast.error("Por favor completa todos los campos obligatorios")
			return
		}

		const p1 = player1Email.toLowerCase()
		const p2 = player2Email.toLowerCase()
		const sub = substituteEmail.trim().toLowerCase()

		if (p1 === p2) {
			toast.error("Los emails de los jugadores no pueden ser iguales.")
			return
		}

		if (sub && (sub === p1 || sub === p2)) {
			toast.error("El email del sustituto no puede coincidir con otro jugador.")
			return
		}

		createTeamByAdmin.mutate(
			{
				competitionId,
				categoryId: newTeamCategory,
				teamName: newTeamName,
				emailPlayer1: player1Email,
				emailPlayer2: player2Email,
				emailSubstitute: sub || null,
			},
			{
				onSuccess: (data) => {
					setIsOpen(false)
					resetCreateForm()

					if (availabilities.length > 0 && data.team_id) {
						for (const avail of availabilities) {
							createTeamAvailability.mutate({
								team_id: data.team_id,
								weekday: avail.weekday,
								start_time: avail.startTime,
								end_time: avail.endTime,
							})
						}
					} else {
						toast.success("Equipo creado correctamente.")
					}
				},
			},
		)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Crear Equipo
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Crear Nuevo Equipo</DialogTitle>
					<DialogDescription>
						Inscribe un equipo manualmente. Si los jugadores no están
						registrados, recibirán una invitación por correo.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Team name */}
					<div className="space-y-2">
						<Label>Nombre del Equipo</Label>
						<Input
							placeholder="Ej: Los Campeones"
							value={newTeamName}
							onChange={(e) => setNewTeamName(e.target.value)}
						/>
					</div>

					{/* Category */}
					<div className="space-y-2">
						<Label>Categoría</Label>
						<Select value={newTeamCategory} onValueChange={setNewTeamCategory}>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona categoría" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((cat) => (
									<SelectItem key={cat.id} value={cat.id}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Player 1 */}
					<div className="space-y-2">
						<Label>Email Jugador 1 *</Label>
						<Input
							type="email"
							placeholder="jugador1@email.com"
							value={player1Email}
							onChange={(e) => setPlayer1Email(e.target.value)}
						/>
					</div>

					{/* Player 2 */}
					<div className="space-y-2">
						<Label>Email Jugador 2 *</Label>
						<Input
							type="email"
							placeholder="jugador2@email.com"
							value={player2Email}
							onChange={(e) => setPlayer2Email(e.target.value)}
						/>
					</div>

					{/* Substitute */}
					<div className="space-y-2">
						<Label>Email Sustituto (opcional)</Label>
						<Input
							type="email"
							placeholder="sustituto@email.com"
							value={substituteEmail}
							onChange={(e) => setSubstituteEmail(e.target.value)}
						/>
						<p className="text-xs text-muted-foreground">
							No es obligatorio, pero recomendable para tener mayor
							disponibilidad horaria.
						</p>
					</div>

					<AvailabilityManager
						availabilities={availabilities}
						setAvailabilities={setAvailabilities}
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancelar
					</Button>

					<Button
						onClick={handleCreateTeam}
						disabled={createTeamByAdmin.isPending}
					>
						{createTeamByAdmin.isPending ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Creando...
							</>
						) : (
							"Crear Equipo"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
