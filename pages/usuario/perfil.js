import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function ProfileRedirect() { const router = useRouter(); useEffect(() => { router.replace('/usuario/perfilinfo'); }, [router]); return null; }
