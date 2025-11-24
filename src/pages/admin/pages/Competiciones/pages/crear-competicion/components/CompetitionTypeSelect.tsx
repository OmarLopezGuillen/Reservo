import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { type CompetitionsType, CompetitionsTypeConst } from "@/models/dbTypes"

interface CompetitionTypeSelectProps {
	value: CompetitionsType
	onValueChange: (value: CompetitionsType) => void
	disabled?: boolean
}

const competitionTypeLabels: Record<CompetitionsType, string> = {
	league: "Liga",
	americano: "Americano",
	tournament: "Torneo",
}

const CompetitionTypeSelect = ({
	value,
	onValueChange,
	disabled,
}: CompetitionTypeSelectProps) => {
	return (
		<Select value={value} onValueChange={onValueChange} disabled={disabled}>
			<SelectTrigger id="type">
				<SelectValue placeholder="Selecciona un tipo" />
			</SelectTrigger>
			<SelectContent>
				{CompetitionsTypeConst.map((type) => (
					<SelectItem key={type} value={type}>
						{competitionTypeLabels[type]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default CompetitionTypeSelect
