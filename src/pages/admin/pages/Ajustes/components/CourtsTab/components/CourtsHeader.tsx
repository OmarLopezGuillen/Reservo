import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CourtsHeaderProps {
	onAddCourt: () => void
}

export function CourtsHeader({ onAddCourt }: CourtsHeaderProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 className="text-3xl font-bold">Recursos</h1>
				<p className="text-muted-foreground">
					Gestiona las pistas y recursos disponibles
				</p>
			</div>
			<Button onClick={onAddCourt} className="cursor-pointer">
				<Plus className="h-4 w-4 mr-2" />
				Añadir pista
			</Button>
		</div>
	)
}
