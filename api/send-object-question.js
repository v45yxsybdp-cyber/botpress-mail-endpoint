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
  } = req.body

  const subject = 'Neue Objektfrage'

  const text = `
Neue Frage zu einer Immobilie

Objekt:
${object_reference}

Frage:
${object_question}

Kontakt:
Name: ${contact_name}
Telefon: ${contact_phone}
E-Mail: ${contact_email}
`

  // await sendMail({ subject, text })

  return res.status(200).json({ success: true })
}
