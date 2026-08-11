import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EndingSection = ({ onReplay }) => {
  const handleTriggerConfetti = () => {
    const count = 250;
    const defaults = { origin: { y: 0.65 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 28,
      startVelocity: 55,
      colors: ['#f43f5e', '#fbbf24']
    });
    fire(0.2, {
      spread: 65,
      colors: ['#6366f1', '#10b981']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 125,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#ffffff', '#f43f5e', '#ec4899']
    });
  };

  return (
    <section className="relative z-10 w-full flex flex-col items-center justify-center mx-auto py-16 sm:py-24 select-none">

      <div className="flex flex-col items-center justify-center w-full max-w-4xl px-4 sm:px-8">
        {/* PERFECTLY CENTERED MORPHING QUOTE CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="glass-panel p-6 sm:p-10 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl border border-amber-500/30 w-full max-w-2xl sm:max-w-3xl mx-auto text-center flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-amber-500/10 to-emerald-500/10 pointer-events-none" />

          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block p-3 rounded-full bg-rose-500/20 text-rose-400 mb-5 border border-rose-500/30 mx-auto"
          >
            <Heart className="w-7 h-7 fill-current animate-pulse" />
          </motion.div>

          {/* CENTERED ENDING QUOTE */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-serif text-white tracking-tight leading-snug sm:leading-relaxed mb-6 glow-text text-center mx-auto max-w-xl sm:max-w-2xl">

            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-400 to-emerald-400">
              Your Cycle with this Daddy!
            </span>
          </h2>

          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed mb-8 italic text-center">
            Thank you for being my sanctuary ,  Happy Birthday, Priyanka! ❤️
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full mx-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTriggerConfetti}
              className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              Tap for Sparkles!
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReplay}
              className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-full glass-pill text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              Replay Life Journey
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* DARK HIGH-CONTRAST BOTTOM FOOTER BAR */}
      <footer className="w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 py-4 sm:py-5 px-4 text-xs sm:text-sm text-slate-100 font-medium flex items-center justify-center gap-2.5 text-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-20">
        <Compass className="w-4 h-4 text-rose-400 shrink-0 animate-spin" style={{ animationDuration: '15s' }} />
        <span>
          Crafted with deep emotion for <strong className="text-amber-300 font-bold">You!</strong> • Eternal Chapter of Life
        </span>
      </footer>

    </section>
  );
};
