import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BusinessTab from "./components/BusinessTab/BusinessTab"
import { CancellationTab } from "./components/CancellationTab/CancellationTab"
import { CourtsTab } from "./components/CourtsTab/CourtsTab"

const SETTINGS_TABS = [
	{ value: "business", label: "Negocio", Content: BusinessTab },
	{ value: "cancellation", label: "Cancelación", Content: CancellationTab },
	{ value: "pistas", label: "Pistas", Content: CourtsTab },
] as const

const Ajustes = () => {
	return (
		<div className="p-3 space-y-3">
			<div>
				<h1 className="text-3xl font-bold">Ajustes</h1>
				<p className="text-muted-foreground">
					Configura tu negocio y políticas
				</p>
			</div>

			<Tabs defaultValue="business" className="space-y-3">
				<TabsList className="grid w-full grid-cols-3">
					{SETTINGS_TABS.map(({ value, label }) => (
						<TabsTrigger key={value} value={value}>
							{label}
						</TabsTrigger>
					))}
				</TabsList>

				{SETTINGS_TABS.map(({ value, Content }) => (
					<TabsContent key={value} value={value} className="space-y-3">
						<Content />
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}

export default Ajustes
