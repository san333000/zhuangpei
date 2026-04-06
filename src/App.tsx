/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Search, 
  Sparkles, 
  User, 
  ChevronLeft, 
  Star, 
  Calendar, 
  CheckCircle2, 
  Camera,
  Heart,
  Share2,
  ArrowRight
} from 'lucide-react';
import { cn } from './lib/utils';
import { MOCK_MUAS } from './constants';
import { MUA, Service } from './types';

// --- Components ---

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: HomeIcon, label: '发现' },
    { path: '/muas', icon: Search, label: '找化妆师' },
    { path: '/ai-match', icon: Sparkles, label: 'AI 试妆' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors duration-200",
              isActive ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const Header = ({ title, showBack = false }: { title: string, showBack?: boolean }) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-4 py-4 flex items-center justify-between border-b border-gray-50 max-w-md mx-auto">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-600">
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        <Share2 size={20} />
      </div>
    </header>
  );
};

// --- Screens ---

const HomeScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pb-24"
    >
      <Header title="妆配 Zhuangpei" />
      
      {/* Hero Section */}
      <section className="px-4 py-6">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl shadow-rose-100/50">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" 
            alt="Wedding Makeup" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
            <h2 className="text-white text-2xl font-bold leading-tight">遇见最美的新娘妆</h2>
            <p className="text-white/80 text-sm mt-1">本地专业跟妆，AI 智能匹配</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-4 grid grid-cols-4 gap-4">
        {[
          { label: '婚礼跟妆', icon: '👰', color: 'bg-rose-50' },
          { label: '轻场景妆', icon: '✨', color: 'bg-amber-50' },
          { label: 'AI 试妆', icon: '🤖', color: 'bg-indigo-50' },
          { label: '优惠券', icon: '🎫', color: 'bg-emerald-50' },
        ].map((cat) => (
          <div key={cat.label} className="flex flex-col items-center gap-2">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm", cat.color)}>
              {cat.icon}
            </div>
            <span className="text-xs font-medium text-gray-600">{cat.label}</span>
          </div>
        ))}
      </section>

      {/* Featured MUAs */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">精选化妆师</h3>
          <Link to="/muas" className="text-rose-500 text-sm font-medium flex items-center gap-1">
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {MOCK_MUAS.map((mua) => (
            <Link key={mua.id} to={`/mua/${mua.id}`} className="flex-shrink-0 w-64">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={mua.portfolio[0]} 
                  alt={mua.name} 
                  className="w-full h-40 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">{mua.name}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">{mua.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mua.styles.slice(0, 2).map(style => (
                      <span key={style} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-full">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Promo */}
      <section className="px-4 py-2">
        <div className="bg-indigo-600 rounded-3xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-white text-xl font-bold mb-2">AI 智能测脸</h3>
            <p className="text-indigo-100 text-sm mb-4">上传照片，AI 为您推荐最适合的妆容风格</p>
            <Link to="/ai-match" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-bold">
              立即体验 <Sparkles size={16} />
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        </div>
      </section>
    </motion.div>
  );
};

const MUAListScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      <Header title="找化妆师" />
      <div className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        {['综合', '销量', '评分', '价格'].map((filter) => (
          <button key={filter} className="px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 whitespace-nowrap">
            {filter}
          </button>
        ))}
      </div>
      <div className="px-4 space-y-4">
        {MOCK_MUAS.map((mua) => (
          <Link key={mua.id} to={`/mua/${mua.id}`} className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <img 
              src={mua.avatar} 
              alt={mua.name} 
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-900 truncate">{mua.name}</h4>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold">{mua.rating}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2 line-clamp-1">{mua.bio}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                <span>已接 {mua.completedOrders} 单</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                <span>{mua.styles[0]}等</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

const MUADetailScreen = () => {
  const { id } = useParams();
  const mua = MOCK_MUAS.find(m => m.id === id);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'services'>('portfolio');

  if (!mua) return <div>MUA not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-24"
    >
      <Header title="化妆师详情" showBack />
      
      {/* Profile Header */}
      <div className="px-4 py-6 flex flex-col items-center text-center">
        <img 
          src={mua.avatar} 
          alt={mua.name} 
          className="w-24 h-24 rounded-full border-4 border-rose-50 shadow-lg mb-4"
          referrerPolicy="no-referrer"
        />
        <h2 className="text-xl font-bold text-gray-900 mb-1">{mua.name}</h2>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold">{mua.rating}</span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">已接 {mua.completedOrders} 单</span>
        </div>
        <p className="text-sm text-gray-600 max-w-xs">{mua.bio}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={cn(
            "flex-1 py-3 text-sm font-bold transition-colors",
            activeTab === 'portfolio' ? "text-rose-500 border-b-2 border-rose-500" : "text-gray-400"
          )}
        >
          作品集
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={cn(
            "flex-1 py-3 text-sm font-bold transition-colors",
            activeTab === 'services' ? "text-rose-500 border-b-2 border-rose-500" : "text-gray-400"
          )}
        >
          服务套餐
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'portfolio' ? (
          <div className="grid grid-cols-2 gap-3">
            {mua.portfolio.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="Portfolio" 
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-sm"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mua.services.map((service) => (
              <div key={service.id} className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900">{service.name}</h4>
                  <span className="text-rose-500 font-bold">¥{service.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar size={12} /> 时长: {service.duration}
                  </span>
                  <button className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-rose-100">
                    立即预约
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AIMatcherScreen = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | { style: string, reason: string }>(null);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        style: '法式复古浪漫妆',
        reason: '根据您的面部轮廓与五官比例，柔和的红唇与微醺腮红能完美衬托您的优雅气质。'
      });
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      <Header title="AI 智能试妆" />
      <div className="p-6">
        {!result ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-full aspect-square bg-gray-50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 mb-8 relative overflow-hidden">
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                  />
                  <p className="text-indigo-600 font-bold animate-pulse">AI 正在深度分析中...</p>
                  <motion.div 
                    className="absolute inset-0 bg-indigo-500/10"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              ) : (
                <>
                  <Camera size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium px-10">上传正面清晰照片，AI 为您定制专属妆容</p>
                </>
              )}
            </div>
            <button 
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-indigo-600 text-white py-4 rounded-3xl font-bold shadow-xl shadow-indigo-100 disabled:opacity-50"
            >
              {isAnalyzing ? '分析中...' : '开始 AI 测脸'}
            </button>
            <p className="mt-4 text-[10px] text-gray-400">AI 负责提效，人工负责把关</p>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <Sparkles size={20} />
              <span className="font-bold">分析结果</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{result.style}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{result.reason}</p>
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">推荐化妆师</p>
              {MOCK_MUAS.slice(0, 1).map(mua => (
                <Link key={mua.id} to={`/mua/${mua.id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <img src={mua.avatar} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{mua.name}</p>
                    <p className="text-[10px] text-gray-500">擅长此风格</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </Link>
              ))}
            </div>
            <button 
              onClick={() => setResult(null)}
              className="w-full mt-8 py-3 text-gray-400 text-sm font-medium"
            >
              重新测试
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ProfileScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      <div className="bg-rose-500 pt-12 pb-20 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">未登录用户</h2>
            <p className="text-rose-100 text-xs">点击登录，开启美丽之旅</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl" />
      </div>

      <div className="px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-100 grid grid-cols-3 gap-4 text-center">
          {[
            { label: '优惠券', value: '0' },
            { label: '收藏夹', value: '12' },
            { label: '足迹', value: '45' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
              <p className="text-[10px] text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {[
            { label: '我的预约', icon: Calendar },
            { label: '我的评价', icon: Star },
            { label: '实名认证', icon: CheckCircle2 },
            { label: '联系客服', icon: User },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// --- Main App ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans selection:bg-rose-100 selection:text-rose-600">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/muas" element={<MUAListScreen />} />
              <Route path="/mua/:id" element={<MUADetailScreen />} />
              <Route path="/ai-match" element={<AIMatcherScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Routes>
          </AnimatePresence>
          <BottomNav />
        </div>
      </div>
    </Router>
  );
}
