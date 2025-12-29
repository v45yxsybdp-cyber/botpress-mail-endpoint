import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    object_reference,
    object_question,
    contact_name,
    contact_phone,
    contact_email
  } = req.body || {}

  try {
    await resend.emails.send({
      from: 'Dialogaro Bot <no-reply@dialogaro.de>',
      to: ['benulmer@dialogaro.de'],
      reply_to: contact_email || undefined,
      subject: 'Neue Objektanfrage – Frage zu Immobilie',
      text: `
NEUE OBJEKTANFRAGE
────────────────────────

OBJEKT
${object_reference || '-'}

FRAGE
${object_question || '-'}

KONTAKTDATEN
Name: ${contact_name || '-'}
Telefon: ${contact_phone || '-'}
E-Mail: ${contact_email || '-'}

────────────────────────
Diese Anfrage wurde automatisch über den Chatbot übermittelt.
`
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('RESEND ERROR:', error)
    return res.status(500).json({ error: 'Mail could not be sent' })
  }
}
