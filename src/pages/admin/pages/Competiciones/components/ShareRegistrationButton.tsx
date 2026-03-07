"use client"

import { Link as LinkIcon } from "lucide-react"
import type { MouseEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/ROUTES"

type ShareRegistrationButtonProps = {
	competitionId: string
	competitionName: string
	className?: string
	size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

const buildRegistrationUrl = (competitionId: string) => {
	if (typeof window === "undefined") return ""

	const url = new URL(ROUTES.COMPETITIONS.REGISTER, window.location.origin)
	url.searchParams.set("id", competitionId)
	return url.toString()
}

const ShareRegistrationButton = ({
	competitionId,
	competitionName,
	className,
	size = "sm",
	variant = "outline",
}: ShareRegistrationButtonProps) => {
	const handleShare = async (event?: MouseEvent<HTMLButtonElement>) => {
		event?.preventDefault()
		event?.stopPropagation()

		const registrationUrl = buildRegistrationUrl(competitionId)

		if (!registrationUrl) {
			toast.error("No se pudo generar el enlace de inscripción.")
			return
		}

		try {
			if (navigator.share) {
				await navigator.share({
					title: `Inscripción a ${competitionName}`,
					url: registrationUrl,
				})
				return
			}

			await navigator.clipboard.writeText(registrationUrl)
			toast.success("Enlace de inscripción copiado.")
		} catch (error) {
			// Ignora cancelaciones del cuadro nativo y solo reporta fallos reales.
			if (error instanceof DOMException && error.name === "AbortError") return
			toast.error("No se pudo compartir el enlace.")
		}
	}

	return (
		<Button
			type="button"
			variant={variant}
			size={size}
			className={className}
			onClick={handleShare}
		>
			<LinkIcon className="h-4 w-4" />
			Compartir inscripción
		</Button>
	)
}

export default ShareRegistrationButton
