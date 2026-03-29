import { getProducts, getCategories, getBanners } from '@/services/productService';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import CategoryIconsRow from '@/components/CategoryIconsRow';
import HeroBannerSlider from '@/components/HeroBannerSlider';
import ProductCarousel from '@/components/ProductCarousel';

// Mark as dynamic since we rely on searchParams
export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const categorySlug = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  // Fetch concurrent data
  const [products, categories, banners] = await Promise.all([
    getProducts(categorySlug, searchQuery),
    getCategories(),
    getBanners()
  ]);

  const isHome = !categorySlug && !searchQuery;

  if (isHome) {
    // Group products for home page carousels by category slug
    const getBySlug = (slug: string) => products.filter((p: any) => p.categories?.slug === slug);
    
    const mobiles = getBySlug('mobiles');
    const electronics = getBySlug('electronics');
    const fashion = getBySlug('fashion');
    const home = getBySlug('home');
    const furniture = getBySlug('furniture');
    const appliances = getBySlug('appliances');
    const beauty = getBySlug('beauty');
    const toys = getBySlug('toys');
    const books = getBySlug('books');
    const sports = getBySlug('sports');
    
    // Combine home + furniture for a bigger shelf
    const homeAndFurniture = [...home, ...furniture];
    
    // Sort deals by highest discount
    const dealsOfTheDay = [...products].sort((a: any, b: any) => (b.discount_percent || 0) - (a.discount_percent || 0)).slice(0, 15);

    return (
      <div className="flex flex-col w-full bg-[#f1f3f6]">
        <CategoryIconsRow categories={categories} />
        <HeroBannerSlider banners={banners} />
        
        <div className="px-2 md:px-4 flex flex-col gap-2 pb-8">
          <ProductCarousel title="Best of Electronics" products={electronics} />
          <ProductCarousel title="Top Deals on Mobiles" products={mobiles} />
          
          <div className="w-full flex gap-2">
             <div className="flex-1 min-w-0">
               <ProductCarousel title="Deals of the Day" products={dealsOfTheDay} />
             </div>
          </div>

          <ProductCarousel title="Fashion Top Brands" products={fashion} />
          <ProductCarousel title="Home & Furniture" products={homeAndFurniture} />
          <ProductCarousel title="Appliances Store" products={appliances} />
          <ProductCarousel title="Beauty & Personal Care" products={beauty} />
          {toys.length > 0 && <ProductCarousel title="Toys & Baby Products" products={toys} />}
          {books.length > 0 && <ProductCarousel title="Books & Stationery" products={books} />}
          {sports.length > 0 && <ProductCarousel title="Sports & Fitness" products={sports} />}
        </div>
      </div>
    );
  }

  // SEARCH OR CATEGORY RESULT PAGE
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-2 px-2 md:px-4 pb-8 bg-[#f1f3f6] min-h-screen pt-4">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-64 shrink-0 bg-white shadow-sm border border-gray-100 rounded-sm self-start">
        <h2 className="text-lg font-bold border-b p-4">Filters</h2>
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className={`text-sm ${!categorySlug ? 'font-bold text-[#2874f0]' : 'text-gray-700 hover:text-gray-900'}`}>
                All Products
              </Link>
            </li>
            {categories.map((cat: any) => (
              <li key={cat.id}>
                <Link 
                  href={'/?category=' + cat.slug}
                  className={`text-sm ${categorySlug === cat.slug ? 'font-bold text-[#2874f0]' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-white shadow-sm rounded-sm p-4">
        {/* Breadcrumb / Title area */}
        <div className="pb-4 border-b mb-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-gray-500 mb-2">
                Home {categorySlug && ` > ${categorySlug}`}
              </div>
              <h1 className="text-xl font-medium text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : categorySlug ? `Category: ${categorySlug.replace('-', ' ')}` : 'All Products'}
                <span className="text-gray-400 text-sm font-normal ml-2">(Showing {products?.length || 0} products)</span>
              </h1>
            </div>
          </div>
        </div>

        {/* The Grid Component */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
