/*
  # Initial Database Schema for Food Delivery App

  ## Overview
  Creates the complete database schema for a food delivery platform connecting stores, customers, and drivers.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, FK to auth.users) - User ID
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `phone` (text) - Contact phone number
  - `role` (enum) - User role: customer, driver, admin
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. stores
  - `id` (uuid, PK) - Store ID
  - `name` (text) - Store name (e.g., Spar, Choppies)
  - `description` (text, nullable) - Store description
  - `logo_url` (text, nullable) - Store logo
  - `address` (text) - Physical address
  - `latitude` (float) - GPS latitude
  - `longitude` (float) - GPS longitude
  - `phone` (text) - Contact number
  - `is_active` (boolean) - Store availability status
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. categories
  - `id` (uuid, PK) - Category ID
  - `name` (text) - Category name (e.g., Dairy, Meat, Vegetables)
  - `description` (text, nullable) - Category description
  - `icon` (text, nullable) - Icon identifier
  - `sort_order` (integer) - Display order

  ### 4. products
  - `id` (uuid, PK) - Product ID
  - `store_id` (uuid, FK) - Reference to store
  - `category_id` (uuid, FK) - Reference to category
  - `name` (text) - Product name
  - `description` (text, nullable) - Product description
  - `price` (decimal) - Product price
  - `image_url` (text, nullable) - Product image
  - `unit` (text) - Unit of measure (kg, litre, piece)
  - `stock_quantity` (integer) - Available quantity
  - `is_available` (boolean) - Availability status
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. orders
  - `id` (uuid, PK) - Order ID
  - `customer_id` (uuid, FK) - Reference to customer profile
  - `driver_id` (uuid, FK, nullable) - Reference to assigned driver
  - `store_id` (uuid, FK) - Reference to store
  - `status` (enum) - Order status: pending, matched, shopping, delivering, delivered, cancelled
  - `subtotal` (decimal) - Items total
  - `delivery_fee` (decimal) - Delivery charge
  - `total` (decimal) - Grand total
  - `delivery_address` (text) - Delivery location
  - `delivery_latitude` (float) - Delivery GPS latitude
  - `delivery_longitude` (float) - Delivery GPS longitude
  - `notes` (text, nullable) - Special instructions
  - `created_at` (timestamptz) - Order creation time
  - `updated_at` (timestamptz) - Last update time

  ### 6. order_items
  - `id` (uuid, PK) - Order item ID
  - `order_id` (uuid, FK) - Reference to order
  - `product_id` (uuid, FK) - Reference to product
  - `quantity` (integer) - Item quantity
  - `price` (decimal) - Price at time of order
  - `subtotal` (decimal) - Line item total

  ### 7. driver_locations
  - `id` (uuid, PK) - Location record ID
  - `driver_id` (uuid, FK) - Reference to driver profile
  - `latitude` (float) - Current latitude
  - `longitude` (float) - Current longitude
  - `is_available` (boolean) - Driver availability
  - `updated_at` (timestamptz) - Last location update

  ### 8. delivery_bids
  - `id` (uuid, PK) - Bid ID
  - `order_id` (uuid, FK) - Reference to order
  - `driver_id` (uuid, FK) - Reference to driver
  - `bid_amount` (decimal) - Proposed delivery fee
  - `status` (enum) - Bid status: pending, accepted, rejected
  - `created_at` (timestamptz) - Bid creation time

  ### 9. messages
  - `id` (uuid, PK) - Message ID
  - `order_id` (uuid, FK) - Reference to order
  - `sender_id` (uuid, FK) - Reference to sender profile
  - `content` (text) - Message content
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz) - Message timestamp

  ## Security
  - Enable RLS on all tables
  - Customers can read their own profiles and update their own data
  - Drivers can read their own profiles and update their location
  - All users can view stores, categories, and products
  - Customers can manage their own orders
  - Drivers can view matched orders and update delivery status
  - Messages are accessible only to order participants
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'driver', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'matched', 'shopping', 'delivering', 'delivered', 'cancelled');
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo_url text,
  address text NOT NULL,
  latitude float NOT NULL,
  longitude float NOT NULL,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active stores"
  ON stores FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  sort_order integer DEFAULT 0
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  unit text DEFAULT 'piece',
  stock_quantity integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  status order_status DEFAULT 'pending',
  subtotal decimal(10,2) NOT NULL,
  delivery_fee decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  delivery_address text NOT NULL,
  delivery_latitude float NOT NULL,
  delivery_longitude float NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

CREATE POLICY "Drivers can view assigned orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = driver_id);

CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Drivers can update assigned orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = driver_id)
  WITH CHECK (auth.uid() = driver_id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items for their orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR orders.driver_id = auth.uid())
    )
  );

CREATE POLICY "Customers can insert items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- Create driver_locations table
CREATE TABLE IF NOT EXISTS driver_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  latitude float NOT NULL,
  longitude float NOT NULL,
  is_available boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available driver locations"
  ON driver_locations FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "Drivers can update own location"
  ON driver_locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = driver_id)
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can insert own location"
  ON driver_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = driver_id);

-- Create delivery_bids table
CREATE TABLE IF NOT EXISTS delivery_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  bid_amount decimal(10,2) NOT NULL,
  status bid_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view bids for own orders"
  ON delivery_bids FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = delivery_bids.order_id
      AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can view own bids"
  ON delivery_bids FOR SELECT
  TO authenticated
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can create bids"
  ON delivery_bids FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = driver_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = messages.order_id
      AND (orders.customer_id = auth.uid() OR orders.driver_id = auth.uid())
    )
  );

CREATE POLICY "Order participants can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = messages.order_id
      AND (orders.customer_id = auth.uid() OR orders.driver_id = auth.uid())
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_order ON messages(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_bids_order ON delivery_bids(order_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_driver ON driver_locations(driver_id);
