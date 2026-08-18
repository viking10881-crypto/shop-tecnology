import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function PaymentsRedirect() { const router = useRouter(); useEffect(() => { router.replace('/configuracion'); }, [router]); return null; }
