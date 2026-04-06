import React, { useState, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Sparkles, User, ChevronLeft, Calendar, 
  CheckCircle2, ArrowRight, Clock, MapPin, MessageCircle, 
  Plus, ChevronDown, ChevronUp, Search, Settings, Heart, LogOut, Phone,
  ChevronRight, Star, Users, Image as ImageIcon, X, Trash2, GripVertical
} from 'lucide-react';
import { cn } from './lib/utils';
import { MOCK_MUAS, MOCK_CHECKLIST, MOCK_CLIENTS, MOCK_APPOINTMENTS, MOCK_ORDERS } from './constants';
import { PublicArtistProfileScreen, BookingScreen, ChatScreen, OrderDetailsScreen, SavedArtistsScreen, SettingsScreen, CRMAppointmentDetailScreen } from './newScreens';

// --- Shared Components ---

const BottomNav = ({ role }: { role: 'bride' | 'artist' }) => {
  const location = useLocation();
  if (location.pathname === '/role-select') return null;

  const navItems = role === 'bride' ? [
    { path: '/home', icon: Home, label: 'Explore' },
    { path: '/checklist', icon: CheckCircle2, label: 'Checklist' },
    { path: '/ai-match', icon: Sparkles, label: 'AI Match' },
    { path: '/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ] : [
    { path: '/crm', icon: Calendar, label: 'Schedule' },
    { path: '/crm/clients', icon: Users, label: 'Clients' },
    { path: '/crm/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-around items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-colors duration-300",
              isActive ? "text-[#D4AF37]" : "text-[#8E8E8E] hover:text-[#2C2C2C]"
            )}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[9px] font-medium tracking-widest uppercase">{item.label}</span>
          </Link>
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
  const [checklist, setChecklist] = useState(MOCK_CHECKLIST);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);
  const [tempHiddenCategories, setTempHiddenCategories] = useState<string[]>([]);

  const openPlanModal = () => {
    setTempHiddenCategories(hiddenCategories);
    setIsPlanModalOpen(true);
  };

  const savePlan = () => {
    setHiddenCategories(tempHiddenCategories);
    setIsPlanModalOpen(false);
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

  const visibleChecklist = checklist.filter(cat => !hiddenCategories.includes(cat.id));

  const totalTasks = visibleChecklist.reduce((acc, cat) => acc + cat.tasks.length, 0);
  const completedTasks = visibleChecklist.reduce((acc, cat) => acc + cat.tasks.filter(t => t.completed).length, 0);
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  const strokeDashoffset = 283 - (283 * progressPercentage) / 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="The Wedding Checklist" showBack />
      
      <div className="px-6 py-6">
        {/* Dashboard Header */}
        <div className="bg-white rounded-[32px] p-8 luxury-shadow mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8E8E8E] tracking-widest uppercase mb-2">Wedding Date</p>
            <p className="font-serif text-xl text-[#2C2C2C] mb-4">Oct 12, 2026</p>
            <p className="text-sm text-[#D4AF37] font-medium">185 Days to go</p>
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
            <button onClick={() => navigate('/home')} className="flex-1 border border-[#D4AF37] text-[#D4AF37] py-3.5 rounded-full text-xs font-medium tracking-widest uppercase active:scale-95 transition-all">Find Artist</button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsDateModalOpen(true)} className="flex-1 bg-white border border-gray-100 text-[#2C2C2C] py-3.5 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-gray-50 flex items-center justify-center gap-2 transition-all active:scale-95">
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
            const completedCount = category.tasks.filter(t => t.completed).length;
            const progress = Math.round((completedCount / category.tasks.length) * 100);
            
            return (
              <div key={category.id} className="bg-white rounded-[28px] luxury-shadow overflow-hidden transition-all duration-300 border border-gray-50/50">
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : category.id)}
                  className="w-full px-7 py-6 flex items-center justify-between group"
                >
                  <div className="flex flex-col items-start flex-1 pr-6">
                    <div className="flex items-center justify-between w-full mb-4">
                      <span className="font-serif text-[19px] text-[#2C2C2C] group-hover:text-[#D4AF37] transition-colors">{category.title}</span>
                      <span className="text-xs font-semibold text-[#8E8E8E] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/80">{completedCount}/{category.tasks.length}</span>
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
                        category.tasks.reduce((acc, task) => {
                          const sub = task.subCategory || 'Other';
                          if (!acc[sub]) acc[sub] = [];
                          acc[sub].push(task);
                          return acc;
                        }, {} as Record<string, typeof category.tasks>)
                      ).map(([subCat, tasks]: [string, any]) => (
                        <div key={subCat} className="mb-5 last:mb-0">
                          <h4 className="text-[11px] font-bold text-[#8E8E8E] uppercase tracking-widest mb-4 pl-3 border-l-2 border-[#D4AF37]">{subCat}</h4>
                          <div className="space-y-3.5">
                            {tasks.map(task => (
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
                                  {task.assignee && (
                                    <div className="flex items-center gap-2 mt-3">
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
              <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] mb-6" />
              <button onClick={() => setIsDateModalOpen(false)} className="w-full bg-[#D4AF37] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg shadow-[#D4AF37]/30">Save Date</button>
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
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 pb-12 z-[60] max-w-md mx-auto max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-[#2C2C2C]">Customize Plan</h3>
                <button onClick={() => setIsPlanModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-[#8E8E8E] hover:text-[#2C2C2C]"><X size={20} /></button>
              </div>
              <p className="text-sm text-[#8E8E8E] mb-6">Add or remove phases from your wedding checklist.</p>
              
              <div className="space-y-3 mb-8">
                {checklist.map(cat => {
                  const isHidden = tempHiddenCategories.includes(cat.id);
                  return (
                    <div 
                      key={cat.id} 
                      onClick={() => {
                        if (isHidden) {
                          setTempHiddenCategories(prev => prev.filter(id => id !== cat.id));
                        } else {
                          setTempHiddenCategories(prev => [...prev, cat.id]);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all active:scale-[0.98]",
                        isHidden ? "border-gray-100 bg-gray-50/50" : "border-[#D4AF37]/30 bg-white"
                      )}
                    >
                      <span className={cn(
                        "font-medium transition-colors",
                        isHidden ? "text-[#8E8E8E]" : "text-[#2C2C2C]"
                      )}>{cat.title}</span>
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        isHidden ? "border-gray-300 bg-transparent" : "border-[#D4AF37] bg-[#D4AF37] text-white"
                      )}>
                        {!isHidden && <CheckCircle2 size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={savePlan} className="w-full bg-[#D4AF37] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg shadow-[#D4AF37]/30">Save Plan</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CRMScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockStart, setBlockStart] = useState('15:00');
  const [blockEnd, setBlockEnd] = useState('16:00');

  const filteredAppointments = appointments.filter(apt => 
    apt.status === 'blocked' || 
    (apt.clientName && apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBlockTime = () => {
    const newBlock = {
      id: `block-${Date.now()}`,
      startTime: blockStart,
      endTime: blockEnd,
      status: 'blocked' as const
    };
    const updated = [...appointments, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime));
    setAppointments(updated);
    setIsBlockModalOpen(false);
    setIsFabOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <div className="px-6 pt-12 pb-6">
        <h1 className="font-serif text-2xl text-[#2C2C2C] mb-1">Welcome back, Elena.</h1>
        <p className="text-sm text-[#8E8E8E]">Here is your schedule for today.</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-8">
        <div className="relative">
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
      </div>

      {/* Financial Snapshot */}
      <div className="px-6 mb-8">
        <div className="bg-[#2C2C2C] rounded-[32px] p-8 text-[#FAF9F6] luxury-shadow">
          <p className="text-xs text-[#FAF9F6]/60 tracking-widest uppercase mb-2">Monthly Revenue</p>
          <p className="font-serif text-4xl mb-6">$4,500</p>
          <div className="flex justify-between border-t border-[#FAF9F6]/10 pt-6">
            <div>
              <p className="text-xl font-medium">12</p>
              <p className="text-[10px] text-[#FAF9F6]/60 tracking-widest uppercase mt-1">Upcoming</p>
            </div>
            <div>
              <p className="text-xl font-medium">4.9</p>
              <p className="text-[10px] text-[#FAF9F6]/60 tracking-widest uppercase mt-1">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto px-6 pb-4 no-scrollbar">
          {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17'].map((day, i) => {
            const isActive = day === 'Thu 15';
            return (
              <div key={day} className={cn(
                "flex-shrink-0 w-16 h-20 rounded-[16px] flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20" : "bg-white text-[#2C2C2C] border border-gray-100"
              )}>
                <span className="text-[10px] uppercase tracking-widest opacity-80">{day.split(' ')[0]}</span>
                <span className="text-lg font-medium">{day.split(' ')[1]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-[#2C2C2C]">Schedule</h3>
          <span className="text-xs font-medium text-[#D4AF37] bg-[#F4E8C8]/50 px-3 py-1 rounded-full">{filteredAppointments.length} Appts</span>
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
                
                <p className="text-xs text-[#8E8E8E] font-medium mb-3">{apt.startTime} - {apt.endTime}</p>
                
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

      {/* FAB Menu */}
      <AnimatePresence>
        {isFabOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-40 right-6 flex flex-col items-end gap-3 z-40"
          >
            <button
              onClick={() => { setIsBlockModalOpen(true); setIsFabOpen(false); }}
              className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full luxury-shadow text-sm font-medium text-[#2C2C2C] hover:bg-gray-50 transition-colors"
            >
              <span>Block Time</span>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#8E8E8E]">
                <Clock size={16} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button 
        onClick={() => setIsFabOpen(!isFabOpen)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#2C2C2C] text-white rounded-full flex items-center justify-center shadow-xl z-40 hover:scale-105 transition-transform"
      >
        <motion.div animate={{ rotate: isFabOpen ? 45 : 0 }}>
          <Plus size={24} />
        </motion.div>
      </button>

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
              </div>

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
    </motion.div>
  );
};

const ClientArchiveScreen = () => {
  const { id } = useParams();
  const client = MOCK_CLIENTS.find(c => c.id === id) || MOCK_CLIENTS[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Client Profile" showBack />
      
      {/* Profile Header */}
      <div className="px-6 py-8 flex flex-col items-center text-center">
        <img src={client.avatar} className="w-28 h-28 rounded-full object-cover mb-4 luxury-shadow" referrerPolicy="no-referrer" />
        <h2 className="font-serif text-2xl text-[#2C2C2C] mb-2">{client.name}</h2>
        <p className="text-sm text-[#8E8E8E] mb-4">{client.phone}</p>
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

      {/* Formula & Notes */}
      <div className="px-6 mb-10">
        <h3 className="font-serif text-xl text-[#2C2C2C] mb-4">Formula & Notes</h3>
        <div className="bg-[#FFFDF9] border border-[#D4AF37]/20 rounded-[24px] p-6 luxury-shadow">
          <p className="text-sm text-[#2C2C2C]/80 leading-relaxed font-serif italic">
            "{client.notes}"
          </p>
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
        <button className="flex-1 border border-[#2C2C2C] text-[#2C2C2C] py-4 rounded-full text-xs font-medium tracking-widest uppercase bg-[#FAF9F6]/80 backdrop-blur-md">Message</button>
        <button className="flex-1 bg-[#2C2C2C] text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase shadow-xl">Book New</button>
      </div>
    </motion.div>
  );
};

const AIMatchScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [vision, setVision] = useState('');

  const options = [
    { id: 1, title: 'Ethereal Glow', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' },
    { id: 2, title: 'Classic Elegance', img: 'https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=400&q=80' },
    { id: 3, title: 'Modern Glam', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80' },
    { id: 4, title: 'Soft Romantic', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("min-h-screen flex flex-col relative transition-all duration-500", selected ? "pb-[380px]" : "pb-24")}>
      <Header title="AI Assessment" showBack />
      
      {/* Progress Bar */}
      <div className="px-6 pt-2 pb-8">
        <div className="h-0.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] w-2/5 transition-all duration-500" />
        </div>
        <p className="text-[10px] text-[#8E8E8E] uppercase tracking-widest mt-3 text-center">Step 2 of 5</p>
      </div>

      <div className="px-6 flex-1">
        <h2 className="font-serif text-3xl text-[#2C2C2C] mb-8 text-center leading-tight">Which bridal aesthetic resonates most with your vision?</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {options.map(opt => {
            const isSelected = selected === opt.id;
            return (
              <div 
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={cn(
                  "relative rounded-[24px] overflow-hidden aspect-[4/5] cursor-pointer transition-all duration-300",
                  isSelected ? "ring-2 ring-[#D4AF37] ring-offset-4 ring-offset-[#FAF9F6]" : "opacity-80 hover:opacity-100"
                )}
              >
                <img src={opt.img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 to-transparent flex items-end p-4">
                  <p className="text-white font-serif text-sm">{opt.title}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 p-6 z-50 max-w-md mx-auto"
          >
            <div className="bg-gradient-to-b from-[#F8F6F0] to-[#EBE6DC] rounded-[32px] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border border-white/60">
              <p className="text-center text-[#9A8C88] italic text-sm mb-4 font-medium">
                Tell us more about your vision (Optional)
              </p>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="e.g., I love a natural look with a hint of gold..."
                className="w-full bg-white/90 border border-white rounded-2xl p-4 text-sm text-[#2C2C2C] placeholder-[#C4BDBA] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none h-24 shadow-inner"
              />
              <button
                onClick={() => navigate('/match-results')}
                className="w-full mt-6 bg-gradient-to-r from-[#C29B38] to-[#D4AF37] text-white py-4 rounded-full font-medium shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                Confirm & Match <Sparkles size={18} className="text-white" />
              </button>
              <button onClick={() => navigate('/match-results')} className="w-full mt-4 text-[#9A8C88] text-sm font-medium flex items-center justify-center gap-1 transition-colors hover:text-[#2C2C2C]">
                Next <ChevronRight size={16} />
              </button>
              <p className="text-center text-[10px] text-[#B5ABA7] uppercase tracking-widest mt-6 font-medium">
                STEP 3 / 5 COMPLETE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BookingListScreen = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="My Appointments" />
      
      <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar">
        {['All', 'Upcoming', 'Completed', 'Canceled'].map((filter, i) => (
          <button key={filter} className={cn(
            "px-5 py-2 rounded-full text-xs tracking-widest uppercase whitespace-nowrap transition-colors",
            i === 1 ? "bg-[#2C2C2C] text-white" : "border border-gray-200 text-[#8E8E8E]"
          )}>
            {filter}
          </button>
        ))}
      </div>

      <div className="px-6 mt-4 space-y-5">
        {MOCK_ORDERS.map(order => (
          <div key={order.id} className="bg-white rounded-[24px] p-6 luxury-shadow">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
              <h4 className="font-serif text-lg text-[#2C2C2C]">{order.muaName}</h4>
              <span className="px-3 py-1 bg-[#F4E8C8]/30 text-[#D4AF37] text-[10px] uppercase tracking-widest rounded-full font-medium">
                Confirmed
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
      </div>
    </motion.div>
  );
};

const MatchResultScreen = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitFeedback = () => {
    if (rating === 0) return;
    console.log('Feedback submitted for AI Match:', { rating, comment });
    setIsSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Your Matches" showBack />
      <div className="px-6 py-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4E8C8] text-[#D4AF37] mb-4">
            <Sparkles size={32} />
          </div>
          <h2 className="font-serif text-2xl text-[#2C2C2C] mb-2">We found your perfect artists</h2>
          <p className="text-sm text-[#8E8E8E]">Based on your preferences</p>
        </div>

        <div className="space-y-6 mb-12">
          {MOCK_MUAS.map(mua => (
            <div key={mua.id} className="bg-white rounded-[24px] overflow-hidden luxury-shadow">
              <div className="h-48 overflow-hidden relative">
                <img src={mua.portfolio[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#2C2C2C] flex items-center gap-1">
                  <Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" /> {mua.rating}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-serif text-xl text-[#2C2C2C]">{mua.name}</h3>
                    <p className="text-xs text-[#8E8E8E]">{mua.title}</p>
                  </div>
                  <span className="text-xs font-medium text-[#D4AF37] bg-[#F4E8C8]/50 px-2 py-1 rounded-md">98% Match</span>
                </div>
                <p className="text-sm text-[#2C2C2C]/80 mt-3 line-clamp-2">{mua.bio}</p>
                <button onClick={() => navigate(`/artist/${mua.id}`)} className="w-full mt-4 border border-[#2C2C2C] text-[#2C2C2C] py-3 rounded-full text-xs font-medium tracking-widest uppercase">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-[24px] p-6 luxury-shadow border border-gray-50">
          <h3 className="font-serif text-xl text-[#2C2C2C] mb-2">Rate your matches</h3>
          <p className="text-xs text-[#8E8E8E] mb-6">Your feedback helps us improve our AI matching model.</p>
          
          {isSubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-3">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-medium text-[#2C2C2C]">Thank you!</p>
              <p className="text-xs text-[#8E8E8E] mt-1">Your feedback has been logged.</p>
            </motion.div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      size={28} 
                      className={cn(
                        "transition-colors",
                        (hoveredRating || rating) >= star 
                          ? "text-[#D4AF37] fill-[#D4AF37]" 
                          : "text-gray-200"
                      )} 
                    />
                  </button>
                ))}
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you think (optional)..."
                className="w-full bg-gray-50 border border-gray-100 rounded-[16px] p-4 text-sm text-[#2C2C2C] placeholder-[#8E8E8E] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none h-24"
              />
              
              <button 
                onClick={handleSubmitFeedback}
                disabled={rating === 0}
                className="w-full bg-[#2C2C2C] text-white py-3.5 rounded-full text-xs font-medium tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
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
            className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-11 pr-4 text-sm text-[#2C2C2C] placeholder-[#8E8E8E] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all luxury-shadow"
          />
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

const ArtistProfileScreen = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const artist = MOCK_MUAS[1]; // Elena Rostova
  const [portfolio, setPortfolio] = useState(artist.portfolio);
  const [services, setServices] = useState(artist.services);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.parentNode as any);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newPortfolio = [...portfolio];
    const draggedItem = newPortfolio[draggedIndex];
    newPortfolio.splice(draggedIndex, 1);
    newPortfolio.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setPortfolio(newPortfolio);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDeleteImage = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header 
        title="My Artist Profile" 
        rightElement={
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        } 
      />
      
      <div className="px-6 py-8 flex flex-col items-center text-center border-b border-gray-100">
        <div className="relative w-28 h-28 rounded-full bg-gray-200 mb-4 overflow-hidden luxury-shadow">
          <img src={artist.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] cursor-pointer">
              <ImageIcon size={24} className="text-white" />
            </div>
          )}
        </div>
        
        {isEditing ? (
          <input 
            type="text" 
            defaultValue={artist.name} 
            className="font-serif text-2xl text-[#2C2C2C] mb-2 text-center bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#D4AF37] transition-colors" 
          />
        ) : (
          <h2 className="font-serif text-2xl text-[#2C2C2C] mb-1">{artist.name}</h2>
        )}
        
        {isEditing ? (
          <input 
            type="text" 
            defaultValue={artist.title} 
            className="text-sm text-[#8E8E8E] text-center bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#D4AF37] mt-1 transition-colors" 
          />
        ) : (
          <p className="text-sm text-[#8E8E8E]">{artist.title} · {artist.city}</p>
        )}
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Bio Section */}
        <div>
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-3">About Me</h3>
          {isEditing ? (
            <textarea 
              defaultValue={artist.bio} 
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] min-h-[100px] luxury-shadow transition-all" 
            />
          ) : (
            <p className="text-sm text-[#8E8E8E] leading-relaxed bg-white p-5 rounded-[24px] luxury-shadow border border-gray-50">{artist.bio}</p>
          )}
        </div>

        {/* Portfolio Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg text-[#2C2C2C]">Portfolio</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
            {portfolio.map((img, idx) => (
              <div 
                key={img} 
                className={cn(
                  "relative flex-shrink-0 w-40 h-56 rounded-[24px] overflow-hidden luxury-shadow group transition-transform",
                  draggedIndex === idx ? "opacity-50 scale-95" : "opacity-100 scale-100"
                )}
                draggable={isEditing}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
              >
                <img src={img} className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                {isEditing && (
                  <>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#2C2C2C] shadow-sm backdrop-blur-sm cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} />
                    </div>
                    <button 
                      onClick={() => handleDeleteImage(idx)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 shadow-sm backdrop-blur-sm transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}
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
            {isEditing && (
              <button className="text-[#D4AF37] text-xs font-medium uppercase tracking-widest flex items-center gap-1 bg-[#F4E8C8]/30 px-3 py-1.5 rounded-full">
                <Plus size={14} /> Add
              </button>
            )}
          </div>
          <div className="space-y-4">
            {services.map((service, idx) => (
              <div key={service.id} className="bg-white rounded-[24px] p-5 luxury-shadow border border-gray-50 relative">
                {isEditing && (
                  <button 
                    onClick={() => setServices(services.filter((_, i) => i !== idx))}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                {isEditing ? (
                  <div className="space-y-3 pr-6">
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
                    <div className="flex gap-3">
                      <input 
                        type="number" 
                        value={service.price}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].price = Number(e.target.value);
                          setServices(newServices);
                        }}
                        className="font-serif text-[#D4AF37] w-1/3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Price"
                      />
                      <input 
                        type="text" 
                        value={service.duration}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].duration = e.target.value;
                          setServices(newServices);
                        }}
                        className="text-xs text-[#8E8E8E] flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Duration (e.g., 2 hrs)"
                      />
                    </div>
                    <textarea 
                      value={service.description}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[idx].description = e.target.value;
                        setServices(newServices);
                      }}
                      className="w-full text-xs text-[#2C2C2C] bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37] resize-none h-16"
                      placeholder="Service Description"
                    />
                    <textarea 
                      value={service.materialsUsed || ''}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[idx].materialsUsed = e.target.value;
                        setServices(newServices);
                      }}
                      className="w-full text-xs text-[#2C2C2C] bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37] resize-none h-16"
                      placeholder="Materials Used (Optional)"
                    />
                    <textarea 
                      value={service.stylingNotes || ''}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[idx].stylingNotes = e.target.value;
                        setServices(newServices);
                      }}
                      className="w-full text-xs text-[#2C2C2C] bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37] resize-none h-16"
                      placeholder="Styling Notes (Optional)"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2 pr-6">
                      <h4 className="font-medium text-[#2C2C2C]">{service.name}</h4>
                      <span className="font-serif text-[#D4AF37]">${service.price}</span>
                    </div>
                    <p className="text-xs text-[#8E8E8E] mb-3">{service.description}</p>
                    
                    {(service.materialsUsed || service.stylingNotes) && (
                      <div className="space-y-2 mb-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {service.materialsUsed && (
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-widest text-[#2C2C2C]">Materials: </span>
                            <span className="text-xs text-[#8E8E8E]">{service.materialsUsed}</span>
                          </div>
                        )}
                        {service.stylingNotes && (
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-widest text-[#2C2C2C]">Notes: </span>
                            <span className="text-xs text-[#8E8E8E]">{service.stylingNotes}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="inline-flex items-center gap-1 text-[10px] text-[#8E8E8E] uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                      <Clock size={10} /> {service.duration}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings / Logout */}
        {!isEditing && (
          <button onClick={() => navigate('/role-select')} className="w-full bg-white rounded-[24px] p-5 flex items-center justify-between luxury-shadow group mt-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center text-red-400 group-hover:bg-red-50 transition-colors">
                <LogOut size={18} />
              </div>
              <span className="font-medium text-red-500">Switch Role / Logout</span>
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [role, setRole] = useState<'bride' | 'artist' | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-[#E5E5E5] font-sans selection:bg-[#F4E8C8] selection:text-[#2C2C2C] flex justify-center">
        <div className="w-full max-w-md bg-[#FAF9F6] min-h-screen shadow-2xl relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={role ? (role === 'bride' ? <HomeScreen /> : <CRMScreen />) : <RoleSelectScreen setRole={setRole} />} />
              <Route path="/role-select" element={<RoleSelectScreen setRole={setRole} />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/checklist" element={<ChecklistScreen />} />
              <Route path="/crm" element={<CRMScreen />} />
              <Route path="/crm/clients" element={<ClientListScreen />} />
              <Route path="/crm/client/:id" element={<ClientArchiveScreen />} />
              <Route path="/crm/profile" element={<ArtistProfileScreen />} />
              <Route path="/crm/appointment/:id" element={<CRMAppointmentDetailScreen Header={Header} />} />
              <Route path="/ai-match" element={<AIMatchScreen />} />
              <Route path="/match-results" element={<MatchResultScreen />} />
              <Route path="/bookings" element={<BookingListScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/artist/:id" element={<PublicArtistProfileScreen Header={Header} />} />
              <Route path="/book/:id" element={<BookingScreen Header={Header} />} />
              <Route path="/chat" element={<ChatScreen Header={Header} />} />
              <Route path="/order/:id" element={<OrderDetailsScreen Header={Header} />} />
              <Route path="/saved-artists" element={<SavedArtistsScreen Header={Header} />} />
              <Route path="/settings" element={<SettingsScreen Header={Header} />} />
            </Routes>
          </AnimatePresence>
          {role && <BottomNav role={role} />}
        </div>
      </div>
    </Router>
  );
}
