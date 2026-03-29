import React from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white mt-4 border border-gray-100 rounded-sm shadow-sm">
        <h2 className="text-xl font-medium text-gray-800">No products found</h2>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
