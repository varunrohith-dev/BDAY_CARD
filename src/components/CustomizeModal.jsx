import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Music, Check } from 'lucide-react';
import { DEFAULT_PLAYLIST } from '../utils/audioEngine';

export const CustomizeModal = ({ isOpen, onClose, onSaveCustomizations }) => {
  const [tracks, setTracks] = useState(DEFAULT_PLAYLIST);
  const [isSaved, setIsSaved] = useState(false);

  const handleTrackChange = (index, field, value) => {
    const updated = [...tracks];
    updated[index] = { ...updated[index], [field]: value };
    setTracks(updated);
  };

  const handleSave = () => {
    localStorage.setItem('priya_custom_playlist', JSON.stringify(tracks));
    onSaveCustomizations(tracks);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-hidden select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-panel max-w-2xl sm:max-w-3xl w-full max-h-[85vh] flex flex-col p-5 sm:p-7 text-white rounded-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] bg-slate-950/95 backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              <h2 className="text-lg sm:text-2xl font-bold font-serif text-white">
                Customize Playlist & Songs
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-rose-500/80 text-slate-300 hover:text-white transition cursor-pointer border border-white/15"
              title="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-2 sm:pr-4 my-2">
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Paste your custom MP3 audio URLs or edit track titles to personalize each chapter's background music!
            </p>

            {tracks.map((track, idx) => (
              <div key={track.id} className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: track.color }} />
                    Chapter {idx + 1} Song
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[11px] sm:text-xs text-slate-400 block mb-1 font-medium">Song Title</label>
                    <input
                      type="text"
                      value={track.title}
                      onChange={(e) => handleTrackChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] sm:text-xs text-slate-400 block mb-1 font-medium">Chapter Subtitle</label>
                    <input
                      type="text"
                      value={track.subtitle}
                      onChange={(e) => handleTrackChange(idx, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs text-slate-400 block mb-1 font-medium">Audio MP3 URL</label>
                  <input
                    type="url"
                    value={track.audioUrl}
                    onChange={(e) => handleTrackChange(idx, 'audioUrl', e.target.value)}
                    placeholder="https://example.com/song.mp3"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400 font-mono truncate"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions (Never Cut Off) */}
          <div className="pt-4 border-t border-white/15 flex items-center justify-end gap-3 flex-shrink-0 bg-slate-950/90 rounded-b-3xl">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition cursor-pointer border border-white/20"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Customizations</span>
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
