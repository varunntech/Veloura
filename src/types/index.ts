export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: 'men' | 'women';
  subcategory: string;
  sizes: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  tags?: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: string;
  createdAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder?: number;
  expiryDate: string;
}
