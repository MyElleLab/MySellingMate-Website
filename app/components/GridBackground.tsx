'use client';
import { useEffect, useRef } from 'react';

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const cellSize = isMobile ? 14 : 10;
    let animationId: number;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = document.documentElement.scrollHeight;
    }

    function draw(time: number) {
      const t = time * 0.001;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const cols = Math.ceil(canvas!.width / cellSize);
      const rows = Math.ceil(canvas!.height / cellSize);

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const wave = Math.sin((x + y) * 0.3 - t * 1.8);
          const opacity = 0.06 + 0.18 * wave;

          ctx!.fillStyle = `rgba(55, 62, 71, ${opacity})`;
          ctx!.beginPath();
          ctx!.roundRect(
            x * cellSize + 1,
            y * cellSize + 1,
            cellSize - 2,
            cellSize - 2,
            2
          );
          ctx!.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(draw);
      }
    }

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) {
      draw(0);
    } else {
      animationId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
