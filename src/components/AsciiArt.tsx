"use client";

import { useEffect, useRef, useCallback } from "react";

const CHARS = "@#S%?*+;:,.01";
const PRIMARY = "#FF541F";
const WHITE = "#FFFFFF";

/**
 * Draw a rocket launching upward with exhaust flames and smoke trail.
 */
function drawRocket(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const rocketW = w * 0.09;

  // Rocket body top/bottom
  const noseY = h * 0.08;
  const bodyTop = h * 0.18;
  const bodyBottom = h * 0.52;
  const finBottom = h * 0.58;

  // === Exhaust flame (brightest part) ===
  ctx.fillStyle = "#fff";

  // Inner flame core (bright)
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(cx - rocketW * 0.4, bodyBottom);
  ctx.quadraticCurveTo(cx - rocketW * 0.15, bodyBottom + h * 0.12, cx, bodyBottom + h * 0.28);
  ctx.quadraticCurveTo(cx + rocketW * 0.15, bodyBottom + h * 0.12, cx + rocketW * 0.4, bodyBottom);
  ctx.closePath();
  ctx.fill();

  // Outer flame (wider, dimmer)
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.moveTo(cx - rocketW * 0.7, bodyBottom);
  ctx.quadraticCurveTo(cx - rocketW * 0.3, bodyBottom + h * 0.18, cx, bodyBottom + h * 0.38);
  ctx.quadraticCurveTo(cx + rocketW * 0.3, bodyBottom + h * 0.18, cx + rocketW * 0.7, bodyBottom);
  ctx.closePath();
  ctx.fill();

  // Far outer glow
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.moveTo(cx - rocketW * 1.2, bodyBottom + h * 0.02);
  ctx.quadraticCurveTo(cx - rocketW * 0.4, bodyBottom + h * 0.25, cx, bodyBottom + h * 0.48);
  ctx.quadraticCurveTo(cx + rocketW * 0.4, bodyBottom + h * 0.25, cx + rocketW * 1.2, bodyBottom + h * 0.02);
  ctx.closePath();
  ctx.fill();

  // === Smoke trail (spreading downward) ===
  ctx.globalAlpha = 0.08;
  const smokeParticles = [
    { x: cx - w * 0.05, y: h * 0.75, r: w * 0.04 },
    { x: cx + w * 0.06, y: h * 0.78, r: w * 0.05 },
    { x: cx - w * 0.08, y: h * 0.82, r: w * 0.06 },
    { x: cx + w * 0.1, y: h * 0.85, r: w * 0.07 },
    { x: cx - w * 0.12, y: h * 0.88, r: w * 0.08 },
    { x: cx + w * 0.14, y: h * 0.9, r: w * 0.09 },
    { x: cx, y: h * 0.92, r: w * 0.1 },
    { x: cx - w * 0.06, y: h * 0.95, r: w * 0.11 },
    { x: cx + w * 0.08, y: h * 0.97, r: w * 0.12 },
  ];
  for (const s of smokeParticles) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // === Rocket nose cone ===
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(cx, noseY);
  ctx.quadraticCurveTo(cx + rocketW * 0.15, noseY + h * 0.04, cx + rocketW * 0.5, bodyTop);
  ctx.lineTo(cx - rocketW * 0.5, bodyTop);
  ctx.quadraticCurveTo(cx - rocketW * 0.15, noseY + h * 0.04, cx, noseY);
  ctx.closePath();
  ctx.fill();

  // === Rocket body ===
  ctx.globalAlpha = 0.8;
  ctx.fillRect(cx - rocketW * 0.5, bodyTop, rocketW, bodyBottom - bodyTop);

  // Body highlight stripe (center)
  ctx.globalAlpha = 1;
  ctx.fillRect(cx - rocketW * 0.15, bodyTop, rocketW * 0.3, bodyBottom - bodyTop);

  // Body detail bands
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 0.3;
  const bandPositions = [0.25, 0.5, 0.75];
  for (const bp of bandPositions) {
    const bandY = bodyTop + (bodyBottom - bodyTop) * bp;
    ctx.fillRect(cx - rocketW * 0.5, bandY - h * 0.005, rocketW, h * 0.01);
  }

  // Window/porthole
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.95;
  const windowY = bodyTop + (bodyBottom - bodyTop) * 0.3;
  ctx.beginPath();
  ctx.arc(cx, windowY, rocketW * 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Window inner
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(cx, windowY, rocketW * 0.12, 0, Math.PI * 2);
  ctx.fill();
  // Window glint
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(cx - rocketW * 0.04, windowY - rocketW * 0.04, rocketW * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // === Fins ===
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.7;

  // Left fin
  ctx.beginPath();
  ctx.moveTo(cx - rocketW * 0.5, bodyBottom - h * 0.03);
  ctx.lineTo(cx - rocketW * 1.3, finBottom + h * 0.02);
  ctx.lineTo(cx - rocketW * 1.1, finBottom - h * 0.02);
  ctx.lineTo(cx - rocketW * 0.5, bodyBottom - h * 0.08);
  ctx.closePath();
  ctx.fill();

  // Right fin
  ctx.beginPath();
  ctx.moveTo(cx + rocketW * 0.5, bodyBottom - h * 0.03);
  ctx.lineTo(cx + rocketW * 1.3, finBottom + h * 0.02);
  ctx.lineTo(cx + rocketW * 1.1, finBottom - h * 0.02);
  ctx.lineTo(cx + rocketW * 0.5, bodyBottom - h * 0.08);
  ctx.closePath();
  ctx.fill();

  // Center fin/nozzle
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(cx - rocketW * 0.25, bodyBottom);
  ctx.lineTo(cx, finBottom);
  ctx.lineTo(cx + rocketW * 0.25, bodyBottom);
  ctx.closePath();
  ctx.fill();

  // === Speed lines (diagonal streaks) ===
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.07;
  const speedLines = [
    [w * 0.15, h * 0.1, w * 0.12, h * 0.25],
    [w * 0.1, h * 0.2, w * 0.08, h * 0.38],
    [w * 0.2, h * 0.3, w * 0.17, h * 0.48],
    [w * 0.82, h * 0.08, w * 0.85, h * 0.28],
    [w * 0.88, h * 0.18, w * 0.9, h * 0.35],
    [w * 0.78, h * 0.25, w * 0.8, h * 0.45],
    [w * 0.25, h * 0.5, w * 0.22, h * 0.65],
    [w * 0.75, h * 0.45, w * 0.78, h * 0.6],
  ];
  for (const [x1, y1, x2, y2] of speedLines) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // === Stars ===
  ctx.fillStyle = "#fff";
  const stars = [
    [0.05, 0.05], [0.12, 0.15], [0.08, 0.35], [0.18, 0.08],
    [0.92, 0.06], [0.88, 0.2], [0.95, 0.35], [0.3, 0.05],
    [0.03, 0.6], [0.15, 0.5], [0.92, 0.5], [0.97, 0.65],
    [0.25, 0.18], [0.7, 0.08], [0.42, 0.04], [0.6, 0.03],
  ];
  for (const [sx, sy] of stars) {
    ctx.globalAlpha = 0.12 + Math.random() * 0.2;
    ctx.beginPath();
    ctx.arc(w * sx, h * sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

export default function AsciiArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const charsGridRef = useRef<string[][]>([]);
  const offsetsRef = useRef<{ x: number; y: number }[][]>([]);
  const timeRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w === 0 || h === 0) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontSize = 11;
      const cellW = fontSize * 0.68;
      const cellH = fontSize;
      const cols = Math.floor(w / cellW);
      const rows = Math.floor(h / cellH);

      // Draw the Watapana tree silhouette on an offscreen canvas
      const offscreen = document.createElement("canvas");
      offscreen.width = cols;
      offscreen.height = rows;
      const offCtx = offscreen.getContext("2d")!;
      drawRocket(offCtx, cols, rows);

      const pixelData = offCtx.getImageData(0, 0, cols, rows).data;
      const brightness: number[][] = [];
      const chars: string[][] = [];
      const offsets: { x: number; y: number }[][] = [];

      for (let row = 0; row < rows; row++) {
        brightness[row] = [];
        chars[row] = [];
        offsets[row] = [];
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4;
          const r = pixelData[i];
          const g = pixelData[i + 1];
          const b = pixelData[i + 2];
          const a = pixelData[i + 3] / 255;
          const bright = ((r * 0.299 + g * 0.587 + b * 0.114) / 255) * a;
          brightness[row][col] = bright;
          const charIndex = Math.floor(bright * (CHARS.length - 1));
          chars[row][col] = CHARS[Math.min(charIndex, CHARS.length - 1)];
          offsets[row][col] = { x: 0, y: 0 };
        }
      }

      charsGridRef.current = chars;
      offsetsRef.current = offsets;

      const draw = () => {
        timeRef.current += 0.016;
        ctx.clearRect(0, 0, w, h);
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        ctx.textBaseline = "top";

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const radius = 110;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const bright = brightness[row][col];
            if (bright < 0.04) continue;

            const baseX = col * cellW;
            const baseY = row * cellH;

            const dx = baseX - mx;
            const dy = baseY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let ox = offsetsRef.current[row][col].x;
            let oy = offsetsRef.current[row][col].y;

            if (dist < radius) {
              const force = (1 - dist / radius) * 28;
              const angle = Math.atan2(dy, dx);
              ox += (Math.cos(angle) * force - ox) * 0.12;
              oy += (Math.sin(angle) * force - oy) * 0.12;
            } else {
              ox *= 0.93;
              oy *= 0.93;
            }

            offsetsRef.current[row][col] = { x: ox, y: oy };
            const finalX = baseX + ox;
            const finalY = baseY + oy;

            const isDisplaced = Math.abs(ox) > 1.5 || Math.abs(oy) > 1.5;

            if (isDisplaced) {
              ctx.fillStyle = PRIMARY;
              ctx.globalAlpha = Math.min(bright * 2.5, 1);
            } else if (bright > 0.55) {
              ctx.fillStyle = WHITE;
              ctx.globalAlpha = bright;
            } else if (bright > 0.15) {
              const wave =
                Math.sin(timeRef.current * 0.3 + row * 0.07 + col * 0.07) *
                  0.5 +
                0.5;
              ctx.fillStyle = wave > 0.72 ? PRIMARY : WHITE;
              ctx.globalAlpha = bright * 0.9;
            } else {
              ctx.fillStyle = WHITE;
              ctx.globalAlpha = bright * 0.5;
            }

            let char = charsGridRef.current[row][col];
            if (Math.random() < 0.004) {
              char = CHARS[Math.floor(Math.random() * CHARS.length)];
              charsGridRef.current[row][col] = char;
            }

            ctx.fillText(char, finalX, finalY);
          }
        }

        ctx.globalAlpha = 1;
        animationRef.current = requestAnimationFrame(draw);
      };

      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(draw);
    };

    setup();

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(animationRef.current);
      setup();
    });
    resizeObserver.observe(parent);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />;
}
