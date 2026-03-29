# Flipkart Clone

A production-quality full-stack e-commerce application built with Next.js App Router, Tailwind CSS, and a Supabase backend. It closely replicates the UI, layout, and functionality of Flipkart.

## Features

- **Storefront & Product Details**: Categorized product grid, image carousels, and variant displays.
- **Cart & Checkout Engine**: Context-driven cart state with persistency to Supabase database. Smooth Flipkart-like checkout accordion view.
- **Authentication**: Easy integration with Supabase Auth.
- **Order Management**: Order history timeline and user wishlists.
- **Supabase Backend**: Fully relational PostgreSQL structure using row-level security (RLS).
- **Responsive**: Mobile-friendly layout.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide React (Icons)
- **Backend / Services**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context API

## Database Structure

The Supabase PostgreSQL database includes tables for:
- `users` (synced via triggers from `auth.users`)
- `categories`, `products`, `product_images`
- `orders`, `order_items`, `addresses`
- `carts`, `cart_items`, `wishlist`

## Local Setup Instructions

1. **Create a Supabase Project**
   Go to [Supabase](https://supabase.com), create a free project.

2. **Configure Database Schema**
   Go to the **SQL Editor** in your Supabase dashboard.
   Copy the contents of `supabase_schema.sql` (found in the parent folder, or copy it over) and run it. This creates tables, RLS policies, and triggers.

3. **Seed Database**
   Copy the contents of `supabase_seed.sql` and run it in the SQL Editor to populate sample categories, products, and images.

4. **Environment Variables**
   Create a `.env.local` file in the root of the Next.js project:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Storage Bucket Setup**
   In the Supabase dashboard under **Storage**, create a new public bucket named `product-images` if you plan to upload your own photos via the new Image Upload component.

6. **Run Development Server**
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy seamlessly to [Vercel](https://vercel.com/new). Add the Supabase URL and Anon Key to Vercel's Environment Variables during project setup.

---
*Built as a Senior Full-Stack Engineering Assignment.*
