"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCart(session.user.id);
      } else {
        // Load from local storage for guest users
        const localCart = localStorage.getItem('fk_cart');
        if (localCart) {
          try {
            setCartItems(JSON.parse(localCart));
          } catch(e) {}
        }
        setLoading(false);
      }
    });

    // Listen for changes on auth state (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCart(session.user.id);
      } else {
        // Switch back to local storage on logout
        const localCart = localStorage.getItem('fk_cart');
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCart = async (userId) => {
    try {
      setLoading(true);
      // Try to find the cart for the user
      let { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      let cartId;
      
      if (cartError && cartError.code === 'PGRST116') {
        // No cart found, create one
        const { data: newCart, error: newCartError } = await supabase
          .from('carts')
          .insert([{ user_id: userId }])
          .select('id')
          .single();
          
        if (newCartError) throw newCartError;
        cartId = newCart.id;
      } else if (cartError) {
        throw cartError;
      } else {
        cartId = cartData.id;
      }

      // Fetch cart items securely joined with products
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id, quantity, product_id,
          products ( id, name, price, product_images (image_url) )
        `)
        .eq('cart_id', cartId);

      if (itemsError) throw itemsError;
      
      setCartItems(items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      // GUEST MODE: Add to LocalStorage
      try {
        const { data: product } = await supabase
          .from('products')
          .select('id, name, price, product_images(image_url)')
          .eq('id', productId)
          .single();
          
        if (!product) return;
        
        setCartItems(prev => {
          const existing = prev.find(item => item.products.id === productId);
          let newItems;
          if (existing) {
            newItems = prev.map(item => 
              item.products.id === productId ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            newItems = [...prev, { id: 'local_' + Date.now(), quantity, product_id: productId, products: product }];
          }
          localStorage.setItem('fk_cart', JSON.stringify(newItems));
          return newItems;
        });
      } catch (e) {
        console.error("Local cart error:", e);
      }
      return;
    }
    
    // LOGGED IN MODE: Supabase
    try {
      // First, ensure cart exists
      let { data: cartData } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (!cartData) return;

      // Check if product already in cart
      const existingItem = cartItems.find(item => item.product_id === productId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert([{ 
            cart_id: cartData.id, 
            product_id: productId, 
            quantity 
          }]);
          
        if (error) throw error;
      }
      
      // Refresh cart
      fetchCart(user.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) {
      setCartItems(prev => {
        const newItems = prev.filter(item => item.id !== cartItemId);
        localStorage.setItem('fk_cart', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
        
      if (error) throw error;
      
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    
    if (!user) {
      setCartItems(prev => {
        const newItems = prev.map(item => item.id === cartItemId ? { ...item, quantity } : item);
        localStorage.setItem('fk_cart', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);
        
      if (error) throw error;
      
      setCartItems(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      user, 
      addToCart, 
      removeFromCart, 
      updateQuantity 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
