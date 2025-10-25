'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/core/template-system/supabase';

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          router.replace('/dashboard');
        } else {
          // Give detectSessionInUrl some time, then fallback to login
          setTimeout(async () => {
            const { data: { session: s } } = await supabase.auth.getSession();
            router.replace(s ? '/dashboard' : '/auth/login');
          }, 1500);
        }
      }
    }
    check();
    return () => { mounted = false; };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
    </div>
  );
}
