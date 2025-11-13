import { type ClassValue, clsx } from "clsx"
import { getDaysInMonth as getDaysInMonthFns, startOfMonth } from "date-fns"
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
export function formatDate(date: string): string {
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

export function getDaysInMonth(date: Date) {
	const firstDay = startOfMonth(date)
	const daysInMonth = getDaysInMonthFns(date)
	const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // 0 = Lunes

	return { daysInMonth, startingDayOfWeek }
}
