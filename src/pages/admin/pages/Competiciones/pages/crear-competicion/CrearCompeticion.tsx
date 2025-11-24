import { Check, ChevronLeft } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/auth/stores/auth.store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCompetitionsMutation } from "@/hooks/competitions/useCompetitionsMutations"
import { cn } from "@/lib/utils"
import type { Competition } from "@/models/competition.model"
import type { CompetitionsInsert, CompetitionsUpdate } from "@/models/dbTypes"
import Step1 from "./components/step-1"
import Step2 from "./components/step-2"
import Step3 from "./components/step-3"
import Step4 from "./components/step-4"
import Step5 from "./components/step-5"

interface WizardStep {
	id: number
	title: string
	description: string
}

const steps: WizardStep[] = [
	{
		id: 1,
		title: "Información General",
		description: "Datos básicos de la competición",
	},
	{
		id: 2,
		title: "Configuración",
		description: "Formato y reglas de puntuación",
	},
	{ id: 3, title: "Categorías", description: "Define las divisiones" },
	{ id: 4, title: "Normas", description: "Reglas y condiciones" },
	{ id: 5, title: "Resumen", description: "Revisa y publica" },
]

const CrearCompeticion = () => {
	const [currentStep, setCurrentStep] = useState(1)
	const [competitionData, setCompetitionData] = useState<Partial<Competition>>(
		{},
	)
	const [isSaving, setIsSaving] = useState(false)
	const { user } = useAuthStore()
	const { createCompetition, updateCompetition } = useCompetitionsMutation()

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1)
		}
	}

	const handleNext = () => {
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1)
		}
	}

	const handleStep1Next = async (data: Partial<CompetitionsInsert>) => {
		if (!user?.clubId) {
			toast.error("Error", {
				description: "No se ha podido identificar el club.",
			})
			return
		}

		setIsSaving(true)
		try {
			const newCompetition = await createCompetition.mutateAsync({
				...data,
				club_id: user.clubId,
				status: "draft",
			} as CompetitionsInsert)
			setCompetitionData(newCompetition)
			handleNext()
		} catch (error) {
			// The toast is already handled in the mutation hook
		} finally {
			setIsSaving(false)
		}
	}

	//ACTUALIZA LA COMPETICION
	const handleStep2Next = async (data: Partial<CompetitionsUpdate>) => {
		if (!competitionData.id) {
			toast.error("Error", {
				description: "No se ha podido identificar la competición.",
			})
			return
		}
		setIsSaving(true)
		try {
			const updatedCompetition = await updateCompetition.mutateAsync({
				id: competitionData.id,
				competitionData: data,
			})
			setCompetitionData(updatedCompetition)
			handleNext()
		} catch (error) {
			// The toast is already handled in the mutation hook
		} finally {
			setIsSaving(false)
		}
	}

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<Step1
						defaultValues={competitionData}
						onNext={handleStep1Next}
						isSaving={isSaving}
					/>
				)
			case 2:
				return (
					<Step2
						defaultValues={competitionData}
						onNext={handleStep2Next}
						onBack={handleBack}
						isSaving={isSaving}
					/>
				)
			case 3:
				return (
					<Step3
						competitionId={competitionData.id}
						defaultMaxTeams={competitionData.maxTeamsPerCategory || 8}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)
			case 4:
				return (
					<Step4
						competitionId={competitionData.id}
						competitionType={competitionData.type || "league"}
						onNext={handleNext}
						onBack={handleBack}
					/>
				)
			case 5:
				return <Step5 competitionId={competitionData.id} onBack={handleBack} />
			default:
				return null
		}
	}

	return (
		<div className="container mx-auto py-8 max-w-5xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Crear Competición</h1>
				<p className="text-muted-foreground">
					Sigue los pasos para configurar tu nueva competición
				</p>
			</div>

			{/* Progress Steps */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					{steps.map((step, index) => (
						<div key={step.id} className="flex items-center flex-1">
							<div className="flex flex-col items-center flex-1">
								<div
									className={cn(
										"flex items-center justify-center size-10 rounded-full border-2 transition-colors mb-2",
										currentStep > step.id &&
											"bg-primary border-primary text-primary-foreground",
										currentStep === step.id && "border-primary text-primary",
										currentStep < step.id &&
											"border-muted text-muted-foreground",
									)}
								>
									{currentStep > step.id ? (
										<Check className="size-5" />
									) : (
										<span className="text-sm font-semibold">{step.id}</span>
									)}
								</div>
								<div className="text-center hidden sm:block">
									<p
										className={cn(
											"text-xs font-medium",
											currentStep >= step.id
												? "text-foreground"
												: "text-muted-foreground",
										)}
									>
										{step.title}
									</p>
								</div>
							</div>
							{index < steps.length - 1 && (
								<div
									className={cn(
										"h-[2px] flex-1 mx-2 transition-colors",
										currentStep > step.id ? "bg-primary" : "bg-muted",
									)}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Step Content */}
			<Card className="p-6 mb-6">
				<div className="mb-6">
					<h2 className="text-2xl font-semibold mb-2">
						{steps[currentStep - 1].title}
					</h2>
					<p className="text-muted-foreground">
						{steps[currentStep - 1].description}
					</p>
				</div>

				{renderStepContent()}
			</Card>

			{/* Navigation for Step 1 - Only back button needed externally */}
			{currentStep === 1 && (
				<div className="flex items-center justify-between">
					<Button variant="outline" onClick={() => window.history.back()}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Volver al listado
					</Button>
					<div className="text-sm text-muted-foreground">
						Paso {currentStep} de {steps.length}
					</div>
					<div className="w-32" /> {/* Spacer for alignment */}
				</div>
			)}
		</div>
	)
}
export default CrearCompeticion
