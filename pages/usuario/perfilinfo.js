// pages/usuario/perfilinfo.js
import { useEffect, useState } from "react";
import withAuth from "../../utils/withAuth";
import { useAuth } from "@/components/contexts/AuthContext";
import EditFieldModal from "./EditFieldModal";
import { Save, Camera } from "lucide-react";
import { updateMyProfile, uploadMyAvatar } from "@/utils/api";
import AccountLayout from "@/components/layouts/AccountLayout";

const MAX_IMAGE_SIZE_MB = 3;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function initials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function PerfilInfo() {
  const { user, updateUser, getToken } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");
  const [modalLabel, setModalLabel] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const openModal = (field, label) => {
    setModalField(field);
    setModalLabel(label);
    setModalOpen(true);
  };

  const saveField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setModalOpen(false);
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setMensaje("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setMensaje("❌ Solo se permiten imágenes JPG, PNG o WEBP.");
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_IMAGE_SIZE_MB) {
      setMensaje(`❌ La imagen supera los ${MAX_IMAGE_SIZE_MB}MB permitidos.`);
      return;
    }

    setSubiendoFoto(true);
    try {
      const token = await getToken();
      const { url, public_id } = await uploadMyAvatar(token, file);
      const updated = await updateMyProfile(token, {
        ...form,
        avatar_url: url,
        avatar_public_id: public_id,
      });
      updateUser(updated);
      setMensaje("✔️ Foto de perfil actualizada.");
    } catch (error) {
      console.error(error);
      setMensaje(`❌ ${error.message || "No fue posible subir la foto."}`);
    } finally {
      setSubiendoFoto(false);
    }
  };

  const guardarCambios = async () => {
    if (!form.name.trim()) {
      setMensaje("❌ El nombre es obligatorio.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const token = await getToken();
      const updated = await updateMyProfile(token, form);
      updateUser(updated);
      setMensaje("✔️ Datos guardados correctamente.");
    } catch (error) {
      console.error(error);
      setMensaje(`❌ ${error.message || "No fue posible actualizar el perfil."}`);
    } finally {
      setLoading(false);
    }
  };

  const editableFields = [
    { field: "name", label: "Nombre" },
    { field: "phone", label: "Teléfono" },
    { field: "city", label: "Ciudad" },
    { field: "address", label: "Dirección" },
  ];

  if (!user) {
    return (
      <AccountLayout
        title="Información personal"
        subtitle="Edita tus datos básicos de perfil dentro de ShopTecnology."
        backHref="/usuario/cuenta"
        backLabel="Cuenta"
      >
        <div className="flex justify-center py-20">
          <p className="text-sm text-neutral-400">
            Cargando datos de usuario...
          </p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title="Información personal"
      subtitle="Actualiza tu nombre, teléfono, ciudad y dirección de entrega."
      backHref="/usuario/cuenta"
      backLabel="Cuenta"
    >
      {/* Card de perfil */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-center w-full p-6 mb-8 gap-6">
        <div className="relative w-24 h-24 rounded-full flex-shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Foto de perfil"
              className="w-full h-full rounded-full object-cover border border-white/15"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-white/10 border border-white/15 text-2xl font-semibold text-white">
              {initials(form.name || user.name)}
            </div>
          )}

          <label className="absolute bottom-0 right-0 bg-black/70 hover:bg-black/90 p-1.5 rounded-full transition cursor-pointer flex items-center justify-center border border-white/30">
            <Camera size={14} className="text-white" />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFotoChange}
              disabled={subiendoFoto}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold">{form.name || "Usuario"}</h2>
          <p className="text-neutral-400 text-sm">{user.email}</p>
          {user.cedula && (
            <p className="text-xs text-neutral-500 mt-1">Cédula {user.cedula}</p>
          )}
        </div>
      </div>

      {/* Campos editables */}
      <div className="w-full flex flex-col gap-8">
        <section>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-3">
            Datos de contacto y entrega
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editableFields.map(({ field, label }) => (
              <button
                type="button"
                key={field}
                onClick={() => openModal(field, label)}
                className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl cursor-pointer hover:bg-white/10 transition flex justify-between items-center text-left"
              >
                <div>
                  <span className="text-neutral-300 text-xs">{label}</span>
                  <p className="text-white text-base mt-1">
                    {form[field] || "-"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Botón guardar */}
      <button
        onClick={guardarCambios}
        disabled={loading}
        className="mt-10 w-full flex items-center justify-center gap-2 py-3 bg-neutral-100 text-black hover:bg-white rounded-2xl border border-neutral-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save size={18} />
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>

      {/* Mensaje de estado */}
      {mensaje && (
        <p
          className={`text-center mt-4 text-sm font-medium ${
            mensaje.startsWith("✔") ? "text-green-400" : "text-red-400"
          }`}
        >
          {mensaje}
        </p>
      )}

      {/* Modal edición */}
      <EditFieldModal
        open={modalOpen}
        field={modalField}
        label={modalLabel}
        value={form[modalField] || ""}
        onClose={() => setModalOpen(false)}
        onSave={saveField}
      />
    </AccountLayout>
  );
}

export default withAuth(PerfilInfo);
