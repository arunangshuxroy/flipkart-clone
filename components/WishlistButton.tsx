"use client";

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';

export default function WishlistButton({ productId }: { productId: string }) {
  const { toggleWishlist, isInWishlist } = useWishlist() as any;
  const isWishlisted = isInWishlist(productId);

  return (
    <button 
      onClick={() => toggleWishlist(productId)}
      className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 py-4 px-2 font-medium rounded-sm shadow-sm hover:bg-gray-50 hover:border-[#2874f0] hover:text-[#2874f0] transition-all uppercase text-sm sm:text-base h-full w-full"
    >
      <Heart size={20} className="shrink-0" fill={isWishlisted ? "#ff4343" : "none"} color={isWishlisted ? "#ff4343" : "currentColor"} />
      <span className="truncate">{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
    </button>
  );
}
