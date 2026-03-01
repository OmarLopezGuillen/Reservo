import { supabase } from "@/lib/supabase"

/* 	
Siempre se envia con el correo de noreply@reservopadel.es

const handleSendEmail = () =>
		sendEmail({
			to: "raridane@gmail.com",
			subject: "Reserva confirmada",
			html: "<h1>Tu reserva está confirmada</h1>",
			// from es opcional si definiste RESEND_FROM_EMAIL como secret
		}) 
      

    <Button onClick={() => handleSendEmail()}>Enviar email</Button>
  */

export interface SendEmailInput {
	to: string | string[]
	subject: string
	html?: string
	text?: string
	from?: string
}

interface SendEmailResponse {
	id: string | null
}

export async function sendEmail(
	input: SendEmailInput,
): Promise<SendEmailResponse> {
	const { data, error } = await supabase.functions.invoke("send-email", {
		body: input,
	})

	if (error) {
		let status: number | undefined
		let details = error.message

		const maybeContext = (error as { context?: Response }).context
		if (maybeContext) {
			status = maybeContext.status
			try {
				const payload = await maybeContext.clone().json()
				const message =
					typeof payload?.error === "string"
						? payload.error
						: JSON.stringify(payload)
				details = `${status}: ${message}`
			} catch {
				try {
					const text = await maybeContext.clone().text()
					if (text) details = `${status}: ${text}`
				} catch {
					// Keep default error message when response body cannot be parsed.
				}
			}
		}

		console.error("Error sending email through edge function:", details)
		throw new Error(`No se pudo enviar el correo. Detalle: ${details}`)
	}

	return data as SendEmailResponse
}
