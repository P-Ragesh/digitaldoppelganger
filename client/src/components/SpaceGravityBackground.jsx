import React, { useEffect, useRef } from 'react';

export default function SpaceGravityBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Optimized star count for 60FPS high performance
    const STAR_COUNT = 60;
    const stars = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: Math.random() * 1.5 + 0.8,
        color: '#ffffff',
        alpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.01 + 0.005
      });
    }

    let centerAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const gravCenterX = mouse.active ? mouse.x : width / 2;
      const gravCenterY = mouse.active ? mouse.y : height / 2;

      centerAngle += 0.005;

      // Dark Space background
      ctx.fillStyle = '#05060a';
      ctx.fillRect(0, 0, width, height);

      // Render orbit ring lines
      ctx.save();
      ctx.translate(gravCenterX, gravCenterY);
      ctx.rotate(centerAngle);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let r = 120; r <= 320; r += 100) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Render stars fast without expensive shadowBlur
      stars.forEach((star) => {
        const dx = gravCenterX - star.x;
        const dy = gravCenterY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const gravityRadius = Math.max(width, height) * 0.5;
        if (dist < gravityRadius && dist > 30) {
          const force = (1 - dist / gravityRadius) * 0.12;
          const angle = Math.atan2(dy, dx);
          star.vx += Math.cos(angle) * force * 0.04;
          star.vy += Math.sin(angle) * force * 0.04;
        }

        star.vx *= 0.98;
        star.vy *= 0.98;

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        star.alpha += (Math.random() - 0.5) * star.twinkleSpeed;
        if (star.alpha < 0.2) star.alpha = 0.2;
        if (star.alpha > 0.8) star.alpha = 0.8;

        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.baseRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#05060a' }}
    />
  );
}
