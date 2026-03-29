"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    discount_percent?: number;
    rating?: number;
    review_count?: number;
    stock: number;
    product_images: { image_url: string; is_primary: boolean }[];
    categories?: { name: string; slug: string };
  };
}

const FALLBACK_SVG = 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/placeholder_fcebae.svg';

function getPicsumUrl(productId: string) {
  // Use a hash of the product id as seed so each product gets a consistent image
  const seed = productId.replace(/-/g, '').slice(-6);
  return 'https://picsum.photos/seed/' + seed + '/400/400';
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount * 83);
}

export default function ProductCard({ product }: ProductCardProps) {
  const initialImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    getPicsumUrl(product.id);

  const [imgSrc, setImgSrc] = useState(initialImage);
  const [triedFallback, setTriedFallback] = useState(false);

  const handleImgError = () => {
    if (!triedFallback) {
      setImgSrc(getPicsumUrl(product.id));
      setTriedFallback(true);
    } else {
      setImgSrc(FALLBACK_SVG);
    }
  };

  return (
    <Link
      href={'/product/' + product.id}
      className="group block bg-white hover:shadow-lg transition-shadow duration-300 rounded-sm overflow-hidden flex flex-col h-full border border-gray-100"
    >
      <div className="relative w-full pt-[100%] bg-white p-4">
        <img
          src={imgSrc}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          onError={handleImgError}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-gray-800 font-medium text-sm line-clamp-2 min-h-[40px] mb-1 group-hover:text-[#2874f0]">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-[#388e3c] text-white text-[11px] font-bold px-1 py-0.5 rounded flex items-center shadow-sm">
            {product.rating || 4.2} <span className="ml-0.5 text-[9px]">★</span>
          </span>
          <span className="text-gray-500 text-xs font-medium">
            ({(product.review_count || 329).toLocaleString('en-IN')})
          </span>
          <img
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
            alt="Plus Assured"
            className="h-4 ml-2"
          />
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-end space-x-2 flex-wrap">
            <span className="text-lg font-medium text-[#212121]">{formatINR(product.price)}</span>
            {(product.original_price || product.price * 1.2) > product.price && (
              <span className="text-sm text-[#878787] line-through mb-0.5">
                {formatINR(product.original_price || product.price * 1.2)}
              </span>
            )}
            {(product.discount_percent || 15) > 0 && (
              <span className="text-sm text-[#388e3c] font-medium mb-0.5">
                {product.discount_percent || 15}% off
              </span>
            )}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-xs text-red-500 mt-1">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-500 font-bold mt-1">Out of stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
