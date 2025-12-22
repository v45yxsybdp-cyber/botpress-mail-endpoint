import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    const data = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.de",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const text = `
NEUER LEAD VON BOTPRESS

Name: ${data.contact_name}
E-Mail: ${data.contact_email}
Telefon: ${data.contact_phone}

Objektart: ${data.buyer_property_type}
Budget: ${data.buyer_budget_max}
Zeitrahmen: ${data.buyer_timeline}

Nachricht:
${data.optional_message}
`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.RECEIVER_MAIL,
      subject: "Neuer Lead über Botpress",
      text
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mail failed" });
  }
}


