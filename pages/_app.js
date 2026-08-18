// pages/_app.js
import { AuthProvider } from "@/components/contexts/AuthContext";
import { CartProvider } from "@/components/contexts/CartContext";
import PageLayout from "@/components/layouts/PageLayout"; // 👈 aquí el cambio
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </CartProvider>
    </AuthProvider>
  );
}
