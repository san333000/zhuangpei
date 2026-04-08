import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sparkles, Upload, CheckCircle2, Star, MapPin, ChevronRight, X } from 'lucide-react';
import { cn } from './lib/utils';
import { MOCK_MUAS } from './constants';

const Header = ({ title, showBack = false, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#FAF9F6] sticky top-0 z-50">
      <div className="w-10">
        {showBack && (
          <button onClick={onBack || (() => navigate(-1))} className="p-2 -ml-2 text-[#2C2C2C] active:scale-95 transition-transform">
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <h1 className="font-serif text-lg text-[#2C2C2C]">{title}</h1>
      <div className="w-10" />
    </div>
  );
};

export const AIMatchEntryScreen = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-[#FAF9F6] pb-24">
      <Header title="Meety AI Match" showBack />

      <div className="flex-1 px-6 flex flex-col gap-6 justify-center mt-4">
        {/* Wedding Makeup Card */}
        <motion.div 
          whileTap={{ scale: 0.98, opacity: 0.9 }}
          onClick={() => navigate('/ai-match/flow/wedding')}
          className="relative rounded-[32px] overflow-hidden h-[40vh] cursor-pointer luxury-shadow"
        >
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" 
            alt="Wedding Makeup" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
            <h2 className="font-serif text-2xl text-white mb-2">I'm a Bride – Book Wedding Makeup</h2>
            <p className="text-white/80 text-sm">Custom bridal look + full-day touch-up service</p>
          </div>
        </motion.div>

        {/* Daily Makeup Card */}
        <motion.div 
          whileTap={{ scale: 0.98, opacity: 0.9 }}
          onClick={() => navigate('/ai-match/flow/daily')}
          className="relative rounded-[32px] overflow-hidden h-[40vh] cursor-pointer luxury-shadow"
        >
          <img 
            src="https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=800&q=80" 
            alt="Daily Makeup" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
            <h2 className="font-serif text-2xl text-white mb-2">I'm a Client – Book Daily Makeup</h2>
            <p className="text-white/80 text-sm">Daily / Date / Business / Portrait makeup</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const AIMatchFlowScreen = ({ type }: { type: 'wedding' | 'daily' }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState('');

  // State for selections (simplified for UI)
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleSelect = (category: string, value: string) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/ai-match/loading');
  };

  const renderWeddingStep1 = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-[#2C2C2C] mb-8 text-center leading-tight">Tell us about your big day</h2>
      <div className="space-y-4">
        <input type="date" className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-[#D4AF37] outline-none" placeholder="Wedding Date" />
        <input type="text" className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-[#D4AF37] outline-none" placeholder="Location (City/Venue)" />
        <select className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-[#D4AF37] outline-none">
          <option value="">Budget Range</option>
          <option value="1000-2000">$1,000 - $2,000</option>
          <option value="2000-4000">$2,000 - $4,000</option>
          <option value="4000+">$4,000+</option>
        </select>
        <div className="flex gap-3">
          {['On-site', 'In-store'].map(opt => (
            <button 
              key={opt}
              onClick={() => handleSelect('locationType', opt)}
              className={cn("flex-1 py-4 rounded-xl border text-sm font-medium transition-colors", selections.locationType === opt ? "border-[#D4AF37] bg-[#F4E8C8]/30 text-[#D4AF37]" : "border-gray-200 text-[#8E8E8E] bg-white")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWeddingStep2 = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-[#2C2C2C] mb-8 text-center leading-tight">What's your bridal style?</h2>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2C2C2C] mb-3">Bridal Style</p>
          <div className="flex flex-wrap gap-2">
            {['Korean', 'Chinese', 'Thai', 'Western Classic', 'Modern Glam'].map(opt => (
              <button 
                key={opt}
                onClick={() => handleSelect('bridalStyle', opt)}
                className={cn("px-4 py-2 rounded-full border text-sm transition-colors", selections.bridalStyle === opt ? "border-[#D4AF37] bg-[#F4E8C8]/30 text-[#D4AF37]" : "border-gray-200 text-[#8E8E8E] bg-white")}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-[#2C2C2C] mb-3">Makeup Finish</p>
          <div className="flex flex-wrap gap-2">
            {['Nude', 'Matte', 'Pearlescent', 'Dewy', 'Soft Glam'].map(opt => (
              <button 
                key={opt}
                onClick={() => handleSelect('makeupFinish', opt)}
                className={cn("px-4 py-2 rounded-full border text-sm transition-colors", selections.makeupFinish === opt ? "border-[#D4AF37] bg-[#F4E8C8]/30 text-[#D4AF37]" : "border-gray-200 text-[#8E8E8E] bg-white")}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWeddingStep3 = () => (
    <div className="space-y-6 flex flex-col h-full">
      <h2 className="font-serif text-3xl text-[#2C2C2C] mb-8 text-center leading-tight">Styling & Services</h2>
      <div className="space-y-4 flex-1">
        <div className="flex flex-wrap gap-2">
          {['Headdress Included', 'Full-day Service', 'Outdoor Touch-up', 'Bridesmaid Makeup', 'Mother Makeup'].map(opt => (
            <button 
              key={opt}
              onClick={() => handleSelect(`service_${opt}`, selections[`service_${opt}`] ? '' : 'yes')}
              className={cn("px-4 py-2 rounded-full border text-sm transition-colors", selections[`service_${opt}`] ? "border-[#D4AF37] bg-[#F4E8C8]/30 text-[#D4AF37]" : "border-gray-200 text-[#8E8E8E] bg-white")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDailyStep1 = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-[#2C2C2C] mb-8 text-center leading-tight">Tell us about the occasion</h2>
      <div className="space-y-4">
        <select className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-[#D4AF37] outline-none">
          <option value="">Occasion</option>
          <option value="daily">Daily</option>
          <option value="date">Date</option>
          <option value="business">Business</option>
          <option value="portrait">Portrait</option>
        </select>
        <input type="date" className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-[#D4AF37] outline-none" />
        <input type="text" className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-[#D4AF37] outline-none" placeholder="Location" />
        <select className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-[#D4AF37] outline-none">
          <option value="">Budget Range</option>
          <option value="100-300">$100 - $300</option>
          <option value="300-500">$300 - $500</option>
          <option value="500+">$500+</option>
        </select>
        <div className="flex gap-3">
          {['On-site', 'In-store'].map(opt => (
            <button 
              key={opt}
              onClick={() => handleSelect('locationType', opt)}
              className={cn("flex-1 py-4 rounded-xl border text-sm font-medium transition-colors", selections.locationType === opt ? "border-[#D4AF37] bg-[#F4E8C8]/30 text-[#D4AF37]" : "border-gray-200 text-[#8E8E8E] bg-white")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDailyStep2 = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-[#2C2C2C] mb-8 text-center leading-tight">What's your preferred style?</h2>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2C2C2C] mb-3">Makeup Style</p>
          <div className="flex flex-wrap gap-2">
            {['Natural', 'Korean', 'Thai', 'Soft Glam', 'Creative'].map(opt => (
              <button 
                key={opt}
                onClick={() => handleSelect('makeupStyle', opt)}
                className={cn("px-4 py-2 rounded-full border text-sm transition-colors", selections.makeupStyle === opt ? "border-[#D4AF37] bg-[#F4E8C8]/30 text-[#D4AF37]" : "border-gray-200 text-[#8E8E8E] bg-white")}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-[#2C2C2C] mb-3">Finish Preferences</p>
          <div className="flex flex-wrap gap-2">
            {['Matte', 'Dewy', 'Satin', 'Glowy'].map(opt => (
              <button 
                key={opt}
                onClick={() => handleSelect('makeupFinish', opt)}
                className={cn("px-4 py-2 rounded-full border text-sm transition-colors", selections.makeupFinish === opt ? "border-[#D4AF37] bg-[#F4E8C8]/30 text-[#D4AF37]" : "border-gray-200 text-[#8E8E8E] bg-white")}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDailyStep3 = () => (
    <div className="space-y-6 flex flex-col h-full">
      <h2 className="font-serif text-3xl text-[#2C2C2C] mb-8 text-center leading-tight">Service Type</h2>
      <div className="space-y-4 flex-1">
        <div className="flex flex-col gap-3">
          {['Basic Makeup', 'With Hairstyling', 'Touch-up Included', 'Multi-session Service'].map(opt => (
            <button 
              key={opt}
              onClick={() => handleSelect(`service_${opt}`, selections[`service_${opt}`] ? '' : 'yes')}
              className={cn("w-full px-6 py-4 rounded-xl border text-sm font-medium transition-colors text-left", selections[`service_${opt}`] ? "border-[#D4AF37] bg-[#F4E8C8]/30 text-[#D4AF37]" : "border-gray-200 text-[#2C2C2C] bg-white")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("min-h-screen flex flex-col bg-[#FAF9F6]", step === 3 ? "pb-[380px]" : "pb-32")}>
      <Header title="AI Assessment" showBack onBack={() => step > 1 ? setStep(step - 1) : navigate(-1)} />
      
      {/* Progress Bar */}
      <div className="px-6 pt-2 pb-8">
        <div className="h-0.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        <p className="text-[10px] text-[#8E8E8E] uppercase tracking-widest mt-3 text-center">Step {step} of 3</p>
      </div>

      <div className="px-6 flex-1 flex flex-col">
        {type === 'wedding' && step === 1 && renderWeddingStep1()}
        {type === 'wedding' && step === 2 && renderWeddingStep2()}
        {type === 'wedding' && step === 3 && renderWeddingStep3()}
        
        {type === 'daily' && step === 1 && renderDailyStep1()}
        {type === 'daily' && step === 2 && renderDailyStep2()}
        {type === 'daily' && step === 3 && renderDailyStep3()}
      </div>

      <div className="fixed bottom-[60px] left-0 right-0 px-6 pb-6 pt-10 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6] via-80% to-transparent max-w-md mx-auto z-40 flex flex-col gap-4">
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your requests or upload makeup references..."
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] resize-none h-24 luxury-shadow"
            />
            <button className="w-full bg-white border border-[#D4AF37] text-[#D4AF37] py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-[#F4E8C8]/20 luxury-shadow">
              <Upload size={16} />
              Upload Reference Image
            </button>
          </div>
        )}
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-[#C29B38] to-[#D4AF37] text-white py-4 rounded-full font-medium shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2 transition-transform active:scale-95 uppercase tracking-widest text-xs mt-2"
        >
          {step === 3 ? (
            <>Confirm & Match <Sparkles size={16} className="text-white" /></>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export const AIMatchLoadingScreen = () => {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState('Analyzing preferences...');

  useEffect(() => {
    const texts = [
      'Analyzing preferences...',
      'Matching style...',
      'Checking availability...',
      'Calculating match rate...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < texts.length) {
        setLoadingText(texts[i]);
      }
    }, 800);

    const timeout = setTimeout(() => {
      navigate('/ai-match/results');
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] px-6">
      <h2 className="font-serif text-2xl text-[#2C2C2C] mb-16 text-center">AI is matching your ideal makeup artist</h2>
      
      {/* Radar Animation */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-16">
        <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-full" />
        <div className="absolute inset-4 border border-[#D4AF37]/30 rounded-full" />
        <div className="absolute inset-8 border border-[#D4AF37]/40 rounded-full" />
        <div className="absolute inset-12 border border-[#D4AF37]/50 rounded-full" />
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(212, 175, 55, 0.4) 360deg)'
          }}
        />
        
        <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.5)] z-10">
          <Sparkles size={24} className="text-white" />
        </div>
      </div>

      <motion.p 
        key={loadingText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-[#8E8E8E] tracking-widest uppercase font-medium"
      >
        {loadingText}
      </motion.p>
    </motion.div>
  );
};

export const MatchResultScreen = () => {
  const navigate = useNavigate();

  // Mock match rates
  const artistsWithMatchRate = MOCK_MUAS.map((mua, index) => ({
    ...mua,
    matchRate: 98 - (index * 6) // e.g., 98%, 92%, 86%
  })).sort((a, b) => b.matchRate - a.matchRate);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen bg-[#FAF9F6]">
      <Header title="Your Matches" showBack />
      
      <div className="px-6 py-6">
        <div className="mb-6">
          <h2 className="font-serif text-2xl text-[#2C2C2C] mb-2">Perfect Matches Found</h2>
          <p className="text-sm text-[#8E8E8E]">We've found artists that align with your vision.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {['Distance', 'Price', 'Volume'].map(filter => (
            <button key={filter} className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs text-[#2C2C2C] whitespace-nowrap flex items-center gap-1">
              {filter} <ChevronLeft className="rotate-270 w-3 h-3" />
            </button>
          ))}
        </div>

        <div className="space-y-6 mb-12">
          {artistsWithMatchRate.map((mua) => (
            <div key={mua.id} className="bg-white rounded-[24px] overflow-hidden luxury-shadow">
              <div className="flex p-4 gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={mua.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif text-lg text-[#2C2C2C] truncate">{mua.name}</h3>
                    <span className="text-xs font-medium text-[#D4AF37] bg-[#F4E8C8]/50 px-2 py-1 rounded-md whitespace-nowrap">
                      {mua.matchRate}% Match
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E8E] mb-2">{mua.title}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {mua.styles.map(style => (
                      <span key={style} className="text-[10px] bg-gray-50 text-[#8E8E8E] px-2 py-0.5 rounded-sm">{style}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-xs text-[#8E8E8E]">
                      <MapPin size={12} /> {mua.city}
                    </div>
                    <p className="text-sm font-medium text-[#2C2C2C]">From ${mua.services[0]?.price}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button onClick={() => navigate(`/artist/${mua.id}`)} className="w-full border border-[#2C2C2C] text-[#2C2C2C] py-3 rounded-xl text-xs font-medium tracking-widest uppercase hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/ai-match')} className="w-full bg-white border border-[#D4AF37] text-[#D4AF37] py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-sm active:scale-95 transition-all">
          Match Again
        </button>
      </div>
    </motion.div>
  );
};
