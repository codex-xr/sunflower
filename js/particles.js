/**
 * Sunflower & Romantic Particles Engine
 * Handles falling petals, sparkling stardust, and celebration confetti bursts.
 */

class ParticleEngine {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isSparkling = true;
    this.resize();
    
    window.addEventListener('resize', () => this.resize());
    this.initBackgroundPetals();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initBackgroundPetals() {
    const count = window.innerWidth < 768 ? 16 : 28;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createPetal(true));
    }
  }

  createPetal(randomY = false) {
    const types = ['sunflower-petal', 'heart', 'sparkle'];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      type: type,
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: type === 'sunflower-petal' ? 12 + Math.random() * 14 : (type === 'heart' ? 10 + Math.random() * 10 : 3 + Math.random() * 4),
      speedY: 0.8 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      opacity: 0.5 + Math.random() * 0.4,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.02
    };
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.globalAlpha = p.opacity;

    if (p.type === 'sunflower-petal') {
      // Warm golden sunflower petal shape
      const grad = this.ctx.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, '#FFD54F');
      grad.addColorStop(0.7, '#FFA000');
      grad.addColorStop(1, '#FF8F00');
      this.ctx.fillStyle = grad;

      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.quadraticCurveTo(p.size * 0.55, 0, 0, p.size);
      this.ctx.quadraticCurveTo(-p.size * 0.55, 0, 0, -p.size);
      this.ctx.fill();
    } else if (p.type === 'heart') {
      // Soft rose heart
      this.ctx.fillStyle = '#FF7597';
      const s = p.size * 0.7;
      this.ctx.beginPath();
      this.ctx.moveTo(0, s * 0.3);
      this.ctx.bezierCurveTo(-s * 0.8, -s * 0.6, -s * 1.2, s * 0.5, 0, s * 1.2);
      this.ctx.bezierCurveTo(s * 1.2, s * 0.5, s * 0.8, -s * 0.6, 0, s * 0.3);
      this.ctx.fill();
    } else {
      // Golden glowing sparkle
      this.ctx.fillStyle = '#FFF8E1';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#FFD54F';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.swayOffset += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.swayOffset) * 0.6;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > this.height + 25 || p.x < -20 || p.x > this.width + 20) {
        this.particles[i] = this.createPetal(false);
      }

      this.drawPetal(p);
    }

    requestAnimationFrame(() => this.animate());
  }

  /**
   * Massive celebratory confetti burst with sunflowers, hearts, and gold streamers
   */
  celebrateBurst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 75) {
    const burstParticles = [];
    const colors = ['#FFC107', '#FF8F00', '#FF4081', '#FF6E40', '#FFE082', '#FFFFFF'];
    const emojis = ['🌻', '❤️', '✨', '🎉', '💖', '💛'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 4 + Math.random() * 12;
      const el = document.createElement('div');
      el.className = 'burst-particle';
      
      const isEmoji = Math.random() > 0.4;
      if (isEmoji) {
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.fontSize = `${16 + Math.random() * 20}px`;
      } else {
        el.style.width = `${8 + Math.random() * 10}px`;
        el.style.height = `${8 + Math.random() * 14}px`;
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
      }

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);

      const vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity - (4 + Math.random() * 4);
      let posX = x;
      let posY = y;
      let rot = Math.random() * 360;
      let rotSpeed = (Math.random() - 0.5) * 15;
      let opacity = 1;

      const anim = () => {
        vy += 0.35; // gravity
        posX += vx;
        posY += vy;
        rot += rotSpeed;
        opacity -= 0.012;

        el.style.transform = `translate3d(${posX - x}px, ${posY - y}px, 0) rotate(${rot}deg)`;
        el.style.opacity = Math.max(0, opacity);

        if (opacity > 0 && posY < window.innerHeight + 50) {
          requestAnimationFrame(anim);
        } else {
          el.remove();
        }
      };

      requestAnimationFrame(anim);
    }
  }
}

window.ParticleEngine = ParticleEngine;
