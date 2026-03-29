import { supabase } from '../lib/supabaseClient';

export const placeOrder = async (userId: string, addressDetails: any, cartItems: any[]) => {
  try {
    // 1. Create or ensure Address exists
    // For simplicity, we create a new address record each time, or you could look up by user ID
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .insert([{
        user_id: userId,
        full_name: addressDetails.fullName,
        address_line: addressDetails.addressLine,
        city: addressDetails.city,
        state: addressDetails.state,
        pincode: addressDetails.pincode,
        phone: addressDetails.phone
      }])
      .select('id')
      .single();

    if (addressError) throw addressError;

    // 2. Calculate totals
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.quantity * item.products.price), 0);

    // 3. Create Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        address_id: addressData.id,
        total_amount: totalAmount,
        status: 'pending' // Or 'paid' if we had a payment gateway
      }])
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    const orderItems = cartItems.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 5. Clear Cart (delete items instead of cart)
    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .in('id', cartItems.map(i => i.id));

    if (clearError) throw clearError;

    return orderData;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const getOrderHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, total_amount, status, created_at,
        order_items(quantity, price, products(id, name, product_images(image_url)))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
