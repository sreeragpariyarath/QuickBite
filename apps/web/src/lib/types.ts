export interface Profile {
  id: string;
  phone: string | null;
  email: string | null;
  isEmailVerified: boolean;
  name: string | null;
  role: 'CUSTOMER' | 'OWNER';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  imageUrl: string | null;
  isActive: boolean;
}

export interface RestaurantDetail extends Restaurant {
  categories: Category[];
  menuItems: MenuItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'PREPARING'
    | 'DELIVERED'
    | 'CANCELLED';
  total: string;
  paymentMethod: 'COD';
  paymentStatus: 'PENDING' | 'PAID';
  createdAt: string;
  items: OrderItem[];
}
