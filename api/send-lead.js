import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Nur POST erlauben
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Daten aus dem Body holen
  const {
    leadScore,       // "HEISS" | "WARM" | "KALT"
    name,
    email,
    phone,
    location,
    propertyType,
    budget,
    timeline,
    message
  } = req.body;

  // Sicherheit: falls nichts kommt
  const safeLeadScore = leadScore || "KALT";

  // Betreff bestimmen (für Posteingang + farbigen Punkt)
  let subject = "Neue Kaufanfrage";

  if (safeLeadScore === "HEISS") {
    subject = `🔴 HEISSER LEAD – Kaufanfrage ${location}`;
  } else if (safeLeadScore === "WARM") {
    subject = `🟠 WARMER LEAD – Kaufanfrage ${location}`;
  } else {
    subject = `🟢 KALTER LEAD – Kaufanfrage ${location}`;
  }

  try {
    // SMTP Transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.de",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // Mail senden
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.RECEIVER_MAIL,
      subject: subject,
      text: `
LEAD-TYP: ${safeLeadScore}

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

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}


