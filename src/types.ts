export type ServiceType = 'Wedding' | 'Scene' | 'AI';

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
}

export interface MUA {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedOrders: number;
  styles: string[];
  portfolio: string[];
  bio: string;
  services: Service[];
}

export interface Order {
  id: string;
  muaId: string;
  serviceId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed';
  totalPrice: number;
}
