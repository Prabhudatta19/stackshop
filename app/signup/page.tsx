'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.replace('/dashboard');
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      setErrorMsg(error.message);
    }
  };

  const handleMobileSignUp = () => {
    router.push('/signup/mobile');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1D3A] px-4">
      <div className="bg-[#102A54] p-10 rounded-2xl shadow-lg w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <Image src="/logo_no_black.png" alt="StackShop Logo" width={80} height={80} />
          <h2 className="text-2xl font-semibold text-white mt-4">Create your StackShop Account</h2>
          <p className="text-gray-400 text-sm mt-1">Get started for free</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-[#0B1D3A] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-[#0B1D3A] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-gray-600 w-1/5 lg:w-1/4"></span>
          <span className="text-gray-400 text-xs">or sign up with</span>
          <span className="border-b border-gray-600 w-1/5 lg:w-1/4"></span>
        </div>

        <button
          onClick={handleMobileSignUp}
          className="mt-4 w-full flex items-center justify-center gap-3 py-3 bg-[#0B1D3A] border border-gray-600 text-gray-100 rounded-lg font-semibold hover:bg-[#123366] transition"
        >
          Sign up with Mobile Number
        </button>

        <button
          onClick={handleGoogleSignUp}
          className="mt-3 w-full flex items-center justify-center gap-3 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          <Image src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" width={20} height={20} />
          Sign up with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Log in</a>
        </p>

      </div>
    </div>
  );
}
