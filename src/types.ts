export type ServiceType = 'Wedding' | 'Scene' | 'AI';

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
  materialsUsed?: string;
  stylingNotes?: string;
}

export interface MUA {
  id: string;
  name: string;
  title?: string;
  city?: string;
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
  muaName: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  status: 'upcoming' | 'completed' | 'canceled';
  totalPrice: number;
}

export interface ChecklistTask {
  id: string;
  title: string;
  assignee?: string;
  completed: boolean;
  subCategory?: string;
  isCustom?: boolean;
  isHidden?: boolean;
  deadline?: string;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  tasks: ChecklistTask[];
  isCustom?: boolean;
  isHidden?: boolean;
}

export interface CRMClient {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  tags: string[];
  totalSpent: number;
  noShows: number;
  lastVisit: string;
  notes: string;
  history: { id: string, date: string, service: string, image: string }[];
}

export interface CRMAppointment {
  id: string;
  clientId?: string;
  clientName?: string;
  clientAvatar?: string;
  service?: string;
  price?: number;
  startTime: string;
  endTime: string;
  status: 'booked' | 'blocked' | 'completed' | 'no-show';
  paymentStatus?: 'unpaid' | 'paid';
}
