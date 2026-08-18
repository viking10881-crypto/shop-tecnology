// Frontend/utils/brevo.js

// ⚠️ IMPORTANTE: Asegúrate de tener BREVO_KEY en .env.local
// BREVO_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx

export async function sendEmail(to, subject, html) {
  const apiKey = process.env.BREVO_KEY;

  if (!apiKey) {
    console.error("❌ BREVO_KEY no está definido en process.env");
    throw new Error("BREVO_KEY no definido");
  }

  const body = {
    sender: {
      email: "auren.urban@gmail.com", // Debe estar configurado/verificado como remitente en tu cuenta Brevo
      name: "Auren",
    },
    to: [
      {
        email: to,
      },
    ],
    subject,
    htmlContent: html,
  };

  try {
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      console.error("❌ Error Brevo HTTP:", resp.status, data);
      throw new Error(
        `Brevo respondió ${resp.status}: ${JSON.stringify(data)}`
      );
    }

    console.log("✅ Email Brevo enviado:", data);
    return data;
  } catch (err) {
    console.error("❌ Error al llamar a Brevo:", err);
    throw err;
  }
}
