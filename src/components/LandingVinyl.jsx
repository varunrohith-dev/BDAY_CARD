import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Disc, Music, Sparkles, Heart, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { musicEngine } from '../utils/audioEngine';
import { AudioVisualizer } from './AudioVisualizer';
import { BlushingStarsAndConfetti } from './BlushingStarsAndConfetti';
import entranceLeft from '../assets/entrance-left.jpg';
import entranceRight from '../assets/entrance-right.jpg';

export const LandingVinyl = ({ onEnter, activeTrack }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handlePlayClick = () => {
    setIsStarting(true);

    confetti({
      particleCount: 160,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbbf24', '#3b82f6', '#10b981', '#ec4899', '#a855f7']
    });

    musicEngine.playNeedleDropSound();
    musicEngine.play();

    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 overflow-hidden z-20 select-none py-16 sm:py-28">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 z-0 pointer-events-none" />

      {/* Blushing Stars & Color Papers */}
      <BlushingStarsAndConfetti />

      {/* Radial glow background around vinyl */}
      <div
        className="absolute w-[600px] h-[600px] sm:w-[950px] sm:h-[950px] rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${activeTrack.color} 0%, rgba(244,63,94,0.2) 40%, transparent 70%)`
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-20 flex flex-col items-center max-w-5xl lg:max-w-7xl 2xl:max-w-[1700px] w-full text-center my-auto py-12 sm:py-20"
      >
        {/* Top Life Journey Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 glass-pill text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300 shadow-2xl border border-amber-400/40 backdrop-blur-xl"
        >
          <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300">
            A Journey Through Chapters of Life
          </span>
          <Heart className="w-4 h-4 text-rose-400 fill-current animate-pulse" />
        </motion.div>

        {/* GRAND CENTRAL TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[clamp(2.4rem,6vw,5.8rem)] font-extrabold tracking-tight mb-8 font-serif leading-[1.15] text-white px-2 max-w-5xl mx-auto"
        >
          Happy Birthday To My{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-amber-300 to-rose-400 drop-shadow-[0_0_35px_rgba(244,63,94,0.6)]">
            Bestesttt Frandddddd
          </span>{' '}
          <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-emerald-300 to-indigo-300 glow-text">
            Priyanka Ravichandran
          </span>
        </motion.h1>

        {/* Subtitle Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-slate-300 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto mb-14 font-light leading-relaxed px-4"
        >
          This is not just a website—it is ur shared journey into chapters of life. Press play on the SoundBox to unlock our memories, emotions, and background melodies as you scroll or swipe! ❤️
        </motion.p>

        {/* Vinyl Turntable Assembly */}
        <div className="relative my-8 sm:my-12 flex items-center justify-center">
          <AudioVisualizer isPlaying={isStarting} activeColor={activeTrack.color} />

          {/* Side Floating Preview Polaroids */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -12 }}
            animate={{ opacity: 1, x: 0, rotate: -8 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hidden lg:block absolute -left-48 top-6 polaroid-frame w-48 z-10 shadow-2xl pointer-events-none"
          >
            <img
              src={entranceLeft}
              alt="Chapter of Us"
              className="w-full h-36 object-cover rounded"
            />
            <p className="handwritten text-xs font-bold text-slate-800 mt-2 text-center">Chapter of Us ✨</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 12 }}
            animate={{ opacity: 1, x: 0, rotate: 10 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hidden lg:block absolute -right-48 top-6 polaroid-frame w-48 z-10 shadow-2xl pointer-events-none"
          >
            <img
              src={entranceRight}
              alt="Eternal Bond"
              className="w-full h-36 object-cover rounded"
            />
            <p className="handwritten text-xs font-bold text-slate-800 mt-2 text-center">The Bond Btw Us 💖</p>
          </motion.div>

          {/* Vinyl Disc */}
          <motion.div
            className={`vinyl-disc shadow-2xl cursor-pointer border-4 border-amber-400/30 ${isStarting ? 'animate-spin-fast' : 'animate-spin-slow'
              }`}
            whileHover={{ scale: 1.05 }}
            onClick={handlePlayClick}
          >
            <div className="vinyl-label">
              <Disc className="w-6 h-6 text-white/90 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[9px] sm:text-[11px] font-extrabold tracking-wider uppercase mt-1 text-amber-200">
                JOURNEY
              </span>
              <div className="vinyl-center-hole mt-1" />
            </div>
          </motion.div>

          {/* Turntable Tonearm */}
          <div className="hidden sm:block">
            <div className={`tonearm ${isStarting ? 'on' : 'off'}`}>
              <svg width="140" height="180" viewBox="0 0 140 180" fill="none">
                <circle cx="100" cy="30" r="22" fill="#1f2937" stroke="#fbbf24" strokeWidth="3" />
                <circle cx="100" cy="30" r="8" fill="#fef08a" />
                <path d="M100 30 L85 100 L45 135 L40 150" stroke="#d1d5db" strokeWidth="5" strokeLinecap="round" />
                <rect x="30" y="145" width="18" height="24" rx="3" fill="#f43f5e" stroke="#9f1239" strokeWidth="2" />
                <circle cx="39" cy="165" r="2" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>

        {/* CTA Play Button */}
        <motion.button
          whileHover={{ scale: 1.07, boxShadow: "0 0 45px rgba(244, 63, 94, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayClick}
          disabled={isStarting}
          className="mt-12 px-12 py-5 sm:py-6 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 text-white font-extrabold text-lg sm:text-2xl shadow-2xl shadow-rose-500/30 flex items-center gap-3 border-2 border-white/30 hover:border-white/70 transition-all cursor-pointer z-30"
        >
          {isStarting ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>Starting Journey!!!</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current text-slate-950" />
              <span className="text-slate-950 font-black tracking-wider uppercase">Begin Ur Life Journey</span>
            </>
          )}
        </motion.button>

        {/* Notice */}
        <span className="mt-8 text-xs sm:text-sm text-slate-400 flex items-center gap-2 font-medium">
          <Music className="w-4 h-4 text-amber-400 animate-bounce" />
          Scroll or Swipe down to change life chapters & background music
        </span>
      </motion.div>
    </div>
  );
};
