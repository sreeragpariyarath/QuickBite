export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  ownerId: string;
  status: OrderStatus;
  total: string;
  paymentMethod: 'COD';
  paymentStatus: 'PENDING' | 'PAID';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
