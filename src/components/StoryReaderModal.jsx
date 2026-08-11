import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Sparkles, ChevronLeft, ChevronRight, BookOpen, Quote, Maximize2 } from 'lucide-react';
import { musicEngine } from '../utils/audioEngine';

export const StoryReaderModal = ({ isOpen, memory, onClose, onNext, onPrev }) => {
  const [isFullImageOpen, setIsFullImageOpen] = useState(false);

  useEffect(() => {
    setIsFullImageOpen(false);
  }, [memory, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.history.pushState({ modalOpen: true }, '');

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          if (isFullImageOpen) {
            setIsFullImageOpen(false);
          } else {
            onClose();
          }
        }
      };

      const handlePopState = () => {
        if (isFullImageOpen) {
          setIsFullImageOpen(false);
        } else {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('popstate', handlePopState);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, isFullImageOpen, onClose]);

  useEffect(() => {
    let activeAudio = null;
    if (isOpen && memory && memory.songUrl) {
      activeAudio = musicEngine.playCustomAudioUrl(memory.songUrl, memory.title, memory.songQuote || "Tamil Soundtrack");
      return () => {
        musicEngine.stopCustomAudio(activeAudio);
      };
    }
  }, [isOpen, memory]);

  if (!isOpen || !memory) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto select-none">
        
        {/* LIGHTBOX FOR HIGH RESOLUTION FULLSCREEN IMAGE */}
        <AnimatePresence>
          {isFullImageOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsFullImageOpen(false)}
              className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullImageOpen(false);
                }}
                className="absolute top-5 right-5 p-3 rounded-full bg-slate-800/90 text-white hover:bg-rose-500 hover:scale-110 transition cursor-pointer border border-white/20 shadow-2xl z-20 flex items-center justify-center"
                title="Exit Fullscreen Photo (Return to Story Frame)"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={memory.image}
                alt={memory.title}
                className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.01] transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullImageOpen(false);
                }}
              />
              <div className="mt-4 flex flex-col items-center gap-1.5">
                <p className="text-white text-xs sm:text-sm font-semibold bg-slate-900/90 px-5 py-2.5 rounded-full border border-white/20 shadow-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{memory.title} • High-Res Fullscreen View</span>
                </p>
                <span className="text-slate-400 text-[11px] font-medium">Tap photo or background to return to story frame</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative glass-panel max-w-6xl 2xl:max-w-7xl w-full max-h-[92vh] my-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 text-white flex flex-col"
        >
          {/* Top Header Bar - Ample Horizontal Inset (px-8 sm:px-12 md:px-16) to Clear Curved Corners */}
          <div className="px-8 sm:px-12 md:px-16 py-4 sm:py-5 border-b border-white/10 bg-slate-900/95 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-20">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-2 shadow-md">
                <BookOpen className="w-4 h-4 text-amber-400" />
                {memory.tag || "Life Chapter"}
              </span>
            </div>

            {/* Close Button with Generous Spacing inside Rounded Corner */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-800/90 text-white hover:bg-rose-500 hover:scale-110 transition-all cursor-pointer border border-white/20 shadow-lg flex items-center justify-center shrink-0"
              title="Close Story Reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Body - Full Page Spaced Grid */}
          <div className="p-6 sm:p-10 lg:p-12 pb-16 sm:pb-24 overflow-y-auto flex-1 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-12 items-start">
            
            {/* Column 1: High-Res Photo Display - Tapping anywhere on container/image opens Fullscreen */}
            <div 
              onClick={() => setIsFullImageOpen(true)}
              className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-slate-900 border border-white/20 shadow-2xl group cursor-pointer"
              title="Touch picture to expand to full screen"
            >
              <img
                src={memory.image}
                alt={memory.title}
                className="w-full aspect-[4/3] lg:aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Prompt on Hover / Touch */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2.5 rounded-full bg-slate-950/90 text-amber-300 text-xs sm:text-sm font-extrabold flex items-center gap-2 border border-amber-400/50 shadow-2xl opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-105">
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  Tap Photo for Fullscreen View
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullImageOpen(true);
                }}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-slate-950/90 backdrop-blur-md text-amber-300 text-xs font-extrabold flex items-center gap-2 border border-amber-400/50 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-xl cursor-pointer"
                title="View Fullscreen High Resolution Image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Fullscreen Photo 🔍
              </button>
            </div>

            {/* Column 2: Story Content & Details - Big Font & Full Spacing */}
            <div className="lg:col-span-7 flex flex-col space-y-6 pb-12">
              
              {/* Heading & Metadata */}
              <div>
                <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-white glow-text leading-tight mb-3">
                  {memory.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                  {memory.date && (
                    <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      {memory.date}
                    </span>
                  )}
                  {memory.location && (
                    <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      {memory.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Caption Quote Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-base sm:text-xl italic font-serif flex items-start gap-3 shadow-inner">
                <Quote className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>"{memory.caption}"</span>
              </div>

              {/* Story Letter Body with Big Readable Font */}
              <div className="space-y-4 text-slate-100 text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose font-light pb-8">
                {memory.description && (
                  <p className="text-slate-200 font-medium">
                    {memory.description}
                  </p>
                )}

                {memory.fullStory ? (
                  <div className="whitespace-pre-line text-slate-100 font-normal leading-relaxed sm:leading-loose border-l-4 border-amber-400/80 px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg md:text-xl bg-slate-900/80 rounded-2xl shadow-xl border border-amber-400/20 mb-8">
                    {memory.fullStory}
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-sm sm:text-base text-indigo-200 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-indigo-400 shrink-0" />
                    <span>
                      Ready for customized story text! Send over your custom headings & text to update this frame.
                    </span>
                  </div>
                )}
              </div>

              {/* Theme Song Quote */}
              {memory.songQuote && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm sm:text-base text-rose-200 flex items-center justify-between shadow-md">
                  <span className="font-bold italic truncate">"Theme: {memory.songQuote}"</span>
                  <Sparkles className="w-5 h-5 text-rose-400 flex-shrink-0 ml-2" />
                </div>
              )}

            </div>
          </div>

          {/* Modal Footer Navigation - Ample Horizontal Inset (px-8 sm:px-12 md:px-16) to Clear Curved Corners */}
          <div className="px-8 sm:px-12 md:px-16 py-4 sm:py-5 border-t border-white/10 bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-4 flex-shrink-0 z-20">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="px-5 py-2.5 rounded-full bg-slate-800/90 text-white font-bold text-xs sm:text-sm hover:bg-slate-700 hover:scale-105 border border-white/20 shadow-md disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span>Previous Photo</span>
            </button>

            <button
              onClick={onNext}
              disabled={!onNext}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:pointer-events-none shrink-0"
            >
              <span>Next Photo</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
