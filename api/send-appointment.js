import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      name,
      phone,
      email,
      preferred_time,
      note
    } = req.body

    // SMTP Transporter (nutzt deine bestehenden ENV Variablen)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true bei 465, sonst false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const subject = 'Neuer Beratungswunsch'

    const text = `
Neuer Terminwunsch

Name: ${name || '-'}
Telefon: ${phone || '-'}
E-Mail: ${email || '-'}

Bevorzugte Zeit:
${preferred_time || '-'}

Zusätzliche Hinweise:
${note || '-'}
`

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject,
      text
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('SEND APPOINTMENT ERROR:', error)
    return res.status(500).json({ error: 'Mail could not be sent' })
  }
}
