export function sanitizeRedirect(redirect: string | null): string | null {
	if (!redirect) return null

	// Solo rutas internas absolutas del SPA: "/algo..."
	if (!redirect.startsWith("/")) return null

	// Evita "//evil.com" (protocolo-relative)
	if (redirect.startsWith("//")) return null

	// Evita cosas raras tipo "/\evil" (opcional)
	if (redirect.includes("\\")) return null

	return redirect
}
