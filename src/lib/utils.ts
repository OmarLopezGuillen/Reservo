import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function requiredEnv(key: string, value: string | undefined): string {
	if (!value) throw new Error(`Missing required env var: ${key}`)
	return value
}
