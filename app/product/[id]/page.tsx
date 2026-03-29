import { getProductById } from '@/services/productService';
import ImageCarousel from '@/components/ImageCarousel';
import AddToCartButton from '@/components/AddToCartButton';
import { notFound } from 'next/navigation';

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  // Calculate display parameters
  const reviewCount = product.review_count || Math.floor(Math.random() * 5000) + 100;
  const rating = product.rating || 4.2;
  const originalPrice = product.original_price || product.price * 1.15; 
  const savings = originalPrice - product.price;
  const discountPercent = product.discount_percent || Math.round((savings / originalPrice) * 100);

  return (
    <div className="bg-white p-4 shadow-sm border border-gray-100 rounded-sm">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left column - Images & Primary Actions */}
        <div className="w-full md:w-[40%] flex flex-col gap-4">
          <ImageCarousel images={product.product_images || []} productName={product.name} />
          
          <div className="flex gap-2">
             <AddToCartButton product={product} />
          </div>
        </div>

        {/* Right column - Product Details */}
        <div className="flex-1 flex flex-col text-gray-800">
          {/* Breadcrumb / Category */}
          <div className="text-xs text-gray-500 mb-2 cursor-pointer">
             Home &gt; {product.categories?.name} &gt; <span className="text-gray-400">{product.name}</span>
          </div>

          <h1 className="text-xl font-normal text-[#212121] leading-tight mb-2">
            {product.name}
          </h1>

          {/* Ratings */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-[#388e3c] text-white text-[12px] font-bold px-1.5 py-0.5 rounded flex items-center shadow-sm">
              {rating} <span className="ml-1 text-[10px]">★</span>
            </span>
            <span className="text-[#878787] text-sm font-medium">{reviewCount.toLocaleString('en-IN')} Ratings & {Math.floor(reviewCount / 10)} Reviews</span>
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="f-assured" className="h-[21px] ml-2" />
          </div>

          {/* Price Section */}
          <div className="mb-4">
            <div className="text-[#388e3c] font-medium text-sm mb-1">Extra ₹{Math.round(savings * 83).toLocaleString('en-IN')} off</div>
            <div className="flex items-center space-x-3">
              <span className="text-[28px] font-medium text-[#212121]">₹{Math.round(product.price * 83).toLocaleString('en-IN')}</span>
              {originalPrice > product.price && (
                <>
                  <span className="text-[#878787] line-through text-base">₹{Math.round(originalPrice * 83).toLocaleString('en-IN')}</span>
                  <span className="text-[#388e3c] font-medium text-base">{discountPercent}% off</span>
                </>
              )}
            </div>
          </div>

          {/* Offers */}
          <div className="mb-6 mt-4">
            <h3 className="font-medium mb-2 text-[#212121] text-base">Available offers</h3>
            <ul className="text-sm space-y-3 text-[#212121]">
               <li className="flex items-start gap-2">
                 <span className="text-[#388e3c] text-base mt-0.5 shrink-0">🏷️</span>
                 <span><span className="font-semibold">Bank Offer</span> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card T&C</span>
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-[#388e3c] text-base mt-0.5 shrink-0">🏷️</span>
                  <span><span className="font-semibold">Special Price</span> Get extra ₹{Math.round(savings * 83).toLocaleString('en-IN')} off (price inclusive of cashback/coupon) T&C</span>
               </li>
            </ul>
          </div>
          
          {/* Warranty / Delivery Mock Placeholder */}
          <div className="flex border-t border-b border-gray-100 py-4 my-4 mb-6">
            <div className="w-1/3 flex flex-col px-2 items-center text-center border-r">
               <span className="text-xs text-gray-500 mb-1">Delivery by</span>
               <span className="font-medium text-sm">Tomorrow, 10 PM</span>
            </div>
            <div className="w-1/3 flex flex-col px-2 items-center text-center border-r">
               <span className="text-xs text-gray-500 mb-1">Replacement</span>
               <span className="font-medium text-sm">7 Days</span>
            </div>
            <div className="w-1/3 flex flex-col px-2 items-center text-center">
               <span className="text-xs text-gray-500 mb-1">Warranty</span>
               <span className="font-medium text-sm">1 Year</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-sm">
             <div className="p-6">
                <h2 className="text-[20px] font-medium text-[#212121] mb-4">Product Description</h2>
                <p className="text-[#212121] text-sm leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
             </div>
             
             {/* General Specifications Table */}
             <div className="border-t border-gray-200 p-6">
                <h2 className="text-[20px] font-medium text-[#212121] mb-4">Specifications</h2>
                <h3 className="text-md mb-4 pb-2 border-b border-gray-100 text-[#212121]">General</h3>
                
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="mb-2 flex w-full">
                      <td className="w-32 text-[#878787] py-2">In The Box</td>
                      <td className="flex-1 text-[#212121] py-2">1 Unit, Manual, Cable</td>
                    </tr>
                    <tr className="mb-2 flex w-full">
                      <td className="w-32 text-[#878787] py-2">Model Name</td>
                      <td className="flex-1 text-[#212121] py-2">{product.name}</td>
                    </tr>
                    <tr className="mb-2 flex w-full">
                      <td className="w-32 text-[#878787] py-2">Color</td>
                      <td className="flex-1 text-[#212121] py-2">As given in description</td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
