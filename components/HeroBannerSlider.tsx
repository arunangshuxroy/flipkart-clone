"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface BannerNode {
  id: string;
  title: string;
  image_url: string;
  link: string;
}

// Built-in CSS gradient banners that never break
const BUILTIN_BANNERS = [
  {
    id: 'b1',
    title: 'Best of Electronics',
    subtitle: 'Up to 80% Off',
    link: '/?category=electronics',
    gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #3949ab 100%)',
    emoji: '💻',
  },
  {
    id: 'b2',
    title: 'Top Deals on Mobiles',
    subtitle: 'From ₹6,999',
    link: '/?category=mobiles',
    gradient: 'linear-gradient(135deg, #004d40 0%, #00695c 40%, #00897b 100%)',
    emoji: '📱',
  },
  {
    id: 'b3',
    title: 'Fashion Top Brands',
    subtitle: '40-80% Off',
    link: '/?category=fashion',
    gradient: 'linear-gradient(135deg, #b71c1c 0%, #c62828 40%, #e53935 100%)',
    emoji: '👗',
  },
  {
    id: 'b4',
    title: 'Home & Furniture',
    subtitle: 'Starting ₹149',
    link: '/?category=home',
    gradient: 'linear-gradient(135deg, #e65100 0%, #ef6c00 40%, #f57c00 100%)',
    emoji: '🏠',
  },
  {
    id: 'b5',
    title: 'Beauty & Personal Care',
    subtitle: 'Min 30% Off',
    link: '/?category=beauty',
    gradient: 'linear-gradient(135deg, #880e4f 0%, #ad1457 40%, #c2185b 100%)',
    emoji: '💄',
  },
];

export default function HeroBannerSlider({ banners }: { banners?: BannerNode[] }) {
  // Use beautiful built-in CSS gradient banners ALWAYS as requested by user
  return (
    <div className="w-full bg-gray-100 mb-2 mt-2 px-2 md:px-4">
      <div className="shadow-sm rounded overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          className="bg-white"
        >
          {BUILTIN_BANNERS.map((banner) => (
            <SwiperSlide key={banner.id}>
              <a href={banner.link}>
                <div
                  className="w-full flex items-center justify-between px-8 md:px-16 lg:px-24"
                  style={{
                    background: banner.gradient,
                    minHeight: '160px',
                    height: 'clamp(120px, 16.87vw, 270px)',
                  }}
                >
                  <div className="text-white">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
                      {banner.title}
                    </h2>
                    <p className="text-lg md:text-2xl lg:text-3xl font-light opacity-90">
                      {banner.subtitle}
                    </p>
                    <span className="inline-block mt-3 bg-white text-gray-800 text-sm font-semibold px-6 py-2 rounded-sm shadow-md hover:shadow-lg transition-shadow">
                      Shop Now
                    </span>
                  </div>
                  <span className="text-6xl md:text-8xl lg:text-9xl opacity-30 select-none">
                    {banner.emoji}
                  </span>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <BannerStyles />
    </div>
  );
}

function BannerStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      .swiper-button-next, .swiper-button-prev {
        background-color: white;
        width: 35px;
        height: 80px;
        color: #333;
        box-shadow: 0 1px 5px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s;
        border-radius: 0 4px 4px 0;
      }
      .swiper-button-next {
        border-radius: 4px 0 0 4px;
      }
      .swiper:hover .swiper-button-next, .swiper:hover .swiper-button-prev {
        opacity: 1;
      }
      .swiper-button-next:after, .swiper-button-prev:after {
        font-size: 16px;
        font-weight: bold;
      }
      .swiper-pagination-bullet {
        width: 12px;
        height: 12px;
        border-radius: 0;
        background: #fff;
        opacity: 0.6;
      }
      .swiper-pagination-bullet-active {
        background: #fff;
        opacity: 1;
      }
    `}} />
  );
}
