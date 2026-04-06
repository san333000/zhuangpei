import { MUA } from './types';

export const MOCK_MUAS: MUA[] = [
  {
    id: '1',
    name: '林悦 (悦己妆造)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    rating: 4.9,
    completedOrders: 128,
    styles: ['中式秀禾', '韩式简约', '法式浪漫'],
    portfolio: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    ],
    bio: '8年专业跟妆经验，擅长根据新娘气质定制妆容。',
    services: [
      { id: 's1', name: '全天婚礼跟妆', price: 2880, description: '包含晨间妆、仪式妆、晚宴妆及3套造型', duration: '12小时' },
      { id: 's2', name: '半天婚礼跟妆', price: 1680, description: '包含晨间妆及仪式妆', duration: '6小时' },
    ]
  },
  {
    id: '2',
    name: '陈思思 (Sisi Studio)',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    rating: 4.8,
    completedOrders: 95,
    styles: ['欧美大金', '日系甜美', '复古港风'],
    portfolio: [
      'https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=800&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80',
    ],
    bio: '追求自然通透的底妆，让每一位新娘都闪耀独特光芒。',
    services: [
      { id: 's3', name: '轻场景妆 (约会/派对)', price: 399, description: '适合日常重要场合', duration: '1.5小时' },
      { id: 's4', name: '全天婚礼跟妆', price: 3200, description: '高端定制，全程陪同', duration: '12小时' },
    ]
  },
  {
    id: '3',
    name: '王小雅',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 4.7,
    completedOrders: 210,
    styles: ['森系小清新', '泰式妆容'],
    portfolio: [
      'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80',
    ],
    bio: '专注森系婚礼，为您打造呼吸感十足的绝美妆造。',
    services: [
      { id: 's5', name: '全天婚礼跟妆', price: 1980, description: '高性价比之选', duration: '10小时' },
    ]
  }
];
