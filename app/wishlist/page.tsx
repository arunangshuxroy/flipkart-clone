"use client";

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

function formatINR(amount: number): string {
  return '₹' + Math.round(amount * 83).toLocaleString('en-IN');
}

export default function WishlistPage() {
  const { wishlistItems, loading, toggleWishlist } = useWishlist() as any;

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Wishlist...</div>;

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white p-12 shadow-sm border border-gray-100 rounded-sm text-center max-w-5xl mx-auto">
        <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center text-8xl grayscale opacity-50">
          ❤️
        </div>
        <h2 className="text-xl font-medium mb-2 opacity-80">Empty Wishlist</h2>
        <p className="text-gray-500 mb-8">You have no items in your wishlist. Start adding!</p>
        <Link href="/">
          <button className="bg-[#2874f0] text-white px-12 py-3 shadow-md rounded-sm font-medium">
            Go To Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">My Wishlist ({wishlistItems.length})</h1>
      </div>

      <div className="divide-y divide-gray-100">
        {wishlistItems.map((item: any) => {
          const product = item.products;
          const image = product.product_images?.[0]?.image_url || 'https://via.placeholder.com/150';
          
          return (
            <div key={item.id} className="p-6 flex gap-6 hover:bg-gray-50 transition items-center">
              <Link href={`/product/${product.id}`} className="h-20 w-20 shrink-0 flex items-center justify-center">
                <img src={image} className="max-h-full max-w-full object-contain" alt={product.name} />
              </Link>

              <div className="flex-1">
                <Link href={`/product/${product.id}`} className="hover:text-[#2874f0] font-medium text-gray-800 line-clamp-1 block mb-1">
                  {product.name}
                </Link>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center">
                    {product.rating || 4.2} <span className="ml-1 text-[9px]">★</span>
                  </span>
                  <span className="text-gray-400">({(product.review_count || 329).toLocaleString()})</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                   <span className="text-lg font-bold">{formatINR(product.price)}</span>
                   <span className="text-gray-400 line-through text-sm">{formatINR(product.price * 1.15)}</span>
                   <span className="text-green-600 font-bold text-xs">15% off</span>
                </div>
              </div>

              <button 
                onClick={() => toggleWishlist(product.id)}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Remove Item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
