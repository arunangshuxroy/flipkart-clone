"use client";

import React from 'react';
import Link from 'next/link';

interface CategoryNode {
  name: string;
  slug: string;
  image_url: string;
}

// Emoji-based category icons that never break
const CATEGORY_EMOJIS: Record<string, string> = {
  mobiles: '📱',
  electronics: '💻',
  fashion: '👗',
  home: '🏠',
  appliances: '🔌',
  beauty: '💄',
  toys: '🧸',
  furniture: '🪑',
  books: '📚',
  sports: '⚽',
  automotive: '🚗',
  grocery: '🛒',
};

function CategoryIcon({ name, emoji }: { name: string; emoji: string }) {
  return (
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:shadow-md transition-shadow text-3xl">
      {emoji}
    </div>
  );
}

export default function CategoryIconsRow({ categories }: { categories: CategoryNode[] }) {
  const displayCats = categories.slice(0, 9);

  return (
    <div className="bg-white shadow-sm border border-gray-100 mb-2 overflow-x-auto hide-scrollbar">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between min-w-max md:min-w-0">
        <button onClick={() => alert('Top Offers section is coming soon!')} className="flex flex-col items-center gap-1 group w-20 md:w-24 shrink-0 transition-transform hover:-translate-y-1">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-50 to-orange-50 group-hover:shadow-md transition-shadow text-3xl">
            🎁
          </div>
          <span className="text-sm font-medium text-gray-800 text-center leading-tight">Top Offers</span>
        </button>

        {displayCats.map((cat, i) => (
          <Link key={i} href={'/?category=' + cat.slug} className="flex flex-col items-center gap-1 group w-20 md:w-24 shrink-0 transition-transform hover:-translate-y-1">
             <CategoryIcon name={cat.name} emoji={CATEGORY_EMOJIS[cat.slug] || '📦'} />
             <span className="text-sm font-medium text-gray-800 text-center leading-tight">{cat.name}</span>
          </Link>
        ))}
        
        {/* Travel placeholder */}
        <button onClick={() => alert('Flights and Travel are coming soon!')} className="flex flex-col items-center gap-1 group w-20 md:w-24 shrink-0 transition-transform hover:-translate-y-1">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-50 to-cyan-50 group-hover:shadow-md transition-shadow text-3xl">
            ✈️
          </div>
          <span className="text-sm font-medium text-gray-800 text-center leading-tight">Travel</span>
        </button>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
