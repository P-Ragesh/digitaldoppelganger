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

    // Track mouse for interactive gravitational pull
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

    // Stars & Particles Setup (Pure White Gravity Balls)
    const STAR_COUNT = 180;
    const stars = [];
    const colors = ['#ffffff', '#ffffff', '#ffffff', '#ffffff'];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: Math.random() * 1.8 + 0.6,
        radius: 0,
        color: '#ffffff',
        alpha: Math.random() * 0.75 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() * 0.002 + 0.0005) * (Math.random() < 0.5 ? 1 : -1)
      });
    }

    // Space Dust / Floating Particles (Soft White Ambient Glow)
    const DUST_COUNT = 35;
    const dust = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      dust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 20 + 10,
        color: '#ffffff',
        alpha: Math.random() * 0.04 + 0.01
      });
    }

    // Black Hole / Cosmic Center Gravity Core
    let centerAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const gravCenterX = mouse.active ? mouse.x : width / 2;
      const gravCenterY = mouse.active ? mouse.y : height / 2;

      centerAngle += 0.005;

      // Draw cosmic nebula background gradients
      const grad1 = ctx.createRadialGradient(
        gravCenterX,
        gravCenterY,
        10,
        gravCenterX,
        gravCenterY,
        Math.max(width, height) * 0.75
      );
      grad1.addColorStop(0, 'rgba(15, 10, 35, 0.95)');
      grad1.addColorStop(0.3, 'rgba(10, 8, 24, 0.98)');
      grad1.addColorStop(0.7, 'rgba(6, 6, 14, 0.99)');
      grad1.addColorStop(1, '#05060a');

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Render cosmic dust clouds
      dust.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        const dGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        dGrad.addColorStop(0, p.color);
        dGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = dGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render gravity field ring lines around cursor/center
      ctx.save();
      ctx.translate(gravCenterX, gravCenterY);
      ctx.rotate(centerAngle);
      for (let r = 100; r <= 350; r += 80) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.03 + (400 - r) / 4000})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 12]);
        ctx.stroke();
      }
      ctx.restore();

      // Render Stars with Gravitational Pull & Orbital Swirl
      stars.forEach((star) => {
        // Calculate distance to gravity center
        const dx = gravCenterX - star.x;
        const dy = gravCenterY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Gravitational force pull (inverse square with max cap)
        const gravityRadius = Math.max(width, height) * 0.6;
        if (dist < gravityRadius && dist > 20) {
          const force = (1 - dist / gravityRadius) * 0.18;
          // Tangential orbital spin force
          const angle = Math.atan2(dy, dx);
          star.vx += Math.cos(angle) * force * 0.05 + Math.sin(angle) * force * 0.08;
          star.vy += Math.sin(angle) * force * 0.05 - Math.cos(angle) * force * 0.08;
        }

        // Apply friction
        star.vx *= 0.985;
        star.vy *= 0.985;

        // Position update
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Twinkle effect
        star.alpha += (Math.random() - 0.5) * star.twinkleSpeed;
        if (star.alpha < 0.2) star.alpha = 0.2;
        if (star.alpha > 0.9) star.alpha = 0.9;

        // Glow near center
        const glowFactor = Math.max(0, 1 - dist / 300);
        const drawRadius = star.baseRadius + glowFactor * 1.5;

        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.shadowBlur = star.baseRadius * 6;
        ctx.shadowColor = star.color;

        ctx.beginPath();
        ctx.arc(star.x, star.y, drawRadius, 0, Math.PI * 2);
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
