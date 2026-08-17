import { useState } from "react";
import { uploadImage } from "@/utils/cloudinary";

export default function FotoPerfil({ user, onUpdate }) {
  // Aquí CORREGIMOS la ruta de la foto
  const currentFoto = user?.perfil?.foto || null;

  const [preview, setPreview] = useState(currentFoto);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    // Vista previa local
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Subir a Cloudinary
    const result = await uploadImage(file);

    if (result.secure_url) {
      setPreview(result.secure_url);

      // Notificar al padre
      if (onUpdate) onUpdate(result.secure_url);
    }

    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 p-6">
      
      <div className="relative w-40 h-40 rounded-full overflow-hidden border border-gray-600">
        <img
          src={
            preview ||
            "https://res.cloudinary.com/demo/image/upload/v1690000000/user-default.png"
          }
          alt="Foto de perfil"
          className="w-full h-full object-cover"
        />

        {/* Botón */}
        <label className="absolute bottom-2 right-2 bg-black/70 p-2 rounded-full cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          📷
        </label>
      </div>

      {loading && <p className="text-gray-400 text-sm">Subiendo foto...</p>}
    </div>
  );
}
