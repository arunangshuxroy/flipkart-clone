"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useCart();
  const redirectTo = searchParams.get('redirect') || '/';

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Success
        router.push(redirectTo);
        
      } else {
        // Signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        
        if (error) throw error;
        
        // Many times, signup requires email confirmation. If not, it logs in right away.
        alert('Signup successful! (If email confirmation is enabled in your Supabase dash, please check your inbox.)');
        if (!error) setIsLogin(true); // Switch to login just in case
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-md flex w-full max-w-3xl overflow-hidden min-h-[500px]">
        
        {/* Left Side (Flipkart Blue Panel) */}
        <div className="hidden md:flex flex-col w-[40%] bg-[#2874f0] p-8 justify-between">
          <div>
            <h1 className="text-white text-3xl font-medium mb-4">
              {isLogin ? 'Login' : 'Looks like you\'re new here!'}
            </h1>
            <p className="text-gray-200 text-lg leading-relaxed">
              {isLogin 
                ? 'Get access to your Orders, Wishlist and Recommendations' 
                : 'Sign up with your email to get started'}
            </p>
          </div>
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
            alt="Login Illustration" 
            className="w-full object-contain"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col pt-8">
            
            {!isLogin && (
              <div className="relative mb-8">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#2874f0] transition-colors peer bg-transparent"
                  placeholder=" "
                />
                <label className="absolute left-0 top-2 text-gray-500 transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                  Full Name
                </label>
              </div>
            )}

            <div className="relative mb-8">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#2874f0] transition-colors peer bg-transparent"
                placeholder=" "
              />
              <label className="absolute left-0 top-2 text-gray-500 transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                Enter Email Address
              </label>
            </div>

            <div className="relative mb-8">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#2874f0] transition-colors peer bg-transparent"
                placeholder=" "
              />
              <label className="absolute left-0 top-2 text-gray-500 transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                Enter Password
              </label>
            </div>
            
            {error && (
              <div className="text-red-500 text-xs mb-4">
                {error}
              </div>
            )}

            <p className="text-xs text-gray-500 mb-6 font-medium">
              By continuing, you agree to Flipkart's <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
            </p>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-medium shadow transition-shadow hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Continue')}
            </button>
            
            <div className="mt-auto pt-16 text-center">
              <button 
                type="button" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-[#2874f0] font-medium text-sm hover:underline"
              >
                {isLogin ? 'New to Flipkart? Create an account' : 'Existing User? Log in'}
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
