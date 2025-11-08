// Rutas públicas
export const ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/register",

	// Admin
	ADMIN: {
		ROOT: "/admin",
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

	// Reservas
	RESERVA: (id: string | number) => `/reserva/${id}`,

	CREAR_RESERVA: {
		ROOT: "/crear-reserva",
		DATOS: "/crear-reserva/datos",
		PAGO: "/crear-reserva/pago",
		EXITO: "/crear-reserva/exito",
	},

	// Errores
	UNAUTHORIZED: "/unauthorized",
	NOT_FOUND: "*",
}
