import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      lead_type,
      contact_name,
      contact_email,
      contact_phone,
      buyer_timeline,
      object_reference,
      optional_message,
    } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // z.B. smtp.ionos.de
      port: Number(process.env.SMTP_PORT),  // 587
      secure: false,                        // MUSS false bei 587
      auth: {
        user: process.env.SMTP_USER,        // komplette E-Mail
        pass: process.env.SMTP_PASS,        // Mail-Passwort
      },
    });

    const mailText = `
Lead-Typ: ${lead_type}

Name: ${contact_name}
E-Mail: ${contact_email}
Telefon: ${contact_phone}

Zeitrahmen:
${buyer_timeline}

Objekt:
${object_reference}

Nachricht:
${optional_message || "-"}
`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.MAIL_TO,
      subject: `Neuer Lead – ${lead_type}`,
      text: mailText,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("MAIL ERROR:", error);
    return res.status(500).json({ error: "Mail failed" });
  }
}
