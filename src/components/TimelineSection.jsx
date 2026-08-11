import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles, Heart, Quote, Compass, Star, BookOpen } from 'lucide-react';
import { musicEngine, DEFAULT_PLAYLIST } from '../utils/audioEngine';
import { MEMORIES_DATA, MemoryCard } from './MemoryCard';
import { StoryReaderModal } from './StoryReaderModal';

const ALL_MEMORIES = [
  ...MEMORIES_DATA.chapter1,
  ...MEMORIES_DATA.chapter2,
  ...MEMORIES_DATA.chapter3
];

export const TimelineSection = ({ onTrackChange }) => {
  const containerRef = useRef(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);

  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.2
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const trackIdx = parseInt(entry.target.getAttribute('data-track-index'), 10);
          if (!isNaN(trackIdx)) {
            setActiveChapterIndex(trackIdx);
            onTrackChange(trackIdx);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll('.timeline-chapter-section');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, [onTrackChange]);

  const scrollToChapter = (index) => {
    const targetEl = document.querySelector(`[data-track-index="${index}"]`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentStoryIndex = ALL_MEMORIES.findIndex(m => m.id === selectedStory?.id);

  const handleNextStory = () => {
    if (currentStoryIndex !== -1 && currentStoryIndex < ALL_MEMORIES.length - 1) {
      setSelectedStory(ALL_MEMORIES[currentStoryIndex + 1]);
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setSelectedStory(ALL_MEMORIES[currentStoryIndex - 1]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-12 py-20 sm:py-32 flex flex-col items-center text-center space-y-40 sm:space-y-56"
    >
      {/* Floating Side Chapter Indicator Dots */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 glass-panel p-2.5 rounded-full border border-white/10 shadow-2xl">
        {DEFAULT_PLAYLIST.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => scrollToChapter(idx)}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 cursor-pointer ${activeChapterIndex === idx ? 'scale-150 shadow-[0_0_15px_#fbbf24]' : 'opacity-40 hover:opacity-80'
              }`}
            style={{ backgroundColor: t.color }}
            title={t.title}
          />
        ))}
      </div>

      {/* CHAPTER 1 */}
      <section className="timeline-chapter-section w-full flex flex-col items-center py-16 sm:py-28" data-track-index="0">
        {/* CENTERED TEXT HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-24 px-4"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 glass-pill text-xs font-bold uppercase tracking-wider text-indigo-300 mb-6 border border-indigo-400/30">
            <Compass className="w-4 h-4 text-indigo-400" />
            {DEFAULT_PLAYLIST[0].title}
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif text-white glow-text leading-tight max-w-3xl text-center">
            {DEFAULT_PLAYLIST[0].subtitle}
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto mt-6 text-sm sm:text-lg font-light italic leading-relaxed text-center">
            "{DEFAULT_PLAYLIST[0].quote}"
          </p>
        </motion.div>

        {/* CENTERED IMAGES GRID */}
        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-24 lg:gap-36 w-full max-w-6xl mx-auto px-4">
          {MEMORIES_DATA.chapter1.map((mem) => (
            <MemoryCard key={mem.id} memory={mem} onOpenStory={(m) => setSelectedStory(m)} />
          ))}
        </div>
      </section>

      {/* CHAPTER 2 */}
      <section className="timeline-chapter-section w-full flex flex-col items-center py-20 sm:py-32" data-track-index="1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-24 px-4"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 glass-pill text-xs font-bold uppercase tracking-wider text-amber-300 mb-6 border border-amber-400/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {DEFAULT_PLAYLIST[1].title}
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif text-amber-200 gold-glow-text leading-tight max-w-3xl text-center">
            {DEFAULT_PLAYLIST[1].subtitle}
          </h2>

          <p className="text-amber-100/80 max-w-2xl mx-auto mt-6 text-sm sm:text-lg font-light italic leading-relaxed text-center">
            "{DEFAULT_PLAYLIST[1].quote}"
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-24 lg:gap-36 w-full max-w-6xl mx-auto px-4">
          {MEMORIES_DATA.chapter2.map((mem) => (
            <MemoryCard key={mem.id} memory={mem} onOpenStory={(m) => setSelectedStory(m)} />
          ))}
        </div>
      </section>

      {/* CHAPTER 3 */}
      <section className="timeline-chapter-section w-full flex flex-col items-center py-20 sm:py-32" data-track-index="2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-24 px-4"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 glass-pill text-xs font-bold uppercase tracking-wider text-emerald-300 mb-6 border border-emerald-400/30">
            <Star className="w-4 h-4 text-emerald-400" />
            {DEFAULT_PLAYLIST[2].title}
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif text-emerald-200 leading-tight max-w-3xl text-center">
            {DEFAULT_PLAYLIST[2].subtitle}
          </h2>

          <p className="text-emerald-200/80 max-w-2xl mx-auto mt-6 text-sm sm:text-lg font-light italic leading-relaxed text-center">
            "{DEFAULT_PLAYLIST[2].quote}"
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-24 lg:gap-36 w-full max-w-6xl mx-auto px-4">
          {MEMORIES_DATA.chapter3.map((mem) => (
            <MemoryCard key={mem.id} memory={mem} onOpenStory={(m) => setSelectedStory(m)} />
          ))}
        </div>
      </section>

      {/* Story Reader Modal */}
      <StoryReaderModal
        isOpen={!!selectedStory}
        memory={selectedStory}
        onClose={() => setSelectedStory(null)}
        onNext={currentStoryIndex < ALL_MEMORIES.length - 1 ? handleNextStory : null}
        onPrev={currentStoryIndex > 0 ? handlePrevStory : null}
      />

    </div>
  );
};
