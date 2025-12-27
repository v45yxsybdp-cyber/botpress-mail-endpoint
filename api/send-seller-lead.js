import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = req.body

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const mailText = `
NEUE KAUFANFRAGE

Lead-Typ: ${data.lead_type}

Name: ${data.contact?.name}
Telefon: ${data.contact?.phone}
E-Mail: ${data.contact?.email}

Objekttyp: ${data.property?.type}
Ort: ${data.property?.location}
Details: ${data.property?.details}

Zeitrahmen: ${data.timeline}
`

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Neue Kaufanfrage – ${data.lead_type}`,
      text: mailText
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Mail failed' })
  }
}

