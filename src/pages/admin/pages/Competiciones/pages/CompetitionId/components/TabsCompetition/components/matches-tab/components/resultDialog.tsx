import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const ResultSchema = z
	.object({
		h1: z.coerce.number().int().min(0).max(20),
		a1: z.coerce.number().int().min(0).max(20),
		h2: z.coerce.number().int().min(0).max(20),
		a2: z.coerce.number().int().min(0).max(20),

		// ✅ Set 3 opcional: NO coerce aquí (evita "" -> 0)
		h3: z.number().int().min(0).max(20).optional(),
		a3: z.number().int().min(0).max(20).optional(),
	})
	.superRefine((v, ctx) => {
		// si uno rellena set 3, el otro también
		const thirdProvided = v.h3 !== undefined || v.a3 !== undefined
		if (thirdProvided && (v.h3 === undefined || v.a3 === undefined)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Completa ambos campos del Set 3.",
				path: ["h3"],
			})
		}
	})

type ResultForm = z.infer<typeof ResultSchema>

function countSetsWon(setsH: number[], setsA: number[]) {
	let wh = 0
	let wa = 0

	for (let i = 0; i < setsH.length; i++) {
		if (setsH[i] === setsA[i]) return null // no se permite empate por set
		if (setsH[i] > setsA[i]) wh++
		else wa++
	}
	return { wh, wa }
}

export function MatchResultDialog(props: {
	homeTeamName: string
	awayTeamName: string
	onReport: (setsHome: number[], setsAway: number[]) => Promise<void>
}) {
	const { homeTeamName, awayTeamName, onReport } = props
	const [open, setOpen] = useState(false)

	const form = useForm<ResultForm>({
		resolver: zodResolver(ResultSchema),
		defaultValues: {
			h1: 6,
			a1: 4,
			h2: 6,
			a2: 4,
			h3: undefined,
			a3: undefined,
		},
	})

	const submit = async (v: ResultForm) => {
		const setsHome = [v.h1, v.h2]
		const setsAway = [v.a1, v.a2]

		const thirdProvided = v.h3 !== undefined || v.a3 !== undefined
		if (thirdProvided) {
			// superRefine ya valida ambos, pero por seguridad:
			if (v.h3 === undefined || v.a3 === undefined) {
				toast.error("Completa ambos campos del Set 3.")
				return
			}
			setsHome.push(v.h3)
			setsAway.push(v.a3)
		}

		const wins = countSetsWon(setsHome, setsAway)
		if (!wins) {
			toast.error("No puede haber sets empatados (ej: 6-6).")
			return
		}

		const { wh, wa } = wins

		const isValid =
			(setsHome.length === 2 &&
				((wh === 2 && wa === 0) || (wa === 2 && wh === 0))) ||
			(setsHome.length === 3 &&
				((wh === 2 && wa === 1) || (wa === 2 && wh === 1)))

		if (!isValid) {
			toast.error("Resultado inválido: debe ser 2-0 o 2-1.")
			return
		}

		await onReport(setsHome, setsAway)
		setOpen(false)
		form.reset()
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" variant="outline">
					Reportar resultado
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Reportar resultado</DialogTitle>
				</DialogHeader>

				<form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
					{/* Set 1 */}
					<div className="grid grid-cols-3 gap-2 items-center">
						<div className="text-sm font-medium truncate">{homeTeamName}</div>
						<div className="text-center text-xs text-muted-foreground">
							Set 1
						</div>
						<div className="text-sm font-medium truncate text-right">
							{awayTeamName}
						</div>

						<Input type="number" {...form.register("h1")} inputMode="numeric" />
						<div className="text-center text-xs text-muted-foreground">-</div>
						<Input type="number" {...form.register("a1")} inputMode="numeric" />
					</div>

					{/* Set 2 */}
					<div className="grid grid-cols-3 gap-2 items-center">
						<Input type="number" {...form.register("h2")} inputMode="numeric" />
						<div className="text-center text-xs text-muted-foreground">
							Set 2
						</div>
						<Input type="number" {...form.register("a2")} inputMode="numeric" />
					</div>

					{/* Set 3 (opcional) */}
					<div className="grid grid-cols-3 gap-2 items-center">
						<Input
							type="number"
							placeholder="(opcional)"
							inputMode="numeric"
							{...form.register("h3", {
								valueAsNumber: true,
								setValueAs: (v) =>
									v === "" || Number.isNaN(v) ? undefined : v,
							})}
						/>
						<div className="text-center text-xs text-muted-foreground">
							Set 3
						</div>
						<Input
							type="number"
							placeholder="(opcional)"
							inputMode="numeric"
							{...form.register("a3", {
								valueAsNumber: true,
								setValueAs: (v) =>
									v === "" || Number.isNaN(v) ? undefined : v,
							})}
						/>
					</div>

					{(form.formState.errors.h3 || form.formState.errors.a3) && (
						<p className="text-sm text-destructive">
							{form.formState.errors.h3?.message ||
								form.formState.errors.a3?.message}
						</p>
					)}

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting
								? "Enviando..."
								: "Enviar para confirmar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
