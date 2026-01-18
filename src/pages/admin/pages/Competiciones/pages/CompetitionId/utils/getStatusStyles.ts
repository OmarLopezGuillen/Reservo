export const getStatusColor = (status: string) => {
	switch (status) {
		case "published":
			return "success"
		case "draft":
			return "secondary"
		case "in_progress":
			return "default"
		case "finished":
			return "outline"
		default:
			return "destructive"
	}
}

export const getStatusLabel = (status: string) => {
	switch (status) {
		case "published":
			return "Publicada"
		case "draft":
			return "Borrador"
		case "in_progress":
			return "En Progreso"
		case "finished":
			return "Finalizada"
		case "closed":
			return "Cerrada"
		default:
			return status
	}
}
