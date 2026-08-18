// Frontend/pages/api/email/send-reset-password.js
import { sendEmail } from "../../../utils/brevo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { to, link } = req.body;

  if (!to || !link) {
    return res.status(400).json({ error: "Faltan datos (to, link)" });
  }

  const subject = "Recupera tu contraseña - ShopTecnology";

  const html = `
    <div style="font-family: Arial, sans-serif; color:#111;">
      <h2>Recupera tu contraseña</h2>
      <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>ShopTecnology</strong>.</p>
      <p>Haz clic en el botón para continuar:</p>
      <p style="margin: 20px 0;">
        <a href="${link}"
          style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:999px;">
          Cambiar contraseña
        </a>
      </p>
      <p>Si tú no hiciste esta solicitud, puedes ignorar este mensaje.</p>
    </div>
  `;

  try {
    await sendEmail(to, subject, html);
    return res.status(200).json({ message: "Email enviado" });
  } catch (error) {
    console.error("Error enviando email Brevo (reset):", error);
    return res.status(500).json({ error: "No se pudo enviar el email" });
  }
}
