import { useEffect, useState } from "react";

// 🔹 Helper para comparar textos ignorando mayúsculas/minúsculas y tildes
const normalizarTexto = (texto) => {
  if (!texto) return "";
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

// Normalizamos la URL base para evitar barra extra al final
const RAW_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

const DIRECCIONES_BASE_URL = `${API_BASE}/usuarios/direcciones`;
const CIUDADES_API_URL =
  process.env.NEXT_PUBLIC_CIUDADES_API_URL ||
  `${API_BASE}/envios/ciudades-colombia/`; // 👈 igual que en checkout

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    id: null,
    nombre_completo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "", // departamento
    codigo_postal: "",
    pais: "Colombia",
    predeterminada: false,
  });

  const isEditing = form.id !== null;

  // Departamentos / ciudades de Colombia
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState([]);

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;

    // 1️⃣ Si ya guardas el access plano en "access"
    const rawAccess = localStorage.getItem("access");
    if (rawAccess) return rawAccess;

    // 2️⃣ Si guardas todo el objeto en "token" (o similar)
    const rawToken = localStorage.getItem("token");
    if (!rawToken) return null;

    try {
      // Intentamos parsear JSON: { access, refresh, ... }
      const parsed = JSON.parse(rawToken);
      if (parsed && typeof parsed === "object" && parsed.access) {
        return parsed.access;
      }
      // Si no tiene .access, devolvemos tal cual
      return rawToken;
    } catch {
      // No era JSON, era un string plano (ya sirve)
      return rawToken;
    }
  };
  const getAuthHeaders = () => {
    const token = getAccessToken();
    const headers = { "Content-Type": "application/json" };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  // Cargar direcciones
  const loadDirecciones = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${DIRECCIONES_BASE_URL}/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("No se pudieron cargar las direcciones");
      }
      const data = await res.json();

      // Normalizar a array SIEMPRE
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.direcciones)
        ? data.direcciones
        : [];

      setDirecciones(lista);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error cargando direcciones");
      setDirecciones([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar departamentos/ciudades de Colombia (misma lógica que en checkout)
  const loadCiudades = async () => {
    try {
      console.log("CIUDADES_API_URL =>", CIUDADES_API_URL);
      const res = await fetch(CIUDADES_API_URL);
      if (!res.ok) {
        console.error("Error cargando ciudades:", res.status);
        return;
      }
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("API ciudades devolvió algo inesperado:", data);
        return;
      }

      setDepartamentos(data);

      // Si el formulario no tiene departamento, ponemos el primero
      if (!form.estado && data.length > 0) {
        const dep0 = data[0];
        setForm((prev) => ({
          ...prev,
          estado: dep0.departamento,
          ciudad:
            prev.ciudad && dep0.ciudades?.includes(prev.ciudad)
              ? prev.ciudad
              : dep0.ciudades?.[0] || "",
        }));
        setCiudadesDisponibles(dep0.ciudades || []);
      }
    } catch (err) {
      console.error("Error cargando ciudades:", err);
    }
  };

  useEffect(() => {
    loadDirecciones();
    loadCiudades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar ciudades cuando cambie estado/departamento (usando normalizarTexto)
  useEffect(() => {
    if (!form.estado || departamentos.length === 0) {
      setCiudadesDisponibles([]);
      return;
    }

    const dep = departamentos.find(
      (d) =>
        normalizarTexto(d.departamento) === normalizarTexto(form.estado)
    );

    if (dep) {
      const ciudadesDep = dep.ciudades || [];
      setCiudadesDisponibles(ciudadesDep);

      if (!ciudadesDep.includes(form.ciudad)) {
        setForm((prev) => ({
          ...prev,
          ciudad: ciudadesDep[0] || "",
        }));
      }
    } else {
      setCiudadesDisponibles([]);
    }
  }, [form.estado, form.ciudad, departamentos]);

  const resetForm = () => {
    setForm({
      id: null,
      nombre_completo: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      estado: "",
      codigo_postal: "",
      pais: "Colombia",
      predeterminada: false,
    });
    setCiudadesDisponibles([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (direccion) => {
    setForm({
      id: direccion.id,
      nombre_completo: direccion.nombre_completo || "",
      telefono: direccion.telefono || "",
      direccion: direccion.direccion || "",
      ciudad: direccion.ciudad || "",
      estado: direccion.estado || "",
      codigo_postal: direccion.codigo_postal || "",
      pais: direccion.pais || "Colombia",
      predeterminada: Boolean(direccion.predeterminada),
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta dirección?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${DIRECCIONES_BASE_URL}/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("No se pudo eliminar la dirección");
      }
      setSuccess("Dirección eliminada");
      await loadDirecciones();
      if (form.id === id) resetForm();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error eliminando dirección");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        nombre_completo: form.nombre_completo,
        telefono: form.telefono,
        direccion: form.direccion,
        ciudad: form.ciudad,
        estado: form.estado || null,
        codigo_postal: form.codigo_postal || null,
        pais: form.pais,
        predeterminada: form.predeterminada,
      };

      const url = isEditing
        ? `${DIRECCIONES_BASE_URL}/${form.id}/`
        : `${DIRECCIONES_BASE_URL}/crear/`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "No se pudo guardar la dirección";
        try {
          const data = await res.json();
          console.error("Error API direcciones:", data);
        } catch (_) {}
        throw new Error(msg);
      }

      setSuccess(isEditing ? "Dirección actualizada" : "Dirección creada");
      resetForm();
      await loadDirecciones();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error guardando dirección");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (direccion) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${DIRECCIONES_BASE_URL}/${direccion.id}/`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ predeterminada: true }),
      });
      if (!res.ok) {
        throw new Error("No se pudo marcar como predeterminada");
      }
      setSuccess("Dirección marcada como predeterminada");
      await loadDirecciones();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error cambiando dirección predeterminada");
    }
  };

  const hayDirecciones =
    Array.isArray(direcciones) && direcciones.length > 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          Configuración · Direcciones
        </h1>

        {error && (
          <div className="mb-4 rounded-md border border-red-600 bg-red-900/20 px-4 py-2 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md border border-emerald-600 bg-emerald-900/20 px-4 py-2 text-sm">
            {success}
          </div>
        )}

        {/* FORMULARIO */}
        <section className="mb-10 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-medium mb-4">
            {isEditing ? "Editar dirección" : "Nueva dirección"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm mb-1">
                  Nombre completo<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={form.nombre_completo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Teléfono<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1">
                  Dirección<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Departamento<span className="text-red-500">*</span>
                </label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                >
                  {departamentos.length === 0 && (
                    <option value="">Cargando...</option>
                  )}
                  {departamentos.map((dep) => (
                    <option key={dep.departamento} value={dep.departamento}>
                      {dep.departamento}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Ciudad<span className="text-red-500">*</span>
                </label>
                <select
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                >
                  {ciudadesDisponibles.length === 0 && (
                    <option value="">Selecciona un departamento</option>
                  )}
                  {ciudadesDisponibles.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Código postal</label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={form.codigo_postal}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  País<span className="text-red-500">*</span>
                </label>
                <select
                  name="pais"
                  value={form.pais}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                >
                  <option value="Colombia">Colombia</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="predeterminada"
                  checked={form.predeterminada}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
                />
                <span>Usar como dirección predeterminada</span>
              </label>

              <div className="flex gap-3">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-neutral-600 px-4 py-2 text-sm"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
                >
                  {saving
                    ? isEditing
                      ? "Guardando..."
                      : "Creando..."
                    : isEditing
                    ? "Guardar cambios"
                    : "Crear dirección"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* LISTA DE DIRECCIONES */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-medium mb-4">
            Mis direcciones
          </h2>

          {loading ? (
            <p className="text-sm text-neutral-400">Cargando direcciones...</p>
          ) : !hayDirecciones ? (
            <p className="text-sm text-neutral-400">
              Aún no tienes direcciones guardadas.
            </p>
          ) : (
            <div className="space-y-4">
              {direcciones.map((dir) => (
                <div
                  key={dir.id}
                  className="flex flex-col gap-3 rounded-xl border border-neutral-700 bg-neutral-950/40 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {dir.nombre_completo} · {dir.ciudad}, {dir.pais}
                      </p>
                      {dir.predeterminada && (
                        <span className="rounded-full border border-emerald-500 px-2 py-0.5 text-[11px] uppercase tracking-wide text-emerald-300">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-300 mt-1">
                      {dir.direccion}
                      {dir.estado ? `, ${dir.estado}` : ""}
                      {dir.codigo_postal ? `, CP ${dir.codigo_postal}` : ""}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Teléfono: {dir.telefono}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!dir.predeterminada && (
                      <button
                        onClick={() => handleSetDefault(dir)}
                        className="rounded-lg border border-neutral-600 px-3 py-1.5 text-xs uppercase tracking-wide"
                      >
                        Hacer predeterminada
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(dir)}
                      className="rounded-lg border border-neutral-500 px-3 py-1.5 text-xs uppercase tracking-wide"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(dir.id)}
                      className="rounded-lg border border-red-600 px-3 py-1.5 text-xs uppercase tracking-wide text-red-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
