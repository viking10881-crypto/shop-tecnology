export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido.' });
  }

  if (!req.headers.authorization) {
    return res.status(401).json({ success: false, message: 'Token de autenticación requerido.' });
  }

  const base =
    process.env.DELASOFT_PUBLIC_API_URL ||
    'https://delasoft-back.onrender.com/public-api/v1';
  const key = process.env.DELASOFT_PUBLIC_API_KEY;

  if (!key) {
    return res.status(500).json({
      success: false,
      message: 'Falta configurar DELASOFT_PUBLIC_API_KEY en las variables del servidor.',
    });
  }

  try {
    const upstream = await fetch(`${base.replace(/\/$/, '')}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: req.headers.authorization,
        'X-API-Key': key,
      },
      body: req,
      duplex: 'half',
    });

    const data = await upstream.json().catch(() => null);
    return res.status(upstream.status).json(
      data || { success: false, message: 'Respuesta inválida al subir la imagen.' }
    );
  } catch (error) {
    return res.status(502).json({ success: false, message: 'No fue posible subir la imagen.' });
  }
}
