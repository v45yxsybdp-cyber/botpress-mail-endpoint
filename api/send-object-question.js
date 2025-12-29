import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  // Nur POST erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Safety: Body prüfen
  if (!req.body) {
    return res.status(400).json({ error: 'Missing request body' })
  }

  const {
    object_reference,
    object_question,
    contact_name,
    contact_phone,
    contact_email
  } = req.body

  try {
    await resend.emails.send({
      from: 'Botpress <no-reply@dialogaro.de>', // Domain MUSS bei Resend verifiziert sein
      to: ['benulmer@dialogaro.de'],
      reply_to: contact_email || undefined,
      subject: 'Neue Objektanfrage',
      text: `
Neue Anfrage zu einer Immobilie

--------------------------------
OBJEKT
--------------------------------
${object_reference || '-'}

--------------------------------
FRAGE
--------------------------------
${object_question || '-'}

--------------------------------
KONTAKT
--------------------------------
Name: ${contact_name || '-'}
Telefon: ${contact_phone || '-'}
E-Mail: ${contact_email || '-'}
`
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('SEND OBJECT QUESTION ERROR:', error)
    return res.status(500).json({ error: 'Mail could not be sent' })
  }
}
