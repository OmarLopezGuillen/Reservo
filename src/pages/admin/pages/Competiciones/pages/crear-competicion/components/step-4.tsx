import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useCompetitionRulesMutation } from "@/hooks/competitions/useCompetitionRulesMutations"
import { useCompetitionRulesByCompetitionId } from "@/hooks/competitions/useCompetitionRulesQuery"
import { useCompetitionRuleTemplateByType } from "@/hooks/competitions/useCompetitionRuleTemplatesQuery"
import type { CompetitionsType } from "@/models/dbTypes"

interface Step4Props {
	competitionId?: string
	competitionType: CompetitionsType
	onNext: () => void
	onBack: () => void
}

const Step4 = ({
	competitionId,
	competitionType,
	onNext,
	onBack,
}: Step4Props) => {
	const [rulesContent, setRulesContent] = useState("")

	// 1. Cargar la regla existente de la competición, si la hay
	const { data: existingRule, isLoading: isLoadingRule } =
		useCompetitionRulesByCompetitionId(competitionId).competitionRulesQuery

	// 2. Cargar la plantilla de reglas por defecto según el tipo de competición
	const { competitionRuleTemplateByTypeQuery } =
		useCompetitionRuleTemplateByType(competitionType)
	const { data: ruleTemplate, isLoading: isLoadingTemplate } =
		competitionRuleTemplateByTypeQuery

	const { createCompetitionRule, updateCompetitionRule } =
		useCompetitionRulesMutation()

	const isLoading =
		isLoadingRule ||
		isLoadingTemplate ||
		createCompetitionRule.isPending ||
		updateCompetitionRule.isPending

	useEffect(() => {
		// Si ya existe una regla para esta competición, la cargamos
		if (existingRule && existingRule.length > 0) {
			setRulesContent(existingRule[0].content)
		}
		// Si no, y la plantilla ya ha cargado, usamos el contenido de la plantilla
		else if (ruleTemplate) {
			setRulesContent(ruleTemplate.content)
		}
	}, [existingRule, ruleTemplate])

	const handleSave = async () => {
		if (!competitionId || !rulesContent) {
			toast.warning("El contenido de las normas no puede estar vacío.")
			return
		}

		const ruleData = {
			competition_id: competitionId,
			content: rulesContent,
			template_id: ruleTemplate?.id, // Guardamos la referencia a la plantilla usada
		}

		try {
			if (existingRule && existingRule.length > 0) {
				// Actualizar la regla existente
				await updateCompetitionRule.mutateAsync({
					id: existingRule[0].id,
					ruleData: { content: rulesContent },
				})
			} else {
				// Crear una nueva regla
				await createCompetitionRule.mutateAsync(ruleData)
			}

			toast.success("Normativa guardada correctamente.")
			onNext()
		} catch (error) {
			// Los hooks de mutación ya muestran un toast de error
		}
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h3 className="text-lg font-medium">Normativa de la Competición</h3>
				<p className="text-sm text-muted-foreground">
					Define las reglas que regirán el torneo. Se ha cargado una plantilla
					predeterminada que puedes editar.
				</p>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Editor de Normas</CardTitle>
					<CardDescription>
						Puedes usar formato Markdown básico para estructurar el texto.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Textarea
						className="min-h-[400px] font-mono text-sm leading-relaxed"
						value={rulesContent}
						onChange={(e) => setRulesContent(e.target.value)}
						placeholder="# Reglas de la competición..."
					/>
				</CardContent>
			</Card>

			<div className="flex justify-between pt-4">
				<Button variant="outline" onClick={onBack} disabled={isLoading}>
					Anterior
				</Button>
				<Button onClick={handleSave} disabled={isLoading}>
					{isLoading ? "Guardando..." : "Finalizar"}
				</Button>
			</div>
		</div>
	)
}

export default Step4
