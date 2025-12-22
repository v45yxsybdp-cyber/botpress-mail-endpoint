import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    name,
    email,
    phone,
    location,
    propertyType,
    budget,
    timeline,
    message
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.de",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.RECEIVER_MAIL,
    subject: "Neuer Lead von Botpress",
    text: `
Name: ${name}
E-Mail: ${email}
Telefon: ${phone}
Ort: ${location}
Objekt: ${propertyType}
Budget: ${budget}
Zeitrahmen: ${timeline}

Nachricht:
${message}
`
  });

  res.status(200).json({ ok: true });
}


