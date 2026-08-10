import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Disc, SkipForward, SkipBack, Heart, Music, Sparkles } from 'lucide-react';
import { musicEngine, DEFAULT_PLAYLIST } from '../utils/audioEngine';

// Helper function to format seconds into MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const HeaderNav = ({ currentTrackIndex, isPlaying, onNavigateToChapter }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(195);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const unsubscribe = musicEngine.subscribe((state) => {
      setIsMuted(state.isMuted);
      setCurrentTime(state.currentTime);
      setDurationSec(state.durationSec || 195);
    });
    return () => unsubscribe();
  }, []);

  const track = DEFAULT_PLAYLIST[currentTrackIndex] || DEFAULT_PLAYLIST[0];

  const lyricsList = track.lyrics || ["✨ Sharing our life journey through music & memories..."];
  const lyricIndex = Math.floor((currentTime / (durationSec || 180)) * lyricsList.length) % lyricsList.length;
  const currentLyricLine = lyricsList[lyricIndex] || lyricsList[0];

  const handleTogglePlay = () => {
    musicEngine.togglePlayPause();
  };

  const handleToggleMute = () => {
    musicEngine.toggleMute();
  };

  const handlePrevChapterTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + DEFAULT_PLAYLIST.length) % DEFAULT_PLAYLIST.length;
    musicEngine.crossfadeToTrack(prevIdx);
    if (onNavigateToChapter) {
      onNavigateToChapter(prevIdx);
    }
  };

  const handleNextChapterTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % DEFAULT_PLAYLIST.length;
    musicEngine.crossfadeToTrack(nextIdx);
    if (onNavigateToChapter) {
      onNavigateToChapter(nextIdx);
    }
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / (durationSec || 180)) * 100));

  return (
    <motion.header
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 pointer-events-auto select-none flex justify-end items-start"
    >
      {/* FLOATING TOP-RIGHT VERTICAL SQUARE MUSIC PLAYER */}
      <div className="w-44 sm:w-48 bg-slate-950/95 backdrop-blur-2xl p-3 flex flex-col items-center text-center gap-2 rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.9)] border border-amber-400/40 text-white ml-auto">
        
        {/* Top Album / Vinyl Box */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-slate-900 border border-white/20 flex items-center justify-center shadow-md shrink-0">
          <Disc
            className={`w-9 h-9 sm:w-10 sm:h-10 text-amber-400 ${isPlaying ? 'animate-spin-slow' : ''}`}
          />
          {isPlaying && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-400 rounded-sm animate-ping" />
          )}
        </div>

        {/* Track Title & Subtitle */}
        <div className="w-full flex flex-col items-center justify-center min-w-0">
          <span className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full hover:text-amber-400 transition cursor-pointer">
            {track.title}
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-full font-light">
            {track.subtitle}
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-center gap-2 w-full">
          <button
            onClick={handlePrevChapterTrack}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-amber-400 transition cursor-pointer"
            title="Previous Chapter"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="p-2.5 rounded-md bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-500 text-slate-950 font-extrabold shadow-md hover:scale-105 transition cursor-pointer border border-white/20"
            title={isPlaying ? "Pause Music" : "Play Music"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current text-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-current text-slate-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNextChapterTrack}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-amber-400 transition cursor-pointer"
            title="Next Chapter"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-300" />
            )}
          </button>
        </div>

        {/* Progress Bar & Timer */}
        <div className="flex items-center gap-2 w-full pt-1.5 border-t border-white/10">
          <span className="text-[9px] text-amber-300 font-mono font-bold">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 h-1 bg-slate-800 rounded-none overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-400 font-mono">
            {formatTime(durationSec)}
          </span>
        </div>

        {/* Lyrics Ticker */}
        <div className="flex items-center justify-center gap-1 w-full overflow-hidden pt-0.5">
          <Music className="w-2.5 h-2.5 text-rose-400 animate-pulse flex-shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentLyricLine}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.3 }}
              className="text-[9px] sm:text-[10px] font-medium italic text-amber-200 truncate max-w-[150px]"
            >
              {currentLyricLine}
            </motion.span>
          </AnimatePresence>
          <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse flex-shrink-0" />
        </div>

      </div>
    </motion.header>
  );
};
