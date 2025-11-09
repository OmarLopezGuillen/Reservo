import { logIn } from "@/services/auth/logIn.service"
import { signOut } from "@/services/auth/signOut.service"
import { signUp } from "@/services/auth/signUp.service"

export const useAuthActions = () => {
	return { logIn, signUp, signOut }
}
