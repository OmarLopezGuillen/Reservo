import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { passwordRequirements } from "@/auth/schemas/password.schema"

interface PasswordRequirementsProps {
	password: string
}

export function PasswordRequirements({
	password,
}: PasswordRequirementsProps) {
	return (
		<div className="rounded-md border bg-muted/40 px-3 py-2">
			<p className="mb-2 text-xs font-medium text-muted-foreground">
				La contraseña debe incluir:
			</p>
			<ul className="space-y-1">
				{passwordRequirements.map((requirement) => {
					const isMet = requirement.test(password)

					return (
						<li
							key={requirement.label}
							className={cn(
								"flex items-center gap-2 text-xs transition-colors",
								isMet ? "text-emerald-600" : "text-muted-foreground",
							)}
						>
							{isMet ? (
								<CheckCircle2 className="h-3.5 w-3.5" />
							) : (
								<Circle className="h-3.5 w-3.5" />
							)}
							<span>{requirement.label}</span>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
