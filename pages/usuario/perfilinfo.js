// Frontend/pages/usuario/perfil.js (o donde tengas este componente)
import { useEffect, useState } from "react";
import withAuth from "../../utils/withAuth";
import { useAuth } from "@/components/contexts/AuthContext";
import EditFieldModal from "./EditFieldModal";
import { Save, Camera } from "lucide-react";
import { uploadImage } from "../../utils/cloudinary";
import AccountLayout from "@/components/layouts/AccountLayout";

const DEFAULT_AVATAR = "/img/user-default.png";
const MAX_IMAGE_SIZE_MB = 3;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function PerfilInfo() {
  const { user, api, refreshUser } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    username: "",
    telefono: "",
    fecha_nacimiento: "",
    foto: "",
    genero: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");
  const [modalLabel, setModalLabel] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  // Cargar datos iniciales del user
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        username: user.username || "",
        telefono: user.perfil?.telefono || "",
        fecha_nacimiento: user.perfil?.fecha_nacimiento || "",
        foto: user.perfil?.foto || "",
        genero: user.perfil?.genero || "",
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

    setMensaje("");

    // Validaciones básicas de seguridad / UX
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
      const res = await uploadImage(file);
      const url = res.secure_url || res.url;

      if (!url) {
        setMensaje("❌ No se pudo obtener la URL de la imagen.");
      } else {
        setForm((prev) => ({ ...prev, foto: url }));
        setMensaje("✔️ Foto subida correctamente (no olvides Guardar cambios).");
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error subiendo la imagen.");
    } finally {
      setSubiendoFoto(false);
    }
  };

  const guardarCambios = async () => {
    if (!api) {
      setMensaje("❌ No se pudo conectar con el servidor de usuario.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const payload = {
        first_name: form.first_name,
        username: form.username, // si tu API no lo permite, lo ignorará
        perfil: {
          telefono: form.telefono || "",
          fecha_nacimiento: form.fecha_nacimiento || null,
          foto: form.foto || null,
          genero: form.genero || null,
        },
      };

      const res = await api.patch("/usuarios/perfil/", payload);
      await refreshUser();

      if (res.status >= 200 && res.status < 300) {
        setMensaje("✔️ Datos guardados correctamente.");
      } else {
        setMensaje("❌ Error al actualizar los datos.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error de conexión al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${form.first_name || user?.first_name || "Usuario"}`.trim();

  const basicFields = [
    { field: "first_name", label: "Nombre" },
    { field: "username", label: "Username" },
    { field: "genero", label: "Género" },
  ];

  const extraFields = [
    { field: "telefono", label: "Teléfono" },
    { field: "fecha_nacimiento", label: "Fecha de nacimiento" },
  ];

  // Fallback por si withAuth aún no ha resuelto
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
      subtitle="Actualiza tu nombre, usuario, foto, contacto y otros datos de tu perfil."
      backHref="/usuario/cuenta"
      backLabel="Cuenta"
    >
      {/* Card de perfil */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-center w-full p-6 mb-8 gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border border-neutral-700 flex-shrink-0">
          <img
            src={form.foto || user?.perfil?.foto || DEFAULT_AVATAR}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          <label className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 p-2 rounded-full transition cursor-pointer flex items-center justify-center border border-white/40">
            <Camera size={18} className="text-white" />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFotoChange}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold">{fullName}</h2>
          <p className="text-neutral-400 text-sm">
            @{form.username || user.username}
          </p>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-[0.18em]">
            Perfil ShopTecnology
          </p>
        </div>
      </div>

      {/* Secciones de campos */}
      <div className="w-full flex flex-col gap-8">
        {/* Datos básicos */}
        <section>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-3">
            Datos básicos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {basicFields.map(({ field, label }) => (
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

        {/* Contacto y otros */}
        <section>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-3">
            Contacto y otros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extraFields.map(({ field, label }) => (
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
        disabled={loading || subiendoFoto}
        className="mt-10 w-full flex items-center justify-center gap-2 py-3 bg-neutral-100 text-black hover:bg-white rounded-2xl border border-neutral-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save size={18} />
        {loading
          ? "Guardando..."
          : subiendoFoto
          ? "Subiendo foto..."
          : "Guardar cambios"}
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
