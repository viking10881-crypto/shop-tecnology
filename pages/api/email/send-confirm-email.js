// Frontend/pages/api/email/send-confirm-email.js
import { sendEmail } from "../../../utils/brevo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { to, link } = req.body;

  if (!to || !link) {
    return res.status(400).json({ error: "Faltan datos (to, link)" });
  }

  const subject = "Confirma tu cuenta en ShopTecnology";

  const html = `
    <div style="font-family: Arial, sans-serif; color:#111;">
      <h2>Confirma tu cuenta en ShopTecnology</h2>
      <p>Gracias por registrarte. Solo falta un paso para activar tu cuenta.</p>
      <p>Haz clic en el botón para confirmar tu correo:</p>
      <p style="margin: 20px 0;">
        <a href="${link}"
          style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:999px;">
          Confirmar mi cuenta
        </a>
      </p>
      <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
    </div>
  `;

  try {
    console.log("📧 Enviando email de confirmación a:", to, "link:", link);
    await sendEmail(to, subject, html);
    return res.status(200).json({ message: "Email enviado" });
  } catch (error) {
    console.error(
      "Error enviando email Brevo (confirm):",
      error?.message || error
    );
    return res.status(500).json({
      error:
        error?.message || "No se pudo enviar el email (revisa logs del servidor)",
    });
  }
}
