'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/explore/map'); {/*Whenever the 'router' (useRouter next.js utility) changes on this page, replace the url*/}
    }, [router]);

    return null;
}