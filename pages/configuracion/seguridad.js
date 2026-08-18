import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function SecurityRedirect() { const router = useRouter(); useEffect(() => { router.replace('/configuracion'); }, [router]); return null; }
