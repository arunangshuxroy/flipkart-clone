"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function WishlistPage() {
  const { user } = useCart();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id, product_id,
          products(id, name, price, product_images(image_url))
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setWishlist(data || []);
    } catch (error) {
       console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const { error } = await supabase.from('wishlist').delete().eq('id', id);
      if (error) throw error;
      setWishlist(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Wishlist...</div>;

  if (!user) {
    return (
      <div className="bg-white p-12 shadow-sm border border-gray-100 rounded-sm text-center">
        <h2 className="text-2xl font-medium mb-4">Please log in to view your Wishlist</h2>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-white p-12 shadow-sm border border-gray-100 rounded-sm text-center">
        <h2 className="text-2xl font-medium mb-4">Empty Wishlist</h2>
        <p className="text-gray-500 mb-8">You have no items in your wishlist. Start adding!</p>
        <Link href="/">
          <button className="bg-[#2874f0] text-white px-12 py-3 shadow-md rounded-sm font-medium">Shop now</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-sm divide-y divide-gray-200">
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-lg font-bold">My Wishlist ({wishlist.length})</h2>
      </div>
      
      {wishlist.map((item) => {
        const product = item.products;
        const image = product.product_images?.[0]?.image_url || 'https://via.placeholder.com/150';

        return (
           <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 relative group">
             {/* Delete Icon */}
             <button 
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
             </button>

             <div className="h-24 w-24 flex items-center justify-center shrink-0">
               <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" />
             </div>
             <div>
               <Link href={`/product/${product.id}`} className="hover:text-[#2874f0] text-lg font-medium">
                 {product.name}
               </Link>
               <div className="flex items-center space-x-2 mt-2">
                 <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
                   4.3 <span className="ml-1 text-[10px]">★</span>
                 </span>
                 <span className="text-gray-500 text-sm">(2,453)</span>
               </div>
               <div className="flex items-center space-x-3 mt-4">
                 <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                 <span className="text-gray-500 line-through text-sm">${(product.price * 1.15).toFixed(2)}</span>
                 <span className="text-green-600 font-bold text-sm">15% off</span>
               </div>
             </div>
           </div>
        );
      })}
    </div>
  );
}
