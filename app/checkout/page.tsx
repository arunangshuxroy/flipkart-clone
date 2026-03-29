"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { placeOrder } from '@/services/orderService';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, loading, user } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', pincode: '', 
    locality: '', addressLine: '', city: '', state: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!user) return <div className="p-12 text-center">Please log in to checkout.</div>;
  if (cartItems.length === 0) return <div className="p-12 text-center">Your cart is empty.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const order = await placeOrder(user.id, formData, cartItems);
      // Wait a moment for cart context to naturally sync from Supabase if needed,
      // or just redirect since page reload handles it.
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
       console.error("Order placed error:", error);
       alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc: number, item: any) => acc + (item.quantity * item.products.price), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-4 max-w-5xl mx-auto">
      
      {/* Left Column: Form Steps */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Step 1: Login */}
        <div className="bg-white shadow-sm rounded-sm">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <span className="bg-gray-200 text-[#2874f0] font-medium px-2 py-0.5 rounded text-sm">1</span>
              <h2 className="text-gray-500 font-medium uppercase">Login</h2>
              <span className="font-medium text-sm ml-4">{user.email}</span>
            </div>
            <button className="text-[#2874f0] text-sm font-medium">CHANGE</button>
          </div>
        </div>

        {/* Step 2: Delivery Address */}
        <div className="bg-[#2874f0] text-white p-4 shadow-sm rounded-t-sm flex items-center gap-4">
          <span className="bg-white text-[#2874f0] font-medium px-2 py-0.5 rounded text-sm">2</span>
          <h2 className="font-medium uppercase">Delivery Address</h2>
        </div>
        <div className="bg-white p-6 shadow-sm rounded-b-sm border-x border-b border-gray-100">
           
          <form id="address-form" onSubmit={handleSubmit} className="space-y-4 max-w-lg">
             <div className="grid grid-cols-2 gap-4">
                <input required type="text" name="fullName" placeholder="Name" value={formData.fullName} onChange={handleChange} className="border p-3 rounded-sm text-sm focus:outline-blue-500" />
                <input required type="text" name="phone" placeholder="10-digit mobile number" value={formData.phone} onChange={handleChange} className="border p-3 rounded-sm text-sm focus:outline-blue-500" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <input required type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="border p-3 rounded-sm text-sm focus:outline-blue-500" />
                <input required type="text" name="locality" placeholder="Locality" value={formData.locality} onChange={handleChange} className="border p-3 rounded-sm text-sm focus:outline-blue-500" />
             </div>

             <textarea required name="addressLine" placeholder="Address (Area and Street)" value={formData.addressLine} onChange={handleChange} className="w-full border p-3 rounded-sm text-sm h-24 focus:outline-blue-500"></textarea>

             <div className="grid grid-cols-2 gap-4">
                <input required type="text" name="city" placeholder="City/District/Town" value={formData.city} onChange={handleChange} className="border p-3 rounded-sm text-sm focus:outline-blue-500" />
                <input required type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="border p-3 rounded-sm text-sm focus:outline-blue-500" />
             </div>
             
             <div className="pt-4 border-t border-gray-100 mt-6 !mt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#fb641b] text-white px-10 py-3 uppercase font-medium text-sm rounded-sm hover:shadow disabled:opacity-50 transition-shadow w-full sm:w-auto"
                >
                  {isSubmitting ? 'Processing...' : 'Save and Deliver Here'}
                </button>
             </div>
          </form>

        </div>

        {/* Step 3: Order Summary */}
        <div className="bg-white shadow-sm rounded-sm">
          <div className="flex items-center p-4 bg-gray-50 border-b">
            <span className="bg-gray-200 text-[#2874f0] font-medium px-2 py-0.5 rounded text-sm mr-4">3</span>
            <h2 className="text-gray-500 font-medium uppercase">Order Summary ({totalItems} items)</h2>
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
               <span>${totalAmount.toFixed(2)}</span>
             </div>
             <div className="flex justify-between">
               <span>Delivery Charges</span>
               <span className="text-green-600">Free</span>
             </div>
             <div className="flex justify-between font-bold text-lg border-t border-dashed pt-4 mt-2">
               <span>Amount Payable</span>
               <span>${totalAmount.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
