import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function OrdersRedirect() { const router = useRouter(); useEffect(() => { router.replace('/pedidos'); }, [router]); return null; }
