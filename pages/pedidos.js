// frontend/pages/pedidos.js
import { useEffect, useState, useMemo, useCallback } from "react";
import withAuth from "../utils/withAuth";
import { useAuth } from "@/components/contexts/AuthContext";
import {
  Package,
  Search,
  Filter,
  Loader2,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

// Mapeo visual de estados
const ESTADO_LABELS = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  en_proceso: "En proceso",
  enviado: "Enviado",
  entregado: "Entregado",
  anulado: "Anulado",
  devuelto: "Devuelto",
};

const ESTADO_COLORS = {
  pendiente: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  pagado: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  en_proceso: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  enviado: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  entregado: "bg-emerald-600/20 text-emerald-200 border-emerald-600/40",
  anulado: "bg-red-500/20 text-red-300 border-red-500/40",
  devuelto: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

const formatearFecha = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatearPrecio = (valor) => {
  if (valor == null) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
};

function Pedidos() {
  const { api, user } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes"); // recientes | antiguos

  const fetchPedidos = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const res = await api.get("/pedidos/mios/");

      // DRF con paginación -> { count, next, previous, results: [...] }
      let dataArray = [];

      if (Array.isArray(res.data)) {
        dataArray = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        dataArray = res.data.results;
      }

      setPedidos(dataArray);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError("No se pudieron cargar tus pedidos.");
      setPedidos([]);
    } finally {
      setCargando(false);
    }
  }, [api]);

  useEffect(() => {
    if (api) {
      fetchPedidos();
    }
  }, [api, fetchPedidos]);

  // Derivados / métricas
  const { totalPedidos, totalGastado, ultimoPedido } = useMemo(() => {
    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      return { totalPedidos: 0, totalGastado: 0, ultimoPedido: null };
    }

    const total = pedidos.length;
    const gastado = pedidos.reduce(
      (acc, p) => acc + (Number(p.total) || 0),
      0
    );
    const ultimo = pedidos
      .slice()
      .sort(
        (a, b) =>
          new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime()
      )[0];

    return {
      totalPedidos: total,
      totalGastado: gastado,
      ultimoPedido: ultimo,
    };
  }, [pedidos]);

  // Aplicar filtro, búsqueda y orden
  const pedidosFiltrados = useMemo(() => {
    if (!Array.isArray(pedidos) || pedidos.length === 0) return [];

    let lista = [...pedidos];

    if (filtroEstado !== "todos") {
      lista = lista.filter((p) => p.estado === filtroEstado);
    }

    if (busqueda.trim() !== "") {
      const term = busqueda.trim().toLowerCase();
      lista = lista.filter((p) => {
        const idStr = String(p.id);
        const estado = p.estado?.toLowerCase() || "";
        const productoMatch = (p.items || []).some((item) =>
          (item.producto_nombre || "").toLowerCase().includes(term)
        );
        return (
          idStr.includes(term) || estado.includes(term) || productoMatch
        );
      });
    }

    lista.sort((a, b) => {
      const dateA = new Date(a.creado_en).getTime();
      const dateB = new Date(b.creado_en).getTime();
      return orden === "recientes" ? dateB - dateA : dateA - dateB;
    });

    return lista;
  }, [pedidos, filtroEstado, busqueda, orden]);

  // UI de carga
  if (cargando) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin w-8 h-8 text-white" />
          <p className="text-neutral-300 text-sm">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  // UI de error
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl px-6 py-5 max-w-md text-center">
          <p className="text-red-300 mb-2">{error}</p>
          <button
            onClick={fetchPedidos}
            className="mt-2 text-sm px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const nombreUsuario =
    user?.first_name && user.first_name.trim().length > 0
      ? user.first_name
      : user?.username || "";

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-8 md:py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        {/* Título y resumen */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <Package className="w-7 h-7 text-white/80" />
              Historial de pedidos
            </h1>
            {nombreUsuario && (
              <p className="text-neutral-400 text-sm mt-1">
                Estos son los pedidos realizados por{" "}
                <span className="text-neutral-200">@{nombreUsuario}</span>.
              </p>
            )}
          </div>

          {/* Resumen rápido */}
          <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 flex flex-col">
              <span className="text-neutral-400">Pedidos</span>
              <span className="text-lg font-semibold">
                {totalPedidos ?? 0}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 flex flex-col">
              <span className="text-neutral-400">Total gastado</span>
              <span className="text-lg font-semibold">
                {formatearPrecio(totalGastado ?? 0)}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 flex flex-col">
              <span className="text-neutral-400 text-[0.7rem]">
                Último pedido
              </span>
              <span className="text-[0.75rem] mt-1 text-neutral-200">
                {ultimoPedido ? (
                  <>
                    #{ultimoPedido.id} ·{" "}
                    {formatearFecha(ultimoPedido.creado_en)}
                  </>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </div>
        </header>

        {/* Barra de filtros / búsqueda */}
        <section className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-5 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-300 hidden sm:inline">
              Filtrar por estado:
            </span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs md:text-sm outline-none focus:border-white/40"
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="en_proceso">En proceso</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="anulado">Anulado</option>
              <option value="devuelto">Devuelto</option>
            </select>

            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs md:text-sm outline-none focus:border-white/40"
            >
              <option value="recientes">Más recientes primero</option>
              <option value="antiguos">Más antiguos primero</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por #pedido, estado o producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full md:w-72 bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs md:text-sm outline-none focus:border-white/40 placeholder:text-neutral-500"
              />
            </div>
          </div>
        </section>

        {/* Contenido principal */}
        {(!Array.isArray(pedidos) || pedidos.length === 0) ? (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-neutral-300" />
            </div>
            <h2 className="text-lg font-semibold">Aún no tienes pedidos</h2>
            <p className="text-neutral-400 text-sm max-w-sm">
              Cuando realices tu primera compra, podrás ver aquí el estado de
              envío, los productos y los pagos asociados a cada pedido.
            </p>
            <Link
              href="/producto"
              className="inline-flex items-center gap-2 text-sm mt-1 px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition"
            >
              Ver colección
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </section>
        ) : pedidosFiltrados.length === 0 ? (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-neutral-300 text-sm">
              No encontramos pedidos que coincidan con los filtros actuales.
            </p>
          </section>
        ) : (
          <section className="flex flex-col gap-4">
            {pedidosFiltrados.map((pedido) => {
              const estadoLabel =
                ESTADO_LABELS[pedido.estado] || pedido.estado || "—";
              const estadoClase =
                ESTADO_COLORS[pedido.estado] || "bg-white/10 text-white";

              const totalItems =
                (pedido.items || []).reduce(
                  (acc, item) => acc + (item.cantidad || 0),
                  0
                ) || 0;

              return (
                <article
                  key={pedido.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col gap-4"
                >
                  {/* Encabezado */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        Pedido #{pedido.id}
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Creado: {formatearFecha(pedido.creado_en)}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Ítems:{" "}
                        <span className="text-neutral-200 font-medium">
                          {totalItems}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className="text-xs uppercase tracking-wide text-neutral-400">
                        Estado
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[0.7rem] border ${estadoClase}`}
                      >
                        {estadoLabel}
                      </span>
                      <div className="text-sm mt-2 md:mt-1 text-neutral-300">
                        <span className="text-xs uppercase tracking-wide text-neutral-500 block">
                          Total
                        </span>
                        <span className="text-base font-semibold">
                          {formatearPrecio(pedido.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-xs font-semibold mb-2 text-neutral-300 uppercase tracking-wide">
                      Productos
                    </h3>
                    {pedido.items && pedido.items.length > 0 ? (
                      <ul className="space-y-2">
                        {pedido.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex justify-between items-center text-xs md:text-sm"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {item.producto_nombre}
                              </span>
                              <span className="text-neutral-400">
                                Variante: {item.variante_nombre}
                              </span>
                              <span className="text-neutral-500">
                                Cantidad: {item.cantidad}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-neutral-300">
                                {formatearPrecio(item.precio)} c/u
                              </p>
                              <p className="text-neutral-100 font-semibold">
                                {formatearPrecio(item.subtotal)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-neutral-400">
                        Este pedido no tiene ítems registrados.
                      </p>
                    )}
                  </div>

                  {/* Pagos */}
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-xs font-semibold mb-2 text-neutral-300 uppercase tracking-wide">
                      Pagos
                    </h3>
                    {pedido.pagos && pedido.pagos.length > 0 ? (
                      <ul className="space-y-2 text-xs md:text-sm">
                        {pedido.pagos.map((pago) => (
                          <li
                            key={pago.id}
                            className="flex justify-between items-center"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {formatearPrecio(pago.monto)} · {pago.metodo}
                              </span>
                              <span className="text-neutral-400 text-xs">
                                {formatearFecha(pago.creado_en)}
                              </span>
                            </div>
                            <span className="text-[0.7rem] uppercase tracking-wide bg-white/10 px-2 py-1 rounded-full text-neutral-200">
                              {pago.estado}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-neutral-400">
                        No hay pagos registrados para este pedido.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}

export default withAuth(Pedidos);
