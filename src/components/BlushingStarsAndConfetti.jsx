import React from 'react';
import { motion } from 'framer-motion';

// Blushing Star SVG Component with cute pink cheeks & glowing twinkle
const BlushingStar = ({ size = 32, delay = 0, style = {} }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    style={style}
    animate={{
      scale: [1, 1.25, 1],
      rotate: [0, 15, -15, 0],
      opacity: [0.7, 1, 0.7]
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: delay
    }}
    className="drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
  >
    {/* Star shape */}
    <path
      d="M50 5 L63 35 L95 38 L71 60 L78 92 L50 75 L22 92 L29 60 L5 38 L37 35 Z"
      fill="url(#starGrad)"
      stroke="#fef08a"
      strokeWidth="2"
    />
    {/* Cute blushing cheeks */}
    <ellipse cx="34" cy="54" rx="7" ry="4" fill="#f43f5e" opacity="0.85" />
    <ellipse cx="66" cy="54" rx="7" ry="4" fill="#f43f5e" opacity="0.85" />
    {/* Cute eyes */}
    <circle cx="36" cy="46" r="4.5" fill="#1e1b4b" />
    <circle cx="64" cy="46" r="4.5" fill="#1e1b4b" />
    <circle cx="37.5" cy="44.5" r="1.5" fill="#ffffff" />
    <circle cx="65.5" cy="44.5" r="1.5" fill="#ffffff" />
    {/* Smiling mouth */}
    <path d="M43 58 Q50 65 57 58" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" fill="none" />
    
    <defs>
      <linearGradient id="starGrad" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </motion.svg>
);

export const BlushingStarsAndConfetti = () => {
  // Pre-calculated position arrays for floating icons, blushing stars, and color paper ribbons
  const icons = [
    { emoji: '🎈', top: '8%', left: '6%', size: 'text-3xl sm:text-5xl', delay: 0 },
    { emoji: '🎂', top: '12%', right: '8%', size: 'text-3xl sm:text-5xl', delay: 0.5 },
    { emoji: '🎁', top: '75%', left: '8%', size: 'text-3xl sm:text-5xl', delay: 1 },
    { emoji: '💖', top: '82%', right: '10%', size: 'text-3xl sm:text-5xl', delay: 1.5 },
    { emoji: '🎵', top: '40%', left: '4%', size: 'text-2xl sm:text-4xl', delay: 0.8 },
    { emoji: '🎉', top: '45%', right: '5%', size: 'text-3xl sm:text-5xl', delay: 1.2 },
    { emoji: '🥂', top: '25%', left: '12%', size: 'text-2xl sm:text-4xl', delay: 0.3 },
    { emoji: '🌟', top: '65%', right: '15%', size: 'text-2xl sm:text-4xl', delay: 1.8 },
  ];

  const blushingStarsPos = [
    { top: '15%', left: '20%', size: 48, delay: 0 },
    { top: '20%', right: '22%', size: 56, delay: 0.6 },
    { top: '70%', left: '18%', size: 44, delay: 1.2 },
    { top: '78%', right: '20%', size: 52, delay: 0.4 },
    { top: '35%', right: '12%', size: 38, delay: 0.9 },
    { top: '55%', left: '10%', size: 42, delay: 1.5 },
  ];

  // Floating color paper confetti strips
  const colorPapers = [
    { color: '#f43f5e', top: '10%', left: '30%', width: 14, height: 28, rotate: 25, duration: 4 },
    { color: '#3b82f6', top: '18%', right: '35%', width: 18, height: 35, rotate: -40, duration: 5 },
    { color: '#fbbf24', top: '30%', left: '15%', width: 16, height: 30, rotate: 60, duration: 4.5 },
    { color: '#10b981', top: '60%', right: '28%', width: 20, height: 40, rotate: -15, duration: 3.8 },
    { color: '#ec4899', top: '72%', left: '35%', width: 12, height: 26, rotate: 45, duration: 5.2 },
    { color: '#a855f7', top: '85%', right: '40%', width: 16, height: 32, rotate: -70, duration: 4.2 },
    { color: '#06b6d4', top: '5%', right: '15%', width: 15, height: 30, rotate: 30, duration: 6 },
    { color: '#f97316', top: '90%', left: '5%', width: 18, height: 36, rotate: -25, duration: 4.7 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Floating Emojis & Party Icons */}
      {icons.map((item, idx) => (
        <motion.div
          key={`icon-${idx}`}
          style={{ position: 'absolute', top: item.top, left: item.left, right: item.right }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, 12, -12, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4 + (idx % 3),
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut'
          }}
          className={`${item.size} filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Cute Blushing Stars */}
      {blushingStarsPos.map((star, idx) => (
        <div
          key={`star-${idx}`}
          style={{ position: 'absolute', top: star.top, left: star.left, right: star.right }}
        >
          <BlushingStar size={star.size} delay={star.delay} />
        </div>
      ))}

      {/* Floating Color Papers (Confetti Ribbon Strips) */}
      {colorPapers.map((paper, idx) => (
        <motion.div
          key={`paper-${idx}`}
          style={{
            position: 'absolute',
            top: paper.top,
            left: paper.left,
            right: paper.right,
            width: `${paper.width}px`,
            height: `${paper.height}px`,
            backgroundColor: paper.color,
            borderRadius: '4px',
            boxShadow: `0 0 10px ${paper.color}`
          }}
          animate={{
            y: [0, 30, 0],
            rotate: [paper.rotate, paper.rotate + 180, paper.rotate + 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: paper.duration,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};
