import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin, Heart, Settings, LogOut, Search, Plus, Calendar, CheckCircle2, X, Star, Sparkles, User, Phone, ImageIcon, PlayCircle, Video, Undo2, Redo2, GripVertical, Trash2, Edit2, Share2 } from 'lucide-react';
import { cn } from './lib/utils';
import { MOCK_MUAS, MOCK_CLIENTS, MOCK_ORDERS } from './constants';
import Markdown from 'react-markdown';

const DraggableServiceItem = ({ service, idx, isEditing, editServices, setEditServices, navigate, artist }: any) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      value={service} 
      dragListener={false}
      dragControls={dragControls}
      className={cn(
        "bg-white rounded-[24px] p-6 border border-gray-50 relative group",
        isEditing ? "luxury-shadow-sm border-gray-200" : "luxury-shadow"
      )}
    >
      {isEditing && (
        <button 
          onClick={() => {
            setEditServices(editServices.filter((s: any) => s.id !== service.id));
          }}
          className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors z-10"
        >
          <Trash2 size={16} />
        </button>
      )}
      
      {isEditing ? (
        <div className="space-y-3 pr-6">
          <div className="flex items-center gap-2 mb-2">
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="text-gray-300 cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'none' }}
            >
              <GripVertical size={20} />
            </div>
            <input 
              type="text" 
              value={service.name}
              onChange={(e) => {
                const newServices = [...editServices];
                newServices[idx].name = e.target.value;
                setEditServices(newServices);
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
                  const newServices = [...editServices];
                  newServices[idx].category = e.target.value;
                  setEditServices(newServices);
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
                value={service.price}
                onChange={(e) => {
                  const newServices = [...editServices];
                  newServices[idx].price = Number(e.target.value);
                  setEditServices(newServices);
                }}
                className="font-serif text-[#D4AF37] w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-1/3 flex flex-col gap-1">
              <select
                value={service.duration || ''}
                onChange={(e) => {
                  const newServices = [...editServices];
                  newServices[idx].duration = e.target.value;
                  setEditServices(newServices);
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
                const newServices = [...editServices];
                newServices[idx].description = e.target.value;
                setEditServices(newServices);
              }}
              className="w-full text-xs text-[#2C2C2C] bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37] min-h-[80px]"
              placeholder="Description (Markdown supported)"
            />
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </Reorder.Item>
  );
};

export const PublicArtistProfileScreen = ({ Header }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = MOCK_MUAS.find(m => m.id === id) || MOCK_MUAS[0];
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [selectedDateIndices, setSelectedDateIndices] = useState<number[]>([0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(artist.name);
  const [editTitle, setEditTitle] = useState(artist.title);
  const [editCity, setEditCity] = useState(artist.city);
  const [editBio, setEditBio] = useState(artist.bio);
  const [editPortfolio, setEditPortfolio] = useState(artist.portfolio);
  const [editServices, setEditServices] = useState(artist.services);

  const handleSave = () => {
    artist.name = editName;
    artist.title = editTitle;
    artist.city = editCity;
    artist.bio = editBio;
    artist.portfolio = editPortfolio;
    artist.services = editServices;
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(artist.name);
    setEditTitle(artist.title);
    setEditCity(artist.city);
    setEditBio(artist.bio);
    setEditPortfolio(artist.portfolio);
    setEditServices(artist.services);
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen bg-[#FAF9F6]">
      {/* 1. Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent pointer-events-none">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2C2C2C] luxury-shadow pointer-events-auto transition-transform active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 pointer-events-auto">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div key="edit-controls" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-2">
                <button onClick={handleCancel} className="px-4 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#8E8E8E] text-sm font-medium luxury-shadow transition-transform active:scale-95">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-4 h-10 rounded-full bg-[#D4AF37] text-white text-sm font-medium luxury-shadow transition-transform active:scale-95">
                  Save
                </button>
              </motion.div>
            ) : (
              <motion.div key="view-controls" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-2">
                <button onClick={() => setIsFavorite(!isFavorite)} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2C2C2C] luxury-shadow transition-transform active:scale-95">
                  <Heart size={20} className={cn("transition-colors", isFavorite ? "fill-[#D4AF37] text-[#D4AF37]" : "")} />
                </button>
                <button onClick={() => setIsEditing(true)} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2C2C2C] luxury-shadow transition-transform active:scale-95">
                  <Edit2 size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
            <div className="flex-1 pr-4">
              {isEditing ? (
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-serif text-3xl text-[#2C2C2C] w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1 focus:outline-none focus:border-[#D4AF37]"
                    placeholder="Name"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-sm text-[#8E8E8E] bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37] flex-1"
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="text-sm text-[#8E8E8E] bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37] flex-1"
                      placeholder="City"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-3xl text-[#2C2C2C] mb-1">{editName}</h2>
                  <p className="text-sm text-[#8E8E8E]">{editTitle} · {editCity}</p>
                </>
              )}
            </div>
            {!isEditing && (
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-[#D4AF37] bg-[#F4E8C8]/50 px-2 py-1 rounded-md mb-1">98% Match</span>
                <div className="flex items-center gap-1 text-xs font-medium text-[#2C2C2C]">
                  <Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" /> {artist.rating}
                </div>
              </div>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex flex-wrap gap-2 mb-4">
              {artist.styles.map(style => (
                <span key={style} className="text-[10px] uppercase tracking-widest bg-gray-50 text-[#8E8E8E] px-3 py-1.5 rounded-full">{style}</span>
              ))}
              <span className="text-[10px] uppercase tracking-widest bg-gray-50 text-[#8E8E8E] px-3 py-1.5 rounded-full">5+ Yrs Exp</span>
            </div>
          )}

          {isEditing ? (
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="text-sm text-[#2C2C2C] w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 min-h-[100px] focus:outline-none focus:border-[#D4AF37]"
              placeholder="Bio"
            />
          ) : (
            <p className="text-sm text-[#2C2C2C]/80 leading-relaxed">{editBio}</p>
          )}
        </div>

        {/* 4. Work gallery */}
        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-serif text-xl text-[#2C2C2C]">Work Gallery</h3>
            {isEditing && (
              <span className="text-xs text-[#8E8E8E] flex items-center gap-1">
                <GripVertical size={12} /> Drag to reorder
              </span>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
            {isEditing ? (
              <Reorder.Group 
                axis="x" 
                values={editPortfolio} 
                onReorder={setEditPortfolio} 
                className="flex gap-4"
              >
                {editPortfolio.map((img, idx) => (
                  <Reorder.Item 
                    key={img} 
                    value={img} 
                    className="w-48 flex-shrink-0 aspect-[4/5] rounded-[24px] overflow-hidden luxury-shadow relative cursor-grab active:cursor-grabbing"
                  >
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditPortfolio(editPortfolio.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </Reorder.Item>
                ))}
                <button 
                  className="w-48 flex-shrink-0 aspect-[4/5] rounded-[24px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-[#8E8E8E] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  <Plus size={24} className="mb-2" />
                  <span className="text-xs font-medium uppercase tracking-widest">Add Image</span>
                </button>
              </Reorder.Group>
            ) : (
              editPortfolio.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImageIndex(idx)}
                  className="w-48 flex-shrink-0 aspect-[4/5] rounded-[24px] overflow-hidden luxury-shadow relative cursor-pointer"
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white">After</div>
                </div>
              ))
            )}
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

          <Reorder.Group 
            axis="y" 
            values={isEditing ? editServices : (selectedCategory === 'All' ? artist.services : artist.services.filter(s => s.category === selectedCategory))} 
            onReorder={isEditing ? setEditServices : () => {}} 
            className="space-y-4"
          >
            {(isEditing ? editServices : (selectedCategory === 'All' ? artist.services : artist.services.filter(s => s.category === selectedCategory))).map((service, idx) => (
              <DraggableServiceItem
                key={service.id}
                service={service}
                idx={idx}
                isEditing={isEditing}
                editServices={editServices}
                setEditServices={setEditServices}
                navigate={navigate}
                artist={artist}
              />
            ))}
          </Reorder.Group>
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
                const isSelected = selectedDateIndices.includes(i);
                return (
                  <div 
                    key={i} 
                    onClick={() => {
                      setSelectedDateIndices(prev => {
                        if (prev.includes(i)) {
                          if (prev.length === 1) return prev; // Keep at least one selected
                          return prev.filter(idx => idx !== i);
                        }
                        return [...prev, i].sort();
                      });
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
                Book {selectedDateIndices.length > 1 ? `across ${selectedDateIndices.length} days at ${selectedTimeSlot}` : selectedTimeSlot}
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
  const [artist, setArtist] = useState(MOCK_MUAS[1]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(artist.name);
  const [editBio, setEditBio] = useState(artist.bio);
  
  // Custom states for the new design
  const [editTagline, setEditTagline] = useState('Principal Artist');
  const [editSlogan, setEditSlogan] = useState('Master of Radiant Bridal Glow');
  const [editTags, setEditTags] = useState(['8YRS EXP', 'LUXURY BRANDS', 'SKIN SPECIALIST']);
  const [editAvatar, setEditAvatar] = useState(artist.avatar);

  const displayTagline = editTagline || 'Principal Artist';
  const displaySlogan = editSlogan || 'Master of Radiant Bridal Glow';

  const handleSave = () => {
    setArtist({ ...artist, name: editName, bio: editBio, avatar: editAvatar });
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen bg-[#FAF9F6]">
      <Header title="Personal Center" />
      <div className="w-full max-w-md mx-auto relative">
        {/* Immersive Top Image */}
        <div className="w-full px-6 mt-2 relative">
          <div className="w-full h-[55vh] rounded-[32px] overflow-hidden luxury-shadow mb-8 relative">
            <img 
              src={artist.avatar} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              alt={artist.name}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>
        
        <div className="px-6 relative">
          <div className="absolute right-6 top-0 z-10">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 flex items-center justify-center text-[#2C2C2C] hover:bg-white transition-all active:scale-95"
            >
              <Edit2 size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Top Tagline */}
          <p className="text-[10px] text-[#D4AF37] font-medium tracking-[0.2em] uppercase mb-2">
            {displayTagline}
          </p>
          
          {/* Large Name */}
          <h1 className="font-serif text-5xl text-[#2C2C2C] mb-2 tracking-tight pr-12">
            {artist.name}
          </h1>
          
          {/* Catchy Slogan */}
          <p className="text-lg text-[#6A5ACD] font-serif italic mb-6">
            {displaySlogan}
          </p>
          
          {/* Tags Row */}
          <div className="flex flex-wrap gap-2 mb-8">
            {editTags.map((tag, idx) => (
              <span key={idx} className="px-4 py-1.5 bg-[#F4E8C8]/30 border border-[#F4E8C8] text-[#8E8E8E] font-medium text-[9px] uppercase tracking-widest rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          {/* About Me Paragraph */}
          <p className="text-[15px] font-sans text-[#8E8E8E] leading-relaxed mb-10">
            {artist.bio}
          </p>
        </div>
        
        <div className="px-6 space-y-4">
          {['Notifications', 'Privacy', 'Payment Methods', 'Help & Support'].map(item => (
            <button key={item} className="w-full bg-white rounded-[24px] p-5 flex items-center justify-between luxury-shadow group active:scale-95 transition-all">
              <span className="font-medium text-[#2C2C2C]">{item}</span>
              <ChevronLeft size={20} className="text-[#8E8E8E] rotate-180" />
            </button>
          ))}
          
          <button 
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              navigate('/login');
            }}
            className="w-full mt-8 bg-red-50 text-red-500 rounded-[24px] p-5 flex items-center justify-center gap-2 luxury-shadow group active:scale-95 transition-all"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 right-0 z-[60] flex justify-center pointer-events-none"
          >
            <div className="w-full max-w-md flex flex-col h-full bg-[#FAF9F6] relative pointer-events-auto shadow-2xl">
              <header className="px-6 py-5 flex items-center justify-between bg-[#FAF9F6] z-10 shrink-0">
                <button onClick={() => setIsEditing(false)} className="p-2 -ml-2 text-[#2C2C2C] hover:text-[#D4AF37] transition-colors rounded-full hover:bg-gray-100/50">
                  <X size={24} strokeWidth={1.5} />
                </button>
                <h1 className="font-serif text-xl text-[#2C2C2C]">Edit Profile</h1>
                <button onClick={handleSave} className="text-sm font-medium text-[#D4AF37] uppercase tracking-widest px-2 py-1">
                  Save
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-8">
                {/* Avatar Edit Area */}
                <div className="flex flex-col items-center py-4">
                  <button
                    onClick={() => {
                      const newUrl = window.prompt("Enter new image URL to replace photo:", editAvatar);
                      if (newUrl) setEditAvatar(newUrl);
                    }}
                    className="relative group w-32 h-40 rounded-[24px] overflow-hidden luxury-shadow"
                  >
                    <img src={editAvatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="text-white mb-2" size={24} />
                      <span className="text-white text-[10px] font-medium uppercase tracking-widest">Replace</span>
                    </div>
                  </button>
                  <p className="text-[11px] text-[#8E8E8E] mt-4 uppercase tracking-widest font-medium">Tap photo to change</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">Tagline</label>
                  <input
                    type="text"
                    value={editTagline}
                    onChange={(e) => setEditTagline(e.target.value)}
                    placeholder="e.g. Principal Artist"
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">Slogan</label>
                  <input
                    type="text"
                    value={editSlogan}
                    onChange={(e) => setEditSlogan(e.target.value)}
                    placeholder="e.g. Master of Radiant Bridal Glow"
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editTags.join(', ')}
                    onChange={(e) => setEditTags(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="e.g. 8YRS EXP, LUXURY BRANDS"
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">About Me</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Write a short biography..."
                    rows={4}
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all resize-none"
                  />
                </div>
                <div className="h-8" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

export const MonthlyTrackingScreen = ({ Header }: any) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const pendingClients = [
    { id: '1', name: 'Sarah Jenkins', type: 'Bridal Trial', date: 'Oct 24, 2026', status: 'Waiting for Trial', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
    { id: '2', name: 'Emily Davis', type: 'Wedding Day', date: 'Nov 12, 2026', status: 'Payment Pending', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
    { id: '3', name: 'Jessica Chen', type: 'Event Makeup', date: 'Oct 30, 2026', status: 'Confirm Details', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80' },
  ];

  const completedClients = [
    { id: '4', name: 'Amanda Smith', type: 'Wedding Day', date: 'Oct 15, 2026', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
    { id: '5', name: 'Linda Lee', type: 'Bridal Trial', date: 'Oct 10, 2026', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 min-h-screen bg-[#FAF9F6]">
      <Header title="Monthly Overview" showBack />
      
      {/* Tabs */}
      <div className="px-6 py-4 flex gap-6 border-b border-gray-100 sticky top-[72px] bg-[#FAF9F6] z-10">
        <button 
          onClick={() => setActiveTab('pending')}
          className={cn(
            "pb-3 text-sm font-medium transition-colors relative",
            activeTab === 'pending' ? "text-[#D4AF37]" : "text-[#8E8E8E]"
          )}
        >
          Pending (待完成)
          {activeTab === 'pending' && (
            <motion.div layoutId="trackingTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={cn(
            "pb-3 text-sm font-medium transition-colors relative",
            activeTab === 'completed' ? "text-[#D4AF37]" : "text-[#8E8E8E]"
          )}
        >
          Completed (已完成)
          {activeTab === 'completed' && (
            <motion.div layoutId="trackingTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-t-full" />
          )}
        </button>
      </div>

      <div className="px-6 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {activeTab === 'pending' ? (
            <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {pendingClients.map(client => (
                <div key={client.id} className="bg-white rounded-[24px] p-5 luxury-shadow flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-serif text-[17px] text-[#2C2C2C] mb-1">{client.name}</h4>
                      <p className="text-xs text-[#8E8E8E] mb-2">{client.type} · {client.date}</p>
                      <span className="px-2.5 py-1 bg-[#F4E8C8]/30 text-[#D4AF37] text-[10px] uppercase tracking-widest rounded-md font-medium">
                        {client.status}
                      </span>
                    </div>
                  </div>
                  <button className="h-10 px-4 rounded-full border border-gray-200 text-[#2C2C2C] text-xs font-medium uppercase tracking-widest hover:border-[#D4AF37] transition-colors shrink-0">
                    Follow Up
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="completed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {completedClients.map(client => (
                <div key={client.id} className="bg-white rounded-[24px] p-5 luxury-shadow flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover grayscale opacity-80" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-serif text-[17px] text-[#2C2C2C] mb-1">{client.name}</h4>
                      <p className="text-xs text-[#8E8E8E] mb-2">{client.type}</p>
                      <span className="text-xs text-[#2C2C2C]/50">Served on {client.date}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#07C160] shrink-0">
                    <CheckCircle2 size={20} strokeWidth={2} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const PortfolioLookDetailsScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialLook = state?.look || {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'
    ],
    title: 'Ethereal Glow',
    category: 'BRIDAL GLAM',
    date: 'OCT 12, 2023'
  };

  const [images, setImages] = useState<string[]>(initialLook.images && initialLook.images.length > 0 ? initialLook.images : [initialLook.image]);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialLook.title);
  const [category, setCategory] = useState(initialLook.category || 'BRIDAL GLAM');
  const [date, setDate] = useState(initialLook.date || 'OCT 12, 2023');
  const [clientName, setClientName] = useState('Sarah Jenkins');
  const [clientPhone, setClientPhone] = useState('+1 234 567 890');
  const [service, setService] = useState('Full Bridal Day Service');
  const [price, setPrice] = useState('$599');
  const [notes, setNotes] = useState('Trial makeup was completed last week. The client requested a natural skin focus with a subtle golden eye glow. Used high-end Armani and Tom Ford products. Full wedding day look completed successfully.');
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  const handleDeleteImage = () => {
    if (imageToDelete !== null) {
      setImages(images.filter((_, i) => i !== imageToDelete));
      setImageToDelete(null);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollLeft;
    const containerWidth = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollPosition / containerWidth);
    if (newIndex !== activeImageIndex) {
      setActiveImageIndex(newIndex);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-32 min-h-screen bg-[#FAF9F6] relative z-50">
      <header className="sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md z-40 px-6 py-5 flex items-center justify-between max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="p-1 -ml-2 text-[#2C2C2C] hover:text-[#D4AF37] transition-colors">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-serif text-[#2C2C2C] tracking-wide">Look Details</h1>
        <div className="w-8" />
      </header>

      <div className="max-w-md mx-auto w-full px-6 flex flex-col space-y-8">
        {/* Upper Section: Immersive Media Showcase */}
        <div className="w-full relative rounded-[32px] overflow-hidden luxury-shadow bg-white aspect-[4/5]">
          {images.length === 1 ? (
            <img src={images[0]} loading="lazy" className="w-full h-full object-cover" alt={title} />
          ) : (
            <div 
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
              onScroll={handleScroll}
            >
              {images.map((img: string, i: number) => (
                <img key={i} src={img} loading="lazy" className="w-full h-full object-cover shrink-0 snap-center" alt={`${title} ${i + 1}`} />
              ))}
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_: any, i: number) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300",
                    i === activeImageIndex ? "bg-white w-3" : "bg-white/60"
                  )} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Lower Section: Modular Information Panel */}
        <div className="space-y-6">
          {/* Field 1: Look Title */}
          <div className="border-b border-gray-200 pb-4">
            <p className="text-[10px] text-[#8E8E8E] font-medium tracking-[0.2em] uppercase mb-1">Look Title</p>
            <h2 className="font-serif text-3xl text-[#2C2C2C]">{title}</h2>
          </div>

          {/* Field 2: Date & Category */}
          <div className="flex gap-2 border-b border-gray-200 pb-4">
            <span className="px-4 py-1.5 bg-[#F5F5F0] text-[#8E8E8E] font-medium text-[9px] uppercase tracking-widest rounded-full">
              {date}
            </span>
            <span className="px-4 py-1.5 bg-[#F5F5F0] text-[#8E8E8E] font-medium text-[9px] uppercase tracking-widest rounded-full">
              {category}
            </span>
          </div>

          {/* Field 3: Client Information */}
          <div className="bg-[#F5F5F0] rounded-[24px] p-5 luxury-shadow">
            <p className="text-[10px] text-[#8E8E8E] font-medium tracking-[0.2em] uppercase mb-2">Client</p>
            <h3 className="font-serif text-lg text-[#2C2C2C] mb-1">{clientName}</h3>
            <p className="text-[13px] text-[#8E8E8E] font-sans">{clientPhone}</p>
          </div>

          {/* Field 4: Service & Price */}
          <div className="bg-[#F5F5F0] rounded-[24px] p-5 luxury-shadow">
            <p className="text-[10px] text-[#8E8E8E] font-medium tracking-[0.2em] uppercase mb-2">Service</p>
            <h3 className="font-serif text-lg text-[#2C2C2C] mb-1">{service}</h3>
            <p className="text-lg text-[#2C2C2C] font-sans font-medium">{price}</p>
          </div>

          {/* Field 5: Case Notes */}
          <div className="bg-[#F5F5F0] rounded-[24px] p-5 luxury-shadow">
            <h3 className="font-serif text-lg text-[#2C2C2C] mb-3">Case Notes</h3>
            <p className="text-[14px] leading-relaxed text-[#5C5C5C] font-sans">
              {notes}
            </p>
          </div>
        </div>
        
        {/* Spacer for floating buttons */}
        <div className="h-16" />
      </div>

      {/* Floating Actions */}
      <div className="fixed bottom-8 left-0 right-0 max-w-md mx-auto px-6 pointer-events-none z-40 flex justify-between items-end">
        <button onClick={() => setIsEditing(true)} className="w-14 h-14 rounded-full bg-white text-[#2C2C2C] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform pointer-events-auto border border-gray-100">
          <Edit2 size={24} strokeWidth={1.5} />
        </button>
        <button className="w-14 h-14 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform pointer-events-auto">
          <Share2 size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Edit Details Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 right-0 z-[60] flex justify-center pointer-events-none"
          >
            <div className="w-full max-w-md flex flex-col h-full bg-[#FAF9F6] relative pointer-events-auto shadow-2xl">
              <header className="px-6 py-5 flex items-center justify-between bg-[#FAF9F6] z-10 shrink-0">
                <button onClick={() => setIsEditing(false)} className="p-2 -ml-2 text-[#2C2C2C] hover:text-[#D4AF37] transition-colors rounded-full hover:bg-gray-100/50">
                  <X size={24} strokeWidth={1.5} />
                </button>
                <h1 className="font-serif text-xl text-[#2C2C2C]">Edit Details</h1>
                <button onClick={() => setIsEditing(false)} className="text-sm font-medium text-[#D4AF37] uppercase tracking-widest px-2 py-1">
                  Save
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Images</label>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
                    <Reorder.Group 
                      axis="x"
                      values={images}
                      onReorder={setImages}
                      className="flex gap-4"
                    >
                      <AnimatePresence>
                        {images.map((img, i) => (
                          <Reorder.Item 
                            key={img}
                            value={img}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden cursor-grab active:cursor-grabbing"
                          >
                            <img src={img} className="w-full h-full object-cover pointer-events-none" alt={`Look ${i}`} />
                            <button 
                              onClick={() => setImageToDelete(i)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors pointer-events-auto"
                            >
                              <Trash2 size={12} />
                            </button>
                          </Reorder.Item>
                        ))}
                      </AnimatePresence>
                    </Reorder.Group>
                    <button className="w-24 h-24 rounded-xl bg-[#F5F5F0] flex flex-col items-center justify-center text-[#8E8E8E] flex-shrink-0 hover:bg-[#EBEBEB] transition-colors border-2 border-dashed border-gray-200">
                      <Plus size={20} className="mb-1" />
                      <span className="text-[10px] uppercase tracking-widest font-medium">Add</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Look Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Date</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Client Phone</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Service Provided</label>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Case Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    className="w-full bg-[#F5F5F5] border border-transparent rounded-[16px] p-4 text-[15px] text-[#2C2C2C] placeholder-[#A0A0A0] focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all resize-none"
                  />
                </div>
                
                <div className="h-8" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {imageToDelete !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-sm luxury-shadow"
            >
              <h3 className="font-serif text-2xl text-[#2C2C2C] mb-2 text-center">Delete Image</h3>
              <p className="text-sm text-[#8E8E8E] text-center mb-8">
                Are you sure you want to remove this image from the look? This action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setImageToDelete(null)}
                  className="flex-1 py-4 px-6 rounded-full border border-gray-200 text-[#2C2C2C] font-medium text-[11px] uppercase tracking-widest active:scale-95 transition-all text-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteImage}
                  className="flex-1 py-4 px-6 rounded-full bg-red-500 text-white font-medium text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-red-500/20 text-center"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
