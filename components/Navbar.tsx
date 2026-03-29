"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { cartItems, user } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Or router.push('/') if preferred
  };

  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  return (
    <nav className="bg-[#2874f0] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold italic translate-y-1">Flipkart</span>
              <span className="text-xs text-gray-200">
                Explore <span className="text-yellow-400 font-bold">Plus</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on very small screens, shown otherwise */}
          <div className="hidden sm:block flex-1 max-w-2xl px-8">
            <form onSubmit={handleSearch} className="relative shadow-sm rounded-sm overflow-hidden flex">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full py-2 px-4 text-black focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-white px-4 text-[#2874f0] hover:text-blue-700"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 shrink-0">
            {/* Login / Profile */}
            {user ? (
              <div className="group relative">
                <button className="flex items-center space-x-1 hover:text-gray-200 font-medium">
                  <User size={20} />
                  <span>{user.user_metadata?.full_name?.split(' ')[0] || 'Profile'}</span>
                  <ChevronDown size={16} />
                </button>
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-sm overflow-hidden">
                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-100 text-sm">Orders</Link>
                  <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-100 text-sm">Wishlist</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-white text-[#2874f0] px-8 py-1 font-medium rounded-sm shadow-sm hover:bg-gray-100">
                Login
              </Link>
            )}

            {/* Become a Seller */}
            <Link href="/" className="hidden md:block font-medium hover:text-gray-200">
              Become a Seller
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex items-center space-x-1 font-medium hover:text-gray-200">
              <div className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative shadow-sm rounded-sm overflow-hidden flex">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full py-2 px-4 text-black focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-white px-3 text-[#2874f0]">
            <Search size={18} />
          </button>
        </form>
      </div>
    </nav>
  );
}
