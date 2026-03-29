"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { getOrderHistory } from '@/services/orderService';
import Link from 'next/link';

function formatINR(amount: number): string {
  return '₹' + Math.round(amount * 83).toLocaleString('en-IN');
}

export default function OrdersPage() {
  const { user } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      if (user) {
        const data = await getOrderHistory(user.id);
        setOrders(data || []);
      }
    } catch (error) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user, loadOrders]);

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Orders...</div>;

  if (!user) {
    return (
      <div className="bg-white p-12 shadow-sm border border-gray-100 rounded-sm text-center">
         <h2 className="text-2xl font-medium mb-4">Please log in to view your Orders</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 shadow-sm border border-gray-100 rounded-sm text-center">
         <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/empty-orders_e98f8c.png" 
            alt="Empty Orders" 
            className="w-64 mx-auto mb-6 opacity-80" 
         />
         <h2 className="text-2xl font-medium mb-4">No active orders found!</h2>
         <p className="text-gray-500 mb-8">Looks like you haven't placed an order yet.</p>
         <Link href="/">
           <button className="bg-[#2874f0] text-white px-12 py-3 shadow-md rounded-sm font-medium">Shop now</button>
         </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Title */}
      <div className="bg-white p-4 shadow-sm border border-gray-100 rounded-sm">
         <h2 className="text-lg font-bold">My Orders</h2>
      </div>

      {orders.map((order) => (
         <div key={order.id} className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center text-sm">
               <div>
                  <span className="text-gray-500 uppercase font-medium">Order Placed</span>
                  <div className="text-gray-800 font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
               </div>
               <div>
                  <span className="text-gray-500 uppercase font-medium">Total</span>
                  <div className="text-gray-800 font-medium">{formatINR(order.total_amount)}</div>
               </div>
               <div>
                 <span className="text-gray-500 uppercase font-medium">Order ID</span>
                 <div className="text-gray-800 font-medium">{order.id.split('-')[0].toUpperCase()}</div>
               </div>
            </div>

            <div className="divide-y divide-gray-100">
               {order.order_items.map((item: any, idx: number) => {
                 const product = item.products;
                 const image = product.product_images?.[0]?.image_url || 'https://via.placeholder.com/150';
                 return (
                   <div key={idx} className="p-4 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition cursor-pointer">
                      <div className="h-16 w-16 shrink-0 flex items-center justify-center">
                        <img src={image} className="max-h-full max-w-full object-contain" alt={product.name} />
                      </div>
                      
                      <div className="flex-1">
                        <Link href={`/product/${product.id}`} className="hover:text-[#2874f0] font-medium text-gray-800 line-clamp-1">
                           {product.name}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">Qty: {item.quantity} x {formatINR(item.price)}</div>
                      </div>

                      <div className="w-1/4 shrink-0 font-medium flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0"></div>
                        <span className="text-gray-900 capitalize">{order.status}</span>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      ))}
    </div>
  );
}
