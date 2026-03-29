"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white p-8 mt-4 shadow-sm border border-gray-100 rounded-sm">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-medium text-gray-800 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-8">
        Your order <span className="font-bold text-gray-700">#{orderId?.substring(0, 8).toUpperCase() || 'AWAITING'}</span> has been placed.
      </p>
      
      <div className="flex space-x-4">
        <Link href="/orders">
          <button className="bg-[#2874f0] text-white px-8 py-3 font-medium rounded-sm shadow hover:bg-blue-700 transition">
            TRACK ORDER
          </button>
        </Link>
        <Link href="/">
          <button className="bg-white text-[#2874f0] border border-[#2874f0] px-8 py-3 font-medium rounded-sm shadow hover:bg-gray-50 transition">
            CONTINUE SHOPPING
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading Success Details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
