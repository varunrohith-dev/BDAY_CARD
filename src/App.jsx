import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingVinyl } from './components/LandingVinyl';
import { TimelineSection } from './components/TimelineSection';
import { EndingSection } from './components/EndingSection';
import { CustomizeModal } from './components/CustomizeModal';
import { DEFAULT_PLAYLIST, musicEngine } from './utils/audioEngine';
import './App.css';

export function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = musicEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTrackIndex(state.activeTrackIndex);
    });
    return () => unsubscribe();
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
  };

  const handleTrackChange = (idx) => {
    setCurrentTrackIndex(idx);
  };

  const handleNavigateToChapter = (chapterIdx) => {
    const targetEl = document.querySelector(`[data-track-index="${chapterIdx}"]`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    musicEngine.crossfadeToTrack(0);
  };

  const activeTrack = DEFAULT_PLAYLIST[currentTrackIndex] || DEFAULT_PLAYLIST[0];

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-rose-500 selection:text-white overflow-x-hidden">
      {/* Dynamic Smooth Color Gradient Background */}
      <div
        className="ambient-glow-bg opacity-90"
        style={{
          background: activeTrack.gradient,
          transition: 'background 1.8s ease-in-out'
        }}
      />

      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1 }}
          >
            <LandingVinyl onEnter={handleEnter} activeTrack={activeTrack} />
          </motion.div>
        ) : (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 w-full flex flex-col items-center justify-center"
          >
            {/* Scrollable & Touch-Swipable Life Story Chapters */}
            <TimelineSection onTrackChange={handleTrackChange} />

            {/* Morphing Quote & Celebration Ending Section */}
            <EndingSection onReplay={handleReplay} />

            {/* Customization Modal */}
            <CustomizeModal
              isOpen={isCustomizeOpen}
              onClose={() => setIsCustomizeOpen(false)}
              onSaveCustomizations={() => {}}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
