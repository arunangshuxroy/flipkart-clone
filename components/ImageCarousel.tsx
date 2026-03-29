"use client";

import React, { useState, useEffect } from 'react';

// Safe SVG placeholder string
const FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f7f7f7"><rect width="400" height="400" fill="%23f7f7f7"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="%23ccc" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';

interface ImageCarouselProps {
  images: { image_url: string; is_primary: boolean }[];
  productName: string;
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
  // Use first image if no primary, or placeholder if empty array
  const defaultImage = images.find(img => img.is_primary)?.image_url 
    || images[0]?.image_url 
    || FALLBACK_SVG;

  const [activeImage, setActiveImage] = useState(defaultImage);
  const [imgError, setImgError] = useState(false);

  // Sync state if props change
  useEffect(() => {
    setActiveImage(defaultImage);
    setImgError(false);
  }, [defaultImage]);

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      // Try picsum seed based on name as first fallback
      const safeName = productName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 10);
      setActiveImage(`https://picsum.photos/seed/${safeName}fallback/500/500`);
    } else {
      // If picsum also fails, use the safe data URI
      setActiveImage(FALLBACK_SVG);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Thumbnail Bar */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] w-20 shrink-0">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            className={`border rounded-sm overflow-hidden p-1 ${activeImage === img.image_url ? 'border-[#2874f0]' : 'border-gray-200'}`}
            onMouseEnter={() => { setActiveImage(img.image_url); setImgError(false); }}
            onClick={() => { setActiveImage(img.image_url); setImgError(false); }}
          >
            <img 
              src={img.image_url} 
              alt={`${productName} thumbnail ${idx}`} 
              className="w-full object-contain aspect-square"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_SVG; }}
            />
          </button>
        ))}
        {images.length === 0 && (
          <div className="border border-gray-200 rounded-sm p-1 w-full aspect-square bg-gray-50 flex items-center justify-center">
             <span className="text-xs text-gray-400">N/A</span>
          </div>
        )}
      </div>

      {/* Main Image View */}
      <div className="flex-1 relative border border-gray-200 rounded-sm p-4 flex items-center justify-center bg-white min-h-[400px]">
        <img 
          src={activeImage} 
          alt={productName} 
          className="max-w-full max-h-[500px] object-contain transition-opacity duration-300" 
          onError={handleError}
        />
      </div>
    </div>
  );
}
