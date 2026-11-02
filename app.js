import React, { useState, useEffect, useRef, useMemo, Component } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

import {
  config,
  timelineEvents,
  secretLetters,
  quizQuestions,
  constellationStars,
  memoryBookPages,
  dreamTreeWishes,
  giftSurprises,
  galleryPhotos,
  premiumMemoryPhotos,
  gardenCompliments,
  reasonsMiuuIsAmazing
} from './data.js?v=2.5.1';

const galleryVersion = Date.now();

const MOON_GARDEN_POINTS = [
  // Digit "2" (10 points)
  { x: 25, y: 22 }, { x: 35, y: 18 }, { x: 45, y: 22 }, { x: 47, y: 32 },
  { x: 43, y: 44 }, { x: 35, y: 56 }, { x: 27, y: 68 }, { x: 23, y: 80 },
  { x: 35, y: 80 }, { x: 47, y: 80 },
  // Digit "0" (10 points)
  { x: 65, y: 18 }, { x: 55, y: 28 }, { x: 53, y: 45 }, { x: 55, y: 62 },
  { x: 59, y: 76 }, { x: 65, y: 80 }, { x: 71, y: 76 }, { x: 75, y: 62 },
  { x: 77, y: 45 }, { x: 75, y: 28 }
];
console.log("Moon Garden Loaded", MOON_GARDEN_POINTS);

const html = htm.bind(React.createElement);

// Setup global helpers from script tags
const gsap = window.gsap;
const confetti = window.confetti;

// Global Web Audio API Synthesizer Helper
const playAmbientSound = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (type === 'sparkle') {
      const now = ctx.currentTime;
      const notes = [880, 1046.5, 1174.66, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.04, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.25);
      });
    } else if (type === 'page_turn') {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.25);
      filter.Q.setValueAtTime(1.5, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.25);
    } else if (type === 'lantern') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'butterfly') {
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(90, now + i * 0.08);
        gain.gain.setValueAtTime(0.04, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.05);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.05);
      }
    }
  } catch(e) {
    console.log("AudioContext blocked/unsupported", e);
  }
};

const triggerConfetti = () => {
  if (window.confetti) {
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
};

const triggerFireworks = () => {
  if (!window.confetti) return;
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
};

// Error Boundary to prevent crashes in ending overlays
class EndingErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Ending component crashed:", error, errorInfo);
    if (this.props.onCrash) {
      this.props.onCrash();
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const EndingEmergencyFallback = ({ onReturn }) => {
  return html`
    <div className="butterfly-release-screen stage-quote" style=${{ background: 'radial-gradient(circle at center, #0f0724 0%, #030208 100%)', zIndex: 30000 }}>
      <div className="moonlight-rays-overlay"></div>
      <div className="release-quote-card">
        <h1 className="luxury-text-gradient" style=${{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>
          ✨ Happy 20th Birthday Miuu 🤍 ✨
        </h1>
        <button className="return-universe-btn" onClick=${onReturn}>
          Return To Miuu's Universe 🌙
        </button>
      </div>
    </div>
  `;
};

function WishConstellation({ playAmbientSound, audioRef, volume, setVolume }) {
  const canvasRef = useRef(null);
  const [connectedStars, setConnectedStars] = useState([]);
  const [phase, setPhase] = useState('connecting');
  const [floats, setFloats] = useState([]);
  const [showCrownText, setShowCrownText] = useState(false);
  const [showBdayText, setShowBdayText] = useState(false);
  const [showMoonText, setShowMoonText] = useState(false);
  const [showSecretCard, setShowSecretCard] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);

  const engineRef = useRef({
    stars: [],
    lines: [],
    ambientStars: [],
    sparkles: [],
    floatingParticles: [],
    shootingStars: [],
    petals: [],
    morphParticles: [],
    targets: [],
    pulse: { active: false, x: 0, y: 0, r: 0, maxR: 0, alpha: 0 },
    moon: { alpha: 0 },
    mouseX: 0,
    mouseY: 0,
    time: 0,
    morphStartTime: 0
  });

  useEffect(() => {
    engineRef.current.stars = constellationStars.map(s => ({
      id: s.id,
      x: s.x,
      y: s.y,
      wish: s.wish,
      glowPulse: 0
    }));

    engineRef.current.lines = [
      { p1: 1, p2: 2, progress: 0 },
      { p1: 2, p2: 10, progress: 0 },
      { p1: 10, p2: 3, progress: 0 },
      { p1: 3, p2: 4, progress: 0 },
      { p1: 1, p2: 5, progress: 0 },
      { p1: 5, p2: 6, progress: 0 },
      { p1: 2, p2: 6, progress: 0 },
      { p1: 6, p2: 7, progress: 0 },
      { p1: 7, p2: 8, progress: 0 },
      { p1: 8, p2: 3, progress: 0 },
      { p1: 8, p2: 9, progress: 0 },
      { p1: 9, p2: 4, progress: 0 }
    ];

    const ambient = [];
    for (let i = 0; i < 200; i++) {
      ambient.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 1.2,
        twinkleSpeed: 0.015 + Math.random() * 0.04,
        twinkleOffset: Math.random() * Math.PI * 2,
        alpha: Math.random()
      });
    }
    engineRef.current.ambientStars = ambient;

    const offscreen = document.createElement('canvas');
    offscreen.width = 400;
    offscreen.height = 120;
    const octx = offscreen.getContext('2d');
    if (octx) {
      octx.fillStyle = '#fff';
      octx.font = 'bold 64px serif';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText('MIUU', 200, 60);
      const imgData = octx.getImageData(0, 0, 400, 120);
      const sampled = [];
      for (let y = 0; y < 120; y += 3) {
        for (let x = 0; x < 400; x += 3) {
          const idx = (y * 400 + x) * 4;
          if (imgData.data[idx + 3] > 120) {
            sampled.push({
              x: (x - 200) / 200,
              y: (y - 60) / 60
            });
          }
        }
      }
      engineRef.current.targets = sampled;
    }
  }, []);

  const triggerCrownComplete = () => {
    setPhase('reveal');
    setShowCrownText(true);

    playAmbientSound('sparkle');
    setTimeout(() => playAmbientSound('lantern'), 150);
    setTimeout(() => playAmbientSound('butterfly'), 300);

    if (audioRef && audioRef.current) {
      const origVolume = audioRef.current.volume;
      let v = origVolume;
      const interval = setInterval(() => {
        v = Math.min(0.95, v + 0.05);
        audioRef.current.volume = v;
        setVolume(v);
        if (v >= 0.95) clearInterval(interval);
      }, 100);
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const engine = engineRef.current;
      engine.pulse.active = true;
      engine.pulse.x = canvas.width / 2;
      engine.pulse.y = canvas.height * 0.44;
      engine.pulse.r = 0;
      engine.pulse.maxR = Math.hypot(canvas.width, canvas.height);
      engine.pulse.alpha = 1;
    }

    setTimeout(() => {
      setShowBdayText(true);
    }, 1500);

    setTimeout(() => {
      setPhase('star_shower');
      setShowMoonText(true);
    }, 3500);

    setTimeout(() => {
      setPhase('secret_wish');
      setShowSecretCard(true);
    }, 7500);

    setTimeout(() => {
      setPhase('morph_miuu');
      engineRef.current.morphStartTime = performance.now();
      setShowFinalText(true);
    }, 11500);
  };

  const spawnSparkles = (pctX, pctY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sx = pctX * canvas.width / 100;
    const sy = pctY * canvas.height / 100;
    const colors = ['#d4af37', '#e0a996', '#fff', '#f3e5ab'];
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      engineRef.current.sparkles.push({
        x: sx,
        y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.5,
        opacity: 1.0,
        decay: 0.015 + Math.random() * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  };

  const handleCanvasClick = (e) => {
    if (phase !== 'connecting') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clickedStar = null;
    engineRef.current.stars.forEach(star => {
      const sx = star.x * canvas.width / 100;
      const sy = star.y * canvas.height / 100;
      const dist = Math.hypot(x - sx, y - sy);
      if (dist < 22) {
        clickedStar = star;
      }
    });

    if (clickedStar) {
      if (!connectedStars.includes(clickedStar.id)) {
        playAmbientSound('sparkle');
        const nextConnected = [...connectedStars, clickedStar.id];
        setConnectedStars(nextConnected);
        spawnSparkles(clickedStar.x, clickedStar.y);

        const floatId = Date.now();
        setFloats(prev => [...prev, { id: floatId, x: clickedStar.x, y: clickedStar.y, text: clickedStar.wish }]);
        setTimeout(() => {
          setFloats(prev => prev.filter(f => f.id !== floatId));
        }, 3000);

        if (nextConnected.length === 10) {
          triggerCrownComplete();
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (phase !== 'connecting') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    engineRef.current.mouseX = e.clientX - rect.left;
    engineRef.current.mouseY = e.clientY - rect.top;
  };

  useEffect(() => {
    if (phase === 'star_shower') {
      let count = 0;
      const interval = setInterval(() => {
        if (count >= 20) {
          clearInterval(interval);
          return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
          engineRef.current.shootingStars.push({
            x: Math.random() * canvas.width * 0.6 - 50,
            y: -10,
            vx: 6 + Math.random() * 4,
            vy: 3 + Math.random() * 2,
            history: []
          });
        }
        count++;
      }, 200);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const loop = (timestamp) => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const engine = engineRef.current;
      engine.time += 0.016;

      engine.ambientStars.forEach(s => {
        const sx = s.x * width / 100;
        const sy = s.y * height / 100;
        const alpha = Math.max(0.1, Math.min(1, Math.sin(engine.time * s.twinkleSpeed * 50 + s.twinkleOffset) * 0.5 + 0.5));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (phase === 'star_shower' || phase === 'secret_wish' || phase === 'morph_miuu') {
        if (phase !== 'morph_miuu') {
          engine.moon.alpha = Math.min(1, engine.moon.alpha + 0.01);
        } else {
          engine.moon.alpha = Math.max(0, engine.moon.alpha - 0.01);
        }
        if (engine.moon.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = engine.moon.alpha;
          const mx = width * 0.5;
          const my = height * 0.28;
          const r = 55;

          ctx.shadowBlur = 40;
          ctx.shadowColor = 'rgba(243, 229, 171, 0.5)';
          ctx.fillStyle = '#f3e5ab';
          ctx.beginPath();
          ctx.arc(mx, my, r, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#0a0514';
          ctx.beginPath();
          ctx.arc(mx - 15, my - 5, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (phase !== 'morph_miuu') {
        engine.lines.forEach(line => {
          const star1 = engine.stars.find(s => s.id === line.p1);
          const star2 = engine.stars.find(s => s.id === line.p2);
          if (!star1 || !star2) return;

          const active = connectedStars.includes(line.p1) && connectedStars.includes(line.p2);
          if (active) {
            line.progress = Math.min(1, line.progress + 0.04);
          } else {
            line.progress = 0;
          }

          if (line.progress > 0) {
            const x1 = star1.x * width / 100;
            const y1 = star1.y * height / 100;
            const x2 = star2.x * width / 100;
            const y2 = star2.y * height / 100;
            const lx = x1 + (x2 - x1) * line.progress;
            const ly = y1 + (y2 - y1) * line.progress;

            ctx.save();
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = phase === 'connecting' ? 1.5 : 2.5;
            ctx.shadowBlur = phase === 'connecting' ? 5 : 15;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
            ctx.globalAlpha = phase === 'connecting' ? 0.6 : 0.9;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(lx, ly);
            ctx.stroke();
            ctx.restore();
          }
        });
      }

      if (phase !== 'morph_miuu') {
        engine.stars.forEach(star => {
          const sx = star.x * width / 100;
          const sy = star.y * height / 100;
          const isConnected = connectedStars.includes(star.id);

          star.glowPulse = Math.sin(engine.time * 3 + star.id) * 0.15 + 0.85;

          ctx.save();
          let cursorHover = false;
          if (phase === 'connecting') {
            const dist = Math.hypot(engine.mouseX - sx, engine.mouseY - sy);
            if (dist < 22) cursorHover = true;
          }

          if (isConnected) {
            ctx.shadowBlur = phase === 'connecting' ? 12 * star.glowPulse : 25 * star.glowPulse;
            ctx.shadowColor = '#d4af37';
            ctx.fillStyle = '#fff';
          } else if (cursorHover) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#d4af37';
            ctx.fillStyle = '#fff';
          } else {
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          }

          const r = isConnected ? (phase === 'connecting' ? 6 : 8) : (cursorHover ? 7 : 5);
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();

          if (isConnected) {
            ctx.strokeStyle = 'rgba(224, 169, 150, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(sx, sy, r + 4 * star.glowPulse, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      if (engine.pulse.active) {
        engine.pulse.r += 12;
        engine.pulse.alpha -= 0.015;
        if (engine.pulse.alpha <= 0) {
          engine.pulse.active = false;
        } else {
          ctx.save();
          ctx.globalAlpha = engine.pulse.alpha;
          const gradient = ctx.createRadialGradient(
            engine.pulse.x, engine.pulse.y, engine.pulse.r * 0.1,
            engine.pulse.x, engine.pulse.y, engine.pulse.r
          );
          gradient.addColorStop(0, 'rgba(243, 229, 171, 0)');
          gradient.addColorStop(0.5, 'rgba(243, 229, 171, 0.35)');
          gradient.addColorStop(0.8, 'rgba(224, 169, 150, 0.15)');
          gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(engine.pulse.x, engine.pulse.y, engine.pulse.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      engine.sparkles.forEach((s, idx) => {
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= s.decay;
        s.size *= 0.96;
        if (s.opacity <= 0 || s.size <= 0.1) {
          engine.sparkles.splice(idx, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = s.opacity;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (phase !== 'connecting' && phase !== 'morph_miuu') {
        if (engine.floatingParticles.length < 60 && Math.random() < 0.1) {
          engine.floatingParticles.push({
            x: (0.1 + Math.random() * 0.8) * width,
            y: (0.5 + Math.random() * 0.4) * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.2 - Math.random() * 0.4,
            size: 1 + Math.random() * 2,
            opacity: 0,
            maxOpacity: 0.3 + Math.random() * 0.5,
            fadeSpeed: 0.01 + Math.random() * 0.02
          });
        }

        engine.floatingParticles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.opacity < p.maxOpacity) {
            p.opacity = Math.min(p.maxOpacity, p.opacity + p.fadeSpeed);
          }
          p.vx += Math.sin(engine.time + idx) * 0.01;

          if (p.y < -10 || p.x < -10 || p.x > width + 10) {
            engine.floatingParticles.splice(idx, 1);
          } else {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = '#d4af37';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      }

      if (phase === 'star_shower' || phase === 'secret_wish') {
        engine.shootingStars.forEach((s, idx) => {
          s.x += s.vx;
          s.y += s.vy;
          s.history.push({ x: s.x, y: s.y });
          if (s.history.length > 8) {
            s.history.shift();
          }

          if (s.x > width + 100 || s.y > height + 100) {
            engine.shootingStars.splice(idx, 1);
          } else {
            ctx.save();
            ctx.beginPath();
            for (let i = 0; i < s.history.length; i++) {
              const pt = s.history[i];
              const alpha = (i / s.history.length) * 0.4;
              ctx.strokeStyle = `rgba(243, 229, 171, ${alpha})`;
              ctx.lineWidth = (i / s.history.length) * 2;
              if (i === 0) {
                ctx.moveTo(pt.x, pt.y);
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            }
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#d4af37';
            ctx.beginPath();
            ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      }

      if (phase === 'star_shower' || phase === 'secret_wish' || phase === 'morph_miuu') {
        if (engine.petals.length < 35) {
          engine.petals.push({
            x: Math.random() * width,
            y: -20,
            z: 0.5 + Math.random() * 1.0,
            size: 4 + Math.random() * 4,
            angle: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.03,
            color: Math.random() > 0.4 ? '#e0a996' : '#d4af37',
            speedY: 0.6 + Math.random() * 0.8,
            speedX: -0.2 + Math.random() * 0.4
          });
        }

        engine.petals.forEach((p, idx) => {
          p.y += p.speedY * p.z;
          p.x += (p.speedX + Math.sin(p.y * 0.01 + p.z) * 0.2) * p.z;
          p.angle += p.rotSpeed;

          if (p.y > height + 20 || p.x < -20 || p.x > width + 20) {
            engine.petals.splice(idx, 1);
          } else {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * p.z, p.size * 0.6 * p.z, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      }

      if (phase === 'morph_miuu') {
        const morphTime = (timestamp - engine.morphStartTime) / 1000;

        if (engine.morphParticles.length === 0) {
          const numParticles = 1000;
          for (let i = 0; i < numParticles; i++) {
            const originStar = engine.stars[i % engine.stars.length];
            engine.morphParticles.push({
              x: (originStar.x * width / 100) + (Math.random() - 0.5) * 15,
              y: (originStar.y * height / 100) + (Math.random() - 0.5) * 15,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: 0.8 + Math.random() * 1.5,
              color: Math.random() > 0.35 ? '#d4af37' : '#fff',
              alpha: 0.5 + Math.random() * 0.5,
              offset: Math.random() * Math.PI * 2
            });
          }
        }

        let steerForce = 0;
        if (morphTime > 1.5) {
          steerForce = Math.min(1, (morphTime - 1.5) / 2.0);
        }

        engine.morphParticles.forEach((p, idx) => {
          let tx = width / 2;
          let ty = height / 2;

          if (engine.targets.length > 0) {
            const target = engine.targets[idx % engine.targets.length];
            tx = width / 2 + target.x * (width * 0.28);
            ty = height * 0.44 + target.y * (height * 0.16);
          }

          const cx = width / 2;
          const cy = height * 0.44;
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const angle = Math.atan2(dy, dx);

          const swirlAngle = angle + 0.05;
          const sx = cx + Math.cos(swirlAngle) * dist;
          const sy = cy + Math.sin(swirlAngle) * dist;

          if (steerForce < 1.0) {
            p.vx = p.vx * 0.94 + (sx - p.x) * 0.02;
            p.vy = p.vy * 0.94 + (sy - p.y) * 0.02;
          }

          if (steerForce > 0) {
            const tdx = tx - p.x;
            const tdy = ty - p.y;
            p.vx = p.vx * (1 - steerForce * 0.08) + tdx * 0.035 * steerForce;
            p.vy = p.vy * (1 - steerForce * 0.08) + tdy * 0.035 * steerForce;
          }

          p.alpha = Math.max(0.3, Math.sin(engine.time * 5 + idx) * 0.35 + 0.65);
          p.x += p.vx;
          p.y += p.vy;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          if (steerForce > 0.8) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#d4af37';
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [connectedStars, phase]);

  return html`
    <div style=${{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref=${canvasRef}
        className="constellation-canvas"
        style=${{ cursor: phase === 'connecting' ? 'pointer' : 'default' }}
        onClick=${handleCanvasClick}
        onMouseMove=${handleMouseMove}
      ></canvas>

      ${floats.map(f => html`
        <div
          key=${f.id}
          className="blessing-float"
          style=${{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          ${f.text}
        </div>
      `)}

      <div className="constellation-ui">
        ${showCrownText && phase !== 'morph_miuu' && html`
          <h3 className="crown-title ui-fade-in">👑 A Queen Deserves A Sky Full Of Stars 👑</h3>
        `}

        ${showBdayText && phase !== 'morph_miuu' && html`
          <div className="ui-fade-in" style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 className="crown-subtitle">✨ Happy 20th Birthday Miuu ✨</h4>
            <p className="crown-desc">
              May your future be filled with happiness,<br/>
              success, peace, beautiful memories,<br/>
              good health and countless reasons to smile.
            </p>
          </div>
        `}

        ${showMoonText && phase !== 'morph_miuu' && html`
          <p className="moon-blessing-text ui-fade-in">
            🌙 Every wish written in the stars<br/>
            finds its way to you. 🌙
          </p>
        `}

        ${showSecretCard && phase !== 'morph_miuu' && html`
          <div className="secret-wish-card">
            <h4 className="secret-card-title">✨ A Secret Wish For Miuu ✨</h4>
            <p className="secret-card-text">
              "May every year make you happier,<br/>
              every dream come closer,<br/>
              and every memory become more beautiful<br/>
              than the last."
            </p>
            <span className="secret-card-heart">🤍</span>
          </div>
        `}

        ${showFinalText && phase === 'morph_miuu' && html`
          <div className="ui-fade-in" style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="final-brightest-star">⭐ Forever The Brightest Star ⭐</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// MAIN COMPONENT
function App() {
  // Screen States
  // Screen States
  const urlParams = new URLSearchParams(window.location.search);
  const isDev = urlParams.has('dev');
  const [unlocked, setUnlocked] = useState(isDev); // Always start locked on load
  const [showIntro, setShowIntro] = useState(!isDev);   // Always show intro storybook on load
  const [showReveal, setShowReveal] = useState(false);
  const [welcomeTransition, setWelcomeTransition] = useState(false);

  // Easter Egg State
  const [moonClicks, setMoonClicks] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);

  // Game/Interaction States
  const [gardenBlooms, setGardenBlooms] = useState({});
  const [gardenComplete, setGardenComplete] = useState(false);
  const [treasureClue, setTreasureClue] = useState(0);
  const [safeUnlocked, setSafeUnlocked] = useState(false);

  // Music States
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [songProgress, setSongProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  // Active Modals / Interactive values
  const [modalText, setModalText] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [complimentMachineWord, setComplimentMachineWord] = useState("Click to Spin! ✨");
  const [giftIndex, setGiftIndex] = useState(null);
  const [bookPage, setBookPage] = useState(parseInt(urlParams.get('page') || '0', 10));
  const [connectedStars, setConnectedStars] = useState([]);
  const [openedLetter, setOpenedLetter] = useState(null);
  const [localOpen, setLocalOpen] = useState({});
  const [readLetters, setReadLetters] = useState({});
  const [showButterflyRelease, setShowButterflyRelease] = useState(false);
  const [showFinalQuote, setShowFinalQuote] = useState(false);
  const [showThankYouScreen, setShowThankYouScreen] = useState(false);
  const [showExtraEnding, setShowExtraEnding] = useState(false);

  // Journey tracker states
  const [clickedLanterns, setClickedLanterns] = useState({});
  const [visitedGallery, setVisitedGallery] = useState(false);
  const [reachedEndReasons, setReachedEndReasons] = useState(false);
  const [showReturnBtn, setShowReturnBtn] = useState(false);
  const [endingUnlocked, setEndingUnlocked] = useState(false);
  const [endingCompleted, setEndingCompleted] = useState(false);
  const [endingCrash, setEndingCrash] = useState(false);

  // Memoized check for all journey tasks completion
  const allRequirementsMet = useMemo(() => {
    const moonGardenDone = Object.values(gardenBlooms).filter(Boolean).length === 20;
    const memoryLakeDone = Object.keys(clickedLanterns).length === 7;
    const galleryVisited = visitedGallery;
    const reasonsDone = reachedEndReasons;
    const lettersRead = Object.keys(readLetters).length === 3;

    return moonGardenDone && memoryLakeDone && galleryVisited && reasonsDone && lettersRead;
  }, [gardenBlooms, clickedLanterns, visitedGallery, reachedEndReasons, readLetters]);

  // Set endingUnlocked when requirements are met
  useEffect(() => {
    if (allRequirementsMet && !endingUnlocked) {
      setEndingUnlocked(true);
    }
  }, [allRequirementsMet, endingUnlocked]);

  // For automated testing and verification of milestones and sequence flow
  useEffect(() => {
    window.__simulateMilestones = () => {
      // 1. Moon Garden (20 flowers)
      const blooms = {};
      for (let i = 0; i < 20; i++) blooms[i] = true;
      setGardenBlooms(blooms);
      setGardenComplete(true);

      // 2. Memory Lake (7 lanterns)
      const lanterns = {};
      for (let i = 1; i <= 7; i++) lanterns[i] = true;
      setClickedLanterns(lanterns);

      // 3. Gallery (visited)
      setVisitedGallery(true);

      // 4. 100 Reasons (scrolled)
      setReachedEndReasons(true);

      // 5. Secret Letters (3 letters)
      const letters = {};
      for (let i = 1; i <= 3; i++) letters[i] = true;
      setReadLetters(letters);

      console.log("TEST HOOK: All milestones simulated!");
    };
  }, []);

  // Single-fire transition console log observers
  useEffect(() => {
    if (showButterflyRelease) {
      console.log("Butterfly Release Started");
    }
  }, [showButterflyRelease]);

  useEffect(() => {
    if (showFinalQuote) {
      console.log("Quote Started");
    }
  }, [showFinalQuote]);

  useEffect(() => {
    if (showThankYouScreen) {
      console.log("Thank You Screen Started");
    }
  }, [showThankYouScreen]);

  useEffect(() => {
    if (showThankYouScreen) {
      const t1 = setTimeout(() => {
        setShowExtraEnding(true);
      }, 3500);
      const t2 = setTimeout(() => {
        setShowExtraEnding(false);
        setShowReturnBtn(true);
      }, 6500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setShowReturnBtn(false);
    }
  }, [showThankYouScreen]);

  // Elements references for animations
  const passwordScreenRef = useRef(null);
  const introScreenRef = useRef(null);
  const revealScreenRef = useRef(null);
  const worldRef = useRef(null);

  // Intersection Observer to track Gallery of Smiles visits
  useEffect(() => {
    if (visitedGallery || !unlocked || showIntro || showReveal) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisitedGallery(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    const element = document.getElementById('gallery');
    if (element) {
      observer.observe(element);
    }
    return () => observer.disconnect();
  }, [visitedGallery, unlocked, showIntro, showReveal]);



  // Audio Playback Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
      setSongProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };
    const onLoadedMetadata = () => {
      setAudioDuration(audio.duration);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  // Update volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Autoplay music once unlocked
  useEffect(() => {
    if (unlocked && audioRef.current && !isPlaying) {
      audioRef.current.play().catch(err => {
        console.log("Autoplay blocked by browser. Awaiting user interaction.", err);
      });
    }
  }, [unlocked]);



  const triggerGardenCompleteSurprise = () => {
    const end = Date.now() + 4 * 1000;
    const colors = ['#e0a996', '#ffb7b2', '#ff8b94', '#d4af37', '#f3e5ab'];
    (function frame() {
      // Sparkle side bursts
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        shapes: ['star']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        shapes: ['star']
      });
      // Falling rose petals from top
      confetti({
        particleCount: 2,
        angle: 90,
        spread: 120,
        origin: { x: Math.random(), y: -0.1 },
        colors: ['#e0a996', '#ffb7b2', '#ff8b94'],
        gravity: 0.5,
        scalar: 1.1
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Music volume fading utility
  const fadeVolume = (target, durationMs) => {
    const startVol = volume;
    const diff = target - startVol;
    const steps = 30;
    const stepTime = durationMs / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newVol = startVol + (diff * (currentStep / steps));
      setVolume(Math.max(0, Math.min(1, newVol)));
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  };

  // Action helpers
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.log(err));
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newPercent = parseFloat(e.target.value);
    const newTime = (newPercent / 100) * audio.duration;
    audio.currentTime = newTime;
    setSongProgress(newPercent);
  };

  const closeSecretLetter = () => {
    setOpenedLetter(null);
  };

  return html`
    <div>
      
      <${CustomCursor} unlocked=${unlocked} />

      
      <${StarrySky} />

      
      <audio ref=${audioRef} src=${config.musicSrc} loop preloaded="auto"></audio>

      
      <div className=${`welcome-transition-screen ${welcomeTransition ? 'active' : ''}`}>
        <div className="gate-aurora"></div>
        <div className="welcome-text">Welcome Home, Miuu 🌙</div>
      </div>

      
      ${!unlocked && html`
        <${PasswordGate}
          onSuccess=${() => {
            setWelcomeTransition(true);
            setTimeout(() => {
              setWelcomeTransition(false);
              setUnlocked(true);
              triggerConfetti();
            }, 3500);
          }}
          moonClicks=${moonClicks}
          setMoonClicks=${setMoonClicks}
          onEasterEggUnlock=${() => {
            setEasterEggActive(true);
          }}
        />
      `}

      
      ${unlocked && showIntro && html`
        <${StorybookIntro}
          onComplete=${() => {
            setShowIntro(false);
            setShowReveal(true);
            triggerFireworks();
          }}
        />
      `}

      
      ${unlocked && !showIntro && showReveal && html`
        <${GrandReveal}
          onClose=${() => {
            setShowReveal(false);
          }}
        />
      `}

      
      ${unlocked && !showIntro && !showReveal && html`
        <div className=${`main-world active ${isDev ? 'dev-mode' : ''}`} ref=${worldRef}>
          
          
          <${FloatingPlayer}
            isPlaying=${isPlaying}
            songProgress=${songProgress}
            volume=${volume}
            title=${config.musicTitle}
            artist=${config.musicArtist}
            onPlayPause=${handlePlayPause}
            onVolumeChange=${handleVolumeChange}
            onProgressChange=${handleProgressChange}
            audioDuration=${audioDuration}
            audioCurrentTime=${audioCurrentTime}
          />

          
          <section className="world-section glass-panel" style=${{ margin: '30px 20px', border: '1px solid var(--glass-border)' }}>
            <h2 className="section-title luxury-text-gradient">THE BIRTHDAY COUNTDOWN</h2>
            <p className="section-subtitle">Ticking closer to the magical day</p>
            <${CountdownTimer} targetDate=${config.targetDate} onComplete=${() => {}} />
          </section>

          
          <${HeartOfUniverse} />

          
          <section id="moon-garden" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE MOON GARDEN</h2>
            <p className="section-subtitle">Click the glowing buds to watch them bloom with love</p>
            <div className="garden-container-20">
              ${MOON_GARDEN_POINTS.map((pt, idx) => {
                const isBloomed = !!gardenBlooms[idx];
                const flowerEmoji = ['🌹', '🪷', '🌸'][idx % 3];
                return html`
                  <div
                    key=${idx}
                    className="flower-slot"
                    style=${{
                      position: 'absolute',
                      left: `${pt.x}%`,
                      top: `${pt.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div
                      className=${`flower-bud ${isBloomed ? 'bloomed' : ''}`}
                      onClick=${() => {
                        let nextBlooms = { ...gardenBlooms };
                        if (!isBloomed) {
                          nextBlooms[idx] = true;
                          setGardenBlooms(nextBlooms);
                          playAmbientSound('sparkle');
                        }
                        
                        // Set modal title and clean compliment text
                        const emojis = ['🌙', '✨', '🌸', '💫', '🌷', '🌙', '⭐', '📚', '🎂', '✨', '🌷', '⭐', '💫', '🌙', '🌟', '⭐', '🎯', '🏆', '🌹', '🌙✨'];
                        setModalTitle(`Year ${idx + 1} ${emojis[idx] || '✨'}`);
                        const comp = gardenCompliments[idx] || "";
                        const cleanComp = comp.replace(/^✨ Flower \d+ Bloom:\s*/, "");
                        setModalText(cleanComp);

                        // Check if all 20 are bloomed
                        const bloomedCount = Object.values(nextBlooms).filter(Boolean).length;
                        if (bloomedCount === 20 && !gardenComplete) {
                          setGardenComplete(true);
                          triggerFireworks();
                          triggerGardenCompleteSurprise();
                        }
                      }}
                    >
                      ${isBloomed ? flowerEmoji : '🌱'}
                    </div>
                  </div>
                `;
              })}
            </div>

            ${gardenComplete && html`
              <div className="garden-completion-card">
                <h3 className="completion-title">🌙 20 Beautiful Years of Miuu 🌙</h3>
                <h4 className="completion-middle-title" style=${{ color: 'var(--rose-gold)', fontSize: '1.4rem', margin: '12px 0', fontFamily: 'var(--font-serif)' }}>
                  Happy 20th Birthday Miuu 🤍
                </h4>
                <p className="completion-subtitle">
                  May your future be filled with happiness, success, peace, good health, beautiful memories, and countless reasons to smile.
                </p>
              </div>
            `}
          </section>

          
          <section id="memory-lake" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE MEMORY LAKE</h2>
            <p className="section-subtitle">Stir the waters and pull floating lanterns to reveal memories</p>
            <${MemoryLake}
              onLanternClick=${(id, title, memory) => {
                setModalTitle(title);
                setModalText(memory);
                setClickedLanterns(prev => ({ ...prev, [id]: true }));
              }}
            />
          </section>

          
          <section id="letters" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE SECRET LETTER ROOM</h2>
            <p className="section-subtitle">Open custom vintage letters addressed to you</p>
            <div className="letter-room-container">
              ${secretLetters.map(letter => {
                const isFlapOpen = !!localOpen[letter.id];
                const isThisLetterOpened = openedLetter && openedLetter.id === letter.id;
                const previewText = letter.content.length > 90 ? letter.content.slice(0, 90) + "..." : letter.content;
                return html`
                  <div key=${letter.id} className=${`secret-letter-column ${isThisLetterOpened ? 'opened' : ''}`}>
                    <div
                      className="envelope-wrapper"
                      onClick=${() => {
                        if (isFlapOpen) return;
                        setLocalOpen(prev => ({ ...prev, [letter.id]: true }));
                        playAmbientSound('page_turn');
                        setTimeout(() => {
                          setOpenedLetter(letter);
                          setReadLetters(prev => ({ ...prev, [letter.id]: true }));
                          setLocalOpen(prev => ({ ...prev, [letter.id]: false }));
                        }, 750);
                      }}
                    >
                      <div className=${`envelope ${isFlapOpen ? 'flap-open' : ''}`}>
                        <div className="envelope-flap"></div>
                        <div className="envelope-content-preview">
                          <h4>${letter.title}</h4>
                          <small style=${{ color: '#8c765c' }}>${letter.date}</small>
                          <p className="preview-text">${previewText}</p>
                        </div>
                      </div>
                    </div>

                    <div className=${`secret-letter-room-modal-wrapper ${isThisLetterOpened ? 'active' : ''}`}>
                      <div className="secret-letter-connector">
                        <i className="fas fa-chevron-down"></i>
                      </div>
                      <div className="secret-letter-modal-sheet" onClick=${(e) => e.stopPropagation()}>
                        <div className="letter-paper-content">
                          <h3 style=${{ fontFamily: 'var(--font-serif)', color: '#6a4a35', marginBottom: '10px', fontSize: '2rem', textAlign: 'center' }}>
                            ${letter.title}
                          </h3>
                          <div style=${{ textAlign: 'center', color: '#8c765c', marginBottom: '20px', fontStyle: 'italic' }}>
                            ${letter.date}
                          </div>
                          <p style=${{ fontSize: '1.25rem', fontFamily: 'var(--font-cursive)', lineHeight: '1.6', color: '#3b2f1f', whiteSpace: 'pre-line' }}>
                            ${letter.content}
                          </p>
                        </div>
                        <button className="letter-close-btn" style=${{ marginTop: '20px' }} onClick=${closeSecretLetter}>Close Letter 🤍</button>
                      </div>
                    </div>
                  </div>
                `;
              })}
            </div>

            ${endingUnlocked && html`
              <div style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
                ${!endingCompleted ? html`
                  <button
                    className="ending-trigger-btn"
                    onClick=${() => {
                      setShowButterflyRelease(true);
                    }}
                  >
                    ✨ One Last Gift For Miuu ✨
                  </button>
                ` : html`
                  <div className="ending-completed-text">✨ Ending Completed 🤍</div>
                  <button
                    className="ending-trigger-btn"
                    style=${{ marginTop: '10px' }}
                    onClick=${() => {
                      setShowButterflyRelease(true);
                    }}
                  >
                    🔁 Watch Ending Again
                  </button>
                `}
              </div>
            `}
          </section>

          
          <section id="gallery" className="world-section">
            <h2 className="section-title luxury-text-gradient">GALLERY OF SMILES</h2>
            <p className="section-subtitle">Moments frozen in time</p>

            
            <${CinematicGallery} />

            <div className="premium-memories-board">
              <div className="memories-row row-1">
                ${premiumMemoryPhotos.slice(0, 3).map((photo, idx) => {
                  const rotations = [-3, 4, -1];
                  const rot = rotations[idx % rotations.length];
                  return html`
                    <div
                      key=${photo.url}
                      className="polaroid-card premium-memory-card"
                      style=${{ '--rot': `${rot}deg`, '--delay': `${idx * 0.2}s` }}
                    >
                      <div className="polaroid-img-wrapper">
                        <img
                          src=${`${photo.url}?v=${galleryVersion}`}
                          alt=${photo.caption}
                          className="premium-memory-img"
                        />
                      </div>
                      <div className="polaroid-caption">${photo.caption}</div>
                    </div>
                  `;
                })}
              </div>
              <div className="memories-row row-2">
                ${premiumMemoryPhotos.slice(3, 5).map((photo, idx) => {
                  const rotations = [3, -4];
                  const rot = rotations[idx % rotations.length];
                  return html`
                    <div
                      key=${photo.url}
                      className="polaroid-card premium-memory-card"
                      style=${{ '--rot': `${rot}deg`, '--delay': `${(idx + 3) * 0.2}s` }}
                    >
                      <div className="polaroid-img-wrapper">
                        <img
                          src=${`${photo.url}?v=${galleryVersion}`}
                          alt=${photo.caption}
                          className="premium-memory-img"
                        />
                      </div>
                      <div className="polaroid-caption">${photo.caption}</div>
                    </div>
                  `;
                })}
              </div>
            </div>

            <div className="standalone-polaroid-container">
              <div
                className="polaroid-card standalone-card"
                style=${{ '--rot': '3deg' }}
                onClick=${() => {
                  setModalTitle("❤️ Click me, Miuu ❤️");
                  setModalText("Among the millions of memories we share, my absolute favorite ones are those where you were laughing with total freedom. Never lose that bright glow. You are precious.");
                }}
              >
                <div className="polaroid-img-wrapper" style=${{ background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style=${{ fontSize: '3rem' }}>❤️</span>
                </div>
                <div className="polaroid-caption" style=${{ color: 'var(--rose-gold)' }}>Click me, Miuu!</div>
              </div>
            </div>
          </section>

          
          <section id="reasons" className="world-section">
            <h2 className="section-title luxury-text-gradient">100 REASONS WHY YOU ARE AMAZING</h2>
            <p className="section-subtitle">Swipe left or right to read them all</p>
            <div
              className="reasons-container"
              onScroll=${(e) => {
                const target = e.target;
                if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 150) {
                  setReachedEndReasons(true);
                }
              }}
            >
              ${reasonsMiuuIsAmazing.map((reason, idx) => html`
                <div key=${idx} className="reason-card glass-panel">
                  <i className="fas fa-heart"></i>
                  <p style=${{ fontSize: '1.05rem', lineHeight: '1.6' }}>${reason}</p>
                </div>
              `)}
            </div>
          </section>

          
          <section id="wishes" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE WISH CONSTELLATION</h2>
            <p className="section-subtitle">Click the glowing stars to connect them and uncover blessings</p>
            <div className="constellation-wrapper">
              <${WishConstellation} playAmbientSound=${playAmbientSound} audioRef=${audioRef} volume=${volume} setVolume=${setVolume} />
            </div>
          </section>

          
          <section id="memory-book" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE MEMORY BOOK</h2>
            <p className="section-subtitle">Turn the pages to flip through our cozy milestones</p>
            <div className="memory-book-container">
              <div className="book-shelf">
                 ${(() => {
                  const ratios = {
                    './1.jpeg': '1045 / 1920',
                    './2.jpeg': '1060 / 1408',
                    './41.jpeg': '745 / 1280',
                    './42.jpeg': '1600 / 1002'
                  };
                  const currentRatio = ratios[memoryBookPages[bookPage].image] || '1';
                  console.error("[DEBUG MEMORY BOOK] Render page index:", bookPage, "Title:", memoryBookPages[bookPage].title);
                  const isAlwaysForever = bookPage === 3;
                  if (isAlwaysForever) {
                    return html`
                      <div className="hero-scrapbook-page">
                        <div className="hero-moonlight-glow"></div>
                        <div className="hero-particles">
                          <div className="hero-particle hp1"></div>
                          <div className="hero-particle hp2"></div>
                          <div className="hero-particle hp3"></div>
                          <div className="hero-particle hp4"></div>
                          <div className="hero-particle hp5"></div>
                          <div className="hero-particle hp6"></div>
                        </div>
                        
                        <div className="hero-photo-wrapper">
                          <img
                            src=${memoryBookPages[bookPage].image}
                            className="premium-magazine-photo"
                            alt="Always & Forever Photo"
                          />
                        </div>
                        
                        <h3 className="hero-book-title">
                          ${memoryBookPages[bookPage].title}
                        </h3>
                        
                        <p className="hero-book-text">
                          ${memoryBookPages[bookPage].content}
                        </p>
                        
                        <div className="hero-book-nav">
                          <button
                            className="control-btn"
                            disabled=${bookPage === 0}
                            onClick=${() => {
                              playAmbientSound('page_turn');
                              setBookPage(prev => Math.max(0, prev - 1));
                            }}
                          >
                            <i className="fas fa-chevron-left"></i> Prev
                          </button>
                          <button
                            className="control-btn"
                            disabled=${bookPage === memoryBookPages.length - 1}
                            onClick=${() => {
                              playAmbientSound('page_turn');
                              setBookPage(prev => Math.min(memoryBookPages.length - 1, prev + 1));
                            }}
                          >
                            Next <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                    `;
                  }

                  return html`
                    <div className="book-half left-half">
                      <div className="book-content" style=${{ margin: 'auto 0', display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <h3 style=${{ fontFamily: 'var(--font-serif)', color: 'var(--light-gold)', marginBottom: '15px' }}>
                          ${memoryBookPages[bookPage].title}
                        </h3>
                        <p style=${{ fontSize: '0.92rem', lineHeight: '1.6', color: '#ccc', whiteSpace: 'pre-line' }}>
                          ${memoryBookPages[bookPage].content}
                        </p>
                        <div style=${{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                          <button
                            className="control-btn"
                            disabled=${bookPage === 0}
                            onClick=${() => {
                              playAmbientSound('page_turn');
                              setBookPage(prev => Math.max(0, prev - 1));
                            }}
                          >
                            <i className="fas fa-chevron-left"></i> Prev
                          </button>
                          <button
                            className="control-btn"
                            disabled=${bookPage === memoryBookPages.length - 1}
                            onClick=${() => {
                              playAmbientSound('page_turn');
                              setBookPage(prev => Math.min(memoryBookPages.length - 1, prev + 1));
                            }}
                          >
                            Next <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                      <div className="book-half right-half-showcase">
                        <div className="moonlight-glow"></div>
                        <img
                          src=${memoryBookPages[bookPage].image}
                          className="magazine-cover-photo"
                          alt="Page"
                        />
                      </div>
                  `;
                })()}
              </div>
            </div>
          </section>

          
          <section id="treasure-hunt" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE TREASURE HUNT</h2>
            <p className="section-subtitle">Solve the riddles to unlock the ultimate surprise chest</p>
            <${TreasureHunt}
              clue=${treasureClue}
              setClue=${setTreasureClue}
              onComplete=${() => {}}
            />
          </section>

          
          <section id="secret-room" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE SECRET DIAL ROOM</h2>
            <p className="section-subtitle">Rotate the dial to 10-06 (her birthday) to unlock</p>
            <${SecretRoomDial}
              unlocked=${safeUnlocked}
              setUnlocked=${setSafeUnlocked}
              onUnlock=${() => {
                setModalTitle("🔓 Vault Unlocked!");
                setModalText(`If this entire universe could hide only one treasure,
it would be the memories we've made along the way. ✨

Some people become memories,
but a few become comfort,
and you have been both. 🤍

Thank you for every laugh,
every conversation,
every smile,
and every moment that made this journey special.

No matter where life takes us,
a part of these memories will always stay close to my heart. 🌙

Never forget how amazing you are, Miuu.

This rose is for you. 🌹`);
              }}
            />
          </section>

          
          <section id="bubbles" className="world-section">
            <h2 className="section-title luxury-text-gradient">FLOATING MEMORY BUBBLES</h2>
            <p className="section-subtitle">Click the bubbles to pop them and float away into happy thoughts</p>
            <div className="bubble-canvas">
              <${FloatingBubbles}
                onPop=${(msg) => {
                  setModalTitle("🎈 Bubble Pop Message");
                  setModalText(msg);
                }}
              />
            </div>
          </section>

          
          <section id="videos" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE MIIUU MOMENTS</h2>
            <p className="section-subtitle">Little moments that make you, you ✨🤍</p>
            <div className="video-frame-glow">
              
              <video
                src="./Video11.mp4"
                controls
                className="cinematic-player"
                placeholder="Upload your customized MP3/MP4 here"
              ></video>
            </div>
          </section>

          
          <section id="quiz" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE CUTE MIUU QUIZ</h2>
            <p className="section-subtitle">Answer some playful questions about yourself</p>
            <${MiuuQuiz}
              score=${quizScore}
              setScore=${setQuizScore}
              activeIndex=${activeQuizIndex}
              setActiveIndex=${setActiveQuizIndex}
              completed=${quizCompleted}
              setCompleted=${setQuizCompleted}
            />
          </section>

          
          <section id="compliment-machine" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE COMPLIMENT GENERATOR</h2>
            <p className="section-subtitle">Pull the magical handle to receive infinite warm words</p>
            <div className="machine-box glass-panel">
              <div
                style=${{
                  padding: '20px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(224, 169, 150, 0.2)',
                  borderRadius: '12px',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--light-gold)',
                  marginBottom: '20px'
                }}
              >
                ${complimentMachineWord}
              </div>
              <${LeverHandle}
                onPull=${() => {
                  const items = [
                    "You shine brighter than any moon in the galaxy! 🌙",
                    "Your smile is the absolute highlight of my day! ✨",
                    "You are capable of doing amazing things! 🏆",
                    "Everything feels cozy and happy when you are around! ☕",
                    "You are a stellar friend and a beautiful human! 🤍",
                    "Keep smiling, because the world is gorgeous when you do! 😄"
                  ];
                  const rand = items[Math.floor(Math.random() * items.length)];
                  setComplimentMachineWord(rand);
                  triggerConfetti();
                }}
              />
            </div>
          </section>

          
          <section id="dream-tree" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE DREAM TREE</h2>
            <p className="section-subtitle">Touch the hanging leaves to release blessings</p>
            <div className="dream-tree-wrapper">
              <${DreamTreeCanvas}
                onLeafClick=${(wish) => {
                  setModalTitle("🍂 Tree Leaf Blessing");
                  setModalText(wish);
                }}
              />
            </div>
          </section>

          
          <section id="gifts" className="world-section">
            <h2 className="section-title luxury-text-gradient">THE SURPRISE GIFT ROOM</h2>
            <p className="section-subtitle">Click on a luxury box to unwrap a surprise note</p>
            <div style=${{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
              ${[0, 1, 2].map(idx => html`
                <div
                  key=${idx}
                  className="gift-box"
                  style=${{
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, var(--rose-gold), var(--deep-purple))',
                    border: '2px solid var(--gold)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                  }}
                  onClick=${() => {
                    const item = giftSurprises[idx % giftSurprises.length];
                    setModalTitle(item.title);
                    setModalText(item.text);
                    triggerConfetti();
                  }}
                >
                  <span style=${{ fontSize: '2.5rem' }}>🎁</span>
                  <small style=${{ color: 'var(--light-gold)', marginTop: '5px' }}>Open Me</small>
                </div>
              `)}
            </div>
          </section>



          
          <section id="castle" className="world-section">
            <${FinalCastle}
              showThankYouScreen=${showThankYouScreen}
              setShowThankYouScreen=${setShowThankYouScreen}
              onTriggerEnding=${() => setShowButterflyRelease(true)}
              onVolumeFadeDown=${() => fadeVolume(0.05, 3000)}
              onVolumeFadeUp=${() => fadeVolume(0.8, 3000)}
              allRequirementsMet=${allRequirementsMet}
              endingUnlocked=${endingUnlocked}
              endingCompleted=${endingCompleted}
            />
          </section>
        </div>
      `}

      
      ${modalText && html`
        <div className="custom-modal">
          <div className="modal-content glass-panel">
            <h3 className="luxury-text-gradient" style=${{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '15px' }}>
              ${modalTitle}
            </h3>
            <p style=${{ fontSize: '1.1rem', lineHeight: '1.6', color: '#eee' }}>${modalText}</p>
            <button className="close-modal-btn" onClick=${() => {
              setModalText(null);
              setModalTitle(null);
            }}>Close ✨</button>
          </div>
        </div>
      `}

      
      
      ${easterEggActive && html`
        <div className="custom-modal">
          <div className="modal-content glass-panel">
            <h3 className="luxury-text-gradient" style=${{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '15px' }}>
              🌙 Secret Moon Vault Unlocked!
            </h3>
            <p style=${{ fontSize: '1.1rem', lineHeight: '1.6', color: '#eee' }}>
              "Miuu, you clicked the moon 5 times and unlocked the secret message! 🤍\n\nSometimes, the simplest things bring the greatest comfort. Never forget how much joy you bring to my life. I am eternally grateful for you."
            </p>
            <button className="close-modal-btn" onClick=${() => setEasterEggActive(false)}>Close ✨</button>
          </div>
        </div>
      `}

      
      ${(showButterflyRelease || showFinalQuote || showThankYouScreen) && html`
        <${EndingErrorBoundary}
          key=${(showButterflyRelease ? 'release' : '') + (showFinalQuote ? 'quote' : '') + (showThankYouScreen ? 'thankyou' : '')}
          onCrash=${() => setEndingCrash(true)}
          fallback=${html`
            <${EndingEmergencyFallback}
              onReturn=${() => {
                setEndingCrash(false);
                setShowButterflyRelease(false);
                setShowFinalQuote(false);
                setShowThankYouScreen(false);
                setEndingCompleted(true);
                console.log("Returned To Universe");
              }}
            />
          `}
        >
          
          ${showButterflyRelease && html`
            <${FinalButterflyRelease}
              onComplete=${() => {
                setShowButterflyRelease(false);
                setShowFinalQuote(true);
              }}
            />
          `}

          
          ${showFinalQuote && html`
            <${FinalQuoteScene}
              onComplete=${() => {
                setShowFinalQuote(false);
                setShowThankYouScreen(true);
              }}
            />
          `}

          
          ${showThankYouScreen && html`
            <div className="thank-you-screen active">
              
              <div className="thank-you-stars">
                ${Array.from({ length: 40 }).map((_, idx) => html`
                  <div
                    key=${idx}
                    className="thank-you-star"
                    style=${{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${idx * 0.1}s`
                    }}
                  ></div>
                `)}
              </div>

              
              <div className="thank-you-moon"></div>

              
              <div className="thank-you-petals">
                ${Array.from({ length: 15 }).map((_, idx) => html`
                  <div
                    key=${idx}
                    className="spotlight-petal"
                    style=${{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * -10}%`,
                      animationDelay: `${idx * 1.5}s`,
                      animationDuration: `${5 + Math.random() * 4}s`
                    }}
                  >🌸</div>
                `)}
              </div>

              <h1 className="thank-you-message">Thank You For Exploring My Universe, Miuu 🤍</h1>
              <p className="thank-you-subtext">
                And whenever you miss this little universe,<br />
                the stars will always remember your name. ✨
              </p>

              ${showReturnBtn && html`
                <button
                  className="return-universe-btn"
                  onClick=${() => {
                    setShowThankYouScreen(false);
                    setEndingCompleted(true);
                    console.log("Returned To Universe");
                  }}
                >
                  🌙 Return To Miuu's Universe 🌙
                </button>
              `}
            </div>
          `}
        </${EndingErrorBoundary}>
      `}

      
      ${endingCrash && html`
        <${EndingEmergencyFallback}
          onReturn=${() => {
            setEndingCrash(false);
            setShowButterflyRelease(false);
            setShowFinalQuote(false);
            setShowThankYouScreen(false);
            setEndingCompleted(true);
            console.log("Returned To Universe");
          }}
        />
      `}

      
      ${showExtraEnding && html`
        <div className="extra-ending-scene">
          <div className="extra-ending-stars">
            ${Array.from({ length: 15 }).map((_, idx) => html`
              <div
                key=${idx}
                className="extra-ending-star"
                style=${{
                  left: `${10 + (idx * 6) % 80}%`,
                  top: `${15 + (idx * 7) % 70}%`,
                  animationDelay: `${idx * 0.2}s`,
                  animationDuration: `${3 + (idx % 3)}s`
                }}
              >
                ${idx % 2 === 0 ? '✨' : '⭐'}
              </div>
            `)}
          </div>
          <div className="extra-ending-content">
            <div className="extra-ending-moon">🌙</div>
            <h1 className="extra-ending-text">Happy 20th Birthday Miuu</h1>
            <div className="extra-ending-moon">🌙</div>
          </div>
        </div>
      `}
    </div>
  `;
}

// Cinematic Gallery Component
function CinematicGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      handleNext();
    }, 4000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [currentIndex]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryPhotos.length);
      setIsTransitioning(false);
      triggerConfetti();
    }, 800); // matches CSS transition time
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
      setIsTransitioning(false);
      triggerConfetti();
    }, 800);
  };

  const goToSlide = (idx) => {
    if (isTransitioning || idx === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsTransitioning(false);
      triggerConfetti();
    }, 800);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isTransitioning]);

  // Touch swipe support on mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const swipeThreshold = 50; // minimum distance in px
    const diff = touchEndX.current - touchStartX.current;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range [-0.5, 0.5]
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty('--px', `${x * -12}px`);
    e.currentTarget.style.setProperty('--py', `${y * -12}px`);
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--px', '0px');
    e.currentTarget.style.setProperty('--py', '0px');
  };

  return html`
    <div className="gallery-showcase-container">
      <div
        className="showcase-frame-wrapper glass-panel"
        onMouseMove=${handleMouseMove}
        onMouseLeave=${handleMouseLeave}
        onTouchStart=${handleTouchStart}
        onTouchEnd=${handleTouchEnd}
      >
        
        <div className="spotlight-rose-petals-overlay">
          ${Array.from({ length: 6 }).map((_, i) => html`
            <div key=${i} className="showcase-petal" style=${{ left: `${Math.random() * 85 + 5}%`, animationDelay: `${i * 1.5}s` }}>🌸</div>
          `)}
        </div>

        
        <button className="nav-arrow left" onClick=${handlePrev}>◀</button>

        
        <div className="viewport-inner">
          <img
            src=${`${galleryPhotos[currentIndex].url}?v=${galleryVersion}`}
            className=${`showcase-img ${isTransitioning ? 'fade-out' : 'fade-in'}`}
            alt="Miuu Memory"
          />
          <div className="image-counter">
            ${currentIndex + 1} / ${galleryPhotos.length}
          </div>
        </div>

        
        <button className="nav-arrow right" onClick=${handleNext}>▶</button>
      </div>

      
      <div className="indicator-dots">
        ${galleryPhotos.map((_, idx) => html`
          <div
            key=${idx}
            className=${`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick=${() => goToSlide(idx)}
          ></div>
        `)}
      </div>

      <div className="spotlight-info">
        <h3 className="spotlight-title">✨ A Collection of Beautiful Memories ✨</h3>
        <p className="spotlight-caption">${galleryPhotos[currentIndex].caption}</p>
      </div>
    </div>
  `;
}

// ----------------- SUB-COMPONENTS -----------------

// Custom Cursor Trail
function CustomCursor({ unlocked }) {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, active: false });

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (cursor && glow) {
      const onMouseMoveCursor = (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      };
      window.addEventListener('mousemove', onMouseMoveCursor);
      return () => window.removeEventListener('mousemove', onMouseMoveCursor);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let trailParticles = [];

    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const onMouseMoveTrail = (e) => {
      const mouse = mouseRef.current;
      if (!mouse.active) {
        mouse.lastX = e.clientX;
        mouse.lastY = e.clientY;
        mouse.active = true;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = mouse.x - mouse.lastX;
      const dy = mouse.y - mouse.lastY;
      const dist = Math.hypot(dx, dy);

      // Interpolate points for high density stardust
      const steps = Math.min(30, Math.floor(dist / 3.0));
      const colors = ['#FFD86B', '#FFE8A3', '#FFF4C7', '#F3E5AB', '#D4AF37', '#E0A996'];
      const glowColors = [
        'rgba(255, 216, 107, ',  // Soft gold
        'rgba(255, 232, 163, ',  // Warm champagne gold
        'rgba(255, 244, 199, '   // Pale moonlight gold
      ];

      for (let s = 0; s <= steps; s++) {
        const t = steps === 0 ? 1 : s / steps;
        const px = mouse.lastX + dx * t + (Math.random() - 0.5) * 5;
        const py = mouse.lastY + dy * t + (Math.random() - 0.5) * 5;

        const rand = Math.random();
        let type = 'dot';
        let size = 1.2 + Math.random() * 1.6;

        if (rand < 0.45) {
          type = 'star';
          size = 1.6 + Math.random() * 2.8;
        } else if (rand < 0.85) {
          type = 'dust';
          size = 0.6 + Math.random() * 1.0;
        }

        const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)];

        trailParticles.push({
          type,
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 1.1,
          vy: -0.3 - Math.random() * 0.7, // slow float up
          size,
          baseSize: size,
          initialAlpha: 0.85 + Math.random() * 0.15,
          alpha: 0.85 + Math.random() * 0.15,
          glowColor,
          shimmerOffset: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.05,
          startTime: performance.now(),
          age: 0
        });
      }

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
    };

    window.addEventListener('mousemove', onMouseMoveTrail);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();

      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        const elapsed = (now - p.startTime) / 1000; // exact elapsed time in seconds

        if (elapsed >= 1.0) {
          trailParticles.splice(i, 1);
          continue;
        }

        // Fade smoothly to exactly 0 at 1.0s
        p.alpha = p.initialAlpha * (1.0 - elapsed);

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.age += 1;

        // Drag
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Float wave
        p.x += Math.sin(p.age * 0.05) * 0.25;

        // Particle shrinks slightly while fading (from 100% size at start down to 60% at 1.0s)
        const scale = 0.6 + 0.4 * (p.alpha / p.initialAlpha);
        const currentSize = p.size * scale;

        // Very subtle brightness variation (shimmer)
        const shimmer = 1.0 + Math.sin(p.age * 0.15 + p.shimmerOffset) * 0.12;

        ctx.save();
        ctx.globalAlpha = Math.max(0.01, Math.min(1.0, p.alpha * shimmer));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'star') {
          // Star glow layer
          ctx.fillStyle = `${p.glowColor}0.22)`;
          ctx.beginPath();
          drawStar(ctx, 0, 0, 4, currentSize * 2.3, currentSize * 0.45);
          ctx.fill();

          // Star core
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          drawStar(ctx, 0, 0, 4, currentSize, currentSize * 0.25);
          ctx.fill();
        } else if (p.type === 'dot') {
          // Dot glow
          ctx.fillStyle = `${p.glowColor}0.28)`;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize * 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Dot core
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft dust
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMoveTrail);
      cancelAnimationFrame(animId);
    };
  }, []);

  return html`
    <div className="landing-magical-cursor">
      <div className="custom-cursor" ref=${cursorRef}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style=${{ transform: 'translate(-2px, -2px)' }}>
          <defs>
            <linearGradient id="magic-gold" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#FFF4C7" />
              <stop offset="35%" stop-color="#FFE8A3" />
              <stop offset="70%" stop-color="#FFD86B" />
              <stop offset="100%" stop-color="#D4AF37" />
            </linearGradient>
            <filter id="magic-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#FFD86B" flood-opacity="0.8" />
              <feDropShadow dx="0" dy="1.5" stdDeviation="1" flood-color="#000" flood-opacity="0.4" />
            </filter>
          </defs>
          <path d="M2.5 2 L3 21.5 C3 22.3 4.0 22.8 4.6 22.2 L9.2 17.0 L15.2 23.0 C15.6 23.4 16.2 23.4 16.6 23.0 L19.8 19.8 C20.2 19.4 20.2 18.8 19.8 18.4 L13.8 12.4 L19.0 7.8 C19.6 7.2 19.2 6.0 18.3 6.0 L2.5 2 Z" fill="url(#magic-gold)" filter="url(#magic-glow)" stroke="#FFF4C7" stroke-width="0.75" />
          <path d="M10 11.5 C10 10.5 9.2 9.8 8.0 9.8 C9.2 9.8 10 9.1 10 8.1 C10 9.1 10.8 9.8 12.0 9.8 C10.8 9.8 10 10.5 10 11.5 Z" fill="#FFF"/>
        </svg>
      </div>
      <div className="custom-cursor-glow" ref=${glowRef}></div>
      <canvas ref=${canvasRef} className="global-trail-canvas"></canvas>
    </div>
  `;
}

// Starry Canvas background (using 2D Canvas for maximum performance and portability)
function StarrySky() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    // Stars
    const stars = Array.from({ length: 700 }, () => {
      const rand = Math.random();
      let size, minAlpha, maxAlpha, twinkleSpeed, glow;
      if (rand < 0.75) {
        // Distant tiny stars
        size = Math.random() * 0.4 + 0.35;
        minAlpha = 0.1;
        maxAlpha = 0.45;
        twinkleSpeed = Math.random() * 0.01 + 0.005;
        glow = false;
      } else if (rand < 0.96) {
        // Medium stars
        size = Math.random() * 0.5 + 0.75;
        minAlpha = 0.35;
        maxAlpha = 0.75;
        twinkleSpeed = Math.random() * 0.015 + 0.008;
        glow = false;
      } else {
        // Bright feature stars
        size = Math.random() * 0.55 + 1.25;
        minAlpha = 0.6;
        maxAlpha = 0.95;
        twinkleSpeed = Math.random() * 0.02 + 0.012;
        glow = true;
      }

      return {
        x: Math.random(),
        y: Math.random(),
        size,
        minAlpha,
        maxAlpha,
        twinkleSpeed,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: ['#FFF4C7', '#FFE8A3', '#FFF9E3', '#F3E5AB', '#FFD86B'][Math.floor(Math.random() * 5)],
        glow
      };
    });

    // Fireflies
    const fireflies = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: Math.random() * 0.02 - 0.01,
      alpha: Math.random() * 0.6 + 0.3
    }));

    // Rose Petals
    const petals = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * -100 - 20,
      size: Math.random() * 6 + 6,
      speedY: Math.random() * 1 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      rot: Math.random() * 360,
      rotSpeed: Math.random() * 0.5 - 0.25
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.5;

      // Stars
      stars.forEach(star => {
        const twinkle = Math.sin(star.twinkleOffset + time * star.twinkleSpeed);
        const alpha = star.minAlpha + (twinkle * 0.5 + 0.5) * (star.maxAlpha - star.minAlpha);

        ctx.save();
        ctx.globalAlpha = alpha;

        if (star.glow) {
          ctx.shadowBlur = star.size * 3.5;
          ctx.shadowColor = star.color;
        }

        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Fireflies
      fireflies.forEach(f => {
        f.x += f.speedX + Math.sin(f.angle) * 0.3;
        f.y += f.speedY + Math.cos(f.angle) * 0.3;
        f.angle += f.spinSpeed;

        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;

        ctx.globalAlpha = f.alpha;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4);
        grad.addColorStop(0, 'rgba(253, 253, 150, 0.8)');
        grad.addColorStop(0.3, 'rgba(253, 253, 150, 0.3)');
        grad.addColorStop(1, 'rgba(253, 253, 150, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Rose Petals
      ctx.fillStyle = 'rgba(224, 169, 150, 0.7)';
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rot += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -50;
          p.x = Math.random() * width;
        }

        ctx.globalAlpha = 0.65;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.beginPath();
        // Drawing simple petal shapes
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return html`<canvas ref=${canvasRef} id="bg-canvas"></canvas>`;
}

const moonSparkleStyles = [
  { left: '10%', top: '20%', animationDelay: '0s', animationDuration: '3.5s', '--x': '15px', '--y': '-15px' },
  { left: '80%', top: '15%', animationDelay: '0.4s', animationDuration: '4.2s', '--x': '-20px', '--y': '10px' },
  { left: '25%', top: '75%', animationDelay: '0.8s', animationDuration: '3.8s', '--x': '10px', '--y': '-20px' },
  { left: '70%', top: '80%', animationDelay: '1.2s', animationDuration: '4.5s', '--x': '-15px', '--y': '-15px' },
  { left: '-10%', top: '45%', animationDelay: '1.6s', animationDuration: '3.9s', '--x': '20px', '--y': '5px' },
  { left: '95%', top: '50%', animationDelay: '2.0s', animationDuration: '4.1s', '--x': '-25px', '--y': '-10px' },
  { left: '40%', top: '-5%', animationDelay: '0.2s', animationDuration: '3.7s', '--x': '-10px', '--y': '20px' },
  { left: '55%', top: '95%', animationDelay: '0.6s', animationDuration: '4.4s', '--x': '15px', '--y': '-20px' },
  { left: '15%', top: '50%', animationDelay: '1.0s', animationDuration: '4.0s', '--x': '-12px', '--y': '15px' },
  { left: '75%', top: '40%', animationDelay: '1.4s', animationDuration: '3.6s', '--x': '18px', '--y': '-12px' },
{ left: '30%', top: '10%', animationDelay: '1.8s', animationDuration: '4.3s', '--x': '8px', '--y': '18px' },
  { left: '65%', top: '90%', animationDelay: '2.2s', animationDuration: '3.4s', '--x': '-18px', '--y': '-8px' }
];

// Password Validator Portal
function PasswordGate({ onSuccess, moonClicks, setMoonClicks, onEasterEggUnlock }) {
  const [val, setVal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle arrays
    let screenSparkles = [];
    let orbitSparkles = [];
    let moonShimmer = [];

    // Helper: Initialize screen sparkles
    const createScreenSparkle = (nearMoon = false) => {
      let sx, sy;
      if (nearMoon) {
        const angle = Math.random() * Math.PI * 2;
        const distRatio = Math.pow(Math.random(), 1.2); // clustered closer to the moon
        const minDistancePx = 65;
        const maxDistancePx = 320;
        const distPx = minDistancePx + distRatio * (maxDistancePx - minDistancePx);
        
        // Convert to normalized coordinates relative to initial width and height
        const angleCos = Math.cos(angle) * distPx;
        const angleSin = Math.sin(angle) * distPx;
        
        sx = 0.5 + angleCos / width;
        sy = 0.35 + angleSin / height;
      } else {
        sx = Math.random();
        sy = Math.random();
      }

      const rand = Math.random();
      let size, minAlpha, maxAlpha, twinkleSpeed, glow;
      if (rand < 0.75) {
        // Tiny distant stars
        size = Math.random() * 0.4 + 0.35;
        minAlpha = 0.1;
        maxAlpha = 0.45;
        twinkleSpeed = Math.random() * 0.01 + 0.005;
        glow = false;
      } else if (rand < 0.96) {
        // Medium stars
        size = Math.random() * 0.5 + 0.75;
        minAlpha = 0.35;
        maxAlpha = 0.75;
        twinkleSpeed = Math.random() * 0.015 + 0.008;
        glow = false;
      } else {
        // Bright feature stars
        size = Math.random() * 0.55 + 1.25;
        minAlpha = 0.6;
        maxAlpha = 0.95;
        twinkleSpeed = Math.random() * 0.02 + 0.012;
        glow = true;
      }

      return {
        x: sx,
        y: sy,
        size,
        minAlpha,
        maxAlpha,
        twinkleSpeed,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: ['#FFF4C7', '#FFE8A3', '#FFF9E3', '#F3E5AB', '#FFD86B'][Math.floor(Math.random() * 5)],
        glow
      };
    };

    // Initialize background screen sparkles
    for (let i = 0; i < 280; i++) screenSparkles.push(createScreenSparkle(true));  // moon proximity
    for (let i = 0; i < 420; i++) screenSparkles.push(createScreenSparkle(false)); // corners / general

    // Initialize orbiting sparkles (18 particles)
    for (let i = 0; i < 18; i++) {
      orbitSparkles.push({
        rx: 75 + Math.random() * 45,
        ry: 22 + Math.random() * 12,
        tilt: -0.25 + Math.random() * 0.1, // tilt angle in radians
        angle: (i / 18) * Math.PI * 2 + Math.random() * 0.2,
        speed: (0.01 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
        baseSize: 1.2 + Math.random() * 1.5,
        color: ['#FFFFFF', '#FFE8A3', '#FFD86B'][Math.floor(Math.random() * 3)]
      });
    }

    // Initialize moon shimmer dust (20 particles)
    for (let i = 0; i < 20; i++) {
      moonShimmer.push({
        r: 65 + Math.random() * 65,
        angle: Math.random() * Math.PI * 2,
        speed: (0.002 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1),
        baseSize: 0.8 + Math.random() * 1.4,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: '#FFE8A3'
      });
    }

    // Resize listener
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Locate current moon portal position dynamically
      const moonEl = document.querySelector('.moon-portal');
      let moonX = width / 2;
      let moonY = height * 0.35;
      if (moonEl) {
        const rect = moonEl.getBoundingClientRect();
        moonX = rect.left + rect.width / 2;
        moonY = rect.top + rect.height / 2;
      }

      // 1. Draw Screen Sparkles (Background Stars)
      screenSparkles.forEach((p) => {
        const twinkle = Math.sin(p.twinkleOffset + time * p.twinkleSpeed);
        const alpha = p.minAlpha + (twinkle * 0.5 + 0.5) * (p.maxAlpha - p.minAlpha);

        ctx.save();
        ctx.globalAlpha = alpha;

        if (p.glow) {
          ctx.shadowBlur = p.size * 3.5;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw Moon Magic Shimmer Dust
      moonShimmer.forEach(p => {
        p.angle += p.speed;
        
        // Slight rhythmic pulsation relative to time
        const wobble = Math.sin(time * 0.03 + p.twinkleOffset) * 4;
        const currentR = p.r + wobble;

        const sx = moonX + Math.cos(p.angle) * currentR;
        const sy = moonY + Math.sin(p.angle) * currentR;

        const twinkle = Math.sin(p.twinkleOffset + time * p.twinkleSpeed);
        const alpha = Math.max(0.08, Math.min(0.8, 0.35 + twinkle * 0.25));

        ctx.fillStyle = `rgba(243, 229, 171, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, p.baseSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Moon Orbit sparkles (Elliptical depth-based projection)
      orbitSparkles.forEach(p => {
        p.angle += p.speed;

        const rx = p.rx;
        const ry = p.ry;
        const cosTilt = Math.cos(p.tilt);
        const sinTilt = Math.sin(p.tilt);

        const ox = rx * Math.cos(p.angle);
        const oy = ry * Math.sin(p.angle);

        // Project coordinate with Z depth
        const sx = moonX + (ox * cosTilt - oy * sinTilt);
        const sy = moonY + (ox * sinTilt + oy * cosTilt);

        const z = Math.sin(p.angle);
        const scaleMultiplier = 0.65 + 0.35 * z;
        const opacityMultiplier = 0.35 + 0.65 * (z * 0.5 + 0.5);

        const twinkle = Math.sin(p.angle * 4 + time * 0.05);
        const alpha = Math.max(0.1, Math.min(1.0, 0.55 * opacityMultiplier + twinkle * 0.15));
        const size = p.baseSize * scaleMultiplier;

        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (val.trim().toUpperCase() === config.password.toUpperCase()) {
      setIsWrong(false);
      onSuccess();
    } else {
      setIsWrong(true);
      setErrorMsg("Oops! This magical universe is reserved only for Miuu 🤍");
      triggerConfettiShake();
    }
  };

  const triggerConfettiShake = () => {
    const card = document.querySelector('.password-card');
    if (card) {
      card.style.animation = 'none';
      setTimeout(() => {
        card.style.animation = 'shake 0.5s ease-in-out';
      }, 10);
    }
  };

  return html`
    <div className="password-screen">
      <canvas ref=${canvasRef} className="login-canvas"></canvas>
      
      <div id="gate-cursor-trail" style=${{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}></div>

      <div className="gate-aurora"></div>

      
      <div className="gate-cloud c1"></div>
      <div className="gate-cloud c2"></div>

      
      <div className="gate-shooting-star s1"></div>
      <div className="gate-shooting-star s2"></div>
      <div className="gate-shooting-star s3"></div>

      
      ${Array.from({ length: 6 }).map((_, idx) => html`
        <div
          key=${idx}
          className="gate-butterfly"
          style=${{
            animationDelay: `${idx * 2.5}s`,
            animationDuration: `${15 + idx * 3}s`,
            left: `${10 + idx * 15}%`,
            top: `${20 + (idx % 2) * 20}%`
          }}
        >
          <div className="wing left"></div>
          <div className="wing right"></div>
        </div>
      `)}

      
      ${Array.from({ length: 15 }).map((_, idx) => html`
        <div
          key=${idx}
          className="gate-firefly"
          style=${{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 85 + 5}%`,
            animationDelay: `${idx * 0.4}s`,
            '--fx': `${(Math.random() - 0.5) * 80}px`,
            '--fy': `${(Math.random() - 0.5) * 80 - 40}px`
          }}
        ></div>
      `)}
      
      
      <div
        className="moon-portal"
        onMouseEnter=${() => playAmbientSound('butterfly')}
        onClick=${() => {
          playAmbientSound('sparkle');
          const next = moonClicks + 1;
          setMoonClicks(next);
          if (next >= 5) {
            onEasterEggUnlock();
            setMoonClicks(0);
          }
        }}
      >
        ${moonSparkleStyles.map((style, idx) => html`
          <div
            key=${idx}
            className="moon-sparkle"
            style=${style}
          ></div>
        `)}
      </div>
      
      
      <div className="sparkle-container">
        <h1 className="portal-text" style=${{ position: 'relative', display: 'inline-block' }}>
          <div className="sparkle-star" style=${{ top: '-10px', left: '-20px', animationDelay: '0.2s' }}>✨</div>
          <div className="sparkle-star" style=${{ top: '-15px', right: '-15px', animationDelay: '0.8s' }}>✨</div>
          <div className="sparkle-star" style=${{ bottom: '-10px', left: '40%', animationDelay: '1.4s' }}>✨</div>
          🌙 A Secret World Awaits 🌙
        </h1>
      </div>
      <p className="portal-subtext">This magical universe belongs to someone very special...</p>

      <div className="password-card glass-panel" style=${{ boxShadow: '0 8px 32px 0 rgba(224, 169, 150, 0.25)', border: '1px solid rgba(224, 169, 150, 0.4)' }}>
        <form onSubmit=${handleSubmit}>
          <input
            type="text"
            className="password-input"
            placeholder="Enter your Cute Nickname ✨"
            value=${val}
            onChange=${(e) => setVal(e.target.value)}
          />
          <button type="submit" className="password-btn">Enter Universe ✨</button>
        </form>

        <a href="#" className="hint-trigger" onClick=${(e) => { e.preventDefault(); setShowHint(true); }}>Need a hint? 🤍</a>

        
        <div className=${`wrong-popup ${isWrong ? 'active' : ''}`}>
          <p>${errorMsg}</p>
          <button className="close-popup-btn" onClick=${() => setIsWrong(false)}>Try Again 🤍</button>
        </div>

        
        ${showHint && html`
          <div style=${{ marginTop: '15px', color: 'var(--soft-pink)', fontSize: '0.85rem' }}>
            Hint: It is a 4-letter nickname starting with 'M' and ending with 'U'!
            <br />
            <a href="#" style=${{ color: '#fff', fontSize: '0.8rem', textDecoration: 'underline' }} onClick=${(e) => { e.preventDefault(); setShowHint(false); }}>Close hint</a>
          </div>
        `}
      </div>
      <div style=${{ position: 'fixed', bottom: '10px', right: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', zIndex: 10000 }}>v2.4.1</div>
    </div>
  `;
}

// ✨ SECTION 1.5: THE HEART OF THIS UNIVERSE ✨
function HeartOfUniverse() {
  const [stage, setStage] = useState(0); // 0: typing text, 1: showing photo
  const [typedText, setTypedText] = useState("");
  const sectionRef = useRef(null);
  const photoContainerRef = useRef(null);
  const trailCanvasRef = useRef(null);
  const text = "Some people become memories.\nSome become stories.\nAnd some become a beautiful part of your universe.";

  // Synthesize soft chime sound using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = ctx.currentTime;
      playTone(523.25, now, 0.8);      // C5
      playTone(587.33, now + 0.1, 0.8);  // D5
      playTone(659.25, now + 0.2, 0.8);  // E5
      playTone(783.99, now + 0.3, 1.0);  // G5
      playTone(880.00, now + 0.4, 1.2);  // A5
      playTone(1046.50, now + 0.5, 1.5); // C6
    } catch(e) {
      console.log("Audio play blocked/unsupported", e);
    }
  };

  // Sparkle trail inside canvas
  useEffect(() => {
    if (stage !== 1) return;
    const canvas = trailCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = 320);
    let height = (canvas.height = 320);
    let particles = [];

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 3; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          alpha: 1,
          size: Math.random() * 2 + 1,
          color: `hsl(${Math.random() * 30 + 35}, 100%, 75%)` // Gold
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const spikes = 4;
        const outerRadius = p.size * 2;
        const innerRadius = p.size;
        let rot = Math.PI / 2 * 3;
        let cx = p.x;
        let cy = p.y;
        let step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          let xStar = cx + Math.cos(rot) * outerRadius;
          let yStar = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(xStar, yStar);
          rot += step;

          xStar = cx + Math.cos(rot) * innerRadius;
          yStar = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(xStar, yStar);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [stage]);

  // Typing effect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && stage === 0) {
          let i = 0;
          const interval = setInterval(() => {
            setTypedText(text.slice(0, i));
            i++;
            if (i > text.length) {
              clearInterval(interval);
              setTimeout(() => {
                setStage(1);
              }, 1200);
            }
          }, 60);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return html`
    <section id="universe-heart" ref=${sectionRef} className="world-section">
      <h2 className="section-title luxury-text-gradient">THE HEART OF THIS UNIVERSE</h2>
      <p className="section-subtitle">Dedicated to our stars</p>

      <div className="heart-text-reveal-container">
        <p className="heart-reveal-text ${stage === 1 ? 'faded' : ''}">${typedText}</p>
      </div>

      ${stage === 1 && html`
        <div className="heart-photo-reveal active">
          
          <div className="orbiting-stars-box">
            <div className="orbit-track track-1"><div className="orbit-star star-1">✨</div></div>
            <div className="orbit-track track-2"><div className="orbit-star star-2">⭐</div></div>
            <div className="orbit-track track-3"><div className="orbit-star star-3">✨</div></div>
          </div>

          
          <div
            className="universe-photo-frame"
            onMouseEnter=${() => {
              playChime();
              const container = photoContainerRef.current;
              if (container) {
                for (let i = 0; i < 4; i++) {
                  const b = document.createElement('div');
                  b.className = 'photo-hover-butterfly';
                  b.style.left = `${Math.random() * 80 + 10}%`;
                  b.style.top = `${Math.random() * 80 + 10}%`;
                  const dx = (Math.random() - 0.5) * 160;
                  const dy = (Math.random() - 0.5) * 160 - 80;
                  b.style.setProperty('--dx', `${dx}px`);
                  b.style.setProperty('--dy', `${dy}px`);
                  b.innerHTML = '<div class="wing left"></div><div class="wing right"></div>';
                  container.appendChild(b);
                  setTimeout(() => b.remove(), 2000);
                }
              }
            }}
            ref=${photoContainerRef}
          >
            
            <canvas ref=${trailCanvasRef} className="sparkle-trail-canvas"></canvas>
            
            <img src="./11.png" className="universe-center-photo" alt="Miuu" />
          </div>

          <div style=${{ marginTop: '30px', textAlign: 'center', zIndex: 10 }}>
            <p className="universe-sub-caption">"Every star in this universe shines a little brighter because of Miuu."</p>
          </div>
        </div>
      `}
    </section>
  `;
}

// 3D storybook cinematic intro
function StorybookIntro({ onComplete }) {
  const [page, setPage] = useState(0);

  const stories = [
    { title: "Chapter 1", text: "Once upon a time,\nthere was a girl named Miuu..." },
    { title: "Chapter 2", text: "She was the kindest soul in the land,\nfilling every room she walked into with smiles..." },
    { title: "Chapter 3", text: "So on her special day, June 10,\nthis magical little universe was created exclusively for her." }
  ];

  return html`
    <div className="storybook-screen">
      <div className="storybook-container">
        ${stories.map((story, i) => html`
          <div
            key=${i}
            className=${`storybook-page ${page > i ? 'page-flipped' : ''}`}
            style=${{ zIndex: stories.length - i }}
          >
            <div className="storybook-content">
              <h2>${story.title}</h2>
              <p>${story.text}</p>
              
              ${page === i && html`
                <button
                  className="story-btn"
                  onClick=${() => {
                    if (page < stories.length - 1) {
                      setPage(page + 1);
                    } else {
                      onComplete();
                    }
                  }}
                >
                  ${i === stories.length - 1 ? 'Unlock Birthday World 🎂' : 'Turn Page 📖'}
                </button>
              `}
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}

// Grand Happy Birthday Reveal Screen
function GrandReveal({ onClose }) {
  return html`
    <div className="grand-reveal-screen active">
      <div className="reveal-title luxury-text-gradient">🎂 HAPPY BIRTHDAY MIUU 🎂</div>
      <div className="reveal-subtitle">You are our guiding light! 🌟</div>
      
      <p className="reveal-message">
        Welcome to your very own personal digital universe. This space was handcrafted with love, memories, and warm blessings just for you. Explore the locations below to find hidden secrets!
      </p>

      <button
        className="password-btn"
        onClick=${onClose}
        style=${{ padding: '15px 40px', fontSize: '1.1rem' }}
      >
        Enter Your Universe ❤️
      </button>
    </div>
  `;
}

// Floating music player component
function FloatingPlayer({
  isPlaying,
  songProgress,
  volume,
  title,
  artist,
  onPlayPause,
  onVolumeChange,
  onProgressChange,
  audioDuration,
  audioCurrentTime
}) {
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return html`
    <div className="floating-player glass-panel">
      <div className="player-header">
        <span>🎵 Now Playing</span>
        
        <div className="visualizer-container">
          ${Array.from({ length: 6 }).map((_, idx) => html`
            <div
              key=${idx}
              className=${`visualizer-bar ${isPlaying ? 'playing' : ''}`}
              style=${{ animationDelay: `${idx * 0.15}s` }}
            ></div>
          `)}
        </div>
      </div>
      <div className="player-main">
        <div className=${`vinyl-disc ${isPlaying ? 'spinning' : ''}`}></div>
        <div className="player-info">
          <div className="song-title">${title}</div>
          <div className="song-artist">${artist}</div>
        </div>
      </div>

      <div style=${{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: 'var(--lavender)', marginTop: '8px' }}>
        <span>${formatTime(audioCurrentTime)}</span>
        <span>${formatTime(audioDuration)}</span>
      </div>

      <div className="player-controls">
        <button className="control-btn" onClick=${onPlayPause}>
          <i className=${isPlaying ? 'fas fa-pause' : 'fas fa-play'}></i>
        </button>

        <div className="progress-container">
          <input
            type="range"
            min="0"
            max="100"
            value=${songProgress}
            onChange=${onProgressChange}
            style=${{ width: '100%', position: 'absolute', opacity: 0, height: '100%', left: 0 }}
          />
          <div className="progress-bar" style=${{ width: `${songProgress}%` }}></div>
        </div>

        <div className="volume-container">
          <i className="fas fa-volume-up" style=${{ fontSize: '0.8rem', color: 'var(--lavender)' }}></i>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            className="volume-slider"
            value=${volume}
            onChange=${onVolumeChange}
          />
        </div>
      </div>
    </div>
  `;
}

// Countdown Clock timer
function CountdownTimer({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      let tempTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        tempTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        onComplete();
      }
      setTimeLeft(tempTimeLeft);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return html`
    <div className="countdown-box">
      <div className="countdown-item glass-panel">
        <span className="countdown-val">${timeLeft.days}</span>
        <span className="countdown-unit">Days</span>
      </div>
      <div className="countdown-item glass-panel">
        <span className="countdown-val">${timeLeft.hours}</span>
        <span className="countdown-unit">Hours</span>
      </div>
      <div className="countdown-item glass-panel">
        <span className="countdown-val">${timeLeft.minutes}</span>
        <span className="countdown-unit">Mins</span>
      </div>
      <div className="countdown-item glass-panel">
        <span className="countdown-val">${timeLeft.seconds}</span>
        <span className="countdown-unit">Secs</span>
      </div>
    </div>
  `;
}

// Memory Lake component
function MemoryLake({ onLanternClick }) {
  const lanterns = [
    { id: 1, left: '12%', top: '55%', title: "🌙 Lantern 1 — First Impression", msg: "Sach bolun toh mujhe kabhi nahi laga tha ki ek din tum meri life ki itni important friend ban jaogi. Lekin aaj lagta hai ki tumhare bina bohot si memories adhuri hoti." },
    { id: 2, left: '25%', top: '35%', title: "✨ Lantern 2 — Random Conversations", msg: "Hamari sabse funny baat ye hai ki kabhi kabhi bina kisi topic ke bhi conversation chalti rehti hai 😂 Aur wahi random talks baad mein best memories ban jaati hain." },
    { id: 3, left: '38%', top: '65%', title: "🌸 Lantern 3 — Trust", msg: "Har kisi par trust karna easy nahi hota, lekin tum un logon mein se ho jinke saath baat karte waqt kabhi filter lagane ki zarurat nahi padti." },
    { id: 4, left: '50%', top: '45%', title: "💫 Lantern 4 — Support", msg: "Life mein jab bhi koi difficult phase aata hai, tab samajh aata hai kaun saath khada hai. Thank you for always being one of those people." },
    { id: 5, left: '62%', top: '70%', title: "🎯 Lantern 5 — Future Wish", msg: "Aaj jo goals tum dekh rahi ho, mujhe poora yakeen hai ek din woh reality banenge. Bas isi tarah mehnat karti rehna." },
    { id: 6, left: '75%', top: '38%', title: "🌹 Lantern 6 — Favourite Memory", msg: "Rose sticker wala moment abhi bhi top tier memory hai 😂🌹 Chhoti si baat thi, lekin usne pura din better bana diya tha." },
    { id: 7, left: '88%', top: '60%', title: "🌙 Lantern 7 — Birthday Wish", msg: "Happy 20th Birthday Miuu 🤍\n\nMain bas itna chahta hoon ki aane wala saal tumhare liye happiness, success, peace aur beautiful surprises lekar aaye.\n\nAur agar kabhi life difficult lage, toh yaad rakhna — tum usse kahin zyada strong ho jitna tum khud sochti ho. ✨" }
  ];

  return html`
    <div className="lake-container">
      <div className="lake-ripple"></div>
      ${lanterns.map(lantern => html`
        <div
          key=${lantern.id}
          className="floating-lantern"
          style=${{ left: lantern.left, top: lantern.top, animationDelay: `${lantern.id * -1.2}s` }}
          onClick=${() => {
            playAmbientSound('lantern');
            onLanternClick(lantern.id, lantern.title, lantern.msg);
          }}
        >
          🏮
        </div>
      `)}
    </div>
  `;
}

// Treasure Hunt mini game
function TreasureHunt({ clue, setClue, onComplete }) {
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState("");

  const clues = [
    {
      q: `Tumhari birthday journey ka pehla chapter yaad hai? 💖
Ek chhota sa gift, jo haathon mein pehna jaata hai,
aur jiske saath bahut saari wishes,
cute memories,
vohot sari care,
aur ek special dost ki yaadein bhi judi hui thi. ✨🤍
Woh gift kya tha? 🌙`,
      a: ["bracelet"]
    },
    {
      q: `Main koi city nahi,
koi country nahi,

phir bhi ek ladke ki favourite place hoon. 💖

Main kya hoon? ✨`,
      a: ["miuu"]
    }
  ];

  const checkAnswer = (e) => {
    e.preventDefault();
    const cleanInput = val.trim().toLowerCase();
    const targets = clues[clue].a.map(ans => ans.toLowerCase());

    if (targets.includes(cleanInput)) {
      setVal("");
      setMsg("Correct! Unlocked next clue! ✨");
      if (clue < clues.length - 1) {
        setClue(clue + 1);
      } else {
        setClue(clue + 1);
        onComplete();
        confetti({
          particleCount: 150,
          spread: 80
        });
      }
    } else {
      setMsg("Not quite, Miuu! Try again. 🤍");
    }
  };

  return html`
    <div className="treasure-hunt-card glass-panel">
      ${clue < clues.length ? html`
        <div>
          <h4>Clue ${clue + 1} of ${clues.length} ${clue === 0 ? '💖' : '🌙'}</h4>
          <p className="clue-box" style=${{ whiteSpace: 'pre-line' }}>${clues[clue].q}</p>
          <form onSubmit=${checkAnswer}>
            <input
              type="text"
              className="hunt-input"
              value=${val}
              onChange=${(e) => setVal(e.target.value)}
              placeholder="Your answer..."
            />
            <br />
            <button type="submit" className="password-btn">Solve Clue 🗝️</button>
          </form>
          <p style=${{ color: 'var(--soft-pink)', marginTop: '10px' }}>${msg}</p>
        </div>
      ` : html`
        <div>
          <h3>🎁 Treasure Unlocked 🎁</h3>
          <p style=${{ margin: '20px 0', fontSize: '1.15rem', color: 'var(--light-gold)', whiteSpace: 'pre-line', lineHeight: '1.8' }}>
            Dekha?

            Ek answer tumhari yaad thi,
            aur doosra answer tum khud thi. 🤍

            Kyuki is poori duniya mein,
            meri favourite jagah,
            meri favourite memory,
            aur meri favourite person...

            sab tum ho. ✨

            Happy 20th Birthday Miuu 🌙💖
          </p>
          <button className="password-btn" onClick=${() => setClue(0)}>Reset Hunt 🔄</button>
        </div>
      `}
    </div>
  `;
}

// Secret safe dial room combination component
function SecretRoomDial({ unlocked, setUnlocked, onUnlock }) {
  const [dialNum, setDialNum] = useState(0);

  const rotateDial = (dir) => {
    let next = dialNum;
    if (dir === 'left') {
      next = (dialNum - 1 + 12) % 12;
    } else {
      next = (dialNum + 1) % 12;
    }
    setDialNum(next);
    // Birthday is June 10. Let's check dial matches number 6 (index 6 represents June)
    if (next === 6 && !unlocked) {
      setUnlocked(true);
      onUnlock();
    }
  };

  return html`
    <div className="safe-dial-container glass-panel" style=${{ padding: '30px', maxWidth: '400px', textAlign: 'center' }}>
      <div className="safe-dial" style=${{ transform: `rotate(${dialNum * 30}deg)`, margin: '0 auto 20px auto' }}>
        <div style=${{
          position: 'absolute',
          top: '5px',
          left: '50%',
          width: '4px',
          height: '15px',
          background: 'red',
          transform: 'translateX(-50%)'
        }}></div>
      </div>
      <div style=${{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '15px' }}>
        <button className="control-btn" onClick=${() => rotateDial('left')}>◀️ Left</button>
        <button className="control-btn" onClick=${() => rotateDial('right')}>Right ▶️</button>
      </div>
      <p style=${{ fontSize: '0.9rem', color: 'var(--lavender)' }}>
        ${unlocked ? "🔓 Vault Unlocked!" : "🔒 Locked. Hint: Align the needle to her birth month index (June = 6)"}
      </p>
    </div>
  `;
}

// Floating Bubbles component
function FloatingBubbles({ onPop }) {
  const bubbleMessages = [
    `🫶 Need help? I'll be your Doreamon.`,
    `🤝 Need loyalty? I'll be your Ninja Hatori.`,
    `🛡️ Need protection? I'll be your Motu Patlu.`,
    `⚡ Need happiness? I'll be your Pikachu.`,
    `💪 Need courage? I'll be your Chhota Bheem.`,
    `🌸 Need calm & kindness? I'll be your Oswald.`,
    `WHEN YOU FEEL SAD,

REMEMBER THAT YOU HAVE ME.

I MAY NOT BE MUCH,

BUT I'LL ALWAYS BE ON YOUR SIDE. 🤍`,
    `Some people become memories,

but a few become comfort.

Thank you for being both. 🤍🌙`
  ];

  return html`
    <div style=${{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '20px', justifyContent: 'center' }}>
      ${bubbleMessages.map((msg, i) => html`
        <div
          key=${i}
          className="memory-bubble"
          style=${{
            width: '100px',
            height: '100px',
            position: 'relative',
            cursor: 'pointer',
            fontSize: '0.8rem',
            textAlign: 'center',
            padding: '5px'
          }}
          onClick=${(e) => {
            playAmbientSound('sparkle');
            e.currentTarget.style.transform = 'scale(0)';
            setTimeout(() => onPop(msg), 150);
          }}
        >
          Bubble 🎈
        </div>
      `)}
    </div>
  `;
}

// Cute Miuu Quiz component
function MiuuQuiz({ score, setScore, activeIndex, setActiveIndex, completed, setCompleted }) {
  const handleSelect = (idx) => {
    if (idx === quizQuestions[activeIndex].answerIndex) {
      setScore(score + 1);
    }

    if (activeIndex < quizQuestions.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  return html`
    <div className="treasure-hunt-card glass-panel" style=${{ padding: '30px' }}>
      ${!completed ? html`
        <div>
          <h4>Question ${activeIndex + 1} of ${quizQuestions.length}</h4>
          <p style=${{ margin: '20px 0', fontSize: '1.2rem', color: 'var(--light-gold)' }}>
            ${quizQuestions[activeIndex].question}
          </p>
          <div style=${{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            ${quizQuestions[activeIndex].options.map((opt, i) => html`
              <button
                key=${i}
                className="password-input"
                style=${{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}
                onClick=${() => handleSelect(i)}
              >
                ${opt}
              </button>
            `)}
          </div>
        </div>
      ` : html`
        <div>
          <h3>🎉 Quiz Completed!</h3>
          <p style=${{ margin: '20px 0', fontSize: '1.15rem' }}>
            You scored <strong>${score}</strong> out of <strong>${quizQuestions.length}</strong>!
          </p>
          <p style=${{ color: 'var(--soft-pink)' }}>
            "${score === quizQuestions.length ? "Perfect score! You know yourself best, Miuu! 🤍" : "Great job, Miuu! You are wonderful!"}"
          </p>
          <button className="password-btn" onClick=${() => {
            setScore(0);
            setActiveIndex(0);
            setCompleted(false);
          }}>Retry Quiz 🔄</button>
        </div>
      `}
    </div>
  `;
}

// Custom Lever Pulling handle for Slot Machine
function LeverHandle({ onPull }) {
  const [pulled, setPulled] = useState(false);

  const pull = () => {
    if (pulled) return;
    setPulled(true);
    playAmbientSound('sparkle');
    onPull();
    setTimeout(() => setPulled(false), 800);
  };

  return html`
    <div
      className="lever-handle"
      style=${{
        transform: pulled ? 'rotateX(45deg) scaleY(0.7)' : 'rotateX(0deg)'
      }}
      onClick=${pull}
    >
      <div className="lever-ball"></div>
    </div>
  `;
}

// Glowing Dream Tree Canvas interactive helper
function DreamTreeCanvas({ onLeafClick }) {
  const leaves = [
    { id: 1, top: '25%', left: '40%', text: "May your smile always stay brighter than your worries. ✨" },
    { id: 2, top: '35%', left: '30%', text: "May every dream you chase find its way back to you. 🌙" },
    { id: 3, top: '30%', left: '60%', text: "May you always find reasons to laugh, even on difficult days. 🤍" },
    { id: 4, top: '45%', left: '20%', text: "May success meet the hard work you put in every day. 🌸" },
    { id: 5, top: '40%', left: '75%', text: "May your heart always stay as kind as it is today. 🫶" },
    { id: 6, top: '50%', left: '50%', text: "May the people you love always stay close to you. 💫" },
    { id: 7, top: '18%', left: '50%', text: "Whenever life feels heavy, remember you're stronger than you think. 🌷" },
    { id: 8, top: '22%', left: '28%', text: "May every birthday bring you closer to the life you dream of. 🎂" },
    { id: 9, top: '36%', left: '46%', text: "You deserve happiness that stays, not happiness that visits. 💛" },
    { id: 10, top: '24%', left: '70%', text: "No matter where life takes you, never forget how special you are. 🌹" },
    { id: 11, top: '44%', left: '63%', text: "Some people become memories, but a few become comfort.\nThank you for being both. 🤍🌙" }
  ];

  return html`
    <div style=${{ position: 'relative', width: '100%', height: '100%' }}>
      
      <svg style=${{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '250px', height: '350px', zIndex: 1 }}>
        <path d="M 110,350 Q 110,200 80,150 T 120,60 T 170,150 Q 140,200 140,350 Z" fill="#4a3b32" />
        <circle cx="120" cy="70" r="80" fill="rgba(181, 166, 201, 0.25)" filter="blur(20px)" />
        <circle cx="70" cy="140" r="60" fill="rgba(224, 169, 150, 0.25)" filter="blur(15px)" />
        <circle cx="170" cy="140" r="60" fill="rgba(255, 183, 178, 0.25)" filter="blur(15px)" />
      </svg>

      
      ${leaves.map(leaf => html`
        <div
          key=${leaf.id}
          style=${{
            position: 'absolute',
            top: leaf.top,
            left: leaf.left,
            zIndex: 10,
            cursor: 'pointer',
            fontSize: '1.5rem',
            animation: 'drift 5s ease-in-out infinite alternate'
          }}
          onClick=${() => onLeafClick(leaf.text)}
        >
          🍁
        </div>
      `)}
    </div>
  `;
}

// Sub-component: Envelope Opening Letter
function FinalLetterModal({ onClose }) {
  const [flapOpen, setFlapOpen] = useState(false);
  const [paperSlide, setPaperSlide] = useState(false);
  const [revealText, setRevealText] = useState(false);
  const [typedContent, setTypedContent] = useState("");
  const [showFinalLine, setShowFinalLine] = useState(false);
  
  const fullText = "Happy Birthday Miuu 🌙\n\nAaj ka din tumhare liye bahut special hai, aur isi liye maine ye chhoti si website banayi hai.\n\nShayad ye perfect na ho, lekin iske har section, har memory aur har surprise mein ek hi cheez hai — tumhari friendship ki value.\n\nThank you for all the laughs, random conversations, funny moments, and good memories.\n\nTum hamesha khush raho, haste raho, aur apni positive energy se sabka din better banati raho.\n\nUmeed hai ki ye chhota sa surprise tumhare face par ek smile zaroor layega. 😊\n\nHappy Birthday once again, Miuu! 🎂✨\n\nStay happy, stay awesome, and enjoy your day. 🌙🤍";

  useEffect(() => {
    const t1 = setTimeout(() => setFlapOpen(true), 800);
    const t2 = setTimeout(() => setPaperSlide(true), 2300);
    const t3 = setTimeout(() => {
      setRevealText(true);
      let i = 0;
      const typeInterval = setInterval(() => {
        setTypedContent(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            setShowFinalLine(true);
          }, 2000);
        }
      }, 55);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return html`
    <div className=${`letter-modal-overlay ${paperSlide ? 'paper-slide' : ''}`}>
      <div className=${`letter-box-envelope ${flapOpen ? 'flap-open' : ''} ${paperSlide ? 'paper-slide' : ''} ${revealText ? 'reveal-text' : ''}`}>
        <div className="letter-envelope-flap"></div>
        <div className="letter-paper-sheet">
          <div className="letter-paper-content">
            <p style=${{ fontSize: '1.35rem', fontFamily: 'var(--font-cursive)', textAlign: 'left', margin: 0 }}>${typedContent}</p>
            
            ${(typedContent.length >= fullText.length) && html`
              <div className="letter-paper-date">
                10 June — A day made a little brighter because of Miuu 🌙
              </div>
            `}
          </div>
        </div>
      </div>
      
      ${showFinalLine && html`
        <div className="letter-final-quote">
          <p>Some gifts are opened once.</p>
          <p>Some memories stay forever.</p>
          <p>Thank you for being one of mine. 🤍</p>
          <button className="letter-close-btn" style=${{ marginTop: '20px' }} onClick=${onClose}>Close Letter 🤍</button>
        </div>
      `}
    </div>
  `;
}

// Location 20: The Final Castle & Final Grand Finale
function FinalCastle({
  onTriggerEnding,
  onVolumeFadeDown,
  onVolumeFadeUp,
  allRequirementsMet,
  endingUnlocked,
  endingCompleted
}) {
  const [gateOpen, setGateOpen] = useState(false);
  const [textStage, setTextStage] = useState(0);
  const [transforming, setTransforming] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);


  
  const [typedMessage, setTypedMessage] = useState("");
  const [showGiftBox, setShowGiftBox] = useState(false);
  const finalMessage = "Some people become memories.\nSome become stories.\nBut some become a beautiful part of your life.\nYou are one of those rare people.\n\nStay happy. Keep smiling. Keep shining.\nBecause this universe looks better when Miuu smiles. 🌙✨";

  useEffect(() => {
    if (textStage === 3) {
      // If already filled (e.g. instant debug), don't type
      if (typedMessage === finalMessage) return;
      let i = 0;
      const interval = setInterval(() => {
        setTypedMessage(finalMessage.slice(0, i));
        i++;
        if (i > finalMessage.length) {
          clearInterval(interval);
          setTimeout(() => {
            setShowGiftBox(true);
          }, 800);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [textStage]);

  const triggerRosePetalsConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ['#e0a996', '#ffb7b2', '#ff8b94', '#ffc6ff'];
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const triggerGiftConfetti = () => {
    // Soft chime
    playAmbientSound('sparkle');
    
    // Golden sparkles / Confetti stars
    const colors = ['#e0a996', '#ffb7b2', '#ff8b94', '#d4af37', '#f3e5ab'];
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: colors
    });
    
    // Side bursts of golden stars
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors,
      shapes: ['star']
    });
    confetti({
      particleCount: 20,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors,
      shapes: ['star']
    });

    // Fireworks
    triggerFireworks();

    // Rose petals
    triggerRosePetalsConfetti();
  };

  const openGates = (instant = false) => {
    if (gateOpen) return;
    setGateOpen(true);
    onVolumeFadeDown();
    playAmbientSound('sparkle');
    triggerConfetti();

    if (instant) {
      setTransforming(true);
      setTextStage(3);
      setTypedMessage(finalMessage);
      setShowGiftBox(true);
      triggerFireworks();
      triggerRosePetalsConfetti();
    } else {
      // 1. Zoom moon starts automatically via CSS when gateOpen is true (moon class mounts)
      // 2. Transform moon to Miuu photo after 4s (and trigger fireworks + rose confetti)
      setTimeout(() => {
        setTransforming(true);
        triggerFireworks();
        triggerRosePetalsConfetti();
      }, 4000);

      // 3. Show birthday title (after 7.5s - which leaves 3.5s of photo alone)
      setTimeout(() => setTextStage(1), 7500);

      // 4. Show secondary title (after 10.5s)
      setTimeout(() => setTextStage(2), 10500);

      // 5. Show final paragraphs (after 13.5s)
      setTimeout(() => {
        setTextStage(3);
      }, 13500);
    }
  };

  return html`
    <div className="castle-entrance">
      <h2 className="section-title luxury-text-gradient">THE FINAL CASTLE</h2>
      <p className="section-subtitle">Touch the door to reveal the grand surprise</p>

      <div className="castle-gates" onClick=${() => openGates(false)}>
        <div className=${`gate-door ${gateOpen ? 'open' : ''}`} style=${{ '--origin': 'left center', '--rotY': '-90deg' }}>
          <i className="fas fa-lock"></i>
        </div>
        <div className=${`gate-door ${gateOpen ? 'open' : ''}`} style=${{ '--origin': 'right center', '--rotY': '90deg' }}>
          <i className="fas fa-lock"></i>
        </div>
      </div>

      ${!gateOpen && html`
        <button
          className="password-btn"
          style=${{ marginTop: '20px', background: 'linear-gradient(135deg, #ff8b94 0%, #ff5252 100%)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer' }}
          onClick=${() => openGates(true)}
        >
          🚀 DEBUG: START FINAL SEQUENCE
        </button>
      `}

      ${gateOpen && html`
        <div className="finale-box glass-panel">
          <div className=${`grand-ending-moon-placeholder ${transforming ? 'transformed' : ''}`}>
            
            <div className="moon-texture-glow"></div>
            
            <img src="./11.png" className="grand-ending-moon-img" alt="Miuu" />
            
            
            ${transforming && html`
              <div className="ending-floating-stars">
                <div className="end-star s1">⭐</div>
                <div className="end-star s2">✨</div>
                <div className="end-star s3">⭐</div>
                <div className="end-star s4">✨</div>
              </div>
            `}
          </div>

          ${textStage >= 1 && html`
            <h1 className="reveal-title" style=${{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '3rem' }}>
              🌙 HAPPY BIRTHDAY MIUU 🌙
            </h1>
          `}

          ${textStage >= 2 && html`
            <p style=${{ fontSize: '1.25rem', color: 'var(--light-gold)', fontStyle: 'italic', margin: '20px 0' }}>
              "Among billions of people, there is only one Miuu."
            </p>
          `}

          ${textStage >= 3 && html`
            <div style=${{ marginTop: '30px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
              <p style=${{ fontStyle: 'italic', color: '#ccc', lineHeight: '1.8', whiteSpace: 'pre-line', minHeight: '160px' }}>
                ${typedMessage}
              </p>

              
              ${showGiftBox && html`
                <div style=${{ marginTop: '40px', animation: 'fadeInGlow 1s ease-out forwards' }}>
                  <h3 style=${{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '15px' }}>
                    🎁 One Last Gift For Miuu
                  </h3>
                  
                  ${!endingUnlocked ? html`
                    <div style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="ending-glowing-box-container" style=${{ marginTop: '10px' }}>
                        <div className="glowing-gift-box" onClick=${() => {
                          triggerGiftConfetti();
                          setShowLetterModal(true);
                        }}>
                          <span className="gift-emoji">🎁</span>
                          <small>Open Miuu's Final Gift 🤍</small>
                        </div>
                      </div>
                      
                      ${showLetterModal && html`
                        <${FinalLetterModal}
                          onClose=${() => {
                            playAmbientSound('page_turn');
                            setShowLetterModal(false);
                            if (allRequirementsMet) {
                              onTriggerEnding();
                            }
                            onVolumeFadeUp(); // bring volume back up softly
                          }}
                        />
                      `}
                    </div>
                  ` : html`
                    ${!endingCompleted ? html`
                      <button
                        className="ending-trigger-btn"
                        onClick=${() => {
                          onTriggerEnding();
                        }}
                      >
                        ✨ One Last Gift For Miuu ✨
                      </button>
                    ` : html`
                      <div className="ending-completed-text">✨ Ending Completed 🤍</div>
                      <button
                        className="ending-trigger-btn"
                        style=${{ marginTop: '10px' }}
                        onClick=${() => {
                          onTriggerEnding();
                        }}
                      >
                        🔁 Watch Ending Again
                      </button>
                    `}
                  `}
                </div>
              `}
            </div>
          `}
        </div>
      `}
    </div>
  `;
}

function FinalButterflyRelease({ onComplete }) {
  const [stage, setStage] = useState('title');
  const [canvasError, setCanvasError] = useState(false);
  const canvasRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    // Normal Stage sequence transitions
    // 0s: show title '✨ One Last Gift For Miuu ✨'
    // 2s: transition from title to butterflies
    const timer = setTimeout(() => {
      setStage('butterflies');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fallback timer:
    // If the canvas fails (or if canvasError is true), transition to the quote scene after 2 seconds total elapsed!
    // If running normally, transition to the quote scene after 8 seconds (2s title + 6s butterflies).
    const elapsed = Date.now() - startTimeRef.current;
    const targetTotal = canvasError ? 2000 : 8000;
    const remaining = Math.max(0, targetTotal - elapsed);

    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, remaining);

    return () => clearTimeout(timer);
  }, [canvasError]);

  useEffect(() => {
    if (canvasError) return;
    const canvas = canvasRef.current;
    if (!canvas) {
      setCanvasError(true);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCanvasError(true);
      return;
    }
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      fade: Math.random() > 0.5
    }));

    const petals = Array.from({ length: 15 }, () => ({
      x: Math.random() * width,
      y: Math.random() * -100 - 20,
      size: Math.random() * 5 + 4,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * 360,
      rotSpeed: Math.random() * 0.4 - 0.2
    }));

    const butterflies = stage === 'butterflies' ? Array.from({ length: 20 }, (_, i) => {
      const angle = -Math.PI / 2 + (i - 9.5) * (Math.PI / 15) + (Math.random() - 0.5) * 0.1;
      const speed = Math.random() * 1.5 + 2.5;
      return {
        x: width / 2,
        y: height / 2 + 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        scale: Math.random() * 0.6 + 0.5,
        flapSpeed: Math.random() * 0.15 + 0.1,
        phase: Math.random() * Math.PI * 2,
        swayAmp: Math.random() * 3 + 1,
        swayFreq: Math.random() * 0.05 + 0.02,
        sparkles: []
      };
    }) : [];

    const render = () => {
      try {
        ctx.clearRect(0, 0, width, height);

        // Stars
        ctx.fillStyle = '#ffffff';
        stars.forEach(star => {
          if (star.fade) {
            star.alpha += star.speed;
            if (star.alpha >= 1) star.fade = false;
          } else {
            star.alpha -= star.speed;
            if (star.alpha <= 0.2) star.fade = true;
          }
          ctx.globalAlpha = star.alpha;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Rose Petals
        ctx.fillStyle = 'rgba(242, 143, 173, 0.6)';
        petals.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rot += p.rotSpeed;

          if (p.y > height + 20) {
            p.y = -50;
            p.x = Math.random() * width;
          }

          ctx.globalAlpha = 0.55;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Butterflies & Sparkles
        butterflies.forEach((b, idx) => {
          b.x += b.vx + Math.sin(Date.now() * b.swayFreq) * b.swayAmp * 0.1;
          b.y += b.vy;

          if (Math.random() < 0.4) {
            b.sparkles.push({
              x: b.x,
              y: b.y,
              alpha: 1,
              size: Math.random() * 2 + 1,
              decay: Math.random() * 0.02 + 0.01
            });
          }

          b.sparkles.forEach((sp, sIdx) => {
            sp.alpha -= sp.decay;
            if (sp.alpha <= 0) {
              b.sparkles.splice(sIdx, 1);
              return;
            }
            ctx.save();
            ctx.globalAlpha = sp.alpha * 0.8;
            ctx.fillStyle = '#ffdf7a';
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#d4af37';
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });

          if (b.x > -50 && b.x < width + 50 && b.y > -50 && b.y < height + 50) {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.scale(b.scale, b.scale);
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#d4af37';

            const flap = Math.abs(Math.sin(Date.now() * b.flapSpeed + b.phase));

            ctx.fillStyle = 'rgba(243, 229, 171, 0.95)';
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.ellipse(-4 * flap, 0, 8 * flap, 12, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(4 * flap, 0, 8 * flap, 12, -Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#6a4a35';
            ctx.beginPath();
            ctx.ellipse(0, 0, 2, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        });

        ctx.globalAlpha = 1.0;
        animationFrameId = requestAnimationFrame(render);
      } catch (err) {
        console.error("Render loop error, falling back to quote scene", err);
        setCanvasError(true);
        onCompleteRef.current();
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [stage, canvasError]);

  return html`
    <div className=${`butterfly-release-screen stage-${stage}`}>
      ${!canvasError && html`
        <canvas ref=${canvasRef} className="release-canvas"></canvas>
      `}
      <div className="moonlight-rays-overlay"></div>

      ${(stage === 'title' || canvasError) && html`
        <div className="release-title-card">
          ✨ One Last Gift For Miuu ✨
        </div>
      `}
    </div>
  `;
}

function FinalQuoteScene({ onComplete }) {
  const [subStage, setSubStage] = useState('quote');

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    // Safety fallback: automatically transition in 6 seconds
    const fallbackTimer = setTimeout(() => {
      console.warn("Quote Scene safety fallback triggered");
      onCompleteRef.current();
    }, 6000);

    // Normal stages transitions
    const t1 = setTimeout(() => setSubStage('subtitle'), 2000);
    const t2 = setTimeout(() => setSubStage('finalLine'), 4000);
    const t3 = setTimeout(() => onCompleteRef.current(), 6000);

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return html`
    <div className="butterfly-release-screen stage-quote">
      <div className="moonlight-rays-overlay"></div>
      
      ${(subStage === 'quote' || subStage === 'subtitle') && html`
        <div className="release-quote-card">
          <p className="quote-line line-1">Some stories end.</p>
          <p className="quote-line line-2">Beautiful memories don't. 🤍</p>
          
          ${subStage === 'subtitle' && html`
            <p className="quote-subtitle">
              Thank you for being part of this little universe, Miuu 🌙
            </p>
          `}
        </div>
      `}

      ${subStage === 'finalLine' && html`
        <div className="release-quote-card">
          <p className="quote-line line-3">And no matter where life takes us,</p>
          <p className="quote-line line-4">some memories will always shine like stars. ✨</p>
        </div>
      `}
    </div>
  `;
}

// Mount the App
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(App)
);
