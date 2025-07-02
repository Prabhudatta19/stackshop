'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectedFrom') || '/dashboard';


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.replace(redirectTo);
    }
  };

  return (
    <div className="flex items-center flex-1 justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="glass-bg shadow-lg rounded-xl p-8 max-w-sm w-full space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">Log in to StackShop</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-transparent border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-transparent border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
