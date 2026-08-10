import React, { useEffect, useRef } from 'react';
import { musicEngine } from '../utils/audioEngine';

export const AudioVisualizer = ({ isPlaying, activeColor = '#6366f1' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const freqData = musicEngine.getFrequencyData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(centerX, centerY) - 30;

      // Draw glowing outer audio pulse ring
      if (isPlaying && freqData.length > 0) {
        const barCount = 32;
        const angleStep = (Math.PI * 2) / barCount;

        for (let i = 0; i < barCount; i++) {
          const value = freqData[i % freqData.length] || 20;
          const barLength = (value / 255) * 45;
          const angle = i * angleStep;

          const startX = centerX + Math.cos(angle) * (baseRadius - 5);
          const startY = centerY + Math.sin(angle) * (baseRadius - 5);
          const endX = centerX + Math.cos(angle) * (baseRadius + barLength);
          const endY = centerY + Math.sin(angle) * (baseRadius + barLength);

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = activeColor;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 12;
          ctx.shadowColor = activeColor;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activeColor]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={480}
      className="visualizer-canvas"
    />
  );
};
