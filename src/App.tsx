import React, { useState, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Home, Sparkles, User, ChevronLeft, Calendar, 
  CheckCircle2, ArrowRight, Clock, MapPin, MessageCircle, 
  Plus, ChevronDown, ChevronUp, Search, Settings, Heart, LogOut, Phone,
  ChevronRight, Star, Users, Image as ImageIcon, X, Trash2, GripVertical, Upload, PlayCircle, Video, Edit2, Share
} from 'lucide-react';
import { cn } from './lib/utils';
import { MOCK_MUAS, MOCK_CHECKLIST, MOCK_CLIENTS, MOCK_APPOINTMENTS, MOCK_ORDERS } from './constants';
import { PublicArtistProfileScreen, BookingScreen, ChatScreen, OrderDetailsScreen, SavedArtistsScreen, SettingsScreen, CRMAppointmentDetailScreen, MonthlyTrackingScreen, PortfolioLookDetailsScreen } from './newScreens';
import { AIMatchEntryScreen, AIMatchFlowScreen, AIMatchLoadingScreen, MatchResultScreen } from './AIMatch';
import { generateServiceRecommendation } from './services/geminiService';
import MDEditor from '@uiw/react-md-editor';
import { ChecklistCategory, ChecklistTask, CRMClient } from './types';

// --- Shared Components ---

const BottomNav = ({ role }: { role: 'bride' | 'artist' }) => {
  const location = useLocation();
  
  const mainTabs = [
    '/', '/home', '/checklist', '/ai-match', '/ai-match/results', '/bookings', '/profile',
    '/crm', '/crm/clients', '/crm/gallery', '/settings'
  ];
  
  if (!mainTabs.includes(location.pathname)) return null;

  const navItems = role === 'bride' ? [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/checklist', icon: CheckCircle2, label: 'Wedding Planner' },
    { path: '/ai-match', icon: Sparkles, label: 'AI Match' },
    { path: '/bookings', icon: Calendar, label: 'My Orders' },
    { path: '/profile', icon: User, label: 'My Profile' },
  ] : [
    { path: '/', icon: Home, label: 'Workspace' },
    { path: '/crm/clients', icon: Users, label: 'Clients' },
    { path: '/crm/gallery', icon: ImageIcon, label: 'Gallery' },
    { path: '/settings', icon: User, label: 'Center' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-4 py-4 flex justify-between items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = (item.path === '/' || item.path === '/home' || item.path === '/crm') 
          ? (location.pathname === item.path || (item.path === '/' && location.pathname === '/crm')) 
          : location.pathname.startsWith(item.path);
        return (
          <div key={item.path} className="flex-1 flex justify-center">
            <Link 
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-colors duration-300",
                isActive ? "text-[#D4AF37]" : "text-[#8E8E8E] hover:text-[#2C2C2C]"
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[9px] font-medium tracking-widest uppercase">{item.label}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
};

const Header = ({ title, showBack = false, rightElement }: { title: string, showBack?: boolean, rightElement?: ReactNode }) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md z-40 px-6 py-5 flex items-center justify-between max-w-md mx-auto">
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-2 text-[#2C2C2C] hover:text-[#D4AF37] transition-colors">
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
        )}
        <h1 className="text-xl font-serif font-medium text-[#2C2C2C] tracking-wide">{title}</h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </header>
  );
};

// --- Screens ---

const RoleSelectScreen = ({ setRole }: { setRole: (r: 'bride'|'artist') => void }) => {
  const navigate = useNavigate();
  
  const handleSelect = (role: 'bride'|'artist') => {
    setRole(role);
    navigate(role === 'bride' ? '/home' : '/crm');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <div className="absolute top-12 left-0 right-0 z-20 flex justify-center">
        <h1 className="font-serif text-2xl text-[#D4AF37] font-bold tracking-[0.2em]">MEETY</h1>
      </div>
      <div onClick={() => handleSelect('bride')} className="flex-1 relative overflow-hidden cursor-pointer group">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" alt="Bride" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/60 via-[#FAF9F6]/20 to-[#2C2C2C]/40 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif text-4xl text-[#2C2C2C] mb-3">I am a Bride</h2>
          <p className="text-[#2C2C2C]/80 text-sm max-w-xs font-light tracking-wide">Discover bespoke artists and manage your wedding journey.</p>
          <ArrowRight className="mt-8 text-[#2C2C2C] opacity-70" strokeWidth={1.5} size={28} />
        </div>
      </div>
      <div onClick={() => handleSelect('artist')} className="flex-1 relative overflow-hidden cursor-pointer group">
        <img src="https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=800&q=80" alt="Artist" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/90 via-[#2C2C2C]/40 to-transparent flex flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif text-4xl text-[#FAF9F6] mb-3">I am an Artist</h2>
          <p className="text-[#FAF9F6]/80 text-sm max-w-xs font-light tracking-wide">Manage your bookings, clients, and showcase your portfolio.</p>
          <ArrowRight className="mt-8 text-[#FAF9F6] opacity-70" strokeWidth={1.5} size={28} />
        </div>
      </div>
    </div>
  );
};

const HomeScreen = () => {
  const navigate = useNavigate();
  
  const totalTasks = MOCK_CHECKLIST.reduce((acc, cat) => acc + cat.tasks.length, 0);
  const completedTasks = MOCK_CHECKLIST.reduce((acc, cat) => acc + cat.tasks.filter(t => t.completed).length, 0);
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  const strokeDashoffset = 283 - (283 * progressPercentage) / 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32">
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <h1 className="font-serif text-2xl text-[#2C2C2C]">Meety</h1>
        <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-white luxury-shadow flex items-center justify-center transition-transform hover:scale-105">
          <User size={18} className="text-[#2C2C2C]" />
        </button>
      </div>
      
      {/* Hero Banner */}
      <section className="px-6 mb-10">
        <div className="relative h-[420px] rounded-[32px] overflow-hidden luxury-shadow">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 via-[#2C2C2C]/20 to-transparent flex flex-col justify-end p-8">
            <h2 className="font-serif text-4xl text-[#FAF9F6] mb-2 leading-tight">Bespoke<br/>Beauty</h2>
            <p className="text-[#FAF9F6]/80 text-sm mb-8 font-light tracking-wide">Find Your Signature Bridal Look</p>
            <button onClick={() => navigate('/ai-match')} className="bg-[#D4AF37] text-white py-4 px-8 rounded-full font-medium tracking-widest text-xs uppercase w-full shadow-lg shadow-[#D4AF37]/30">
              Start AI Matching
            </button>
          </div>
        </div>
      </section>

      {/* Quick Booking */}
      <section className="mb-10">
        <div className="px-6 mb-4 flex justify-between items-end">
          <h3 className="font-serif text-xl text-[#2C2C2C]">Quick Booking</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
          {[
            { id: 's1', title: 'Bridal Trial', icon: Sparkles, price: 'From $150' },
            { id: 's2', title: 'Event Makeup', icon: User, price: 'From $120' },
            { id: 's3', title: 'Full Wedding Day', icon: Heart, price: 'From $800' },
            { id: 's4', title: 'Touch-up Package', icon: Clock, price: 'From $200' },
          ].map(service => (
            <div key={service.id} onClick={() => navigate('/ai-match')} className="flex-shrink-0 w-36 bg-white rounded-[20px] p-4 luxury-shadow cursor-pointer active:scale-95 transition-transform border border-gray-50">
              <div className="w-10 h-10 rounded-full bg-[#F4E8C8]/50 flex items-center justify-center text-[#D4AF37] mb-3">
                <service.icon size={18} />
              </div>
              <h4 className="font-medium text-[#2C2C2C] text-sm mb-1">{service.title}</h4>
              <p className="text-[10px] text-[#8E8E8E] uppercase tracking-widest">{service.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="mb-10">
        <div className="px-6 mb-6 flex justify-between items-end">
          <h3 className="font-serif text-2xl text-[#2C2C2C]">Featured Artists</h3>
        </div>
        <div className="flex gap-5 overflow-x-auto px-6 pb-8 no-scrollbar">
          {MOCK_MUAS.map(mua => (
            <div key={mua.id} className="w-64 flex-shrink-0 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate(`/artist/${mua.id}`)}>
              <div className="h-80 rounded-[24px] overflow-hidden mb-4 luxury-shadow">
                <img src={mua.portfolio[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h4 className="font-serif text-lg text-[#2C2C2C] mb-1">{mua.name}</h4>
              <p className="text-xs text-[#8E8E8E] tracking-wide">{mua.title} · {mua.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* My Journey Dashboard */}
      <section className="px-6 mb-10">
        <div className="bg-white rounded-[32px] p-8 luxury-shadow relative overflow-hidden">
          <h3 className="font-serif text-xl text-[#2C2C2C] mb-6">My Journey</h3>
          <div className="flex items-center gap-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FAF9F6" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="6" strokeDasharray="283" strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-medium text-[#2C2C2C]">{progressPercentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#2C2C2C] font-medium mb-1">Wedding Prep</p>
              <p className="text-xs text-[#8E8E8E] mb-3">Tasks Done: {completedTasks}/{totalTasks}</p>
              <button onClick={() => navigate('/checklist')} className="text-xs text-[#D4AF37] font-medium tracking-widest uppercase border-b border-[#D4AF37] pb-0.5">View Checklist</button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const ChecklistScreen = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>('c1');
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(MOCK_CHECKLIST);
  
  // Date State
  const [weddingDate, setWeddingDate] = useState('2026-10-12');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [tempDate, setTempDate] = useState('2026-10-12');
  
  // Plan State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [tempChecklist, setTempChecklist] = useState<ChecklistCategory[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Date Logic
  const calculateDaysToGo = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isDateValid = () => {
    if (!tempDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(tempDate);
    return selectedDate >= today;
  };

  const handleSaveDate = () => {
    if (!isDateValid()) return;
    setWeddingDate(tempDate);
    setIsDateModalOpen(false);
    showToast("Wedding date saved");
  };

  // Plan Logic
  const openPlanModal = () => {
    setTempChecklist(JSON.parse(JSON.stringify(checklist)));
    setEditingCategoryId(null);
    setIsPlanModalOpen(true);
  };

  const savePlan = () => {
    setChecklist(tempChecklist);
    setIsPlanModalOpen(false);
    showToast("Wedding checklist updated");
  };

  const toggleTask = (categoryId: string, taskId: string) => {
    setChecklist(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          tasks: cat.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return cat;
    }));
  };

  const visibleChecklist = checklist.filter(cat => !cat.isHidden);

  const totalTasks = visibleChecklist.reduce((acc, cat) => acc + cat.tasks.filter(t => !t.isHidden).length, 0);
  const completedTasks = visibleChecklist.reduce((acc, cat) => acc + cat.tasks.filter(t => !t.isHidden && t.completed).length, 0);
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const strokeDashoffset = 283 - (283 * progressPercentage) / 100;

  const formatDate = (dateStr: string) => {
    // Add timezone offset to prevent date shifting
    const date = new Date(dateStr);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return adjustedDate.toLocaleDateString('en-US', options);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen relative">
      <Header title="The Wedding Checklist" showBack />
      
      <div className="px-6 py-6">
        {/* Dashboard Header */}
        <div className="bg-white rounded-[32px] p-8 luxury-shadow mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8E8E8E] tracking-widest uppercase mb-2">Wedding Date</p>
            <p className="font-serif text-xl text-[#2C2C2C] mb-4">{formatDate(weddingDate)}</p>
            <p className="text-sm text-[#D4AF37] font-medium">{calculateDaysToGo(weddingDate)} Days to go</p>
          </div>
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#FAF9F6" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="8" strokeDasharray="283" strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
            </svg>
            <span className="absolute text-sm font-medium text-[#2C2C2C]">{progressPercentage}%</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex gap-3">
            <button onClick={() => alert('Auto-Plan feature coming soon!')} className="flex-1 bg-[#D4AF37] text-white py-3.5 rounded-full text-xs font-medium tracking-widest uppercase shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all">Auto-Plan</button>
            <button onClick={() => navigate('/ai-match')} className="flex-1 border border-[#D4AF37] text-[#D4AF37] py-3.5 rounded-full text-xs font-medium tracking-widest uppercase active:scale-95 transition-all">Find Artist</button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setTempDate(weddingDate); setIsDateModalOpen(true); }} className="flex-1 bg-white border border-gray-100 text-[#2C2C2C] py-3.5 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-gray-50 flex items-center justify-center gap-2 transition-all active:scale-95">
              <Calendar size={14} className="text-[#D4AF37]" /> Customize Date
            </button>
            <button onClick={openPlanModal} className="flex-1 bg-white border border-gray-100 text-[#2C2C2C] py-3.5 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-gray-50 flex items-center justify-center gap-2 transition-all active:scale-95">
              <Settings size={14} className="text-[#D4AF37]" /> Customize Plan
            </button>
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-5">
          {visibleChecklist.map(category => {
            const isExpanded = expandedId === category.id;
            const visibleTasks = category.tasks.filter(t => !t.isHidden);
            if (visibleTasks.length === 0) return null;
            
            const completedCount = visibleTasks.filter(t => t.completed).length;
            const progress = Math.round((completedCount / visibleTasks.length) * 100);
            
            return (
              <div key={category.id} className="bg-white rounded-[28px] luxury-shadow overflow-hidden transition-all duration-300 border border-gray-50/50">
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : category.id)}
                  className="w-full px-7 py-6 flex items-center justify-between group"
                >
                  <div className="flex flex-col items-start flex-1 pr-6">
                    <div className="flex items-center justify-between w-full mb-4">
                      <span className="font-serif text-[19px] text-[#2C2C2C] group-hover:text-[#D4AF37] transition-colors text-left">{category.title}</span>
                      <span className="text-xs font-semibold text-[#8E8E8E] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/80">{completedCount}/{visibleTasks.length}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4E8C8] transition-all duration-700 ease-out rounded-full" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#8E8E8E] group-hover:bg-[#F4E8C8]/50 group-hover:text-[#D4AF37] transition-colors shrink-0">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-7 pb-7 space-y-5"
                    >
                      {Object.entries(
                        visibleTasks.reduce((acc, task) => {
                          const sub = task.subCategory || 'Other';
                          if (!acc[sub]) acc[sub] = [];
                          acc[sub].push(task);
                          return acc;
                        }, {} as Record<string, typeof visibleTasks>)
                      ).map(([subCat, tasks]: [string, any]) => (
                        <div key={subCat} className="mb-5 last:mb-0">
                          <h4 className="text-[11px] font-bold text-[#8E8E8E] uppercase tracking-widest mb-4 pl-3 border-l-2 border-[#D4AF37]">{subCat}</h4>
                          <div className="space-y-3.5">
                            {tasks.map((task: any) => (
                              <div 
                                key={task.id} 
                                onClick={() => toggleTask(category.id, task.id)}
                                className={cn(
                                "flex items-start gap-4 group cursor-pointer p-4 rounded-[20px] transition-all duration-300 border active:scale-[0.98]",
                                task.completed 
                                  ? "bg-gray-50/80 border-transparent opacity-70" 
                                  : "bg-white border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-lg hover:shadow-[#D4AF37]/5"
                              )}>
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center mt-0.5 transition-all duration-300 shrink-0",
                                  task.completed 
                                    ? "bg-[#D4AF37] border-[#D4AF37] text-white scale-95" 
                                    : "border-gray-200 group-hover:border-[#D4AF37]"
                                )}>
                                  <motion.div
                                    initial={false}
                                    animate={{ scale: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  >
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                  </motion.div>
                                </div>
                                <div className="flex-1 pt-0.5">
                                  <p className={cn(
                                    "text-[15px] font-medium transition-all duration-300 leading-snug", 
                                    task.completed ? "text-gray-400 line-through decoration-gray-300/80" : "text-[#2C2C2C] group-hover:text-[#D4AF37]"
                                  )}>{task.title}</p>
                                  <div className="flex items-center gap-4 mt-3">
                                    {task.assignee && (
                                      <div className="flex items-center gap-2">
                                        <div className={cn(
                                          "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm",
                                          task.assignee === 'Bride' ? "bg-gradient-to-br from-pink-300 to-pink-400" : 
                                          task.assignee === 'Groom' ? "bg-gradient-to-br from-blue-300 to-blue-400" : 
                                          "bg-gradient-to-br from-purple-300 to-purple-400"
                                        )}>
                                          {task.assignee.charAt(0)}
                                        </div>
                                        <p className={cn(
                                          "text-[10px] tracking-widest uppercase font-semibold",
                                          task.completed ? "text-gray-400" : "text-[#8E8E8E]"
                                        )}>{task.assignee}</p>
                                      </div>
                                    )}
                                    {task.deadline && (
                                      <div className="flex items-center gap-1.5">
                                        <Calendar size={12} className={task.completed ? "text-gray-400" : "text-[#D4AF37]"} />
                                        <p className={cn(
                                          "text-[10px] tracking-widest uppercase font-semibold",
                                          task.completed ? "text-gray-400" : "text-[#8E8E8E]"
                                        )}>{formatDate(task.deadline)}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDateModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setIsDateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 pb-12 z-[60] max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-[#2C2C2C]">Customize Date</h3>
                <button onClick={() => setIsDateModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-[#8E8E8E] hover:text-[#2C2C2C]"><X size={20} /></button>
              </div>
              <p className="text-sm text-[#8E8E8E] mb-6">Select your new wedding date to recalculate your timeline.</p>
              <input 
                type="date" 
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] mb-2" 
              />
              {!isDateValid() && tempDate && (
                <p className="text-xs text-red-500 mb-4 pl-2">Please select a date in the future.</p>
              )}
              <div className="mt-6">
                <button 
                  onClick={handleSaveDate} 
                  disabled={!isDateValid()}
                  className="w-full bg-[#D4AF37] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg shadow-[#D4AF37]/30 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  Save Date
                </button>
              </div>
            </motion.div>
          </>
        )}

        {isPlanModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setIsPlanModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 pb-12 z-[60] max-w-md mx-auto max-h-[85vh] overflow-y-auto flex flex-col"
            >
              {!editingCategoryId ? (
                // --- Categories View ---
                <>
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="font-serif text-xl text-[#2C2C2C]">Customize Plan</h3>
                    <button onClick={() => setIsPlanModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-[#8E8E8E] hover:text-[#2C2C2C]"><X size={20} /></button>
                  </div>
                  <p className="text-sm text-[#8E8E8E] mb-6 shrink-0">Add or remove phases from your wedding checklist.</p>
                  
                  <div className="space-y-3 mb-6 overflow-y-auto flex-1 pr-2">
                    {tempChecklist.map(cat => (
                      <div 
                        key={cat.id} 
                        className={cn(
                          "flex items-center justify-between p-4 border rounded-xl transition-all",
                          cat.isHidden ? "border-gray-100 bg-gray-50/50" : "border-[#D4AF37]/30 bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {cat.isCustom ? (
                            <input 
                              type="text" 
                              value={cat.title}
                              onChange={(e) => {
                                setTempChecklist(prev => prev.map(c => c.id === cat.id ? { ...c, title: e.target.value } : c));
                              }}
                              className="font-medium text-[#2C2C2C] bg-transparent border-b border-dashed border-gray-300 focus:border-[#D4AF37] focus:outline-none w-full"
                            />
                          ) : (
                            <span className={cn(
                              "font-medium transition-colors cursor-pointer",
                              cat.isHidden ? "text-[#8E8E8E]" : "text-[#2C2C2C]"
                            )} onClick={() => {
                              setTempChecklist(prev => prev.map(c => c.id === cat.id ? { ...c, isHidden: !c.isHidden } : c));
                            }}>{cat.title}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 pl-4">
                          {cat.isCustom ? (
                            <button 
                              onClick={() => setTempChecklist(prev => prev.filter(c => c.id !== cat.id))}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <div 
                              onClick={() => {
                                setTempChecklist(prev => prev.map(c => c.id === cat.id ? { ...c, isHidden: !c.isHidden } : c));
                              }}
                              className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer",
                                cat.isHidden ? "border-gray-300 bg-transparent" : "border-[#D4AF37] bg-[#D4AF37] text-white"
                              )}
                            >
                              {!cat.isHidden && <CheckCircle2 size={14} />}
                            </div>
                          )}
                          <button 
                            onClick={() => setEditingCategoryId(cat.id)}
                            className="p-1.5 text-[#8E8E8E] hover:bg-gray-100 rounded-lg transition-colors ml-1"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="shrink-0 space-y-4">
                    <button 
                      onClick={() => {
                        const newCat: ChecklistCategory = {
                          id: `custom_cat_${Date.now()}`,
                          title: 'New Category',
                          tasks: [],
                          isCustom: true,
                          isHidden: false
                        };
                        setTempChecklist(prev => [...prev, newCat]);
                      }}
                      className="w-full py-3 border border-dashed border-[#D4AF37] text-[#D4AF37] rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#F4E8C8]/20 transition-colors"
                    >
                      <Plus size={16} /> Add Custom Category
                    </button>
                    <button onClick={savePlan} className="w-full bg-[#D4AF37] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg shadow-[#D4AF37]/30">Save Plan</button>
                  </div>
                </>
              ) : (
                // --- Sub-tasks View ---
                <>
                  <div className="flex items-center gap-3 mb-6 shrink-0">
                    <button onClick={() => setEditingCategoryId(null)} className="p-2 bg-gray-50 rounded-full text-[#8E8E8E] hover:text-[#2C2C2C] -ml-2"><ChevronLeft size={20} /></button>
                    <h3 className="font-serif text-xl text-[#2C2C2C] flex-1 truncate">
                      {tempChecklist.find(c => c.id === editingCategoryId)?.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#8E8E8E] mb-6 shrink-0">Edit sub-tasks for this category.</p>
                  
                  <div className="space-y-3 mb-6 overflow-y-auto flex-1 pr-2">
                    {tempChecklist.find(c => c.id === editingCategoryId)?.tasks.map(task => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "flex items-center justify-between p-4 border rounded-xl transition-all",
                          task.isHidden ? "border-gray-100 bg-gray-50/50" : "border-[#D4AF37]/30 bg-white"
                        )}
                      >
                        <div className="flex flex-col gap-2 flex-1 pr-4">
                          {task.isCustom ? (
                            <>
                              <input 
                                type="text" 
                                value={task.title}
                                onChange={(e) => {
                                  setTempChecklist(prev => prev.map(c => {
                                    if (c.id === editingCategoryId) {
                                      return { ...c, tasks: c.tasks.map(t => t.id === task.id ? { ...t, title: e.target.value } : t) };
                                    }
                                    return c;
                                  }));
                                }}
                                className="font-medium text-[#2C2C2C] bg-transparent border-b border-dashed border-gray-300 focus:border-[#D4AF37] focus:outline-none w-full text-sm pb-1"
                                placeholder="Task Name"
                              />
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar size={12} className="text-[#8E8E8E]" />
                                <input
                                  type="date"
                                  value={task.deadline || ''}
                                  onChange={(e) => {
                                    setTempChecklist(prev => prev.map(c => {
                                      if (c.id === editingCategoryId) {
                                        return { ...c, tasks: c.tasks.map(t => t.id === task.id ? { ...t, deadline: e.target.value } : t) };
                                      }
                                      return c;
                                    }));
                                  }}
                                  className="text-[11px] text-[#8E8E8E] bg-transparent border-b border-dashed border-gray-300 focus:border-[#D4AF37] focus:outline-none"
                                />
                              </div>
                            </>
                          ) : (
                            <span className={cn(
                              "font-medium transition-colors text-sm",
                              task.isHidden ? "text-[#8E8E8E]" : "text-[#2C2C2C]"
                            )}>{task.title}</span>
                          )}
                          {!task.isCustom && task.subCategory && (
                            <span className="text-[10px] text-[#8E8E8E] uppercase tracking-widest">{task.subCategory}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {task.isCustom ? (
                            <button 
                              onClick={() => {
                                setTempChecklist(prev => prev.map(c => {
                                  if (c.id === editingCategoryId) {
                                    return { ...c, tasks: c.tasks.filter(t => t.id !== task.id) };
                                  }
                                  return c;
                                }));
                              }}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <div 
                              onClick={() => {
                                setTempChecklist(prev => prev.map(c => {
                                  if (c.id === editingCategoryId) {
                                    return { ...c, tasks: c.tasks.map(t => t.id === task.id ? { ...t, isHidden: !t.isHidden } : t) };
                                  }
                                  return c;
                                }));
                              }}
                              className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer",
                                task.isHidden ? "border-gray-300 bg-transparent" : "border-[#D4AF37] bg-[#D4AF37] text-white"
                              )}
                            >
                              {!task.isHidden && <CheckCircle2 size={14} />}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="shrink-0 space-y-4">
                    <button 
                      onClick={() => {
                        const newTask: ChecklistTask = {
                          id: `custom_task_${Date.now()}`,
                          title: 'New Task',
                          completed: false,
                          isCustom: true,
                          isHidden: false,
                          subCategory: 'Custom'
                        };
                        setTempChecklist(prev => prev.map(c => {
                          if (c.id === editingCategoryId) {
                            return { ...c, tasks: [...c.tasks, newTask] };
                          }
                          return c;
                        }));
                      }}
                      className="w-full py-3 border border-dashed border-[#D4AF37] text-[#D4AF37] rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#F4E8C8]/20 transition-colors"
                    >
                      <Plus size={16} /> Add Custom Sub-task
                    </button>
                    <button onClick={() => setEditingCategoryId(null)} className="w-full bg-[#2C2C2C] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg">Done Editing</button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#2C2C2C] text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl z-[70] whitespace-nowrap flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-[#D4AF37]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CRMScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-04-15');
  const [blockDate, setBlockDate] = useState('2026-04-15');
  const [blockStart, setBlockStart] = useState('15:00');
  const [blockEnd, setBlockEnd] = useState('16:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [blockError, setBlockError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // AI Inquiry Workflow State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [aiUploadedImages, setAiUploadedImages] = useState<string[]>([]);
  const [isAIReviewOpen, setIsAIReviewOpen] = useState(false);
  
  // AI Identification Review State
  const [parsedData, setParsedData] = useState({
    clientName: '',
    phone: '',
    date: '',
    location: '',
    inquiryType: '',
    requirements: ''
  });

  const filteredAppointments = appointments.filter(apt => {
    if (apt.date !== selectedDate) return false;
    if (activeFilter !== 'All' && apt.status.toLowerCase() !== activeFilter.toLowerCase()) return false;
    if (searchQuery && apt.status !== 'blocked') {
      if (!apt.clientName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const handleBlockTime = () => {
    setBlockError('');
    const start = isAllDay ? '00:00' : blockStart;
    const end = isAllDay ? '23:59' : blockEnd;

    if (start >= end) {
      setBlockError('End time must be after start time.');
      return;
    }

    const hasOverlap = appointments.some(apt => {
      if (apt.date !== blockDate) return false;
      return (start < apt.endTime && end > apt.startTime);
    });

    if (hasOverlap) {
      setBlockError('This time slot overlaps with an existing appointment or block.');
      return;
    }

    const newBlock = {
      id: `block-${Date.now()}`,
      date: blockDate,
      startTime: start,
      endTime: end,
      isAllDay,
      status: 'blocked' as const
    };
    const updated = [...appointments, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime));
    setAppointments(updated);
    setIsBlockModalOpen(false);
    setIsFabOpen(false);
  };

  const handleAIPromptConfirm = () => {
    // Mock AI processing simulating structured data extraction
    setParsedData({
      clientName: 'Sarah Jenkins',
      phone: '(555) 123-4567',
      date: '2026-10-24',
      location: 'Ritz-Carlton',
      inquiryType: 'Bridal Makeup Trial',
      requirements: aiInputText || 'Wants a soft-glam look for the trial. Mentioned sensitive skin.'
    });
    setIsAIModalOpen(false);
    setIsAIReviewOpen(true);
  };

  const handleFinalSubmit = () => {
    if (!parsedData.clientName) return;
    
    // Simulate saving the client
    const newClient: CRMClient = {
      id: `client-${Date.now()}`,
      name: parsedData.clientName,
      phone: parsedData.phone,
      notes: parsedData.requirements,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedData.clientName)}&background=F4E8C8&color=D4AF37`,
      tags: ['New Inquiry'],
      totalSpent: 0,
      noShows: 0,
      lastVisit: 'Never',
      history: []
    };
    
    MOCK_CLIENTS.push(newClient);
    setIsAIReviewOpen(false);
    setAiInputText('');
    setAiUploadedImages([]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <div className="px-6 pt-12 pb-6">
        <h1 className="font-serif text-2xl text-[#2C2C2C] mb-1">Welcome back, Elena.</h1>
        <p className="text-sm text-[#8E8E8E]">Here is your schedule for today.</p>
      </div>

      {/* Search Bar & AI Input */}
      <div className="px-6 mb-8 flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[#8E8E8E]" />
          </div>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-11 pr-4 text-sm text-[#2C2C2C] placeholder-[#8E8E8E] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all luxury-shadow"
          />
        </div>
        <button 
          onClick={() => setIsAIModalOpen(true)}
          className="w-full bg-[#2C2C2C] text-white py-4 rounded-full flex items-center justify-center gap-2 luxury-shadow active:scale-95 transition-transform group"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles size={18} className="text-[#D4AF37]" />
            <div className="absolute inset-0 bg-[#D4AF37] blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <span className="font-medium text-sm tracking-widest uppercase ml-1">AI Inquiry Input</span>
        </button>
      </div>

      {/* Financial Snapshot & Performance */}
      <div className="px-6 mb-8 cursor-pointer group" onClick={() => navigate('/crm/monthly-tracking')}>
        <div className="bg-[#2C2C2C] rounded-[32px] p-8 text-[#FAF9F6] luxury-shadow relative">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
             <ChevronRight size={24} className="text-[#D4AF37]" />
          </div>
          <div className="flex justify-between items-start mb-6 pr-8">
            <div>
              <p className="text-xs text-[#FAF9F6]/60 tracking-widest uppercase mb-2">Monthly Earnings</p>
              <p className="font-serif text-4xl">$4,500</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#FAF9F6]/60 tracking-widest uppercase mb-2">Profile Views</p>
              <p className="font-serif text-2xl text-[#D4AF37]">1.2k</p>
            </div>
          </div>
          <div className="flex justify-between border-t border-[#FAF9F6]/10 pt-6 pr-8">
            <div>
              <p className="text-xl font-medium">12</p>
              <p className="text-[10px] text-[#FAF9F6]/60 tracking-widest uppercase mt-1">Pending</p>
            </div>
            <div>
              <p className="text-xl font-medium">28</p>
              <p className="text-[10px] text-[#FAF9F6]/60 tracking-widest uppercase mt-1">Completed</p>
            </div>
            <div>
              <p className="text-xl font-medium">70%</p>
              <p className="text-[10px] text-[#FAF9F6]/60 tracking-widest uppercase mt-1">Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto px-6 pb-4 no-scrollbar">
          {[
            { label: 'Mon 13', date: '2026-04-13' },
            { label: 'Tue 14', date: '2026-04-14' },
            { label: 'Wed 15', date: '2026-04-15' },
            { label: 'Thu 16', date: '2026-04-16' },
            { label: 'Fri 17', date: '2026-04-17' },
            { label: 'Sat 18', date: '2026-04-18' }
          ].map((day) => {
            const isActive = day.date === selectedDate;
            return (
              <button 
                key={day.date} 
                onClick={() => setSelectedDate(day.date)}
                className={cn(
                  "flex-shrink-0 w-16 h-20 rounded-[16px] flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive ? "bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20" : "bg-white text-[#2C2C2C] border border-gray-100 hover:border-[#D4AF37]/50"
                )}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-80">{day.label.split(' ')[0]}</span>
                <span className="text-lg font-medium">{day.label.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl text-[#2C2C2C]">Schedule</h3>
          <span className="text-xs font-medium text-[#D4AF37] bg-[#F4E8C8]/50 px-3 py-1 rounded-full">{filteredAppointments.length} Appts</span>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
          {['All', 'Booked', 'Blocked', 'Completed'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase whitespace-nowrap transition-colors",
                activeFilter === filter ? "bg-[#2C2C2C] text-white" : "border border-gray-200 text-[#8E8E8E] hover:border-[#D4AF37]/50"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-8">
          {filteredAppointments.length === 0 ? (
            <p className="text-sm text-[#8E8E8E] pl-6">No appointments match your search.</p>
          ) : (
            filteredAppointments.map(apt => (
              <div key={apt.id} className="relative pl-8">
                {/* Time indicator dot */}
                <div className={cn(
                  "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-[#FAF9F6]",
                  apt.status === 'completed' ? "bg-green-400" : apt.status === 'blocked' ? "bg-gray-300" : "bg-[#D4AF37]"
                )} />
                
                <p className="text-xs text-[#8E8E8E] font-medium mb-3">
                  {apt.isAllDay ? 'All Day' : `${apt.startTime} - ${apt.endTime}`}
                </p>
                
                {apt.status === 'blocked' ? (
                  <div className="h-16 rounded-[20px] bg-gray-50 border border-gray-100 flex items-center justify-center border-dashed">
                    <span className="text-xs text-[#8E8E8E] tracking-widest uppercase font-medium">Personal Time / Blocked</span>
                  </div>
                ) : (
                  <div className="bg-white rounded-[24px] p-5 luxury-shadow border border-gray-50">
                    <Link to={`/crm/client/${apt.clientId}`} className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {apt.clientAvatar ? (
                          <img src={apt.clientAvatar} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-serif text-lg text-[#2C2C2C]">{apt.clientName}</h4>
                          <p className="text-xs text-[#8E8E8E] mt-0.5">{apt.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-lg text-[#2C2C2C]">${apt.price}</p>
                        <p className={cn(
                          "text-[10px] uppercase tracking-widest font-medium mt-1",
                          apt.paymentStatus === 'paid' ? "text-green-500" : "text-[#D4AF37]"
                        )}>
                          {apt.paymentStatus}
                        </p>
                      </div>
                    </Link>
                    
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                      {apt.status === 'booked' && apt.paymentStatus === 'unpaid' ? (
                        <>
                          <button className="flex-1 bg-[#2C2C2C] text-white py-2.5 rounded-full text-xs font-medium tracking-widest uppercase transition-transform active:scale-95">
                            Checkout
                          </button>
                          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#2C2C2C] hover:bg-gray-50 transition-colors">
                            <MessageCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="flex-1 bg-gray-50 text-[#8E8E8E] py-2.5 rounded-full text-xs font-medium tracking-widest uppercase cursor-default">
                            Completed
                          </button>
                          <button className="flex-1 border border-gray-200 text-[#2C2C2C] py-2.5 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-gray-50 transition-colors">
                            Rebook
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* FAB - AI Inquiry Input */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 pointer-events-none z-40 flex justify-end">
        <button 
          onClick={() => setIsAIModalOpen(true)}
          className="w-14 h-14 bg-[#2C2C2C] text-white rounded-full flex items-center justify-center shadow-xl pointer-events-auto hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Block Time Modal */}
      <AnimatePresence>
        {isBlockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsBlockModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-6 luxury-shadow"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-[#2C2C2C]">Block Personal Time</h3>
                <button onClick={() => setIsBlockModalOpen(false)} className="text-[#8E8E8E] hover:text-[#2C2C2C] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-medium text-[#8E8E8E] uppercase tracking-widest mb-2">Date</label>
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <label className="text-sm font-medium text-[#2C2C2C]">All Day</label>
                  <button 
                    onClick={() => setIsAllDay(!isAllDay)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      isAllDay ? "bg-[#D4AF37]" : "bg-gray-200"
                    )}
                  >
                    <motion.div 
                      className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                      animate={{ left: isAllDay ? '26px' : '2px' }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {!isAllDay && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div>
                        <label className="block text-xs font-medium text-[#8E8E8E] uppercase tracking-widest mb-2">Start Time</label>
                        <input
                          type="time"
                          value={blockStart}
                          onChange={(e) => setBlockStart(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#8E8E8E] uppercase tracking-widest mb-2">End Time</label>
                        <input
                          type="time"
                          value={blockEnd}
                          onChange={(e) => setBlockEnd(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {blockError && (
                <p className="text-xs text-red-500 mb-4 text-center">{blockError}</p>
              )}

              <button
                onClick={handleBlockTime}
                className="w-full bg-[#2C2C2C] text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase transition-transform active:scale-95"
              >
                Save Blocked Time
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Inquiry Modals (Stage 1 & 2) */}
      <AnimatePresence>
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsAIModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[400px] bg-white rounded-[32px] p-6 luxury-shadow"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-2xl text-[#2C2C2C]">New Client Inquiry</h3>
                <button onClick={() => setIsAIModalOpen(false)} className="text-[#8E8E8E] hover:text-[#2C2C2C] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <textarea
                    value={aiInputText}
                    onChange={(e) => setAiInputText(e.target.value)}
                    placeholder="Describe the inquiry in natural language, e.g., Sarah Jenkins, Oct 24, Ritz-Carlton, Bridal Makeup Trial."
                    className="w-full bg-gray-50 border border-gray-100 rounded-[20px] p-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none h-32 placeholder-[#8E8E8E]/60 leading-relaxed"
                  />
                </div>
                
                {/* Actions Area */}
                <div className="flex flex-col items-center gap-4 mt-2">
                  <button className="w-[220px] flex items-center justify-center gap-2 text-[11px] text-[#2C2C2C] bg-white border border-gray-200 rounded-full px-6 py-4 hover:border-[#D4AF37] transition-all group tracking-widest uppercase font-medium">
                    <ImageIcon size={16} className="text-[#8E8E8E] group-hover:text-[#D4AF37] transition-colors" />
                    Upload Reference
                  </button>
                  <button
                    onClick={handleAIPromptConfirm}
                    disabled={!aiInputText.trim()}
                    className="w-[220px] bg-[#2C2C2C] disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-4 rounded-full text-[11px] font-medium tracking-widest uppercase transition-transform active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    <Sparkles size={16} className="text-[#D4AF37] group-disabled:text-gray-400" />
                    Identify & Confirm
                  </button>
                  
                  {aiUploadedImages.length > 0 && (
                     <div className="flex justify-center gap-2">
                        {/* Placeholder for uploaded thumbnails */}
                     </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isAIReviewOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 pb-safe">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAIReviewOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-[400px] h-[85vh] overflow-hidden bg-[#FAF9F6] rounded-[32px] luxury-shadow flex flex-col items-center"
            >
              {/* Header */}
              <div className="w-full flex justify-between items-center px-6 py-6 border-b border-gray-100 bg-white">
                <h3 className="font-serif text-xl text-[#2C2C2C]">Inquiry Confirmation</h3>
                <button onClick={() => setIsAIReviewOpen(false)} className="text-[#8E8E8E] hover:text-[#2C2C2C] transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="w-full flex-1 overflow-y-auto px-6 py-6 space-y-6 flex flex-col no-scrollbar">
                
                {/* Client Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium tracking-widest uppercase text-[#8E8E8E]">Client Details</h4>
                  
                  <div className="bg-white rounded-[20px] p-4 border border-gray-100 space-y-3">
                     <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">Client Name</label>
                        <input 
                          type="text"
                          value={parsedData.clientName}
                          onChange={(e) => setParsedData({...parsedData, clientName: e.target.value})}
                          className="w-full font-medium text-[#2C2C2C] bg-transparent focus:outline-none"
                        />
                     </div>
                     <div className="w-full h-px bg-gray-50" />
                     <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">Phone Number</label>
                        <input 
                          type="text"
                          value={parsedData.phone}
                          onChange={(e) => setParsedData({...parsedData, phone: e.target.value})}
                          className="w-full font-medium text-[#2C2C2C] bg-transparent focus:outline-none"
                        />
                     </div>
                  </div>
                </div>

                {/* Service Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium tracking-widest uppercase text-[#8E8E8E]">Service Details</h4>
                  
                  <div className="bg-white rounded-[20px] p-4 border border-gray-100 space-y-3">
                     <div className="flex flex-col gap-1 relative">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">Wedding / Event Date</label>
                        <input 
                          type="date"
                          value={parsedData.date}
                          onChange={(e) => setParsedData({...parsedData, date: e.target.value})}
                          className="w-full font-medium text-[#2C2C2C] bg-transparent focus:outline-none pr-8 relative z-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <Calendar size={14} className="absolute right-0 bottom-1 text-[#8E8E8E] z-0 pointer-events-none" />
                     </div>
                     <div className="w-full h-px bg-gray-50" />
                     <div className="flex flex-col gap-1 relative">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">Location</label>
                        <input 
                          type="text"
                          value={parsedData.location}
                          onChange={(e) => setParsedData({...parsedData, location: e.target.value})}
                          className="w-full font-medium text-[#2C2C2C] bg-transparent focus:outline-none pr-8"
                        />
                        <MapPin size={14} className="absolute right-0 bottom-1 text-[#8E8E8E]" />
                     </div>
                     <div className="w-full h-px bg-gray-50" />
                     <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">Inquiry Type</label>
                        <input 
                          type="text"
                          value={parsedData.inquiryType}
                          onChange={(e) => setParsedData({...parsedData, inquiryType: e.target.value})}
                          className="w-full font-medium text-[#2C2C2C] bg-transparent focus:outline-none"
                        />
                     </div>
                     <div className="w-full h-px bg-gray-50" />
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">Styling Requirements / Notes</label>
                        <textarea 
                          value={parsedData.requirements}
                          onChange={(e) => setParsedData({...parsedData, requirements: e.target.value})}
                          className="w-full text-sm text-[#2C2C2C] bg-transparent focus:outline-none resize-none h-20 leading-relaxed"
                        />
                     </div>
                  </div>
                </div>

                {/* Reference Images Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium tracking-widest uppercase text-[#8E8E8E]">References & Photos</h4>
                  <div className="bg-white rounded-[20px] p-4 border border-gray-100 flex flex-col gap-3">
                    <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-[#8E8E8E] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                      <ImageIcon size={18} /> Add Photos
                    </button>
                  </div>
                </div>

              </div>

              {/* Action */}
              <div className="w-full p-6 pt-4 bg-gradient-to-t from-[#FAF9F6] to-transparent">
                <button
                  onClick={handleFinalSubmit}
                  className="w-full bg-[#2C2C2C] text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  Final Submit
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ClientArchiveScreen = () => {
  const { id } = useParams();
  const client = MOCK_CLIENTS.find(c => c.id === id) || MOCK_CLIENTS[0];
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(client.name);
  const [editPhone, setEditPhone] = useState(client.phone || '');
  
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [clientStatus, setClientStatus] = useState<string>('Inquiry / Unbooked');
  
  const handleSaveProfile = () => {
    client.name = editName;
    client.phone = editPhone;
    setIsEditingProfile(false);
  };

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  const handleGenerateRecommendation = async () => {
    setIsGenerating(true);
    const result = await generateServiceRecommendation(client);
    setRecommendation(result);
    setIsGenerating(false);
  };

  const openAddNoteModal = () => {
    setEditingNoteId(null);
    setNewNoteContent('');
    setNewNoteTags('');
    setIsNoteModalOpen(true);
  };

  const openEditNoteModal = (note: any) => {
    setEditingNoteId(note.id);
    setNewNoteContent(note.content);
    setNewNoteTags(note.tags.join(', '));
    setIsNoteModalOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    if (client.richNotes) {
      client.richNotes = client.richNotes.filter(n => n.id !== noteId);
      setNoteToDelete(null);
      // Force re-render
      setSelectedTagFilter(prev => prev);
    }
  };

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;
    
    const tags = newNoteTags.split(',').map(t => t.trim()).filter(t => t);
    
    if (!client.richNotes) {
      client.richNotes = [];
    }

    if (editingNoteId) {
      const noteIndex = client.richNotes.findIndex(n => n.id === editingNoteId);
      if (noteIndex !== -1) {
        client.richNotes[noteIndex] = {
          ...client.richNotes[noteIndex],
          content: newNoteContent,
          tags
        };
      }
    } else {
      const newNote = {
        id: `note-${Date.now()}`,
        content: newNoteContent,
        tags,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      client.richNotes.unshift(newNote);
    }
    
    setIsNoteModalOpen(false);
    setNewNoteContent('');
    setNewNoteTags('');
    setEditingNoteId(null);
  };

  const allTags = Array.from(new Set(client.richNotes?.flatMap(note => note.tags) || []));
  const filteredNotes = selectedTagFilter 
    ? client.richNotes?.filter(note => note.tags.includes(selectedTagFilter))
    : client.richNotes;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Client Profile" showBack />
      
      {/* Profile Header */}
      <div className="px-6 py-8 flex flex-col items-center text-center">
        <img src={client.avatar} className="w-28 h-28 rounded-full object-cover mb-4 luxury-shadow" referrerPolicy="no-referrer" />
        
        {isEditingProfile ? (
          <>
            <input 
              type="text" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)}
              className="font-serif text-2xl text-[#2C2C2C] mb-2 text-center bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#D4AF37] transition-colors" 
              placeholder="Name"
            />
            <input 
              type="text" 
              value={editPhone} 
              onChange={(e) => setEditPhone(e.target.value)}
              className="text-sm text-[#8E8E8E] mb-4 text-center bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#D4AF37] transition-colors" 
              placeholder="Phone"
            />
          </>
        ) : (
          <>
             <h2 className="font-serif text-2xl text-[#2C2C2C] mb-2">{client.name}</h2>
             <p className="text-sm text-[#8E8E8E] mb-4">{client.phone}</p>
          </>
        )}
        
        <div className="flex gap-2">
          {client.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-[#F4E8C8]/50 text-[#D4AF37] text-[10px] uppercase tracking-widest rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 luxury-shadow grid grid-cols-3 divide-x divide-gray-100 text-center">
          <div>
            <p className="text-lg font-medium text-[#2C2C2C]">${client.totalSpent}</p>
            <p className="text-[10px] text-[#8E8E8E] uppercase tracking-widest mt-1">Spent</p>
          </div>
          <div>
            <p className="text-lg font-medium text-[#2C2C2C]">{client.noShows}</p>
            <p className="text-[10px] text-[#8E8E8E] uppercase tracking-widest mt-1">No-Shows</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#2C2C2C] mt-1">{client.lastVisit}</p>
            <p className="text-[10px] text-[#8E8E8E] uppercase tracking-widest mt-1">Last Visit</p>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="px-6 mb-8">
        <div className="bg-[#F4E8C8]/20 rounded-[24px] p-6 border border-[#D4AF37]/20">
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[#D4AF37]" />
            Quick Summary
          </h3>
          <div className="space-y-4">
            {client.preferredStyles && client.preferredStyles.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8E8E8E] mb-1">Preferred Styles</p>
                <p className="text-sm text-[#2C2C2C] font-medium">{client.preferredStyles.join(', ')}</p>
              </div>
            )}
            {client.allergies && client.allergies.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-red-400 mb-1">Allergies / Sensitivities</p>
                <p className="text-sm text-[#2C2C2C] font-medium">{client.allergies.join(', ')}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8E8E8E] mb-1">Last Service Date</p>
              <p className="text-sm text-[#2C2C2C] font-medium">{client.history[0]?.date || client.lastVisit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formula & Notes */}
      <div className="px-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl text-[#2C2C2C]">Formula & Notes</h3>
          <button 
            onClick={openAddNoteModal}
            className="text-[#D4AF37] text-xs font-medium uppercase tracking-widest flex items-center gap-1 bg-[#F4E8C8]/30 px-3 py-1.5 rounded-full"
          >
            <Plus size={14} /> Add Note
          </button>
        </div>
        
        {allTags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedTagFilter(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-medium whitespace-nowrap transition-colors",
                selectedTagFilter === null ? "bg-[#2C2C2C] text-white" : "bg-gray-100 text-[#8E8E8E]"
              )}
            >
              All Notes
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-medium whitespace-nowrap transition-colors",
                  selectedTagFilter === tag ? "bg-[#D4AF37] text-white" : "bg-[#F4E8C8]/30 text-[#D4AF37]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        
        <div className="space-y-4">
          {filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <div key={note.id} className="bg-[#FFFDF9] border border-[#D4AF37]/20 rounded-[24px] p-6 luxury-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#8E8E8E] uppercase tracking-widest">{note.date}</span>
                    <button onClick={() => openEditNoteModal(note)} className="text-[#D4AF37] hover:text-[#2C2C2C] transition-colors"><Edit2 size={12} /></button>
                    <button 
                      onClick={() => setNoteToDelete(note.id)} 
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {note.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-[#F4E8C8]/50 text-[#D4AF37] text-[9px] uppercase tracking-widest rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="markdown-body text-sm text-[#2C2C2C]/80 leading-relaxed font-serif prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-[#2C2C2C] prose-strong:font-semibold">
                  <Markdown>{note.content}</Markdown>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#FFFDF9] border border-[#D4AF37]/20 rounded-[24px] p-6 luxury-shadow">
              <p className="text-sm text-[#2C2C2C]/80 leading-relaxed font-serif italic">
                {selectedTagFilter ? `No notes found with tag "${selectedTagFilter}"` : `"${client.notes}"`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="px-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl text-[#2C2C2C]">AI Recommendation</h3>
          <Sparkles size={18} className="text-[#D4AF37]" />
        </div>
        <div className="bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A] rounded-[24px] p-6 luxury-shadow text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl -mr-10 -mt-10" />
          
          {recommendation ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm text-white/90 leading-relaxed mb-4 relative z-10">
                {recommendation}
              </p>
              <button 
                onClick={handleGenerateRecommendation}
                disabled={isGenerating}
                className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Regenerating...' : 'Regenerate'}
              </button>
            </motion.div>
          ) : (
            <div className="relative z-10 flex flex-col items-center text-center py-2">
              <p className="text-sm text-white/70 mb-4">
                Generate a personalized service recommendation based on {client.name}'s history and preferences.
              </p>
              <button 
                onClick={handleGenerateRecommendation}
                disabled={isGenerating}
                className="bg-[#D4AF37] text-white px-6 py-3 rounded-full text-xs font-medium tracking-widest uppercase shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles size={14} />
                    </motion.div>
                    Analyzing...
                  </>
                ) : (
                  'Generate Idea'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Service History */}
      <div className="px-6">
        <h3 className="font-serif text-xl text-[#2C2C2C] mb-6">Service History</h3>
        <div className="space-y-6">
          {client.history.map(hist => (
            <div key={hist.id} className="flex gap-4 items-center bg-white p-4 rounded-[24px] luxury-shadow">
              <img src={hist.image} className="w-16 h-16 rounded-[16px] object-cover" referrerPolicy="no-referrer" />
              <div>
                <p className="font-medium text-[#2C2C2C]">{hist.service}</p>
                <p className="text-xs text-[#8E8E8E] mt-1">{hist.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6] to-transparent max-w-md mx-auto z-40 flex gap-4">
        <button 
          onClick={() => {
            if (isEditingProfile) {
              handleSaveProfile();
            } else {
              setIsEditingProfile(true);
            }
          }}
          className="flex-1 border border-[#2C2C2C] text-[#2C2C2C] py-4 rounded-full text-[11px] font-medium tracking-widest uppercase bg-[#FAF9F6]/80 backdrop-blur-md active:scale-95 transition-all"
        >
          {isEditingProfile ? <span className="text-[#D4AF37]">Save</span> : "Edit Profile"}
        </button>
        <button 
          onClick={() => setIsStatusModalOpen(true)}
          className="flex-1 bg-[#2C2C2C] text-white py-4 rounded-full text-[11px] font-medium tracking-widest uppercase shadow-xl active:scale-95 transition-all"
        >
          Update Status
        </button>
      </div>

      {/* Update Status Modal */}
      <AnimatePresence>
        {isStatusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsStatusModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#FAF9F6] rounded-t-[32px] sm:rounded-[32px] p-6 pb-12 sm:pb-6 luxury-shadow"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-[#2C2C2C]">Update Client Status</h3>
                <button onClick={() => setIsStatusModalOpen(false)} className="text-[#8E8E8E] hover:text-[#2C2C2C] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { label: 'Inquiry / Unbooked', color: 'bg-gray-300' },
                  { label: 'Booked / Deposit Paid', color: 'bg-[#D4AF37]' },
                  { label: 'Needs Reschedule', color: 'bg-orange-400' },
                  { label: 'Completed / Archived', color: 'bg-[#2C2C2C]' }
                ].map((status) => (
                  <button
                    key={status.label}
                    onClick={() => setClientStatus(status.label)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-[20px] transition-all",
                      clientStatus === status.label ? "bg-white luxury-shadow border border-gray-100" : "bg-transparent border border-transparent hover:bg-black/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", status.color)} />
                      <span className={cn("font-medium", clientStatus === status.label ? "text-[#2C2C2C]" : "text-[#8E8E8E]")}>
                        {status.label}
                      </span>
                    </div>
                    {clientStatus === status.label && (
                      <CheckCircle2 size={18} className="text-[#D4AF37]" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  // Apply Status Logic here
                  setIsStatusModalOpen(false);
                }}
                className="w-full bg-[#2C2C2C] text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase shadow-xl active:scale-95 transition-all"
              >
                Confirm
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsNoteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-6 luxury-shadow"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-[#2C2C2C]">{editingNoteId ? 'Edit Note' : 'Add Note'}</h3>
                <button onClick={() => setIsNoteModalOpen(false)} className="text-[#8E8E8E] hover:text-[#2C2C2C] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-medium text-[#8E8E8E] uppercase tracking-widest mb-2 flex justify-between">
                    <span>Note Content</span>
                    <span className="text-[9px] lowercase normal-case">Supports Markdown</span>
                  </label>
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="E.g., **Skin Prep:** Used water-based primer..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none h-32 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8E8E8E] uppercase tracking-widest mb-2">Tags</label>
                  <input
                    type="text"
                    value={newNoteTags}
                    onChange={(e) => setNewNoteTags(e.target.value)}
                    placeholder="E.g., Skin Prep, Product Prefs (comma separated)"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveNote}
                disabled={!newNoteContent.trim()}
                className="w-full bg-[#2C2C2C] disabled:bg-gray-300 text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase transition-transform active:scale-95"
              >
                Save Note
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {noteToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setNoteToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-6 luxury-shadow text-center"
            >
              <h3 className="font-serif text-xl text-[#2C2C2C] mb-2">Delete Note</h3>
              <p className="text-sm text-[#8E8E8E] mb-8">Are you sure you want to delete this note? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 border border-gray-200 text-[#2C2C2C] py-3 rounded-full text-xs font-medium tracking-widest uppercase transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteNote(noteToDelete)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-full text-xs font-medium tracking-widest uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};



const BookingListScreen = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeFilter === 'All') return true;
    return order.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="My Appointments" />
      
      <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar">
        {['All', 'Upcoming', 'Completed', 'Canceled'].map((filter) => (
          <button 
            key={filter} 
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-5 py-2 rounded-full text-xs tracking-widest uppercase whitespace-nowrap transition-colors",
              activeFilter === filter ? "bg-[#2C2C2C] text-white" : "border border-gray-200 text-[#8E8E8E]"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="px-6 mt-4 space-y-5">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-[24px] p-6 luxury-shadow">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
              <h4 className="font-serif text-lg text-[#2C2C2C]">{order.muaName}</h4>
              <span className={cn(
                "px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-medium",
                order.status === 'completed' ? "bg-green-100 text-green-700" : "bg-[#F4E8C8]/30 text-[#D4AF37]"
              )}>
                {order.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-[#2C2C2C]">{order.serviceName}</p>
              <div className="flex items-center gap-2 text-xs text-[#8E8E8E]">
                <Clock size={14} />
                <span>{order.date} · {order.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8E8E8E]">
                <MapPin size={14} />
                <span>{order.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <p className="font-serif text-xl text-[#2C2C2C]">${order.totalPrice}</p>
              <div className="flex gap-2">
                <button onClick={() => navigate('/chat')} className="px-4 py-2 border border-[#2C2C2C] text-[#2C2C2C] rounded-full text-[10px] uppercase tracking-widest font-medium">Contact</button>
                <button onClick={() => navigate(`/order/${order.id}`)} className="px-4 py-2 bg-gray-100 text-[#2C2C2C] rounded-full text-[10px] uppercase tracking-widest font-medium">Details</button>
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <p className="text-center text-sm text-[#8E8E8E] py-8">No appointments found.</p>
        )}
      </div>
    </motion.div>
  );
};



const AIMatchFlowScreenWrapper = () => {
  const { type } = useParams();
  return <AIMatchFlowScreen type={type as 'wedding' | 'daily'} />;
};

// --- Main App ---

const ProfileScreen = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="My Profile" />
      
      <div className="px-6 py-8 flex flex-col items-center text-center border-b border-gray-100">
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden luxury-shadow">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <h2 className="font-serif text-2xl text-[#2C2C2C] mb-1">Sophia Chen</h2>
        <p className="text-sm text-[#8E8E8E]">Wedding: Oct 12, 2026</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <button onClick={() => navigate('/saved-artists')} className="w-full bg-white rounded-[24px] p-5 flex items-center justify-between luxury-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <Heart size={18} />
            </div>
            <span className="font-medium text-[#2C2C2C]">Saved Artists</span>
          </div>
          <ChevronLeft size={20} className="text-[#8E8E8E] rotate-180" />
        </button>
        
        <button onClick={() => navigate('/settings')} className="w-full bg-white rounded-[24px] p-5 flex items-center justify-between luxury-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <Settings size={18} />
            </div>
            <span className="font-medium text-[#2C2C2C]">Settings</span>
          </div>
          <ChevronLeft size={20} className="text-[#8E8E8E] rotate-180" />
        </button>

        <button onClick={() => navigate('/role-select')} className="w-full bg-white rounded-[24px] p-5 flex items-center justify-between luxury-shadow group mt-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center text-red-400 group-hover:bg-red-50 transition-colors">
              <LogOut size={18} />
            </div>
            <span className="font-medium text-red-500">Switch Role / Logout</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
};

const ClientListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = MOCK_CLIENTS.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="My Clients" />
      
      <div className="px-6 py-6">
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[#8E8E8E]" />
          </div>
          <input
            type="text"
            placeholder="Search clients by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-11 pr-10 text-sm text-[#2C2C2C] placeholder-[#8E8E8E] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all luxury-shadow"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8E8E8E] hover:text-[#2C2C2C] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <p className="text-sm text-[#8E8E8E] text-center py-8">No clients found.</p>
          ) : (
            filteredClients.map(client => (
              <Link key={client.id} to={`/crm/client/${client.id}`} className="block bg-white rounded-[24px] p-5 luxury-shadow border border-gray-50">
                <div className="flex items-center gap-4">
                  <img src={client.avatar} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-[#2C2C2C]">{client.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-[#8E8E8E] mt-1">
                      <Phone size={12} />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#2C2C2C]">${client.totalSpent}</p>
                    <p className="text-[10px] text-[#8E8E8E] uppercase tracking-widest mt-0.5">Spent</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

const GalleryScreen = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isNewPortfolioOpen, setIsNewPortfolioOpen] = useState(false);
  const artist = MOCK_MUAS[1]; // Elena Rostova

  const [galleryItems, setGalleryItems] = useState([
    {
      id: 1,
      image: artist.portfolio[0] || 'https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=800&q=80',
      title: 'Ethereal Glow',
      category: 'BRIDAL GLAM'
    },
    {
      id: 2,
      image: artist.portfolio[1] || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      title: 'Soft Matte Excellence',
      category: 'DAILY STYLES'
    },
    {
      id: 3,
      image: artist.portfolio[2] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      title: 'Modern Event Glam',
      category: 'EVENT'
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategoryModal, setNewCategoryModal] = useState('Bridal Glam');
  const [newLink, setNewLink] = useState('');

  const categories = ['All', 'Bridal Glam', 'Daily Styles', 'Event'];
  const modalCategories = ['Bridal Glam', 'Editorial', 'Daily Styles', 'Masterclass'];
  
  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWechatShare = (lookTitle: string) => {
    showToast(`Ready to share "${lookTitle}" to WeChat`);
  };

  const handleCreatePortfolio = () => {
    if (!newTitle) {
      showToast('Please enter a title');
      return;
    }
    
    const newItem = {
      id: Date.now(),
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', // Mock image
      title: newTitle,
      category: newCategoryModal.toUpperCase()
    };

    setGalleryItems([newItem, ...galleryItems]);
    setIsNewPortfolioOpen(false);
    setNewTitle('');
    setNewCategoryModal('Bridal Glam');
    setNewLink('');
    showToast('Portfolio item created');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen bg-[#FAF9F6] relative">
      <header className="sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md z-40 px-6 pt-12 pb-4 flex flex-col items-center max-w-md mx-auto">
        <h1 className="text-xl font-serif text-[#D4AF37] tracking-[0.2em] uppercase mb-6 text-center w-full">GALLERY</h1>
        
        {/* Filter Tabs */}
        <div className="w-full overflow-x-auto no-scrollbar pb-1 -mx-6 px-6">
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-5 py-2 rounded-full text-[11px] font-medium whitespace-nowrap transition-all uppercase tracking-widest border",
                  selectedCategory === category 
                    ? "bg-[#2C2C2C] text-white border-[#2C2C2C] shadow-md" 
                    : "bg-white/60 text-[#8E8E8E] border-gray-200 hover:border-[#D4AF37] backdrop-blur-sm"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="px-4 py-2 grid grid-cols-2 gap-3 max-w-md mx-auto">
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              onClick={() => navigate(`/crm/gallery/${item.id}`, { state: { look: item } })}
              className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden luxury-shadow group cursor-pointer"
            >
              <img 
                src={item.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer" 
                alt={item.title} 
              />
              
              {/* Glassmorphism Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-[16px] p-3 flex flex-col gap-2 shadow-lg">
                  <div className="flex flex-col">
                    <h3 className="font-serif text-[13px] leading-tight text-[#2C2C2C] font-semibold line-clamp-1">{item.title}</h3>
                    <span className="text-[8px] text-[#2C2C2C]/80 uppercase tracking-widest font-medium mt-0.5">{item.category}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWechatShare(item.title);
                    }}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 transition-colors flex items-center justify-center text-[#2C2C2C] shadow-sm active:scale-95 border border-white/50 backdrop-blur-sm"
                  >
                    <Share size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-[#8E8E8E]">
            No works found in this category.
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 left-0 right-0 max-w-md mx-auto px-6 pointer-events-none z-40 flex justify-end">
        <button 
          onClick={() => setIsNewPortfolioOpen(true)}
          className="w-14 h-14 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform pointer-events-auto"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* New Portfolio Modal */}
      <AnimatePresence>
        {isNewPortfolioOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 right-0 z-[60] flex justify-center pointer-events-none"
          >
            <div className="w-full max-w-md flex flex-col h-full bg-[#FAF9F6] relative pointer-events-auto shadow-2xl">
              <header className="px-6 py-5 flex items-center bg-[#FAF9F6] z-10">
                <button onClick={() => setIsNewPortfolioOpen(false)} className="p-1 -ml-2 text-[#2C2C2C] hover:text-[#D4AF37] transition-colors absolute left-6">
                  <ChevronLeft size={24} strokeWidth={1.5} />
                </button>
                <h1 className="flex-1 text-center font-serif text-2xl text-[#2C2C2C]">New Portfolio</h1>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
                {/* Photo Upload Area */}
                <div className="w-full h-40 rounded-[24px] border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center gap-4 bg-white/50 hover:bg-white transition-colors cursor-pointer mb-8">
                  <div className="w-12 h-12 rounded-full border border-[#2C2C2C] flex items-center justify-center text-[#2C2C2C]">
                    <ImageIcon size={20} strokeWidth={1.5} />
                    <Plus size={12} strokeWidth={2} className="absolute ml-5 -mt-5 bg-white rounded-full p-0.5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#2C2C2C] mb-1">Add Main Photo</p>
                    <p className="text-[11px] text-[#8E8E8E]">High resolution, vertical preferred</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm text-[#2C2C2C] mb-3">Work Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="E.g., Summer Garden Romance"
                      className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#2C2C2C] mb-3">Category</label>
                    <div className="flex flex-wrap gap-3">
                      {modalCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewCategoryModal(cat)}
                          className={cn(
                            "px-5 py-2.5 rounded-full text-sm transition-all",
                            newCategoryModal === cat
                              ? "bg-[#D4AF37] text-white shadow-md font-medium"
                              : "bg-[#F5F5F5] text-[#2C2C2C] hover:bg-gray-200"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-[#2C2C2C] mb-3">
                      <span className="text-xs">🔗</span> External Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="Vimeo or YouTube URL"
                      className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Fixed Area */}
              <div className="p-6 pb-12 bg-white border-t border-gray-100">
                <button
                  onClick={handleCreatePortfolio}
                  className="w-full bg-[#D4AF37] text-white py-4 rounded-full text-[13px] font-medium tracking-widest uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Confirm & Create
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#2C2C2C] text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl z-50 whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ArtistProfileScreen = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const artist = MOCK_MUAS[1]; // Elena Rostova
  const [name, setName] = useState(artist.name);
  const [title, setTitle] = useState(artist.title);
  const [city, setCity] = useState(artist.city);
  const [bio, setBio] = useState(artist.bio);
  const [portfolio, setPortfolio] = useState(artist.portfolio);
  const [services, setServices] = useState(artist.services);
  const [priceErrors, setPriceErrors] = useState<Record<string, string>>({});
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteImage = (index: number) => {
    setImageToDelete(index);
  };

  const confirmDeleteImage = () => {
    if (imageToDelete !== null) {
      setPortfolio(portfolio.filter((_, i) => i !== imageToDelete));
      setImageToDelete(null);
    }
  };

  const handleSave = () => {
    if (Object.keys(priceErrors).length === 0) {
      artist.name = name;
      artist.title = title;
      artist.city = city;
      artist.bio = bio;
      artist.portfolio = portfolio;
      artist.services = services;
      setIsEditing(false);
      showToast('Profile saved successfully');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header 
        title="Works Showcase" 
        rightElement={
          isEditing ? (
            <button 
              onClick={handleSave} 
              disabled={Object.keys(priceErrors).length > 0}
              className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase disabled:opacity-50 transition-opacity"
            >
              Save
            </button>
          ) : null
        } 
      />
      
      <div className="px-6 py-6 space-y-8">
        {/* Portfolio Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg text-[#2C2C2C]">Portfolio</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
            <Reorder.Group 
              axis="x" 
              values={portfolio} 
              onReorder={setPortfolio} 
              className="flex gap-4"
            >
              {portfolio.map((img, idx) => (
                <Reorder.Item 
                  key={img} 
                  value={img}
                  dragListener={isEditing}
                  onClick={() => !isEditing && setSelectedImageIndex(idx)}
                  className={cn(
                    "relative flex-shrink-0 w-40 h-56 rounded-[24px] overflow-hidden luxury-shadow group transition-transform",
                    isEditing ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                  {isEditing && (
                    <>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#2C2C2C] shadow-sm backdrop-blur-sm cursor-grab active:cursor-grabbing">
                        <GripVertical size={16} />
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(idx);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 shadow-sm backdrop-blur-sm transition-colors z-10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {isEditing && (
              <div className="flex-shrink-0 w-40 h-56 rounded-[24px] border-2 border-dashed border-[#D4AF37] flex flex-col items-center justify-center gap-3 text-[#D4AF37] cursor-pointer hover:bg-[#F4E8C8]/20 transition-colors bg-[#F4E8C8]/10 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-md">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-medium uppercase tracking-widest">Upload Photo</span>
              </div>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg text-[#2C2C2C]">My Services</h3>
          </div>
          
          {!isEditing && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
              {['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as string)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                    selectedCategory === category 
                      ? "bg-[#D4AF37] text-white shadow-md" 
                      : "bg-white text-[#8E8E8E] border border-gray-200 hover:border-[#D4AF37]"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <Reorder.Group 
            axis="y" 
            values={isEditing ? services : (selectedCategory === 'All' ? services : services.filter(s => s.category === selectedCategory))} 
            onReorder={isEditing ? setServices : () => {}} 
            className="space-y-4"
          >
            {(isEditing ? services : (selectedCategory === 'All' ? services : services.filter(s => s.category === selectedCategory))).map((service, idx) => (
              <Reorder.Item 
                key={service.id} 
                value={service} 
                dragListener={isEditing}
                className={cn(
                  "bg-white rounded-[24px] p-5 luxury-shadow border border-gray-50 relative",
                  isEditing && "cursor-grab active:cursor-grabbing"
                )}
              >
                {isEditing && (
                  <button 
                    onClick={() => setServices(services.filter((_, i) => i !== idx))}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition-colors z-10"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                {isEditing ? (
                  <div className="space-y-3 pr-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-gray-300 cursor-grab active:cursor-grabbing">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                      </div>
                      <input 
                        type="text" 
                        value={service.name}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].name = e.target.value;
                          setServices(newServices);
                        }}
                        className="font-medium text-[#2C2C2C] w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Service Name"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/3 flex flex-col gap-1">
                        <select
                          value={service.category || ''}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[idx].category = e.target.value;
                            setServices(newServices);
                          }}
                          className="text-xs text-[#8E8E8E] w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="">Category...</option>
                          <option value="Bridal">Bridal</option>
                          <option value="Event">Event</option>
                          <option value="Daily Makeup">Daily Makeup</option>
                          <option value="Photoshoot">Photoshoot</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="w-1/3 flex flex-col gap-1">
                        <input 
                          type="number" 
                          value={service.price === 0 && priceErrors[service.id] ? '' : service.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            const numVal = Number(val);
                            const newServices = [...services];
                            newServices[idx].price = numVal;
                            setServices(newServices);
                            
                            if (val === '' || numVal <= 0) {
                              setPriceErrors(prev => ({ ...prev, [service.id]: 'Invalid price' }));
                            } else {
                              setPriceErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[service.id];
                                return newErrors;
                              });
                            }
                          }}
                          className={cn(
                            "font-serif text-[#D4AF37] w-full bg-gray-50 border rounded-lg px-3 py-2 focus:outline-none transition-all",
                            priceErrors[service.id] ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400" : "border-gray-100 focus:border-[#D4AF37]"
                          )}
                          placeholder="Price"
                          min="0"
                          step="0.01"
                        />
                        {priceErrors[service.id] && (
                          <span className="text-[10px] text-red-500">{priceErrors[service.id]}</span>
                        )}
                      </div>
                      <div className="w-1/3 flex flex-col gap-1">
                        <select
                          value={service.duration || ''}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[idx].duration = e.target.value;
                            setServices(newServices);
                          }}
                          className="text-xs text-[#8E8E8E] w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="">Duration...</option>
                          <option value="30 mins">30 mins</option>
                          <option value="45 mins">45 mins</option>
                          <option value="1 hour">1 hour</option>
                          <option value="1.5 hours">1.5 hours</option>
                          <option value="2 hours">2 hours</option>
                          <option value="2.5 hours">2.5 hours</option>
                          <option value="3 hours">3 hours</option>
                          <option value="4 hours">4 hours</option>
                          <option value="5+ hours">5+ hours</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].description = e.target.value;
                          setServices(newServices);
                        }}
                        className="w-full text-xs text-[#2C2C2C] bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37] min-h-[80px] resize-y"
                        placeholder="Service Description"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium uppercase tracking-widest text-[#8E8E8E] ml-1">Materials Used (Optional)</label>
                      <textarea
                        value={service.materialsUsed || ''}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].materialsUsed = e.target.value;
                          setServices(newServices);
                        }}
                        className="w-full text-xs text-[#2C2C2C] bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37] min-h-[60px] resize-y"
                        placeholder="e.g., MAC, Charlotte Tilbury..."
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline px-1">
                        <label className="text-[10px] font-medium uppercase tracking-widest text-[#8E8E8E]">Styling Notes (Optional)</label>
                        <span className="text-[9px] text-[#8E8E8E] lowercase normal-case">Tips or suitability info</span>
                      </div>
                      <textarea
                        value={service.stylingNotes || ''}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].stylingNotes = e.target.value;
                          setServices(newServices);
                        }}
                        className="w-full text-xs text-[#2C2C2C] bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37] min-h-[60px] resize-y"
                        placeholder="e.g., Ideal for outdoor summer weddings, includes heavy setting spray..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium uppercase tracking-widest text-[#8E8E8E] ml-1">Video Link (Optional)</label>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus-within:border-[#D4AF37]">
                        <Video size={14} className="text-[#8E8E8E]" />
                        <input 
                          type="url" 
                          value={service.videoUrl || ''}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[idx].videoUrl = e.target.value;
                            setServices(newServices);
                          }}
                          className="text-xs text-[#2C2C2C] w-full bg-transparent focus:outline-none"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2 pr-6">
                      <h4 className="font-medium text-[#2C2C2C]">{service.name}</h4>
                      <span className="font-serif text-[#D4AF37]">${service.price}</span>
                    </div>
                    <div className="text-xs text-[#8E8E8E] mb-3 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                      <Markdown>{service.description}</Markdown>
                    </div>
                    
                    {(service.materialsUsed || service.stylingNotes) && (
                      <div className="space-y-2 mb-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {service.materialsUsed && (
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-widest text-[#2C2C2C] block mb-1">Materials:</span>
                            <div className="text-xs text-[#8E8E8E] prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-li:my-0">
                              <Markdown>{service.materialsUsed}</Markdown>
                            </div>
                          </div>
                        )}
                        {service.stylingNotes && (
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-widest text-[#2C2C2C] block mb-1 mt-2">Styling & Suitability:</span>
                            <div className="text-xs text-[#8E8E8E] prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-li:my-0">
                              <Markdown>{service.stylingNotes}</Markdown>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 text-[10px] text-[#8E8E8E] uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                        <Clock size={10} /> {service.duration}
                      </div>
                      {service.category && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-[#D4AF37] uppercase tracking-widest bg-[#F4E8C8]/30 px-2 py-1 rounded-md">
                          {service.category}
                        </div>
                      )}
                      {service.videoUrl && (
                        <a 
                          href={service.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-blue-500 uppercase tracking-widest bg-blue-50 hover:bg-blue-100 transition-colors px-2 py-1 rounded-md ml-auto"
                        >
                          <PlayCircle size={12} /> Watch Video
                        </a>
                      )}
                    </div>
                  </>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
          
          {isEditing && (
            <button 
              onClick={() => {
                const newId = `s-${Date.now()}`;
                setServices([...services, { id: newId, name: '', price: 0, duration: '', description: '', materialsUsed: '', stylingNotes: '' }]);
                setPriceErrors(prev => ({ ...prev, [newId]: 'Invalid price' }));
                showToast("New service added");
              }}
              className="w-full mt-4 py-4 border-2 border-dashed border-[#D4AF37] text-[#D4AF37] rounded-[24px] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#F4E8C8]/20 transition-colors bg-[#F4E8C8]/10 shadow-sm"
            >
              <Plus size={18} /> Add New Service
            </button>
          )}
        </div>

        {/* Edit Button */}
        {!isEditing ? (
          <div className="space-y-4 mt-8">
            <button onClick={() => setIsEditing(true)} className="w-full bg-[#2C2C2C] text-white rounded-[24px] p-5 flex items-center justify-between luxury-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
                  <Edit2 size={18} />
                </div>
                <span className="font-medium">Edit Portfolio</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <button 
              onClick={() => {
                if (Object.keys(priceErrors).length === 0) {
                  setIsEditing(false);
                  showToast("Profile saved successfully");
                }
              }}
              disabled={Object.keys(priceErrors).length > 0}
              className="w-full bg-[#2C2C2C] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              Confirm Changes
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {imageToDelete !== null && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center luxury-shadow"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={32} />
              </div>
              <h3 className="font-serif text-2xl text-[#2C2C2C] mb-2">Delete Image?</h3>
              <p className="text-sm text-[#8E8E8E] mb-6">Are you sure you want to remove this image from your portfolio? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setImageToDelete(null)}
                  className="flex-1 py-4 rounded-full font-medium tracking-widest text-xs uppercase border border-gray-200 text-[#2C2C2C]"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteImage}
                  className="flex-1 bg-red-500 text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#2C2C2C] text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl z-50 whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center touch-none"
          >
            <button 
              onClick={() => setSelectedImageIndex(null)} 
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white z-[110] hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
            
            <motion.div 
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(e, { offset }) => {
                const swipe = offset.x;
                if (swipe < -50 && selectedImageIndex < portfolio.length - 1) {
                  setSelectedImageIndex(selectedImageIndex + 1);
                } else if (swipe > 50 && selectedImageIndex > 0) {
                  setSelectedImageIndex(selectedImageIndex - 1);
                }
              }}
              className="w-full h-full flex items-center justify-center absolute cursor-grab active:cursor-grabbing"
            >
              <img src={portfolio[selectedImageIndex]} className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" draggable={false} />
            </motion.div>
            
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-[110]">
              {portfolio.map((_, i) => (
                <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === selectedImageIndex ? "bg-white w-3" : "bg-white/30")} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const ArtistLoginScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Mocking WeChat Cloud Base function call. AI and authentication logic must be handled safely at the backend.
    console.log("Mocking Cloud Base Function call for WeChat OpenID.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoading(false);
    navigate('/crm', { replace: true });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-[24px] luxury-shadow flex items-center justify-center mb-8">
          <Sparkles className="text-[#D4AF37]" size={36} />
        </div>
        <h1 className="font-serif text-3xl text-[#2C2C2C] mb-2 text-center">觅妆Meety</h1>
        <p className="text-sm text-[#8E8E8E] mb-12 tracking-widest uppercase">化妆师私人助理</p>

        <button 
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-[#07C160] hover:bg-[#06ad56] text-white py-4 rounded-full text-sm font-medium shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <MessageCircle size={20} className="fill-white text-white" />
          )}
          <span>{isLoading ? '授权中...' : '微信一键授权登录'}</span>
        </button>

        <p className="text-[10px] text-[#8E8E8E] mt-6 text-center">
          登录即表示同意<a href="#" className="underline">服务条款</a>和<a href="#" className="underline">隐私政策</a>
        </p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [role, setRole] = useState<'bride' | 'artist' | null>('artist'); // Default to artist

  return (
    <Router>
      <div className="min-h-screen bg-[#E5E5E5] font-sans selection:bg-[#F4E8C8] selection:text-[#2C2C2C] flex justify-center">
        <div className="w-full max-w-md bg-[#FAF9F6] min-h-screen shadow-2xl relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              {/* === B-Side (Artist) Routes === */}
              <Route path="/login" element={<ArtistLoginScreen />} />
              <Route path="/" element={<AuthGuard><CRMScreen /></AuthGuard>} />
              <Route path="/crm" element={<AuthGuard><CRMScreen /></AuthGuard>} />
              <Route path="/crm/clients" element={<AuthGuard><ClientListScreen /></AuthGuard>} />
              <Route path="/crm/client/:id" element={<AuthGuard><ClientArchiveScreen /></AuthGuard>} />
              <Route path="/crm/monthly-tracking" element={<AuthGuard><MonthlyTrackingScreen Header={Header} /></AuthGuard>} />
              <Route path="/crm/gallery" element={<AuthGuard><GalleryScreen /></AuthGuard>} />
              <Route path="/crm/gallery/:id" element={<AuthGuard><PortfolioLookDetailsScreen /></AuthGuard>} />
              <Route path="/crm/appointment/:id" element={<AuthGuard><CRMAppointmentDetailScreen Header={Header} /></AuthGuard>} />
              <Route path="/settings" element={<AuthGuard><SettingsScreen Header={Header} /></AuthGuard>} />

              {/* === C-Side (Bride) Routes - Hidden / Commented Out === */}
              {/* 
              <Route path="/role-select" element={<RoleSelectScreen setRole={setRole} />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/checklist" element={<ChecklistScreen />} />
              <Route path="/ai-match" element={<AIMatchEntryScreen />} />
              <Route path="/ai-match/flow/:type" element={<AIMatchFlowScreenWrapper />} />
              <Route path="/ai-match/loading" element={<AIMatchLoadingScreen />} />
              <Route path="/ai-match/results" element={<MatchResultScreen />} />
              <Route path="/bookings" element={<BookingListScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/artist/:id" element={<PublicArtistProfileScreen Header={Header} />} />
              <Route path="/book/:id" element={<BookingScreen Header={Header} />} />
              <Route path="/chat" element={<ChatScreen Header={Header} />} />
              <Route path="/order/:id" element={<OrderDetailsScreen Header={Header} />} />
              <Route path="/saved-artists" element={<SavedArtistsScreen Header={Header} />} />
              */}
            </Routes>
          </AnimatePresence>
          <BottomNav role="artist" />
        </div>
      </div>
    </Router>
  );
}
