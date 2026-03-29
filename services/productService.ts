import { supabase } from '../lib/supabaseClient';

export const getProducts = async (categorySlug?: string, searchQuery?: string) => {
  try {
    let query = supabase
      .from('products')
      .select(`
        id, name, description, price, original_price, discount_percent, rating, review_count, stock,
        categories!inner(id, name, slug),
        product_images(image_url, is_primary)
      `);

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug);
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, description, price, original_price, discount_percent, rating, review_count, stock,
        categories(id, name, slug),
        product_images(image_url, is_primary)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getBanners = async () => {
  try {
    const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};
