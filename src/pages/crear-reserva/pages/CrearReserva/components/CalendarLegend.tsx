const legendItems = [
	{
		label: "Disponible",
		className: "bg-white border border-slate-300",
	},
	{
		label: "No disponible",
		className: "bg-slate-100",
	},
	{
		label: "Tu reserva",
		className: "bg-blue-500",
	},
	{
		label: "Hora pasada",
		className: "bg-gradient-to-br from-slate-50 to-slate-100 opacity-50",
	},
]

export function CalendarLegend() {
	return (
		<div className="flex items-center justify-end gap-6 px-6 py-4 border-t border-border bg-slate-50/50">
			{legendItems.map((item) => (
				<div key={item.label} className="flex items-center gap-2">
					<div className={`w-4 h-4 rounded shadow-sm ${item.className}`} />
					<span className="text-xs font-medium text-slate-600">
						{item.label}
					</span>
				</div>
			))}
		</div>
	)
}
