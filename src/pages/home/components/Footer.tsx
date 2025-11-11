import { Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router"
import { Separator } from "@/components/ui/separator"
import { useClubsById } from "@/hooks/useClubsQuery"
import type { BusinessData } from "@/models/business.model"
import { BusinessHours } from "./BusinessHours"

function FooterSection({
	title,
	children,
}: React.PropsWithChildren<{ title: string }>) {
	return (
		<div>
			<h3 className="font-semibold mb-4">{title}</h3>
			{children}
		</div>
	)
}

function ContactInfo({
	data,
	isLoading,
	isError,
}: {
	data?: BusinessData
	isLoading: boolean
	isError: boolean
}) {
	if (isLoading)
		return <p className="text-sm text-muted-foreground">Cargando...</p>
	if (isError || !data)
		return <p className="text-sm text-muted-foreground">No disponible</p>

	return (
		<div className="space-y-2 text-sm text-muted-foreground">
			{data.address && (
				<a
					href="https://www.google.com/maps"
					target="_blank"
					rel="noreferrer"
					className="flex items-center gap-2 hover:text-accent-foreground"
				>
					<MapPin className="h-4 w-4" /> {data.address}
				</a>
			)}
			{data.phone && (
				<a
					href="tel:+1234567890"
					className="flex items-center gap-2 hover:text-accent-foreground"
				>
					<Phone className="h-4 w-4" /> {data.phone}
				</a>
			)}
			{data.email && (
				<a
					href="mailto:contacto@reservo.com"
					className="flex items-center gap-2 hover:text-accent-foreground"
				>
					<Mail className="h-4 w-4" /> {data.email}
				</a>
			)}
		</div>
	)
}

function LegalLinks() {
	return (
		<div className="flex flex-col space-y-2 text-sm">
			<Link
				to="/legal/privacidad"
				className="text-muted-foreground hover:text-foreground transition-colors"
			>
				Política de privacidad
			</Link>
			<Link
				to="/legal/terminos"
				className="text-muted-foreground hover:text-foreground transition-colors"
			>
				Términos y condiciones
			</Link>
		</div>
	)
}

export function Footer() {
	const { clubsByIdQuery } = useClubsById(
		"a32a865d-3ecc-448b-a38d-9da8a10cca59",
	)

	const businessData = clubsByIdQuery.data
	const isLoading = clubsByIdQuery.isLoading
	const isError = clubsByIdQuery.isError

	return (
		<footer className="border-t bg-muted/50 mb-4">
			<div className="container mx-auto px-4 py-12  max-w-7xl">
				<div className="grid lg:grid-cols-3 gap-8">
					<FooterSection title="Contacto">
						<ContactInfo
							data={businessData}
							isLoading={isLoading}
							isError={isError}
						/>
					</FooterSection>

					<FooterSection title="Legal">
						<LegalLinks />
					</FooterSection>

					<FooterSection title="Horarios">
						<BusinessHours businessId={businessData?.id} />
					</FooterSection>
				</div>

				<Separator className="my-4" />

				<div className="mx-auto">
					<div className="flex items-center space-x-2 mb-4">
						<div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
							<span className="text-primary-foreground font-bold text-xs">
								R
							</span>
						</div>
						<span className="font-semibold">Reservo</span>
					</div>
					<p className="text-sm text-muted-foreground">
						Sistema de reservas para pistas de pádel
					</p>
				</div>
			</div>
		</footer>
	)
}
