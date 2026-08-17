// Frontend/components/checkout/MapSelector.js
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

let L;

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

export default function MapSelector({ onLocationSelected }) {
  const [center, setCenter] = useState([4.5, -74.0]); // centro Colombia
  const [markerPos, setMarkerPos] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const [cargandoDireccion, setCargandoDireccion] = useState(false);
  const [textoDireccion, setTextoDireccion] = useState("");
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!L) {
      // cargamos leaflet sólo en el cliente
      // eslint-disable-next-line global-require
      const leaflet = require("leaflet");
      L = leaflet;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
    setLeafletReady(true);
  }, []);

  const resolverLocacion = async (lat, lng) => {
    let loc = {
      lat,
      lng,
      direccion: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
      ciudad: "",
      departamento: "",
      codigoPostal: "",
    };

    try {
      setCargandoDireccion(true);
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "es" },
      });

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};

        const municipio =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.county ||
          "";

        let departamento = addr.state || "";
        if (departamento) {
          departamento = departamento
            .replace(/^Departamento de\s+/i, "")
            .replace(/^Departamento del\s+/i, "")
            .replace(/ Department$/i, "")
            .trim();
        }

        const calle = addr.road || addr.pedestrian || "";
        const numero = addr.house_number || "";
        const direccionCorta = [
          [calle, numero].filter(Boolean).join(" "),
          municipio,
          departamento,
        ]
          .filter(Boolean)
          .join(", ");

        loc = {
          lat,
          lng,
          direccion: direccionCorta || data.display_name || loc.direccion,
          ciudad: municipio,
          departamento,
          codigoPostal: addr.postcode || "",
        };
      }
    } catch (err) {
      console.error("Error resolviendo dirección desde el mapa:", err);
    } finally {
      setCargandoDireccion(false);
    }

    console.log("Loc detectada desde mapa:", loc);
    setTextoDireccion(loc.direccion || "");
    onLocationSelected && onLocationSelected(loc);
  };

  const handleMapClick = async (e) => {
    if (!e?.latlng) return;
    const { lat, lng } = e.latlng;

    setMarkerPos([lat, lng]);
    if (mapInstance) {
      mapInstance.setView([lat, lng], 16);
    }

    await resolverLocacion(lat, lng);
  };

  const handleUseMyLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setCargandoDireccion(true);

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            console.log("Mi ubicación actual:", latitude, longitude, "±", accuracy, "m");

            setMarkerPos([latitude, longitude]);
            setCenter([latitude, longitude]);
            if (mapInstance) {
            mapInstance.setView([latitude, longitude], 16);
            }

            await resolverLocacion(latitude, longitude);
        },
        (err) => {
            console.error("Error al obtener ubicación actual:", err);
            setCargandoDireccion(false);
            alert(
            "No pudimos obtener tu ubicación. Revisa los permisos de ubicación del navegador."
            );
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        }
    );

  };

  if (typeof window === "undefined" || !leafletReady) {
    return (
      <div className="w-full h-64 rounded-xl border border-neutral-800 flex items-center justify-center text-xs text-neutral-400">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="inline-flex items-center justify-center px-3 py-1.5 text-[11px] rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition"
        >
          📍 Usar mi ubicación actual
        </button>

        {textoDireccion && (
          <p className="text-[11px] text-neutral-400 sm:text-right">
            Dirección detectada:{" "}
            <span className="text-neutral-200">
              {textoDireccion.length > 80
                ? textoDireccion.slice(0, 80) + "…"
                : textoDireccion}
            </span>
          </p>
        )}
      </div>

      <div className="w-full h-64 rounded-xl overflow-hidden border border-neutral-800">
        <MapContainer
          center={center}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          whenCreated={setMapInstance}
          eventHandlers={{ click: handleMapClick }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markerPos && <Marker position={markerPos} />}
        </MapContainer>
      </div>

      {cargandoDireccion && (
        <div className="text-[10px] px-2 py-1 bg-black/60 text-neutral-300 rounded-b-md">
          Obteniendo dirección aproximada...
        </div>
      )}
    </div>
  );
}
