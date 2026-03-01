import { changePassword } from "@/services/auth/changePassword.service"
import { logIn } from "@/services/auth/logIn.service"
import { resetPassword } from "@/services/auth/resetPassword.service"
import { signOut } from "@/services/auth/signOut.service"
import { signUp } from "@/services/auth/signUp.service"

export const useAuthActions = () => {
	return { logIn, signUp, signOut, resetPassword, changePassword }
}
