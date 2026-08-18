// components/ui/TriangleLoader.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function TriangleLoader() {
  const router = useRouter();
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timeout;

    const start = () => {
      clearTimeout(timeout);
      setActive(true);
    };

    const end = () => {
      timeout = setTimeout(() => setActive(false), 200);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
      clearTimeout(timeout);
    };
  }, [router.events]);

  if (!active) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="relative flex flex-col items-center gap-1">
        <div className="w-14 h-14 rounded-full border border-neutral-900/15 bg-white/90 backdrop-blur flex items-center justify-center animate-pulse">
          <span className="text-[9px] uppercase tracking-[0.28em] text-neutral-600">
            ShopTecnology
          </span>
        </div>
        {/* 🔺 Triangulito inferior */}
        <div className="w-3 h-3 bg-white/90 border-l border-b border-neutral-900/15 rotate-45"></div>
      </div>
    </div>
  );
}
