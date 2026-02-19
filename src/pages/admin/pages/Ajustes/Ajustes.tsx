import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BusinessTab from "./components/BusinessTab/BusinessTab"
import { CancellationTab } from "./components/CancellationTab/CancellationTab"
import { CourtsTab } from "./components/CourtsTab/CourtsTab"

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
					<TabsTrigger value="business">Negocio</TabsTrigger>
					<TabsTrigger value="cancellation">Cancelación</TabsTrigger>
					<TabsTrigger value="pistas">Pistas</TabsTrigger>
				</TabsList>

				<TabsContent value="business" className="space-y-3">
					<BusinessTab />
				</TabsContent>

				<TabsContent value="cancellation" className="space-y-3">
					<CancellationTab />
				</TabsContent>

				<TabsContent value="pistas" className="space-y-3">
					<CourtsTab />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default Ajustes
