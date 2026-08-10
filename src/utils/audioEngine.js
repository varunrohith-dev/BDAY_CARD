// Web Audio API & Multi-Track Background Audio Crossfader for Priyanka's Life Journey

export const DEFAULT_PLAYLIST = [
  {
    id: 1,
    chapter: 1,
    title: "Chapter 1: The Bond Btw Us!",
    subtitle: "Our Journey Starts Here!",
    artist: "Kadhaippoma • Entry Theme",
    mood: "Serene Indigo",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #312e81 100%)",
    audioUrl: "/music/Kadhaippoma - Entry.mpeg",
    quote: "Suddenly Everything Makes Sense , When U Entered!",
    durationSec: 195,
    lyrics: [
      "✨ Two strangers under the evening sky...",
      "🎵 A single conversation that changed everything...",
      "✨ Some connections are written in the stars...",
      "💖 The overture of our lifelong journey begins...",
      "✨ Understanding each other without saying a word..."
    ]
  },
  {
    id: 2,
    chapter: 2,
    title: "Chapter 2: The Days We Were In!",
    subtitle: "The Unbreakable Joy",
    artist: "Kadhaippoma Reprise • Memories",
    mood: "Warm Amber Gold",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #181005 0%, #451a03 50%, #78350f 100%)",
    audioUrl: "/music/Kadhaippoma reprise - .mpeg",
    quote: "With you, even the Simplest Days Became Unforgettable Adventures.",
    durationSec: 210,
    lyrics: [
      "☕ Coffee dates and unscripted laughter...",
      "☀️ Turning dark days into bright sunshine...",
      "🚗 Wrong turns on road trips, singing at top volume...",
      "✨ Side by side through every plot twist of life...",
      "💛 Laughter that healed every tired day..."
    ]
  },
  {
    id: 3,
    chapter: 3,
    title: "Chapter 3: This Chapter is About U!",
    subtitle: "Read and Do the Changes!",
    artist: "Nanbiye • Ending Theme",
    mood: "Sunset Emerald & Gold",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #03241b 0%, #047857 50%, #065f46 100%)",
    audioUrl: "/music/Nanbiye- Ending.mpeg",
    quote: "Different paths, one heart. Ur story is forever.",
    durationSec: 240,
    lyrics: [
      "🌟 Writing our unwritten life horizon together...",
      "💖 Different paths, one single heart...",
      "✨ ...and we're still writing this song...",
      "🎉 ...till our last breath...",
      "🎂 Happy Birthday Priyanka Ravichandran! ❤️"
    ]
  }
];

class MusicEngine {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.audioElements = {};
    this.customAudio = null;
    this.activeCustomTrack = null;
    this.synthInterval = null;
    this.activeTrackIndex = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.masterVolume = 0.85;
    this.currentTime = 0;
    this.timeTicker = null;
    this.listeners = new Set();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const currentTrack = this.activeCustomTrack || DEFAULT_PLAYLIST[this.activeTrackIndex];
    this.listeners.forEach((fn) => fn({
      isPlaying: this.isPlaying,
      activeTrackIndex: this.activeTrackIndex,
      isMuted: this.isMuted,
      masterVolume: this.masterVolume,
      currentTime: this.currentTime,
      durationSec: currentTrack ? currentTrack.durationSec : 180,
      currentTrack: currentTrack
    }));
  }

  startTimeTicker() {
    if (this.timeTicker) clearInterval(this.timeTicker);
    this.timeTicker = setInterval(() => {
      if (this.isPlaying) {
        const audio = this.audioElements[this.activeTrackIndex];
        if (audio && !isNaN(audio.currentTime) && audio.currentTime > 0) {
          this.currentTime = audio.currentTime;
        } else {
          this.currentTime += 1;
          const max = DEFAULT_PLAYLIST[this.activeTrackIndex]?.durationSec || 180;
          if (this.currentTime >= max) this.currentTime = 0;
        }
        this.notify();
      }
    }, 1000);
  }

  playNeedleDropSound() {
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.95 ? 0.8 : 0.08);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  }

  startProceduralSynth(trackIndex) {
    if (this.synthInterval) clearInterval(this.synthInterval);
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const chordPacks = [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66, 349.23]
    ];

    let chordStep = 0;
    const playChord = () => {
      if (!this.isPlaying) return;
      const notes = chordPacks[chordStep % chordPacks.length];
      chordStep++;
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * (1 + (trackIndex * 0.05)), now);

        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.07 / (idx + 1), now + 0.8);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(g);
        if (this.analyser) {
          g.connect(this.analyser);
        } else {
          g.connect(ctx.destination);
        }

        osc.start(now + idx * 0.05);
        osc.stop(now + 3.8);
      });
    };

    playChord();
    this.synthInterval = setInterval(playChord, 3200);
  }

  stopProceduralSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  getOrCreateAudio(index) {
    if (this.audioElements[index]) return this.audioElements[index];
    const track = DEFAULT_PLAYLIST[index];
    if (!track) return null;

    const audio = new Audio();
    if (track.audioUrl && track.audioUrl.startsWith('http')) {
      audio.crossOrigin = "anonymous";
    }
    audio.loop = true;
    audio.src = track.audioUrl;
    audio.preload = "auto";

    this.audioElements[index] = audio;
    return audio;
  }

  crossfadeToTrack(targetIndex, fadeSec = 1.2) {
    if (targetIndex < 0 || targetIndex >= DEFAULT_PLAYLIST.length) return;
    if (targetIndex === this.activeTrackIndex && this.isPlaying) return;

    this.initAudioContext();
    const prevIndex = this.activeTrackIndex;
    this.activeTrackIndex = targetIndex;
    this.currentTime = 0;

    const prevAudio = this.audioElements[prevIndex];
    const targetAudio = this.getOrCreateAudio(targetIndex);

    if (this.isPlaying) {
      if (prevAudio) {
        let fadeOutVol = prevAudio.volume;
        const fadeOutTimer = setInterval(() => {
          fadeOutVol -= 0.1;
          if (fadeOutVol <= 0) {
            prevAudio.volume = 0;
            prevAudio.pause();
            clearInterval(fadeOutTimer);
          } else {
            prevAudio.volume = Math.max(0, fadeOutVol);
          }
        }, (fadeSec * 1000) / 10);
      }

      if (targetAudio) {
        targetAudio.volume = 0;
        const playPromise = targetAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              let fadeInVol = 0;
              const maxVol = this.isMuted ? 0 : this.masterVolume;
              const fadeInTimer = setInterval(() => {
                fadeInVol += 0.1;
                if (fadeInVol >= maxVol) {
                  targetAudio.volume = maxVol;
                  clearInterval(fadeInTimer);
                } else {
                  targetAudio.volume = Math.min(maxVol, fadeInVol);
                }
              }, (fadeSec * 1000) / 10);
            })
            .catch(() => {
              this.startProceduralSynth(targetIndex);
            });
        }
      } else {
        this.startProceduralSynth(targetIndex);
      }
    }

    this.notify();
  }

  playCustomAudioUrl(url, title = "Special Track", artist = "Tamil Memory BGM") {
    if (!url) return null;
    this.initAudioContext();

    // Pause any playlist audio elements
    Object.values(this.audioElements).forEach((audio) => {
      audio.pause();
    });

    if (this.customAudio) {
      this.customAudio.pause();
    }

    this.isPlaying = true;
    this.startTimeTicker();

    const audio = new Audio();
    if (url && url.startsWith('http')) {
      audio.crossOrigin = "anonymous";
    }
    audio.loop = true;
    audio.src = url;
    audio.preload = "auto";
    audio.volume = this.isMuted ? 0 : this.masterVolume;
    this.customAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log("Audio play notice:", err);
      });
    }

    this.activeCustomTrack = {
      title: title,
      subtitle: artist,
      artist: artist,
      audioUrl: url,
      durationSec: 210,
      lyrics: [
        `🎵 Now Playing: ${title}`,
        `✨ Custom Memory Track for Priyanka`
      ]
    };

    this.notify();
    return audio;
  }

  stopCustomAudio(targetAudio = null) {
    if (targetAudio && this.customAudio && this.customAudio !== targetAudio) {
      targetAudio.pause();
      return;
    }

    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
      this.customAudio = null;
    }
    Object.values(this.audioElements).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeCustomTrack = null;
    this.isPlaying = false;
    if (this.timeTicker) clearInterval(this.timeTicker);
    this.notify();
  }

  play() {
    this.initAudioContext();
    this.isPlaying = true;
    this.startTimeTicker();

    if (this.customAudio) {
      this.customAudio.volume = this.isMuted ? 0 : this.masterVolume;
      this.customAudio.play().catch(() => {});
    } else {
      const currentAudio = this.getOrCreateAudio(this.activeTrackIndex);
      if (currentAudio) {
        currentAudio.volume = this.isMuted ? 0 : this.masterVolume;
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.startProceduralSynth(this.activeTrackIndex);
          });
        }
      } else {
        this.startProceduralSynth(this.activeTrackIndex);
      }
    }

    this.notify();
  }

  pause() {
    this.isPlaying = false;
    if (this.timeTicker) clearInterval(this.timeTicker);
    Object.values(this.audioElements).forEach((audio) => {
      audio.pause();
    });
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.stopProceduralSynth();
    this.notify();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Object.values(this.audioElements).forEach((audio) => {
      audio.volume = this.isMuted ? 0 : this.masterVolume;
    });
    if (this.customAudio) {
      this.customAudio.volume = this.isMuted ? 0 : this.masterVolume;
    }
    this.notify();
  }

  setVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (!this.isMuted) {
      if (this.customAudio) {
        this.customAudio.volume = this.masterVolume;
      }
      const currentAudio = this.audioElements[this.activeTrackIndex];
      if (currentAudio) currentAudio.volume = this.masterVolume;
    }
    this.notify();
  }

  getFrequencyData() {
    if (!this.analyser) {
      return new Uint8Array(16).map(() => (this.isPlaying ? Math.floor(Math.random() * 180) + 70 : 15));
    }
    const array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(array);
    return array;
  }
}

export const musicEngine = new MusicEngine();
