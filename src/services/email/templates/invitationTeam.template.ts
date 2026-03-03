/* import { invitationTeamTemplate } from "@/services/email/templates/invitationTeam.template"
import { sendEmail } from "@/services/email/sendEmail.service"

const template = invitationTeamTemplate({
  inviterName: "Carlos",
  teamName: "Lobos Padel",
  clubName: "Club Centro",
  invitationUrl: "https://tuapp.com/invite/abc123",
  expiresAtText: "10/03/2026 23:59",
})

await sendEmail({
  to: "nuevojugador@email.com",
  subject: template.subject,
  html: template.html,
  text: template.text,
}) */

interface InvitationTeamTemplateParams {
	inviterName: string
	teamName: string
	competitionName: string
	invitationUrl: string
	clubName?: string
	appName?: string
	expiresAtText?: string
}

interface InvitationTeamTemplateResult {
	subject: string
	html: string
	text: string
}

const escapeHtml = (value: string): string =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;")

export function invitationTeamTemplate({
	inviterName,
	teamName,
	competitionName,
	invitationUrl,
	clubName,
	appName = "Reservo",
	expiresAtText,
}: InvitationTeamTemplateParams): InvitationTeamTemplateResult {
	const safeInviter = escapeHtml(inviterName)
	const safeTeam = escapeHtml(teamName)
	const safeClub = clubName ? escapeHtml(clubName) : null
	const safeAppName = escapeHtml(appName)
	const safeUrl = escapeHtml(invitationUrl)
	const safeExpiresAt = expiresAtText ? escapeHtml(expiresAtText) : null
	const safeCompetition = escapeHtml(competitionName)

	const subject = `Invitación para unirte a ${safeTeam} - ${safeCompetition} | ${safeAppName}`

	const whereText = safeClub
		? `en el club <strong>${safeClub}</strong>`
		: "en Reservo"
	const expiresTextHtml = safeExpiresAt
		? `<p style="margin:0 0 16px 0;color:#374151;font-size:14px;">Esta invitacion vence el <strong>${safeExpiresAt}</strong>.</p>`
		: ""
	const expiresTextPlain = safeExpiresAt
		? `\nEsta invitacion vence el ${expiresAtText}.`
		: ""

	const html = `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeAppName}</title>
  </head>
  <body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;">Te invitaron a un equipo en ${safeAppName}</h1>
                <p style="margin:0 0 12px 0;font-size:15px;color:#374151;">
									<strong>${safeInviter}</strong> te invitó a unirte al equipo 
									<strong>${safeTeam}</strong> para competir en 
									<strong>${safeCompetition}</strong> ${whereText}.
								</p>
                <p style="margin:0 0 16px 0;font-size:15px;color:#374151;">
                  Aun no tienes cuenta. Crea tu cuenta y acepta la invitacion desde el siguiente enlace:
                </p>
                <p style="margin:0 0 20px 0;">
                  <a href="${safeUrl}" style="display:inline-block;padding:12px 16px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
                    Crear cuenta y unirme al equipo
                  </a>
                </p>
                ${expiresTextHtml}
                <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">
                  Si el boton no funciona, copia y pega este enlace en tu navegador:
                </p>
                <p style="margin:0;font-size:13px;word-break:break-all;color:#2563eb;">
                  <a href="${safeUrl}" style="color:#2563eb;text-decoration:underline;">${safeUrl}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim()

	const text = [
		`Te invitaron a un equipo en ${appName}.`,
		`${inviterName} te invitó a unirte al equipo ${teamName} para competir en ${competitionName}${clubName ? ` en el club ${clubName}` : ""}.`,
		"Aun no tienes cuenta. Crea tu cuenta y acepta la invitacion desde este enlace:",
		invitationUrl,
		expiresTextPlain,
	]
		.filter(Boolean)
		.join("\n")

	return {
		subject,
		html,
		text,
	}
}
