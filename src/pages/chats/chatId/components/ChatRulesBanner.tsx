import { Info, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ChatRulesBanner({
	threadId,
	className,
	dismissible = true,
}: {
	threadId: string
	className?: string
	dismissible?: boolean
}) {
	const storageKey = `chat_rules_dismissed:${threadId}`
	const [hidden, setHidden] = useState(false)

	useEffect(() => {
		if (!dismissible) return
		const v = localStorage.getItem(storageKey)
		if (v === "1") setHidden(true)
	}, [storageKey, dismissible])

	if (hidden) return null

	return (
		<div className={cn("flex justify-center", className)}>
			<div className="relative max-w-[92%] md:max-w-[70%] rounded-2xl border bg-muted/60 px-5 py-4 text-left shadow-sm">
				{/* Header */}
				<div className="flex items-start gap-2 mb-3">
					<Info className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
					<div className="text-sm text-muted-foreground space-y-2">
						<p className="font-medium text-foreground">
							👋 Bienvenidos al chat de reprogramación del partido
						</p>

						<p>
							📌 Este espacio sirve para acordar una nueva fecha si el horario
							actual no os encaja.
						</p>
					</div>
				</div>

				{/* Sección pasos */}
				<div className="mb-3">
					<p className="font-medium text-sm mb-2">🗳 ¿Cómo cambiar la fecha?</p>

					<ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
						<li>
							Pulsa en{" "}
							<span className="font-medium text-foreground">
								"Nueva propuesta"
							</span>{" "}
							(arriba).
						</li>
						<li>Selecciona una o varias franjas disponibles.</li>
						<li>Confirma la propuesta.</li>
						<li>
							Todos los jugadores deben votar una opción (pueden votar varias).
						</li>
					</ol>
				</div>

				{/* Resultado */}
				<div className="space-y-2 text-sm text-muted-foreground">
					<p>
						✅ Cuando todos voten la misma franja, el sistema reservará
						automáticamente la pista y el partido quedará reprogramado.
					</p>

					<p>
						⚠️ Si una franja deja de estar disponible, aparecerá como conflicto y
						deberéis elegir otra.
					</p>

					<p>
						ℹ️ Si ninguna opción encaja, cread una nueva propuesta y la anterior
						quedará en el historial.
					</p>

					<p>
						💬 Podéis usar este chat para poneros de acuerdo antes de crear la
						propuesta.
					</p>
				</div>

				{/* 🆘 @admin */}
				<div className="mt-4 rounded-xl border bg-background/60 px-4 py-3">
					<p className="font-medium text-sm text-foreground mb-1">
						🆘 ¿Necesitáis ayuda del admin?
					</p>
					<p className="text-sm text-muted-foreground">
						Si escribís{" "}
						<span className="font-medium text-foreground">@admin</span> en un
						mensaje, se notificará al administrador del club.
					</p>

					<ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-muted-foreground">
						<li>
							Usadlo <span className="font-medium text-foreground">solo</span>{" "}
							si no llegáis a un acuerdo entre jugadores o hay un problema real.
						</li>
						<li>
							Al poner @admin, explicad{" "}
							<span className="font-medium text-foreground">
								qué está pasando y qué necesitáis
							</span>{" "}
							para que pueda ayudar rápido.
						</li>
					</ul>
				</div>

				{/* Cerrar */}
				{dismissible && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="absolute right-2 top-2 h-7 w-7"
						onClick={() => {
							localStorage.setItem(storageKey, "1")
							setHidden(true)
						}}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	)
}
