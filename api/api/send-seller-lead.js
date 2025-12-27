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
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify(); // 🔥 WICHTIG

    const mailText = `
Lead: ${lead_type}

Name: ${contact_name}
E-Mail: ${contact_email}
Telefon: ${contact_phone}

Zeitrahmen: ${buyer_timeline}
Objekt: ${object_reference}

Nachricht:
${optional_message}
`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Neuer Lead – ${lead_type}`,
      text: mailText,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
