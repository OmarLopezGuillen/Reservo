import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function requiredEnv(key: string, value: string | undefined): string {
	if (!value) throw new Error(`Missing required env var: ${key}`)
	return value
}

export function getInitials(name: string): string {
	if (!name || name.trim().length === 0) {
		return ""
	}

	// Dividir el nombre por espacios y filtrar elementos vacíos
	const words = name
		.trim()
		.split(/\s+/)
		.filter((palabra) => palabra.length > 0)

	if (words.length === 0) {
		return ""
	}

	// Si solo hay una palabra, tomar las primeras 2 letras (o 1 si es muy corta)
	if (words.length === 1) {
		return words[0].substring(0, 2).toUpperCase()
	}

	// Para múltiples words, tomar la primera letra de la primera y última palabra
	const firstInitial = words[0][0].toUpperCase()
	const lastInitial = words[words.length - 1][0].toUpperCase()

	return firstInitial + lastInitial
}

/**
 * Formatea una fecha a una cadena corta con el día de la semana, día del mes y mes abreviado.
 *
 * @param {Date} date - El objeto Date a formatear.
 * @returns {string} La fecha formateada.
 *
 * @example
 * // Devuelve "lun, 5 ago"
 * formatDateWeekDayMonthShort(new Date("2024-08-05"))
 */
export function formatDateWeekDayMonthShort(date: string): string {
	return new Intl.DateTimeFormat("es-ES", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date))
}

export function formatPrice(price: number, currency = "EUR"): string {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency,
	}).format(price)
}

/**
 * Extrae la hora en formato "HH:mm" de un objeto Date o una cadena ISO.
 *
 * @param {Date | string | null} date - El objeto Date o la cadena en formato ISO.
 * @returns {string | null} La hora en formato "HH:mm" o null si la entrada es nula.
 *
 * @example
 * // Devuelve "18:00"
 * formatTimeToHourMinute(new Date("2025-11-12T18:00:00+00:00"))
 */
export function formatTimeToHourMinute(
	date: Date | string | null,
): string | null {
	if (!date) return null
	const dateObj = typeof date === "string" ? new Date(date) : date
	return dateObj.toLocaleTimeString("es-ES", {
		hour: "2-digit",
		minute: "2-digit",
	})
}

export function formatPhoneForDisplay(phone: string): string {
	if (phone.startsWith("+34")) {
		// Spanish phone number formatting
		const number = phone.slice(3)
		return `+34 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
	}
	return phone
}

export function toTitleCase(name: string): string {
	return name
		.toLowerCase()
		.split(" ")
		.filter(Boolean) // elimina espacios dobles
		.map((word) => word[0]?.toUpperCase() + word.slice(1))
		.join(" ")
}

export function formatDateShort(date: string | null): string {
	if (!date) return "N/A"
	return new Date(date).toLocaleDateString("es-ES")
}
