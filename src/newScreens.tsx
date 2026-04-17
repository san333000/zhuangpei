import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin, Heart, Settings, LogOut, Search, Plus, Calendar, CheckCircle2, X, Star, Sparkles, User, Phone, ImageIcon, PlayCircle, Video, Undo2, Redo2 } from 'lucide-react';
import { cn } from './lib/utils';
import { MOCK_MUAS, MOCK_CLIENTS, MOCK_ORDERS } from './constants';
import Markdown from 'react-markdown';

export const PublicArtistProfileScreen = ({ Header }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = MOCK_MUAS.find(m => m.id === id) || MOCK_MUAS[0];
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen bg-[#FAF9F6]">
      {/* 1. Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2C2C2C] luxury-shadow">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setIsFavorite(!isFavorite)} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2C2C2C] luxury-shadow">
          <Heart size={20} className={cn("transition-colors", isFavorite ? "fill-[#D4AF37] text-[#D4AF37]" : "")} />
        </button>
      </div>

      {/* 2. Full-width cover carousel */}
      <div className="h-[35vh] w-full relative">
        <img src={artist.portfolio[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
      </div>

      <div className="px-6 -mt-12 relative z-10 space-y-8">
        {/* 3. Artist info */}
        <div className="bg-white rounded-[32px] p-6 luxury-shadow border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-serif text-3xl text-[#2C2C2C] mb-1">{artist.name}</h2>
              <p className="text-sm text-[#8E8E8E]">{artist.title} · {artist.city}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-medium text-[#D4AF37] bg-[#F4E8C8]/50 px-2 py-1 rounded-md mb-1">98% Match</span>
              <div className="flex items-center gap-1 text-xs font-medium text-[#2C2C2C]">
                <Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" /> {artist.rating}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {artist.styles.map(style => (
              <span key={style} className="text-[10px] uppercase tracking-widest bg-gray-50 text-[#8E8E8E] px-3 py-1.5 rounded-full">{style}</span>
            ))}
            <span className="text-[10px] uppercase tracking-widest bg-gray-50 text-[#8E8E8E] px-3 py-1.5 rounded-full">5+ Yrs Exp</span>
          </div>

          <p className="text-sm text-[#2C2C2C]/80 leading-relaxed">{artist.bio}</p>
        </div>

        {/* 4. Work gallery */}
        <div>
          <h3 className="font-serif text-xl text-[#2C2C2C] mb-4 px-2">Work Gallery</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
            {artist.portfolio.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImageIndex(idx)}
                className="w-48 flex-shrink-0 aspect-[4/5] rounded-[24px] overflow-hidden luxury-shadow relative cursor-pointer"
              >
                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white">After</div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Service packages */}
        <div>
          <h3 className="font-serif text-xl text-[#2C2C2C] mb-4 px-2">Service Packages</h3>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1 px-2">
            {['All', ...Array.from(new Set(artist.services.map(s => s.category).filter(Boolean)))].map(category => (
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

          <div className="space-y-4">
            {(selectedCategory === 'All' ? artist.services : artist.services.filter(s => s.category === selectedCategory)).map((service, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-6 luxury-shadow border border-gray-50 relative group">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-[#2C2C2C] text-lg">{service.name}</h4>
                  <span className="font-serif text-xl text-[#D4AF37]">${service.price}</span>
                </div>
                <div className="text-sm text-[#8E8E8E] mb-4 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                  <Markdown>{service.description}</Markdown>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8E8E8E] font-medium">
                      <Clock size={12} />
                      <span>{service.duration}</span>
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
                        className="inline-flex items-center gap-1 text-[10px] text-blue-500 uppercase tracking-widest bg-blue-50 hover:bg-blue-100 transition-colors px-2 py-1 rounded-md"
                      >
                        <PlayCircle size={12} /> Watch Video
                      </a>
                    )}
                  </div>
                  <button onClick={() => navigate(`/book/${artist.id}`)} className="px-4 py-2 bg-[#F4E8C8]/30 text-[#D4AF37] rounded-full text-xs font-medium tracking-widest uppercase">
                    Select
                  </button>
                </div>

                {/* Tooltip */}
                {(service.materialsUsed || service.stylingNotes) && (
                  <div className="absolute left-0 right-0 -top-2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <div className="bg-[#2C2C2C] text-white p-4 rounded-2xl text-xs shadow-xl relative mx-4">
                      {service.materialsUsed && (
                        <div className="mb-2">
                          <span className="font-medium text-[#D4AF37] uppercase tracking-widest text-[10px] block mb-1">Materials:</span>
                          <div className="text-white/90 prose prose-sm prose-invert max-w-none prose-p:my-0 prose-ul:my-0 prose-li:my-0">
                            <Markdown>{service.materialsUsed}</Markdown>
                          </div>
                        </div>
                      )}
                      {service.stylingNotes && (
                        <div>
                          <span className="font-medium text-[#D4AF37] uppercase tracking-widest text-[10px] block mb-1 mt-2">Styling & Suitability:</span>
                          <div className="text-white/90 prose prose-sm prose-invert max-w-none prose-p:my-0 prose-ul:my-0 prose-li:my-0">
                            <Markdown>{service.stylingNotes}</Markdown>
                          </div>
                        </div>
                      )}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2C2C2C] rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Availability Calendar */}
        <div>
          <h3 className="font-serif text-xl text-[#2C2C2C] mb-4 px-2">Availability</h3>
          <div className="bg-white rounded-[24px] p-6 luxury-shadow border border-gray-50">
            {/* Date Selector */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
              {[...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const isSelected = i === selectedDateIndex;
                return (
                  <div 
                    key={i} 
                    onClick={() => {
                      setSelectedDateIndex(i);
                      setSelectedTimeSlot(null);
                    }}
                    className={cn(
                      "flex-shrink-0 w-14 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors",
                      isSelected ? "bg-[#2C2C2C] text-white" : "bg-gray-50 text-[#8E8E8E] hover:bg-gray-100"
                    )}
                  >
                    <span className="text-[10px] uppercase tracking-widest">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className={cn("text-lg font-serif", isSelected ? "text-[#D4AF37]" : "text-[#2C2C2C]")}>{date.getDate()}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Time Slots */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'].map((time, i) => {
                const isSelected = time === selectedTimeSlot;
                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedTimeSlot(time)}
                    className={cn(
                      "py-2 border rounded-xl text-center text-xs font-medium cursor-pointer transition-colors",
                      isSelected 
                        ? "border-[#D4AF37] bg-[#F4E8C8]/20 text-[#D4AF37]" 
                        : "border-gray-100 text-[#2C2C2C] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    )}
                  >
                    {time}
                  </div>
                );
              })}
            </div>
            
            {selectedTimeSlot && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/book/${artist.id}`)}
                className="w-full mt-6 bg-[#2C2C2C] text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase shadow-xl active:scale-95 transition-all"
              >
                Book {selectedTimeSlot}
              </motion.button>
            )}
          </div>
        </div>

        {/* 6. Customer reviews */}
        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-serif text-xl text-[#2C2C2C]">Client Reviews</h3>
            <span className="text-xs text-[#8E8E8E] underline">View All</span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-5 luxury-shadow border border-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?img=${idx + 10}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2C2C2C]">Sarah M.</p>
                      <div className="flex text-[#D4AF37]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-[#D4AF37]" />)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#8E8E8E]">2 weeks ago</span>
                </div>
                <p className="text-sm text-[#2C2C2C]/80 mb-3">Absolutely loved my makeup! Elena was so professional and understood exactly what I wanted for my wedding day.</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={artist.portfolio[idx % artist.portfolio.length]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Exclusive client file (Mocked for past clients) */}
        <div className="bg-[#2C2C2C] rounded-[24px] p-6 text-white luxury-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <h3 className="font-serif text-lg">Exclusive Client File</h3>
          </div>
          <p className="text-xs text-white/70 mb-4">You've booked Elena before. Here are your notes:</p>
          <div className="space-y-3">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">Service History</p>
              <p className="text-sm">Bridal Trial (Jan 15, 2026)</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">Makeup Notes</p>
              <p className="text-sm">Prefers matte finish, sensitive to strong fragrances.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6] to-transparent z-40 max-w-md mx-auto">
        <button onClick={() => navigate(`/book/${artist.id}`)} className="w-full bg-[#2C2C2C] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-xl active:scale-95 transition-all">
          Book Now
        </button>
      </div>

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
                if (swipe < -50 && selectedImageIndex < artist.portfolio.length - 1) {
                  setSelectedImageIndex(selectedImageIndex + 1);
                } else if (swipe > 50 && selectedImageIndex > 0) {
                  setSelectedImageIndex(selectedImageIndex - 1);
                }
              }}
              className="w-full h-full flex items-center justify-center absolute cursor-grab active:cursor-grabbing"
            >
              <img src={artist.portfolio[selectedImageIndex]} className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" draggable={false} />
            </motion.div>
            
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-[110]">
              {artist.portfolio.map((_, i) => (
                <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === selectedImageIndex ? "bg-white w-3" : "bg-white/30")} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const BookingScreen = ({ Header }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = MOCK_MUAS.find(m => m.id === id) || MOCK_MUAS[0];
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const selectedService = artist.services.find(s => s.id === selectedServiceId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-40 min-h-screen">
      <Header title="Book Consultation" showBack />
      
      <div className="px-6 py-6 space-y-8">
        <div className="flex items-center gap-4 bg-white p-5 rounded-[24px] luxury-shadow border border-gray-50">
          <img src={artist.avatar} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
          <div>
            <h3 className="font-serif text-lg text-[#2C2C2C]">{artist.name}</h3>
            <p className="text-xs text-[#8E8E8E]">{artist.title}</p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-4">Select Service</h3>
          <div className="space-y-3">
            {artist.services.map(service => (
              <div 
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={cn(
                  "p-4 rounded-[20px] border transition-all cursor-pointer luxury-shadow",
                  selectedServiceId === service.id ? "border-[#D4AF37] bg-[#F4E8C8]/10" : "border-gray-100 bg-white"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-[#2C2C2C]">{service.name}</h4>
                  <span className="font-serif text-[#D4AF37]">${service.price}</span>
                </div>
                <p className="text-xs text-[#8E8E8E]">{service.duration}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-4">Select Date</h3>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] transition-colors luxury-shadow" 
          />
        </div>

        <div>
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-4">Select Time</h3>
          <div className="grid grid-cols-3 gap-3">
            {['09:00', '10:30', '13:00', '14:30', '16:00'].map(time => (
              <button 
                key={time}
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "py-3 rounded-xl text-sm font-medium transition-all luxury-shadow",
                  selectedTime === time ? "bg-[#D4AF37] text-white" : "bg-white text-[#2C2C2C] border border-gray-100"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-4">Notes (Optional)</h3>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific requests, skin conditions, or styling preferences..."
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-[#2C2C2C] placeholder-[#8E8E8E] focus:outline-none focus:border-[#D4AF37] transition-colors luxury-shadow resize-none h-28"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40 max-w-md mx-auto">
        <button 
          onClick={() => setIsConfirmModalOpen(true)} 
          disabled={!selectedServiceId || !selectedDate || !selectedTime}
          className="w-full bg-[#2C2C2C] disabled:bg-gray-300 text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg active:scale-95 transition-all"
        >
          Confirm Booking
        </button>
      </div>

      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-sm luxury-shadow"
            >
              <h3 className="font-serif text-2xl text-[#2C2C2C] mb-2 text-center">Confirm Booking</h3>
              <p className="text-sm text-[#8E8E8E] text-center mb-4">
                Are you sure you want to book <strong className="text-[#2C2C2C]">{selectedService?.name}</strong> with {artist.name} on {selectedDate} at {selectedTime}?
              </p>
              {selectedService && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                  <p className="text-xs text-[#8E8E8E] uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="font-serif text-2xl text-[#D4AF37]">${selectedService.price}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsConfirmModalOpen(false)} 
                  className="flex-1 border border-gray-200 text-[#2C2C2C] py-3.5 rounded-full text-xs font-medium tracking-widest uppercase active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => navigate('/bookings')} 
                  className="flex-1 bg-[#D4AF37] text-white py-3.5 rounded-full text-xs font-medium tracking-widest uppercase shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const ChatScreen = ({ Header }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Header title="Messages" showBack />
      <div className="flex-1 p-6 flex flex-col justify-end">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="bg-white p-4 rounded-2xl rounded-tl-none max-w-[80%] luxury-shadow text-sm text-[#2C2C2C]">
            Hello! I'm looking forward to our consultation.
          </div>
          <div className="bg-[#D4AF37] p-4 rounded-2xl rounded-tr-none max-w-[80%] self-end text-white text-sm shadow-md">
            Hi! Me too. Let me know if you have any questions before we meet.
          </div>
        </div>
      </div>
      <div className="p-4 pb-28 bg-white border-t border-gray-100 flex gap-3 items-center">
        <input type="text" placeholder="Type a message..." className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-3 px-5 text-sm focus:outline-none focus:border-[#D4AF37]" />
        <button className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-md active:scale-95 transition-all">
          <ChevronLeft className="rotate-180" size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export const OrderDetailsScreen = ({ Header }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0];
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmitReview = () => {
    // In a real app, this would submit the review to the backend
    alert('Review submitted successfully!');
    setIsReviewModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Order Details" showBack />
      <div className="px-6 py-6 space-y-6">
        <div className="bg-white p-6 rounded-[24px] luxury-shadow">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
            <h3 className="font-serif text-xl text-[#2C2C2C]">{order.serviceName}</h3>
            <span className={cn(
              "px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-medium",
              order.status === 'completed' ? "bg-green-100 text-green-700" : "bg-[#F4E8C8]/30 text-[#D4AF37]"
            )}>
              {order.status}
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Date</span>
              <span className="text-sm font-medium text-[#2C2C2C]">{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Time</span>
              <span className="text-sm font-medium text-[#2C2C2C]">{order.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Artist</span>
              <span className="text-sm font-medium text-[#2C2C2C]">{order.muaName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Location</span>
              <span className="text-sm font-medium text-[#2C2C2C]">{order.address}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-50">
              <span className="text-sm font-medium text-[#2C2C2C]">Total</span>
              <span className="font-serif text-lg text-[#D4AF37]">${order.totalPrice}</span>
            </div>
          </div>
        </div>

        {order.status === 'completed' && (
          <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="w-full bg-[#D4AF37] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg active:scale-95 transition-all mb-3"
          >
            Leave a Review
          </button>
        )}

        <button onClick={() => navigate(-1)} className="w-full border border-[#2C2C2C] text-[#2C2C2C] py-4 rounded-full font-medium tracking-widest text-xs uppercase active:scale-95 transition-all">
          Back to Bookings
        </button>
      </div>

      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-sm luxury-shadow"
            >
              <h3 className="font-serif text-2xl text-[#2C2C2C] mb-2 text-center">Rate your experience</h3>
              <p className="text-sm text-[#8E8E8E] text-center mb-6">
                How was your appointment with {order.muaName}?
              </p>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star 
                      size={32} 
                      className={cn(
                        "transition-colors",
                        star <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"
                      )} 
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share details of your experience..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] resize-none h-24 mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsReviewModalOpen(false)} 
                  className="flex-1 border border-gray-200 text-[#2C2C2C] py-3.5 rounded-full text-xs font-medium tracking-widest uppercase active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitReview}
                  disabled={rating === 0}
                  className="flex-1 bg-[#D4AF37] disabled:bg-gray-300 disabled:shadow-none text-white py-3.5 rounded-full text-xs font-medium tracking-widest uppercase shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SavedArtistsScreen = ({ Header }: any) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMuas = MOCK_MUAS.filter(mua => 
    mua.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Saved Artists" showBack />
      <div className="px-6 pt-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
          <input 
            type="text" 
            placeholder="Search artists by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] luxury-shadow text-[#2C2C2C]"
          />
        </div>
      </div>
      <div className="px-6 py-6 space-y-6">
        {filteredMuas.map(mua => (
          <div key={mua.id} onClick={() => navigate(`/artist/${mua.id}`)} className="bg-white rounded-[24px] overflow-hidden luxury-shadow cursor-pointer active:scale-[0.98] transition-all">
            <div className="h-48 overflow-hidden relative">
              <img src={mua.portfolio[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-serif text-xl text-[#2C2C2C]">{mua.name}</h3>
              <p className="text-xs text-[#8E8E8E] mt-1">{mua.title}</p>
            </div>
          </div>
        ))}
        {filteredMuas.length === 0 && (
          <div className="text-center text-[#8E8E8E] py-10">
            No artists found matching "{searchQuery}"
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const SettingsScreen = ({ Header }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Settings" showBack />
      <div className="px-6 py-6 space-y-4">
        {['Notifications', 'Privacy', 'Payment Methods', 'Help & Support'].map(item => (
          <button key={item} className="w-full bg-white rounded-[24px] p-5 flex items-center justify-between luxury-shadow group">
            <span className="font-medium text-[#2C2C2C]">{item}</span>
            <ChevronLeft size={20} className="text-[#8E8E8E] rotate-180" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export const CRMAppointmentDetailScreen = ({ Header }: any) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("Client prefers a natural look. Allergic to lavender. Requested extra focus on skin prep.");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const [history, setHistory] = useState<string[]>(["Client prefers a natural look. Allergic to lavender. Requested extra focus on skin prep."]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNotes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNotes(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNotes(history[newIndex]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Appointment Details" showBack />
      <div className="px-6 py-6 space-y-6">
        <div className="bg-white p-6 rounded-[24px] luxury-shadow">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
            <h3 className="font-serif text-xl text-[#2C2C2C]">Bridal Trial</h3>
            <span className="px-3 py-1 bg-[#F4E8C8]/30 text-[#D4AF37] text-[10px] uppercase tracking-widest rounded-full font-medium">Upcoming</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8E8E8E]">Client</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#2C2C2C]">Sophia Chen</span>
                <button onClick={() => navigate('/crm/client/1')} className="text-[#D4AF37]"><ChevronLeft className="rotate-180" size={16}/></button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Date</span>
              <span className="text-sm font-medium text-[#2C2C2C]">Oct 12, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Time</span>
              <span className="text-sm font-medium text-[#2C2C2C]">10:00 - 12:00</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-50">
              <span className="text-sm font-medium text-[#2C2C2C]">Total</span>
              <span className="font-serif text-lg text-[#D4AF37]">$350</span>
            </div>
          </div>
        </div>

        {/* Client Notes Section */}
        <div className="bg-white p-6 rounded-[24px] luxury-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg text-[#2C2C2C]">Client Notes</h3>
            <div className="flex items-center gap-3">
              {isEditingNotes && (
                <>
                  <button 
                    onClick={handleUndo}
                    disabled={historyIndex === 0}
                    className="text-[#8E8E8E] disabled:opacity-30 hover:text-[#2C2C2C] transition-colors"
                  >
                    <Undo2 size={16} />
                  </button>
                  <button 
                    onClick={handleRedo}
                    disabled={historyIndex === history.length - 1}
                    className="text-[#8E8E8E] disabled:opacity-30 hover:text-[#2C2C2C] transition-colors"
                  >
                    <Redo2 size={16} />
                  </button>
                </>
              )}
              <button 
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-[#D4AF37] text-xs font-medium uppercase tracking-widest"
              >
                {isEditingNotes ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
          {isEditingNotes ? (
            <textarea
              value={notes}
              onChange={handleNotesChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] resize-none h-32"
              placeholder="Add notes here..."
            />
          ) : (
            <p className="text-sm text-[#8E8E8E] leading-relaxed whitespace-pre-wrap">
              {notes || "No notes added yet."}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="flex-1 border border-[#2C2C2C] text-[#2C2C2C] py-4 rounded-full font-medium tracking-widest text-xs uppercase active:scale-95 transition-all">
            Back
          </button>
          <button onClick={() => navigate('/chat')} className="flex-1 bg-[#2C2C2C] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase active:scale-95 transition-all shadow-lg">
            Message Client
          </button>
        </div>
      </div>
    </motion.div>
  );
};
