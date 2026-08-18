// Frontend/pages/checkout.js
import { useEffect, useState } from "react";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import { useCart } from "@/components/contexts/CartContext";
import { createSale } from "@/utils/api";

const RAW_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

const ENVIO_CALC_URL = `${API_BASE}/envios/calcular/`;

// Helper para auth headers
function getAuthHeaders() {
  if (typeof window === "undefined") {
    return { "Content-Type": "application/json" };
  }
  const token =
    localStorage.getItem("access") || localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// Abre el widget de Wompi usando WidgetCheckout (API oficial)
function abrirWompiDesdePedido(pedido, cliente) {
  if (!pedido || !pedido.id) return;
  if (typeof window === "undefined") return;

  const amountInCents = Math.round(Number(pedido.total || 0) * 100);
  if (!amountInCents) {
    console.warn("Total del pedido inválido para Wompi:", pedido.total);
    return;
  }

  const reference = `SHOPTECNOLOGY-PED-${pedido.id}`;
  const scriptId = "wompi-checkout-script";

  const launchWidget = () => {
    if (!window.WidgetCheckout) {
      console.error("WidgetCheckout de Wompi no está disponible.");
      return;
    }

    const checkout = new window.WidgetCheckout({
      currency: "COP",
      amountInCents,
      reference,
      publicKey:
        process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ||
        "pub_test_EmSkt5qRxOxrwUbiLZ3l48xy9jr01kQz",
      redirectUrl:
        process.env.NEXT_PUBLIC_WOMPI_REDIRECT_URL ||
        "http://localhost:3000/checkout/resultado-wompi",
      customerData: {
        email: cliente.email,
        fullName: cliente.nombre,
        phoneNumber: cliente.telefono,
        phoneNumberPrefix: "+57",
      },
      shippingAddress: pedido.direccion_envio
        ? {
            addressLine1: pedido.direccion_envio.direccion,
            city: pedido.direccion_envio.ciudad,
            region: pedido.direccion_envio.estado || "",
            country: "CO",
            phoneNumber:
              pedido.direccion_envio.telefono || cliente.telefono || "",
          }
        : undefined,
    });

    checkout.open(function (result) {
      const transaction = result.transaction;
      console.log("Transacción Wompi:", transaction);
      // TODO: si quieres, aquí llamas a tu backend para registrar el pago
    });
  };

  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "text/javascript";
    script.src = "https://checkout.wompi.co/widget.js";
    script.onload = launchWidget;
    document.body.appendChild(script);
  } else {
    launchWidget();
  }
}

export default function CheckoutPage() {
  const { cart, loading } = useCart();

  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionadaId, setDireccionSeleccionadaId] = useState(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccionEnvio, setDireccionEnvio] = useState("");
  const [ciudadEnvio, setCiudadEnvio] = useState("");

  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Costo de envío
  const [costoEnvio, setCostoEnvio] = useState(0);

  // Solo Wompi
  const metodoPago = "WOMPI";

  // Cargar direcciones guardadas del usuario
  useEffect(() => {
    const loadDirecciones = async () => {
      try {
        const res = await fetch(`${API_BASE}/usuarios/direcciones/`, {
          headers: getAuthHeaders(),
          credentials: "include", // 👈 IMPORTANTE: misma sesión que el carrito
        });

        if (res.status === 401) {
          console.warn("Usuario no autenticado para cargar direcciones.");
          setDirecciones([]);
          return;
        }

        if (!res.ok) {
          throw new Error("Error cargando direcciones");
        }

        const data = await res.json();
        console.log("Direcciones API data =>", data);

        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.direcciones)
          ? data.direcciones
          : [];

        setDirecciones(lista);

        const pred = lista.find((d) => d.predeterminada);
        if (pred) {
          setDireccionSeleccionadaId(pred.id);
        } else if (lista.length > 0) {
          setDireccionSeleccionadaId(lista[0].id);
        }
      } catch (err) {
        console.error("Error cargando direcciones:", err);
        setDirecciones([]);
      }
    };

    loadDirecciones();
  }, []);

  // Recalcular costo de envío cuando cambie carrito o dirección seleccionada
  useEffect(() => {
    if (!cart) return;

    const subtotal = Number(cart.total || 0);
    if (!subtotal) {
      setCostoEnvio(0);
      return;
    }

    if (!direccionSeleccionadaId || direcciones.length === 0) {
      setCostoEnvio(0);
      return;
    }

    const dirSel = direcciones.find((d) => d.id === direccionSeleccionadaId);
    const ciudadDestino = dirSel?.ciudad || "";

    if (!ciudadDestino) {
      setCostoEnvio(0);
      return;
    }

    const controller = new AbortController();

    const calcular = async () => {
      try {
        const res = await fetch(ENVIO_CALC_URL, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            subtotal,
            ciudad: ciudadDestino,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          console.error("Error API calcular envío:", res.status);
          return;
        }

        const data = await res.json();
        const valor =
          Number(data.costo_envio) || Number(data.costoEnvio) || 0;

        setCostoEnvio(Number.isNaN(valor) ? 0 : valor);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error calculando envío:", err);
      }
    };

    calcular();

    return () => controller.abort();
  }, [cart, direccionSeleccionadaId, direcciones]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!direccionEnvio.trim() || !ciudadEnvio.trim()) {
      setMensaje("Completa la dirección y ciudad de envío.");
      return;
    }

    if (!nombre.trim() || !email.trim()) {
      setMensaje("Completa tu nombre y correo electrónico.");
      return;
    }

    try {
      setEnviando(true);
      setMensaje("");

      const data = await createSale({
        items: cart.items.map((item) => ({ product_id: Number(item.product_id), quantity: item.cantidad })),
        customer_name: nombre.trim(),
        customer_email: email.trim(),
        customer_phone: telefono.trim(),
        shipping_address: direccionEnvio.trim(),
        shipping_city: ciudadEnvio.trim(),
        payment_method: 'wompi',
        notes: notas.trim(),
      });
      console.log("Pedido creado:", data);

      setMensaje(
        "✔️ Pedido creado correctamente. Se abrirá la ventana de pago seguro con Wompi."
      );

      // Siempre Wompi
      abrirWompiDesdePedido({ id: data.id || data.sale_id, total: data.total || totalConEnvio }, {
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
      });
    } catch (err) {
      console.error(err);
      setMensaje("No se pudo completar el checkout. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-neutral-50 flex flex-col">
        <NavBar />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <p className="text-neutral-400 text-sm">Cargando carrito...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-neutral-50 flex flex-col">
        <NavBar />
        <main className="flex-1 pt-24 flex flex-col items-center justify-center px-6">
          <p className="text-neutral-300 mb-4 text-center">
            Tu carrito está vacío. Agrega piezas antes de continuar al checkout.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = Number(cart.total || 0);
  const totalConEnvio = subtotal + Number(costoEnvio || 0);

  const direccionSeleccionada = direcciones.find(
    (d) => d.id === direccionSeleccionadaId
  );

  const envioEsGratis = subtotal > 0 && Number(costoEnvio || 0) === 0;

  return (
    <div className="min-h-screen bg-black text-neutral-50 flex flex-col">
      <NavBar />

      <main className="flex-1 pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_1.2fr] gap-10">
          {/* Datos del cliente / envío */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-7 w-7 rounded-full border border-neutral-700 flex items-center justify-center text-xs">
                  🧾
                </span>
                <h1 className="text-2xl md:text-3xl font-serif">
                  Checkout ShopTecnology
                </h1>
              </div>
              <p className="text-sm text-neutral-400">
                Completa tus datos y confirma tu pedido para pagar con Wompi.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-neutral-900 bg-neutral-950/60 p-5 md:p-6 backdrop-blur"
            >
              {/* Datos personales */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <span className="text-base">👤</span>
                  <span>Datos del cliente</span>
                </div>

                <div>
                  <label className="block text-xs mb-1 text-neutral-400">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-200"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1 text-neutral-400">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-neutral-400">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-200"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de envío */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <span className="text-base">📦</span>
                  <span>Dirección de envío</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input value={direccionEnvio} onChange={(e) => setDireccionEnvio(e.target.value)} required placeholder="Dirección completa" className="md:col-span-2 w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-200" />
                  <input value={ciudadEnvio} onChange={(e) => setCiudadEnvio(e.target.value)} required placeholder="Ciudad" className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-200" />
                </div>

                {direcciones.length > 0 && (
                  <div className="space-y-2 mb-1">
                    {direcciones.map((dir) => {
                      const seleccionada = direccionSeleccionadaId === dir.id;
                      return (
                        <button
                          key={dir.id}
                          type="button"
                          onClick={() => setDireccionSeleccionadaId(dir.id)}
                          className={`w-full text-left rounded-2xl border px-3 py-2.5 text-xs md:text-[13px] transition flex gap-3 ${
                            seleccionada
                              ? "border-neutral-200 bg-neutral-900/80"
                              : "border-neutral-800 bg-neutral-950/70 hover:border-neutral-600"
                          }`}
                        >
                          <div className="pt-1">
                            <span
                              className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                                seleccionada
                                  ? "border-neutral-50 bg-neutral-50"
                                  : "border-neutral-600"
                              }`}
                            >
                              {seleccionada && (
                                <span className="h-2 w-2 rounded-full bg-black" />
                              )}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {dir.nombre_completo} · {dir.ciudad},{" "}
                                {dir.pais}
                              </span>
                              {dir.predeterminada && (
                                <span className="rounded-full border border-neutral-500 px-2 py-[2px] text-[10px] uppercase tracking-wide text-neutral-300">
                                  Predeterminada
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[11px] text-neutral-300">
                              {dir.direccion}
                              {dir.estado ? `, ${dir.estado}` : ""}
                              {dir.codigo_postal
                                ? `, CP ${dir.codigo_postal}`
                                : ""}
                            </p>
                            <p className="mt-0.5 text-[11px] text-neutral-400">
                              Tel: {dir.telefono}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Método de pago (solo Wompi) */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <span className="text-base">💳</span>
                  <span>Método de pago</span>
                </div>

                <div className="rounded-2xl border border-emerald-500/70 bg-emerald-900/10 px-4 py-3 text-xs text-neutral-100 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">
                      Pago en línea seguro con Wompi
                    </span>
                    <span className="rounded-full border border-emerald-400 px-2 py-[2px] text-[10px] uppercase tracking-wide text-emerald-200">
                      Único método
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Paga con tarjeta débito, crédito o PSE. Al confirmar tu
                    pedido se abrirá la ventana de pago de Wompi.
                  </p>
                </div>
              </section>

              {/* Notas */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <span className="text-base">📝</span>
                  <span>Notas para el pedido (opcional)</span>
                </div>
                <textarea
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-200 min-h-[90px]"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej. instrucciones especiales, horarios de entrega, referencias de la dirección…"
                />
              </div>

              <button
                type="submit"
                disabled={enviando || !direccionEnvio.trim() || !ciudadEnvio.trim()}
                className="mt-1 w-full py-3 rounded-full bg-neutral-100 text-black text-xs md:text-sm tracking-[0.22em] uppercase hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {enviando ? "Procesando..." : "Confirmar pedido y pagar con Wompi"}
              </button>

              {mensaje && (
                <p className="text-xs mt-2 text-neutral-300">{mensaje}</p>
              )}
            </form>
          </section>

          {/* Resumen de pedido */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="border border-neutral-800 rounded-3xl p-6 bg-neutral-950/80 shadow-[0_0_40px_rgba(255,255,255,0.03)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-[0.22em] uppercase text-neutral-500">
                  Resumen del pedido
                </p>
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  🛍️
                  {cart.items.length} ítem
                  {cart.items.length !== 1 && "s"}
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-3">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-xs text-neutral-300"
                  >
                    <span>
                      {item.nombre_variante || item.nombre} × {item.cantidad}
                    </span>
                    <span>
                      {(Number(item.subtotal) || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>
                    {subtotal.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    Envío
                    {direccionSeleccionada
                      ? ` a ${direccionSeleccionada.ciudad}`
                      : ""}
                  </span>
                  <span>
                    {envioEsGratis
                      ? "Gratis"
                      : Number(costoEnvio || 0).toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                        })}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs uppercase tracking-[0.22em]">
                    Total estimado
                  </span>
                  <span className="text-base">
                    {totalConEnvio.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 mt-3">
                Al confirmar tu pedido se creará la orden en el sistema y se
                abrirá la ventana de pago seguro de Wompi. Si tu pedido supera
                el monto mínimo, el envío se aplica automáticamente como{" "}
                <span className="text-neutral-200">gratis</span>.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
