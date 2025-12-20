import { Bell, Check, Loader2, X } from "lucide-react"
import { useAuth } from "@/auth/hooks/useAuth"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePendingInvitesForUser } from "@/hooks/competitions/useCompetitionTeamInvitesQuery"

export const TeamInvitations = () => {
	const user = useAuthUser()
	const { pendingInvitesQuery } = usePendingInvitesForUser(user?.email)
	const { data: invites = [], isLoading } = pendingInvitesQuery

	/*const { acceptInvite, declineInvite } = useCompetitionTeamInvitesMutation()

	const handleAccept = (inviteId: string) => {
		if (!user) return
		acceptInvite.mutate({ inviteId, userId: user.id })
	}

	const handleDecline = (inviteId: string) => {
		declineInvite.mutate(inviteId)
	}

	const isProcessing = acceptInvite.isPending || declineInvite.isPending*/
	const isProcessing = false
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="relative">
					<Bell className="h-4 w-4 mr-2" />
					Invitaciones
					{invites.length > 0 && (
						<span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
							{invites.length}
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel>Invitaciones Pendientes</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{isLoading ? (
					<div className="flex items-center justify-center p-4">
						<Loader2 className="h-5 w-5 animate-spin" />
					</div>
				) : invites.length === 0 ? (
					<p className="p-4 text-sm text-center text-muted-foreground">
						No tienes invitaciones pendientes.
					</p>
				) : (
					invites.map((invite) => (
						<DropdownMenuItem
							key={invite.id}
							className="flex flex-col items-start gap-2 p-3"
							onSelect={(e) => e.preventDefault()} // Evita que el menú se cierre al hacer clic
						>
							<div>
								<p className="font-semibold">{invite.team?.name}</p>
								<p className="text-xs text-muted-foreground">
									Competición: {invite.team?.competition?.name}
								</p>
							</div>
							<div className="flex w-full gap-2">
								<Button
									size="sm"
									className="w-full"
									onClick={() => handleAccept(invite.id)}
									disabled={isProcessing}
								>
									<Check className="h-4 w-4 mr-2" />
									Aceptar
								</Button>
								<Button
									size="sm"
									variant="outline"
									className="w-full"
									onClick={() => handleDecline(invite.id)}
									disabled={isProcessing}
								>
									<X className="h-4 w-4 mr-2" />
									Rechazar
								</Button>
							</div>
						</DropdownMenuItem>
					))
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
