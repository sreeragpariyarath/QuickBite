export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  restaurantId: string;
  categoryId: string | null;
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
  menuItems: MenuItem[];
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  imageUrl: string | null;
  isActive: boolean;
  cuisines: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantDetail extends Restaurant {
  categories: Category[];
  menuItems: MenuItem[];
}
