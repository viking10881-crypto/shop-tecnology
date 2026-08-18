import { useAuth } from "../components/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [loading, user]);

    if (loading) return <p>Cargando...</p>;

    return user ? <Component {...props} /> : null;
  };
}
