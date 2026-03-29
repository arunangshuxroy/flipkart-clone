"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
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
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white mb-2 p-4 shadow-sm relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[22px] font-semibold text-gray-900">{title}</h2>
        <button className="bg-[#2874f0] text-white px-5 py-2.5 rounded-sm text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
          VIEW ALL
        </button>
      </div>

      <div className="product-carousel-wrapper">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          navigation
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="pb-2"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-carousel-wrapper .swiper-button-next, 
        .product-carousel-wrapper .swiper-button-prev {
          background-color: white;
          width: 40px;
          height: 100px;
          color: #212121;
          box-shadow: 0 1px 5px 0 rgba(0,0,0,.11);
          top: 45%;
          border-radius: 4px;
        }
        .product-carousel-wrapper .swiper-button-next:after, 
        .product-carousel-wrapper .swiper-button-prev:after {
          font-size: 20px;
        }
        .product-carousel-wrapper .swiper-button-disabled {
          display: none;
        }
      `}} />
    </div>
  );
}
