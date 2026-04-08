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
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    ],
    bio: 'Creating timeless, editorial-worthy bridal looks.',
    services: [
      { 
        id: 's3', 
        name: 'Bridal Trial', 
        price: 399, 
        description: 'In-studio consultation and trial.', 
        duration: '2 hrs',
        materialsUsed: 'Charlotte Tilbury, Tom Ford Beauty, Armani Luminous Silk',
        stylingNotes: 'Focus on skin prep and finding the perfect undertone match. Please arrive with a clean, moisturized face.'
      },
    ]
  }
];

export const MOCK_CHECKLIST: ChecklistCategory[] = [
  {
    id: 'c1',
    title: '订婚阶段 (Engagement)',
    tasks: [
      { id: 't1_1', title: '商议聘礼嫁妆', subCategory: '准备事项', completed: true },
      { id: 't1_2', title: '确定时间地点', subCategory: '准备事项', completed: true },
      { id: 't1_3', title: '邀请媒人宾客', subCategory: '准备事项', completed: true },
      { id: 't1_4', title: '男方：彩礼、三金、六样礼', subCategory: '物品清单', completed: true },
      { id: 't1_5', title: '女方：回礼、男方服饰', subCategory: '物品清单', completed: true },
      { id: 't1_6', title: '通用：订婚书、喜糖、布置用品', subCategory: '物品清单', completed: false },
      { id: 't1_7', title: '送聘礼、签婚书', subCategory: '仪式流程', completed: false },
      { id: 't1_8', title: '敬茶改口', subCategory: '仪式流程', completed: false },
      { id: 't1_9', title: '订婚宴致辞', subCategory: '仪式流程', completed: false },
    ]
  },
  {
    id: 'c2',
    title: '婚礼筹备 (Wedding Prep)',
    tasks: [
      { id: 't2_1', title: '婚期与预算', subCategory: '核心确定', completed: false },
      { id: 't2_2', title: '酒店场地', subCategory: '核心确定', completed: false },
      { id: 't2_3', title: '婚礼策划', subCategory: '核心确定', completed: false },
      { id: 't2_4', title: '四大金刚：摄影、摄像、司仪、化妆', subCategory: '核心确定', completed: false },
      { id: 't2_5', title: '婚纱照拍摄', subCategory: '形象准备', completed: false },
      { id: 't2_6', title: '婚纱礼服定制/租赁', subCategory: '形象准备', completed: false },
      { id: 't2_7', title: '新郎西装定制', subCategory: '形象准备', completed: false },
      { id: 't2_8', title: '钻戒对戒购买', subCategory: '形象准备', completed: false },
      { id: 't2_9', title: '拟定名单与请柬', subCategory: '宾客与帮忙', completed: false },
      { id: 't2_10', title: '确定伴郎伴娘', subCategory: '宾客与帮忙', completed: false },
      { id: 't2_11', title: '统筹、礼炮、财务等人员分工', subCategory: '宾客与帮忙', completed: false },
    ]
  },
  {
    id: 'c3',
    title: '婚礼前夕 (Eve of Wedding)',
    tasks: [
      { id: 't3_1', title: '最终流程走位彩排', subCategory: '事项确认', completed: false },
      { id: 't3_2', title: '确认婚车路线', subCategory: '事项确认', completed: false },
      { id: 't3_3', title: '准备誓言与发言稿', subCategory: '事项确认', completed: false },
      { id: 't3_4', title: '美甲、脱毛、皮肤补水', subCategory: '个人护理', completed: false },
      { id: 't3_5', title: '理发、试穿鞋服', subCategory: '个人护理', completed: false },
      { id: 't3_6', title: '换新钞、封红包', subCategory: '物品分装', completed: false },
      { id: 't3_7', title: '准备新娘急救包', subCategory: '物品分装', completed: false },
      { id: 't3_8', title: '装饰婚房、贴囍字', subCategory: '物品分装', completed: false },
    ]
  },
  {
    id: 'c4',
    title: '婚礼当天 (Wedding Day)',
    tasks: [
      { id: 't4_1', title: '新娘化妆、晨袍拍摄', subCategory: '接亲迎亲', completed: false },
      { id: 't4_2', title: '堵门游戏、找婚鞋', subCategory: '接亲迎亲', completed: false },
      { id: 't4_3', title: '敬茶改口、吃饺子汤圆', subCategory: '接亲迎亲', completed: false },
      { id: 't4_4', title: '新人及伴郎伴娘合影', subCategory: '外景与仪式', completed: false },
      { id: 't4_5', title: 'First Look', subCategory: '外景与仪式', completed: false },
      { id: 't4_6', title: '入场、宣誓、交换戒指', subCategory: '外景与仪式', completed: false },
      { id: 't4_7', title: '感恩父母、抛捧花', subCategory: '外景与仪式', completed: false },
      { id: 't4_8', title: '换敬酒服', subCategory: '晚宴敬酒', completed: false },
      { id: 't4_9', title: '轮桌敬酒', subCategory: '晚宴敬酒', completed: false },
      { id: 't4_10', title: '宾客互动游戏', subCategory: '晚宴敬酒', completed: false },
    ]
  },
  {
    id: 'c5',
    title: '后期收尾 (Post-Wedding)',
    tasks: [
      { id: 't5_1', title: '酒店/婚庆尾款', subCategory: '当日结算', completed: false },
      { id: 't5_2', title: '清点物品、饭菜打包', subCategory: '当日结算', completed: false },
      { id: 't5_3', title: '回门宴(婚后3-9天)', subCategory: '婚后事项', completed: false },
      { id: 't5_4', title: '归还礼服', subCategory: '婚后事项', completed: false },
      { id: 't5_5', title: '领取影像资料', subCategory: '婚后事项', completed: false },
      { id: 't5_6', title: '蜜月旅行', subCategory: '婚后事项', completed: false },
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
  },
  {
    id: 'o2',
    muaId: '2',
    muaName: 'Elena Rostova',
    serviceName: 'Bridal Trial',
    date: 'Jan 15, 2026',
    time: '10:00 AM',
    address: 'Elena Studio',
    status: 'completed',
    totalPrice: 399
  }
];
