import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, phone, email, preferred_time, note } = req.body

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const subject = 'Neue Terminanfrage – Beratungsgespräch'

    const text = `
NEUE TERMINANFRAGE

Ein Interessent bittet um ein Beratungsgespräch.

Kontaktdaten
Name: ${name || '-'}
Telefon: ${phone || '-'}
E-Mail: ${email || '-'}

Bevorzugte Zeit
${preferred_time || '-'}

Zusätzliche Hinweise
${note || 'Keine Angabe'}

—
Automatisch über den Website-Chatbot übermittelt
`

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject,
      text
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Mail could not be sent' })
  }
}

