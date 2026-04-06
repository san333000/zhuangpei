import { MUA, ChecklistCategory, CRMClient, CRMAppointment, Order } from './types';

export const MOCK_MUAS: MUA[] = [
  {
    id: '1',
    name: '妆配meety (遇见妆造)',
    title: 'Master of Radiant Glow',
    city: 'Shanghai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    rating: 4.9,
    completedOrders: 128,
    styles: ['Ethereal Glow', 'Classic Elegance'],
    portfolio: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    ],
    bio: '8 years of bespoke bridal beauty experience.',
    services: [
      { id: 's1', name: 'Full Wedding Day Package', price: 2880, description: 'Includes trial, morning, ceremony, and banquet looks.', duration: '12 hrs' },
    ]
  },
  {
    id: '2',
    name: 'Elena Rostova',
    title: 'Editorial Bridal Expert',
    city: 'Beijing',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    rating: 4.8,
    completedOrders: 95,
    styles: ['Modern Glam', 'Soft Matte'],
    portfolio: [
      'https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=800&q=80',
    ],
    bio: 'Creating timeless, editorial-worthy bridal looks.',
    services: [
      { id: 's3', name: 'Bridal Trial', price: 399, description: 'In-studio consultation and trial.', duration: '2 hrs' },
    ]
  }
];

export const MOCK_CHECKLIST: ChecklistCategory[] = [
  {
    id: 'c1',
    title: '6 Months Before (提前6个月)',
    tasks: [
      { id: 't1', title: 'Determine makeup style & budget (确定妆造风格与预算)', assignee: 'Bride', completed: true },
      { id: 't2', title: 'Research & shortlist Makeup Artists (筛选备选化妆师)', assignee: 'Bride', completed: true },
      { id: 't3', title: 'Book MUA for trial (预约试妆)', assignee: 'Bride', completed: false },
    ]
  },
  {
    id: 'c2',
    title: '3 Months Before (提前3个月)',
    tasks: [
      { id: 't4', title: 'Attend makeup trial (进行试妆)', assignee: 'Bride', completed: false },
      { id: 't5', title: 'Sign contract & pay deposit (签订合同并支付定金)', assignee: 'Bride', completed: false },
      { id: 't6', title: 'Start intensive skincare routine (开始密集护肤)', assignee: 'Bride', completed: false },
    ]
  },
  {
    id: 'c3',
    title: '1 Month Before (提前1个月)',
    tasks: [
      { id: 't7', title: 'Finalize wedding day timeline with MUA (与化妆师确认当天时间表)', assignee: 'Bride', completed: false },
      { id: 't8', title: 'Hair color & trim (染发与修剪)', assignee: 'Bride', completed: false },
      { id: 't9', title: 'Confirm bridesmaid makeup needs (确认伴娘妆造需求)', assignee: 'Bride', completed: false },
    ]
  },
  {
    id: 'c4',
    title: '1 Week Before (提前1周)',
    tasks: [
      { id: 't10', title: 'Confirm final details & location (确认最终细节与地点)', assignee: 'Bride', completed: false },
      { id: 't11', title: 'Prepare emergency touch-up kit (准备补妆急救包)', assignee: 'Maid of Honor', completed: false },
      { id: 't12', title: 'Lash extensions/lift (睫毛嫁接/护理)', assignee: 'Bride', completed: false },
    ]
  },
  {
    id: 'c5',
    title: 'Wedding Day (婚礼当天)',
    tasks: [
      { id: 't13', title: 'Wash hair (no conditioner) (洗头，不使用护发素)', assignee: 'Bride', completed: false },
      { id: 't14', title: 'Wear button-down shirt (穿开衫/纽扣衬衫)', assignee: 'Bride', completed: false },
      { id: 't15', title: 'Prepare payment balance (准备尾款)', assignee: 'Groom', completed: false },
    ]
  }
];

export const MOCK_CLIENTS: CRMClient[] = [
  {
    id: 'client1',
    name: 'Julianne Moore',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    phone: '+1 234 567 890',
    tags: ['VIP', 'Oily Skin'],
    totalSpent: 1200,
    noShows: 0,
    lastVisit: '2 months ago',
    notes: 'Allergic to latex lash glue. Prefers warm earthy eyeshadow tones. Focus on skin prep.',
    history: [
      { id: 'h1', date: 'Oct 12, 2025', service: 'Engagement Shoot', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' }
    ]
  }
];

export const MOCK_APPOINTMENTS: CRMAppointment[] = [
  { id: 'a1', clientId: 'client1', clientName: 'Julianne Moore', clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', service: 'Bridal Trial', price: 399, startTime: '09:00', endTime: '11:00', status: 'booked', paymentStatus: 'unpaid' },
  { id: 'a2', startTime: '12:00', endTime: '13:00', status: 'blocked' },
  { id: 'a3', clientId: 'client2', clientName: 'Sarah Jenkins', clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', service: 'Event Makeup', price: 150, startTime: '14:00', endTime: '15:30', status: 'completed', paymentStatus: 'paid' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    muaId: '1',
    muaName: '妆配meety',
    serviceName: 'Full Wedding Day Package',
    date: 'Oct 12, 2026',
    time: '6:00 AM',
    address: 'Grand Plaza Hotel',
    status: 'upcoming',
    totalPrice: 2880
  }
];
