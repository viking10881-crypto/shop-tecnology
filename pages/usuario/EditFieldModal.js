import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditFieldModal({ open, field, label, value, onClose, onSave }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (open) {
      // Si es fecha, aseguramos formato YYYY-MM-DD
      if (field === "fecha_nacimiento" && value) {
        // Por si backend envía "2025-11-17T00:00:00Z" u otro formato
        const soloFecha = value.toString().slice(0, 10);
        setInputValue(soloFecha);
      } else {
        setInputValue(value || "");
      }
    }
  }, [open, field, value]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-2xl w-96 border border-white/10 relative">
        <button className="absolute right-4 top-4" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">{label}</h2>

        <input
          type={field === "fecha_nacimiento" ? "date" : "text"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-black border border-white/20 rounded-xl p-3 outline-none"
        />

        <button
          className="mt-6 w-full bg-white/20 hover:bg-white/30 border border-white/10 py-2 rounded-xl"
          onClick={() => onSave(field, inputValue)}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
