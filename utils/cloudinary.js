// Frontend/utils/cloudinary.js

/**
 * ❌ Unsigned upload (NO recomendado para producción pública)
 * Útil para dev o paneles muy cerrados.
 */
export const uploadImageUnsigned = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "luxu_preset");

  const res = await fetch("https://api.cloudinary.com/v1_1/dagyxjcjk/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Upload unsigned falló");
  return data; // secure_url, public_id, etc.
};

// Alias de compatibilidad para las pantallas heredadas del diseño.
export const uploadImage = uploadImageUnsigned;

/**
 * ✅ Signed upload (RECOMENDADO para producción)
 * Requiere endpoint en Django: POST /api/cloudinary/signature/
 *
 * Si usas cookies/sesión: deja credentials: "include"
 * Si usas JWT: pasa Authorization: Bearer <token> (ver ejemplo abajo)
 */
export const uploadImageSigned = async (
  file,
  { folder = "auren/uploads", token = null } = {}
) => {
  const API = process.env.NEXT_PUBLIC_API_URL;

  // 1) Pedir firma al backend
  const sigRes = await fetch(`${API}/api/cloudinary/signature/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? "omit" : "include", // si usas cookies/sesión, include
    body: JSON.stringify({ folder }),
  });

  if (!sigRes.ok) {
    const errTxt = await sigRes.text();
    throw new Error(`Firma Cloudinary falló: ${errTxt}`);
  }

  const { signature, timestamp, api_key, cloud_name } = await sigRes.json();

  // 2) Subir a Cloudinary con firma
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const upRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await upRes.json();
  if (!upRes.ok) throw new Error(data?.error?.message || "Upload signed falló");

  return data; // secure_url, public_id, etc.
};
