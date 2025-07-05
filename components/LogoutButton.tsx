'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm "
    >
      Log Out
    </button>
  );
}
