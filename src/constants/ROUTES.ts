// Rutas públicas
export const ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	COMPETITIONS: {
		ROOT: "/competitions",
		ID: (id: string | number) => `/competitions/${id}`,
		REGISTER: "/register/competition",
	},
	REGISTER: "/register",
	INVITE: "/invite",

	// TODO: Revisar estas rutas
	ADMIN: {
		ROOT: "/admin",
		CALENDAR: "/admin/calendar",
		AJUSTES: "/admin/ajustes",
		COMPETICIONES: "/admin/competiciones",
		ID: (id: string | number) => `/admin/competiciones/${id}`,
		CREAR_COMPETICION: "/admin/competiciones/crear",
		CHAT: "/admin/chats",
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

	CHATS: {
		ROOT: "/chats",
		ID: (id: string | number) => `/chats/${id}`,
	},
	MIS_LIGAS: "/mis-ligas",

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
