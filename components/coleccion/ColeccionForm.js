import { useState } from "react";
import axios from "axios";
import { uploadImage } from "@/utils/cloudinary";

export default function ColeccionForm({ coleccionInicial = null, onSuccess }) {
  const [nombre, setNombre] = useState(coleccionInicial?.nombre || "");
  const [slug, setSlug] = useState(coleccionInicial?.slug || "");
  const [descripcion, setDescripcion] = useState(
    coleccionInicial?.descripcion || ""
  );
  const [imagenUrl, setImagenUrl] = useState(
    coleccionInicial?.imagen_portada || ""
  );
  const [activa, setActiva] = useState(
    coleccionInicial?.activa !== undefined ? coleccionInicial.activa : true
  );

  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const generarSlug = (texto) =>
    texto
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleNombreChange = (e) => {
    const value = e.target.value;
    setNombre(value);
    if (!coleccionInicial) {
      setSlug(generarSlug(value));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setOk("");
    setSubiendo(true);

    try {
      const data = await uploadImage(file);
      if (data.secure_url) {
        setImagenUrl(data.secure_url);
        setOk("Imagen subida correctamente.");
      } else {
        setError("No se recibió la URL segura de Cloudinary.");
      }
    } catch (err) {
      console.error("Error subiendo imagen a Cloudinary:", err);
      setError("Error subiendo la imagen. Intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    setGuardando(true);

    try {
      const payload = {
        nombre,
        slug: slug || generarSlug(nombre),
        descripcion,
        imagen_portada: imagenUrl,
        activa,
      };

      if (coleccionInicial?.id) {
        await axios.put(
          `http://localhost:8000/api/colecciones/${coleccionInicial.id}/`,
          payload
        );
        setOk("Colección actualizada correctamente.");
      } else {
        await axios.post("http://localhost:8000/api/colecciones/", payload);
        setOk("Colección creada correctamente.");

        setNombre("");
        setSlug("");
        setDescripcion("");
        setImagenUrl("");
        setActiva(true);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error guardando colección:", err.response?.data || err);
      setError("Ocurrió un error al guardar la colección.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl w-full space-y-5 border border-neutral-800 bg-black/60 p-6 rounded-3xl"
    >
      <h2 className="text-xl font-serif mb-2">
        {coleccionInicial ? "Editar colección" : "Crear nueva colección"}
      </h2>

      {error && (
        <p className="text-sm text-red-400 border border-red-500/40 rounded-lg px-3 py-2 bg-red-500/5">
          {error}
        </p>
      )}
      {ok && (
        <p className="text-sm text-emerald-400 border border-emerald-500/40 rounded-lg px-3 py-2 bg-emerald-500/5">
          {ok}
        </p>
      )}

      {/* Nombre */}
      <div>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-400">
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={handleNombreChange}
          required
          className="mt-1 w-full bg-black border border-neutral-700 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:border-neutral-100"
          placeholder="Ej: Essentials"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-400">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 w-full bg-black border border-neutral-700 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:border-neutral-100"
          placeholder="essentials, nueva-temporada..."
        />
        <p className="mt-1 text-[11px] text-neutral-500">
          Si lo dejas vacío, se genera automáticamente a partir del nombre.
        </p>
      </div>

      {/* Descripción */}
      <div>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-400">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="mt-1 w-full bg-black border border-neutral-700 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:border-neutral-100 resize-none"
          placeholder="Texto corto sobre la colección..."
        />
      </div>

      {/* Imagen */}
      <div>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-400">
          Imagen de portada
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:uppercase file:tracking-[0.18em] file:bg-neutral-100 file:text-black hover:file:bg-neutral-200"
        />
        {subiendo && (
          <p className="mt-1 text-xs text-neutral-400">
            Subiendo imagen a Cloudinary...
          </p>
        )}
        {imagenUrl && (
          <div className="mt-3">
            <p className="text-[11px] text-neutral-500 mb-1">Preview:</p>
            <img
              src={imagenUrl}
              alt="Preview colección"
              className="h-40 w-full object-cover rounded-2xl border border-neutral-800"
            />
          </div>
        )}
      </div>

      {/* Activa */}
      <div className="flex items-center gap-2">
        <input
          id="activa"
          type="checkbox"
          checked={activa}
          onChange={(e) => setActiva(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-600 bg-black text-neutral-100"
        />
        <label
          htmlFor="activa"
          className="text-xs text-neutral-300 select-none"
        >
          Colección activa (se muestra en el inicio)
        </label>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={guardando}
        className="w-full mt-2 border border-neutral-100 py-2.5 text-xs md:text-sm tracking-[0.22em] uppercase rounded-full hover:bg-neutral-100 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {guardando
          ? coleccionInicial
            ? "Guardando cambios..."
            : "Creando colección..."
          : coleccionInicial
          ? "Guardar cambios"
          : "Crear colección"}
      </button>
    </form>
  );
}
