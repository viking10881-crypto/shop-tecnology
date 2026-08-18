import { useAuth } from "@/components/contexts/AuthContext";
import FotoPerfil from "@/components/perfil/FotoPerfil";
import withAuth from "@/utils/withAuth";
import { useState } from "react";

export default withAuth(function CambiarFotoPage() {
  const { user, refreshUser, api } = useAuth();
  const [saving, setSaving] = useState(false);

  const updateFoto = async (url) => {
    setSaving(true);

    try {
      // El backend espera esto:
      await api.patch("/usuarios/perfil/", {
        foto: url
      });

      // Cargar usuario actualizado
      await refreshUser();

    } catch (error) {
      console.error("Error actualizando foto:", error);
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Cambiar Foto de Perfil</h1>

      <FotoPerfil user={user} onUpdate={updateFoto} />

      {saving && (
        <p className="text-gray-400 text-sm mt-4">
          Guardando cambios...
        </p>
      )}
    </div>
  );
});
