import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin, Heart, Settings, LogOut, Search, Plus, Calendar, CheckCircle2, X, Star, Sparkles, User, Phone, ImageIcon } from 'lucide-react';
import { cn } from './lib/utils';
import { MOCK_MUAS, MOCK_CLIENTS, MOCK_ORDERS } from './constants';

export const PublicArtistProfileScreen = ({ Header }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = MOCK_MUAS.find(m => m.id === id) || MOCK_MUAS[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Artist Profile" showBack />
      
      <div className="px-6 py-8 flex flex-col items-center text-center border-b border-gray-100">
        <div className="relative w-28 h-28 rounded-full bg-gray-200 mb-4 overflow-hidden luxury-shadow">
          <img src={artist.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <h2 className="font-serif text-2xl text-[#2C2C2C] mb-1">{artist.name}</h2>
        <p className="text-sm text-[#8E8E8E]">{artist.title} · {artist.city}</p>
      </div>

      <div className="px-6 py-6 space-y-8">
        <div>
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-3">About Me</h3>
          <p className="text-sm text-[#8E8E8E] leading-relaxed bg-white p-5 rounded-[24px] luxury-shadow border border-gray-50">{artist.bio}</p>
        </div>

        <div>
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-4">Portfolio</h3>
          <div className="grid grid-cols-2 gap-3">
            {artist.portfolio.map((img, idx) => (
              <div key={idx} className="aspect-[4/5] rounded-[20px] overflow-hidden luxury-shadow">
                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg text-[#2C2C2C] mb-4">Services</h3>
          <div className="space-y-4">
            {artist.services.map((service, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-5 luxury-shadow border border-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-[#2C2C2C]">{service.name}</h4>
                  <span className="font-serif text-lg text-[#D4AF37]">${service.price}</span>
                </div>
                <p className="text-xs text-[#8E8E8E] mb-3">{service.description}</p>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8E8E8E] font-medium">
                  <Clock size={12} />
                  <span>{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
        <button onClick={() => navigate(`/book/${artist.id}`)} className="w-full bg-[#D4AF37] text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg shadow-[#D4AF37]/30 active:scale-95 transition-all">
          Book Consultation
        </button>
      </div>
    </motion.div>
  );
};

export const BookingScreen = ({ Header }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = MOCK_MUAS.find(m => m.id === id) || MOCK_MUAS[0];
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
        <button 
          onClick={() => navigate('/bookings')} 
          disabled={!selectedDate || !selectedTime}
          className="w-full bg-[#2C2C2C] disabled:bg-gray-300 text-white py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-lg active:scale-95 transition-all"
        >
          Confirm Booking
        </button>
      </div>
    </motion.div>
  );
};

export const ChatScreen = ({ Header }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Header title="Messages" showBack />
      <div className="flex-1 p-6 flex flex-col justify-end">
        <div className="space-y-4 mb-6">
          <div className="bg-white p-4 rounded-2xl rounded-tl-none max-w-[80%] luxury-shadow text-sm text-[#2C2C2C]">
            Hello! I'm looking forward to our consultation.
          </div>
          <div className="bg-[#D4AF37] p-4 rounded-2xl rounded-tr-none max-w-[80%] self-end text-white text-sm shadow-md">
            Hi! Me too. Let me know if you have any questions before we meet.
          </div>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
        <input type="text" placeholder="Type a message..." className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-3 px-5 text-sm focus:outline-none focus:border-[#D4AF37]" />
        <button className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-md active:scale-95 transition-all">
          <ChevronLeft className="rotate-180" size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export const OrderDetailsScreen = ({ Header }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Order Details" showBack />
      <div className="px-6 py-6 space-y-6">
        <div className="bg-white p-6 rounded-[24px] luxury-shadow">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
            <h3 className="font-serif text-xl text-[#2C2C2C]">Consultation</h3>
            <span className="px-3 py-1 bg-[#F4E8C8]/30 text-[#D4AF37] text-[10px] uppercase tracking-widest rounded-full font-medium">Confirmed</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Date</span>
              <span className="text-sm font-medium text-[#2C2C2C]">Oct 12, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Time</span>
              <span className="text-sm font-medium text-[#2C2C2C]">14:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#8E8E8E]">Artist</span>
              <span className="text-sm font-medium text-[#2C2C2C]">Elena Rostova</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-50">
              <span className="text-sm font-medium text-[#2C2C2C]">Total</span>
              <span className="font-serif text-lg text-[#D4AF37]">$150</span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="w-full border border-[#2C2C2C] text-[#2C2C2C] py-4 rounded-full font-medium tracking-widest text-xs uppercase active:scale-95 transition-all">
          Back to Bookings
        </button>
      </div>
    </motion.div>
  );
};

export const SavedArtistsScreen = ({ Header }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen">
      <Header title="Saved Artists" showBack />
      <div className="px-6 py-6 space-y-6">
        {MOCK_MUAS.map(mua => (
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
