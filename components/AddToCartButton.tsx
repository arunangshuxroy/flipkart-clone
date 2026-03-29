"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart, cartItems } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  const handleBuyNow = () => {
    addToCart(product.id, 1);
    router.push('/cart');
  };

  // Check if item is already in cart
  const inCart = cartItems.find((item: any) => item.product_id === product.id);

  if (product.stock === 0) {
    return (
      <div className="flex gap-4 w-full md:w-auto font-medium">
        <div className="py-4 px-8 text-xl text-gray-400 bg-gray-100 uppercase rounded-sm cursor-not-allowed text-center w-full">
          Out of Stock
        </div>
      </div>
    );
  }

  return (
    <>
      {inCart ? (
        <button 
          onClick={() => router.push('/cart')}
          className="flex-1 py-4 px-2 bg-[#ff9f00] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 rounded-sm shadow hover:bg-[#e68e00] transition-colors"
        >
          <ShoppingCart size={20} />
          GO TO CART
        </button>
      ) : (
        <button 
          onClick={handleAddToCart}
          className="flex-1 py-4 px-2 bg-[#ff9f00] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 rounded-sm shadow hover:bg-[#e68e00] transition-colors"
        >
          <ShoppingCart size={20} />
          ADD TO CART
        </button>
      )}

      <button 
        onClick={handleBuyNow}
        className="flex-1 py-4 px-2 bg-[#fb641b] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 rounded-sm shadow hover:bg-[#e05615] transition-colors"
      >
        <Zap size={20} fill="currentColor" />
        BUY NOW
      </button>
    </>
  );
}
