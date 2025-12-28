export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    name,
    phone,
    email,
    preferred_time,
    note
  } = req.body

  const subject = 'Neuer Beratungswunsch'

  const text = `
Neuer Terminwunsch

Name: ${name}
Telefon: ${phone}
E-Mail: ${email}

Bevorzugte Zeit:
${preferred_time}

Notiz:
${note || '-'}
`

  // HIER dein Mailversand (nodemailer / resend / etc.)
  // await sendMail({ subject, text })

  return res.status(200).json({ success: true })
}
