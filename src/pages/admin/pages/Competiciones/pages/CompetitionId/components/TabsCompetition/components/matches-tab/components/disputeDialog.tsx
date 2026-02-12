import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export function DisputeDialog({
	onSubmit,
}: {
	onSubmit: (reason: string) => Promise<void>
}) {
	const [open, setOpen] = useState(false)
	const [reason, setReason] = useState("")

	const handle = async () => {
		await onSubmit(reason)
		setOpen(false)
		setReason("")
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" variant="destructive">
					Disputar
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Disputar resultado</DialogTitle>
				</DialogHeader>

				<Textarea
					placeholder="Explica el motivo..."
					value={reason}
					onChange={(e) => setReason(e.target.value)}
				/>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancelar
					</Button>
					<Button onClick={handle} disabled={reason.length < 5}>
						Enviar disputa
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
