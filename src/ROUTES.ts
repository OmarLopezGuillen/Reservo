// Rutas públicas
export const ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/register",

	// TODO: Revisar estas rutas
	ADMIN: {
		ROOT: "/admin",
		CALENDAR: "/admin/calendar",
		AJUSTES: "/admin/ajustes",
		ESTADISTICAS: "/admin/estadisticas",
		LIGA: "/admin/liga",
		LISTA_ESPERA: "/admin/lista-espera",
		RECURSOS: "/admin/recursos",
		REPORTES: "/admin/reportes",
	},

	// Legal
	LEGAL: {
		PRIVACIDAD: "/legal/privacidad",
		TERMINOS: "/legal/terminos",
	},

	CLUBS: {
		ROOT: "/clubs",
		ID: (id: string | number) => `/clubs/${id}`,
	},

	// Reservas
	RESERVAS: {
		ROOT: "/reservas",
		ID: (id: string | number) => `/reservas/${id}`,
	},

	CREAR_RESERVA: {
		ROOT: "/crear-reserva",
		EXITO: "/crear-reserva/exito",
	},

	// Errores
	UNAUTHORIZED: "/unauthorized",
	NOT_FOUND: "*",
}
