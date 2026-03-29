"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

function formatINR(amount: number): string {
  return '₹' + Math.round(amount * 83).toLocaleString('en-IN');
}

export default function CartPage() {
  const { cartItems, loading, removeFromCart, updateQuantity } = useCart();

  if (loading) {
    return <div className="text-center p-12">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white p-12 shadow-sm border border-gray-100 rounded-sm text-center">
        <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center text-8xl">
          🛒
        </div>
        <h2 className="text-2xl font-medium mb-4">Your cart is empty!</h2>
        <p className="text-gray-500 mb-8">Add items to it now.</p>
        <Link href="/">
          <button className="bg-[#2874f0] text-white px-12 py-3 shadow-md rounded-sm font-medium">
            Shop now
          </button>
        </Link>
      </div>
    );
  }

  // Calculate totals
  const totalItems = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc: number, item: any) => acc + (item.quantity * item.products.price), 0);
  const originalAmount = totalAmount * 1.15; // Simulated discount
  const discount = originalAmount - totalAmount;
  const deliveryCharges = totalAmount > 500 ? 0 : 40;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      
      {/* Left Column: Cart Items */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm border border-gray-100 rounded-sm">
          <h2 className="text-lg font-bold">Flipkart ({totalItems})</h2>
        </div>

        {/* Items List */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-sm divide-y divide-gray-200">
          {cartItems.map((item: any) => {
            const product = item.products;
            const image = product.product_images?.[0]?.image_url || 'https://picsum.photos/seed/cart/150/150';

            return (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                
                {/* Image & Qty controllers */}
                <div className="flex flex-col items-center gap-4 w-32 shrink-0">
                   <div className="h-24 flex items-center justify-center relative w-full">
                     <img src={image} className="max-h-full max-w-full object-contain" alt={product.name} />
                   </div>
                   
                   <div className="flex items-center space-x-2 w-full justify-center">
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity - 1)}
                       className="w-8 h-8 rounded-full border border-gray-300 font-bold hover:bg-gray-100 disabled:opacity-50"
                       disabled={item.quantity <= 1}
                     >
                       -
                     </button>
                     <span className="w-12 text-center border px-2 py-1">{item.quantity}</span>
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity + 1)}
                       className="w-8 h-8 rounded-full border border-gray-300 font-bold hover:bg-gray-100"
                     >
                       +
                     </button>
                   </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={'/product/' + product.id} className="hover:text-[#2874f0] text-lg font-medium leading-tight line-clamp-2">
                       {product.name}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">Seller: AppRetail</p>
                    
                    <div className="flex items-center space-x-3 mt-3">
                      <span className="text-gray-500 line-through text-sm">{formatINR(product.price * 1.15)}</span>
                      <span className="text-2xl font-bold">{formatINR(product.price)}</span>
                      <span className="text-green-600 font-bold text-sm">15% off</span>
                    </div>
                  </div>

                  <div className="flex space-x-6 mt-6 font-medium uppercase text-sm">
                     <button className="hover:text-[#2874f0]" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Order Placement button row */}
          <div className="p-4 flex justify-end shadow-[0_-2px_10px_-5px_rgba(0,0,0,0.2)] bg-white sticky bottom-0 z-10">
            <Link href="/checkout">
              <button className="bg-[#fb641b] text-white px-16 py-4 font-medium rounded-sm shadow-md hover:bg-[#e05615] transition-colors">
                 PLACE ORDER
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Price Details */}
      <div className="w-full lg:w-80 shrink-0 self-start">
        <div className="bg-white shadow-sm border border-gray-100 rounded-sm">
          <h2 className="text-gray-500 font-bold uppercase p-4 border-b">Price Details</h2>
          
          <div className="p-4 space-y-4">
             <div className="flex justify-between">
               <span>Price ({totalItems} items)</span>
               <span>{formatINR(originalAmount)}</span>
             </div>
             
             <div className="flex justify-between">
               <span>Discount</span>
               <span className="text-green-600">-{formatINR(discount)}</span>
             </div>
             
             <div className="flex justify-between">
               <span>Delivery Charges</span>
               <span className={deliveryCharges === 0 ? "text-green-600" : ""}>
                 {deliveryCharges === 0 ? "Free" : formatINR(deliveryCharges)}
               </span>
             </div>
             
             <div className="flex justify-between font-bold text-lg border-t border-dashed pt-4 mt-2">
               <span>Total Amount</span>
               <span>{formatINR(totalAmount + deliveryCharges)}</span>
             </div>
             
             <div className="text-green-600 font-medium text-sm pt-2">
               You will save {formatINR(discount)} on this order
             </div>
          </div>
        </div>
        
        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center p-4 text-gray-400 text-sm font-medium gap-2">
          <span>Safe and Secure Payments</span>
        </div>
      </div>

    </div>
  );
}
