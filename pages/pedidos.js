// pages/pedidos.js
import { useEffect, useState, useMemo, useCallback } from "react";
import withAuth from "../utils/withAuth";
import { useAuth } from "@/components/contexts/AuthContext";
import { fetchMyOrders, fetchMyOrderStats } from "@/utils/api";
import {
  Package,
  Search,
  Filter,
  Loader2,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const ESTADO_LABELS = {
  pending: "Pendiente",
  paid: "Pagado",
  partial: "Pago parcial",
};

const ESTADO_COLORS = {
  pending:
    "bg-yellow-100 text-yellow-800 border-yellow-400/40 dark:bg-yellow-500/20 dark:text-yellow-300",
  paid:
    "bg-emerald-100 text-emerald-800 border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-300",
  partial:
    "bg-blue-100 text-blue-800 border-blue-400/40 dark:bg-blue-500/20 dark:text-blue-300",
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
  const { user, getToken } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes"); // recientes | antiguos

  const fetchPedidos = useCallback(async () => {
    if (!user) return;

    try {
      setCargando(true);
      setError("");

      const token = await getToken();
      const [orders, summary] = await Promise.all([
        fetchMyOrders(token),
        fetchMyOrderStats(token).catch(() => null),
      ]);

      setPedidos(Array.isArray(orders) ? orders : []);
      setStats(summary);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError(err.message || "No se pudieron cargar tus pedidos.");
      setPedidos([]);
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const pedidosFiltrados = useMemo(() => {
    if (!Array.isArray(pedidos) || pedidos.length === 0) return [];

    let lista = [...pedidos];

    if (filtroEstado !== "todos") {
      lista = lista.filter((p) => p.payment_status === filtroEstado);
    }

    if (busqueda.trim() !== "") {
      const term = busqueda.trim().toLowerCase();
      lista = lista.filter((p) => {
        const codigo = (p.order_code || "").toLowerCase();
        const estado = (p.payment_status || "").toLowerCase();
        return codigo.includes(term) || estado.includes(term);
      });
    }

    lista.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return orden === "recientes" ? dateB - dateA : dateA - dateB;
    });

    return lista;
  }, [pedidos, filtroEstado, busqueda, orden]);

  const ultimoPedido = useMemo(() => {
    if (!pedidos.length) return null;
    return [...pedidos].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  }, [pedidos]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl px-6 py-5 max-w-md text-center">
          <p className="text-red-600 dark:text-red-300 mb-2">{error}</p>
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

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 pt-24 pb-8 md:pb-10 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        {/* Título y resumen */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <Package className="w-7 h-7 text-white/80" />
              Historial de pedidos
            </h1>
            {user?.name && (
              <p className="text-neutral-400 text-sm mt-1">
                Estos son los pedidos realizados por{" "}
                <span className="text-neutral-200">{user.name}</span>.
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 flex flex-col">
              <span className="text-neutral-400">Pedidos</span>
              <span className="text-lg font-semibold">
                {stats?.total_orders ?? pedidos.length}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 flex flex-col">
              <span className="text-neutral-400">Total invertido</span>
              <span className="text-lg font-semibold">
                {formatearPrecio(stats?.total_invested ?? 0)}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 flex flex-col">
              <span className="text-neutral-400 text-[0.7rem]">
                Último pedido
              </span>
              <span className="text-[0.75rem] mt-1 text-neutral-200">
                {ultimoPedido ? (
                  <>
                    {ultimoPedido.order_code} ·{" "}
                    {formatearFecha(ultimoPedido.created_at)}
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
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="partial">Pago parcial</option>
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
                placeholder="Buscar por # de pedido o estado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full md:w-72 bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs md:text-sm outline-none focus:border-white/40 placeholder:text-neutral-500"
              />
            </div>
          </div>
        </section>

        {/* Contenido principal */}
        {pedidos.length === 0 ? (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-neutral-300" />
            </div>
            <h2 className="text-lg font-semibold">Aún no tienes pedidos</h2>
            <p className="text-neutral-400 text-sm max-w-sm">
              Cuando realices tu primera compra, podrás ver aquí el estado y
              los datos de envío de cada pedido.
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
                ESTADO_LABELS[pedido.payment_status] || pedido.payment_status || "—";
              const estadoClase =
                ESTADO_COLORS[pedido.payment_status] || "bg-white/10 text-white";

              return (
                <article
                  key={pedido.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col gap-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold">
                        Pedido {pedido.order_code}
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Creado: {formatearFecha(pedido.created_at)}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Método de pago:{" "}
                        <span className="text-neutral-200 font-medium capitalize">
                          {pedido.payment_method || "—"}
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

                  {(pedido.shipping_address || pedido.shipping_city) && (
                    <div className="border-t border-white/10 pt-4">
                      <h3 className="text-xs font-semibold mb-2 text-neutral-300 uppercase tracking-wide">
                        Envío
                      </h3>
                      <p className="text-sm text-neutral-300">
                        {[pedido.shipping_address, pedido.shipping_city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {pedido.shipping_notes && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {pedido.shipping_notes}
                        </p>
                      )}
                    </div>
                  )}

                  {pedido.payment_status === "partial" && (
                    <div className="border-t border-white/10 pt-4 flex justify-between text-xs text-neutral-400">
                      <span>Pagado hasta ahora</span>
                      <span className="text-neutral-200 font-medium">
                        {formatearPrecio(pedido.amount_paid)}
                      </span>
                    </div>
                  )}
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
