import { useAuth } from "@/auth/hooks/useAuth"

export function AuthInit() {
	useAuth() // ← se ejecuta dentro del árbol del <BrowserRouter>
	return null // no renderiza nada
}
