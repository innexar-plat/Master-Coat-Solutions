"use client";

import { useEffect, useRef } from "react";

type SplatterDrop = {
  x: number;
  y: number;
  color: string;
  r: number;
  alpha: number;
  tailLen: number;
  tailAngle: number;
  tailW: number;
  sats: Array<{ x: number; y: number; r: number; alpha: number }>;
};

function createDrop(x: number, y: number, color: string, fromClick = false): SplatterDrop {
  const radius = fromClick ? 4 + Math.random() * 10 : 2 + Math.random() * 6;
  const alpha = 0.7 + Math.random() * 0.3;
  const satsCount = fromClick ? Math.floor(Math.random() * 8 + 4) : Math.floor(Math.random() * 4 + 1);

  const sats = Array.from({ length: satsCount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = radius * (1.2 + Math.random() * 2.5);

    return {
      x: x + Math.cos(angle) * dist,
      y: y + Math.sin(angle) * dist,
      r: radius * (0.15 + Math.random() * 0.4),
      alpha: alpha * (0.4 + Math.random() * 0.5)
    };
  });

  return {
    x,
    y,
    color,
    r: radius,
    alpha,
    tailLen: fromClick ? 0 : 20 + Math.random() * 60,
    tailAngle: -Math.PI / 2 + (Math.random() - 0.5) * 1.2,
    tailW: radius * 0.55,
    sats
  };
}

function drawDrop(ctx: CanvasRenderingContext2D, drop: SplatterDrop): void {
  if (drop.tailLen > 0) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(
      drop.x + Math.cos(drop.tailAngle) * drop.tailLen,
      drop.y + Math.sin(drop.tailAngle) * drop.tailLen
    );
    ctx.strokeStyle = drop.color;
    ctx.lineWidth = drop.tailW;
    ctx.lineCap = "round";
    ctx.globalAlpha = drop.alpha * 0.55;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
  ctx.fillStyle = drop.color;
  ctx.globalAlpha = drop.alpha;
  ctx.fill();

  drop.sats.forEach((sat) => {
    ctx.beginPath();
    ctx.arc(sat.x, sat.y, sat.r, 0, Math.PI * 2);
    ctx.fillStyle = drop.color;
    ctx.globalAlpha = sat.alpha;
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

export function HeroPaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const colors = ["#E8524A", "#2962d4", "#f5c800", "#7c3aed", "#22c55e", "#ff7043", "#0ea5e9"];
    const staticDrops: SplatterDrop[] = [];
    const liveDrops: SplatterDrop[] = [];

    let mouseDown = false;
    let lastMouseX = -999;
    let lastMouseY = -999;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    };

    const drawAll = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      staticDrops.forEach((drop) => drawDrop(ctx, drop));
      liveDrops.forEach((drop) => drawDrop(ctx, drop));
    };

    const seedInitial = () => {
      staticDrops.length = 0;
      const width = canvas.width;
      const height = canvas.height;

      const zones = [
        { x: width * 0.5, y: height * 0.05, w: width * 0.5, h: height * 0.95, count: 35 },
        { x: width * 0.45, y: height * 0.1, w: width * 0.1, h: height * 0.8, count: 8 }
      ];

      zones.forEach((zone) => {
        for (let i = 0; i < zone.count; i += 1) {
          const x = zone.x + Math.random() * zone.w;
          const y = zone.y + Math.random() * zone.h;
          const color = colors[Math.floor(Math.random() * colors.length)] ?? colors[0];
          staticDrops.push(createDrop(x, y, color));
        }
      });
    };

    const addMouseDrop = (x: number, y: number, fromClick: boolean) => {
      const color = colors[Math.floor(Math.random() * colors.length)] ?? colors[0];
      const count = fromClick ? Math.floor(Math.random() * 5 + 3) : 1;

      for (let i = 0; i < count; i += 1) {
        const jitterX = x + (Math.random() - 0.5) * (fromClick ? 40 : 12);
        const jitterY = y + (Math.random() - 0.5) * (fromClick ? 40 : 12);
        liveDrops.push(createDrop(jitterX, jitterY, color, fromClick));
      }

      drawAll();
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return;
      }

      const dx = x - lastMouseX;
      const dy = y - lastMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 38 && mouseDown) {
        addMouseDrop(x, y, false);
      }

      lastMouseX = x;
      lastMouseY = y;
    };

    const onMouseDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return;
      }

      mouseDown = true;
      addMouseDrop(x, y, true);
    };

    const onMouseUp = () => {
      mouseDown = false;
    };

    const randomAmbientDrop = () => {
      const width = canvas.width;
      const height = canvas.height;
      const x = width * 0.48 + Math.random() * width * 0.52;
      const y = Math.random() * height;
      const color = colors[Math.floor(Math.random() * colors.length)] ?? colors[0];

      staticDrops.push(createDrop(x, y, color));
      if (staticDrops.length > 120) {
        staticDrops.shift();
      }

      drawAll();
    };

    resize();
    seedInitial();
    drawAll();

    const intervalId = window.setInterval(randomAmbientDrop, 600);

    const onResize = () => {
      resize();
      seedInitial();
      drawAll();
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-splatter-canvas" aria-hidden />;
}
