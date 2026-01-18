"use client"

import { Edit, FileText, Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

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
import type { Competition } from "@/models/competition.model"

interface RulesTabProps {
	competition: Competition
}

const RulesTab = ({ competition }: RulesTabProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [rulesContent, setRulesContent] = useState("")
	const [originalContent, setOriginalContent] = useState("")

	const { data: existingRules, isLoading: isLoadingRule } =
		useCompetitionRulesByCompetitionId(competition.id).competitionRulesQuery
	const existingRule = existingRules?.[0]

	const { data: ruleTemplate, isLoading: isLoadingTemplate } =
		useCompetitionRuleTemplateByType(
			competition.type,
		).competitionRuleTemplateByTypeQuery

	const { createCompetitionRule, updateCompetitionRule } =
		useCompetitionRulesMutation()

	const isLoading = isLoadingRule || isLoadingTemplate

	useEffect(() => {
		let content = ""
		if (existingRule) {
			content = existingRule.content
		} else if (ruleTemplate) {
			content = ruleTemplate.content
		}
		setRulesContent(content)
		setOriginalContent(content)
	}, [existingRule, ruleTemplate])

	const handleCancel = () => {
		setRulesContent(originalContent)
		setIsEditing(false)
	}

	const handleSave = () => {
		if (existingRule) {
			updateCompetitionRule.mutate(
				{ id: existingRule.id, ruleData: { content: rulesContent } },
				{ onSuccess: () => setIsEditing(false) },
			)
		} else {
			createCompetitionRule.mutate(
				{
					competition_id: competition.id,
					content: rulesContent,
					template_id: ruleTemplate?.id,
				},
				{ onSuccess: () => setIsEditing(false) },
			)
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Normas de la Competición
							</CardTitle>
							<CardDescription>Reglamento y normas aplicables</CardDescription>
						</div>
						{!isEditing ? (
							<Button onClick={() => setIsEditing(true)}>
								<Edit className="mr-2 h-4 w-4" />
								Editar
							</Button>
						) : (
							<div className="flex gap-2">
								<Button variant="outline" onClick={handleCancel}>
									Cancelar
								</Button>
								<Button
									onClick={handleSave}
									disabled={
										updateCompetitionRule.isPending ||
										createCompetitionRule.isPending
									}
								>
									<Save className="mr-2 h-4 w-4" />
									Guardar
								</Button>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center items-center min-h-[400px]">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : isEditing ? (
						<Textarea
							value={rulesContent}
							onChange={(e) => setRulesContent(e.target.value)}
							className="min-h-[400px] font-mono text-sm"
							placeholder="Escribe las normas de la competición en formato Markdown..."
						/>
					) : (
						<div className="prose prose-sm max-w-none dark:prose-invert p-4 border rounded-md min-h-[400px]">
							{rulesContent ? (
								<ReactMarkdown>{rulesContent}</ReactMarkdown>
							) : (
								<p className="text-muted-foreground">
									No hay normas definidas.
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export default RulesTab
