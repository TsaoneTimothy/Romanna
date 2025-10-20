export type UserRole = 'customer' | 'driver' | 'admin';
export type OrderStatus = 'pending' | 'matched' | 'shopping' | 'delivering' | 'delivered' | 'cancelled';
export type BidStatus = 'pending' | 'accepted' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
}

export interface Product {
  id: string;
  store_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  unit: string;
  stock_quantity: number;
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  driver_id?: string;
  store_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: Product;
}

export interface DriverLocation {
  id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  is_available: boolean;
  updated_at: string;
}

export interface DeliveryBid {
  id: string;
  order_id: string;
  driver_id: string;
  bid_amount: number;
  status: BidStatus;
  created_at: string;
  driver?: Profile;
}

export interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
