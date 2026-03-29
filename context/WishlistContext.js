"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const WishlistContext = createContext({});

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWishlist(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWishlist(session.user.id);
      } else {
        setWishlistItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchWishlist = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id, product_id,
          products (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please login to add items to wishlist!");
      return;
    }

    const existingItem = wishlistItems.find(item => item.product_id === productId);

    try {
      if (existingItem) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('id', existingItem.id);

        if (error) throw error;
        setWishlistItems(prev => prev.filter(item => item.id !== existingItem.id));
      } else {
        // Add to wishlist
        const { data, error } = await supabase
          .from('wishlist')
          .insert([{ user_id: user.id, product_id: productId }])
          .select(`
            id, product_id,
            products (*)
          `)
          .single();

        if (error) throw error;
        setWishlistItems(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      loading, 
      toggleWishlist, 
      isInWishlist,
      refreshWishlist: () => user && fetchWishlist(user.id)
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
