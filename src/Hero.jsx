import { useRef, useCallback, useEffect } from 'react';
import './Hero.css';

/* ─────────────────────────────────────────────
   Hero — SKIPSCROLL Classic Netflix Aesthetic
   Static UI • Button-local FX
   ───────────────────────────────────────────── */

function Hero({ onStart }) {
    const ctaRef = useRef(null);
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const rafId = useRef(null);
    const isHovering = useRef(false);
    const spawnTimer = useRef(null);

    const rand = (lo, hi) => Math.random() * (hi - lo) + lo;

    /* ── Micro-particle system (button-local only) ── */

    const spawnBurst = useCallback(() => {
        if (!ctaRef.current || !canvasRef.current) return;
        const btn = ctaRef.current.getBoundingClientRect();
        const canvas = canvasRef.current;
        const cRect = canvas.getBoundingClientRect();

        // spawn particles along the perimeter of the button
        const cx = btn.left + btn.width / 2 - cRect.left;
        const cy = btn.top + btn.height / 2 - cRect.top;
        const rx = btn.width / 2 + 6;
        const ry = btn.height / 2 + 6;

        const count = 6;
        for (let i = 0; i < count; i++) {
            const angle = rand(0, Math.PI * 2);
            const px = cx + Math.cos(angle) * rx;
            const py = cy + Math.sin(angle) * ry * 0.65; // squish for octagon shape

            particles.current.push({
                x: px,
                y: py,
                vx: Math.cos(angle) * rand(0.6, 2),
                vy: Math.sin(angle) * rand(0.6, 2),
                life: 1,
                decay: rand(0.025, 0.06),
                size: rand(1.2, 3),
            });
        }
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);

        particles.current = particles.current.filter((p) => p.life > 0);

        for (const p of particles.current) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 38, 38, ${p.life * 0.85})`;
            ctx.shadowColor = 'rgba(185, 28, 28, 0.8)';
            ctx.shadowBlur = 8 * p.life;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.life -= p.decay;
        }
        ctx.shadowBlur = 0;

        rafId.current = requestAnimationFrame(animate);
    }, []);

    /* ── Hover handlers ── */
    useEffect(() => {
        const wrap = ctaRef.current?.parentElement;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const resize = () => {
            const r = wrap.getBoundingClientRect();
            canvas.width = r.width + 160;
            canvas.height = r.height + 160;
        };

        const onEnter = () => {
            isHovering.current = true;
            resize();
            // burst every 120ms while hovering
            spawnBurst();
            spawnTimer.current = setInterval(spawnBurst, 120);
            rafId.current = requestAnimationFrame(animate);
        };

        const onLeave = () => {
            isHovering.current = false;
            clearInterval(spawnTimer.current);
            // let remaining particles fade out naturally — raf keeps running
        };

        wrap.addEventListener('mouseenter', onEnter);
        wrap.addEventListener('mouseleave', onLeave);
        window.addEventListener('resize', resize);
        resize();

        return () => {
            wrap.removeEventListener('mouseenter', onEnter);
            wrap.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('resize', resize);
            clearInterval(spawnTimer.current);
            cancelAnimationFrame(rafId.current);
        };
    }, [animate, spawnBurst]);

    /* ── Render ── */
    return (
        <section className="hero">
            {/* ── Background System ── */}
            <div className="hero-bg">
                <div className="hero-circuit" />
                <div className="hero-ambient hero-ambient--tl" />
                <div className="hero-ambient hero-ambient--br" />
                <div className="hero-ambient hero-ambient--c" />
            </div>

            {/* Subtle frame */}
            <div className="hero-frame" />

            {/* ── Navbar ── */}
            <nav className="hero-nav">
                <a href="/" className="hero-brand">
                    <span className="hero-brand-name">
                        <span className="hero-brand-highlight">Skip</span>Scroll
                    </span>
                </a>
            </nav>

            {/* ── Centered Content ── */}
            <div className="hero-content">
                <h1 className="hero-headline">
                    <span className="hero-line">Stop Scrolling.</span>
                    <span className="hero-line">Start Watching.</span>
                </h1>

                <p className="hero-pitch">
                    Tell us your vibe.&nbsp; Our AI finds the perfect show, then gets you
                    the direct link to watch it.
                </p>

                {/* ── Geometric Shield CTA ── */}
                <div className="hero-cta-wrap">
                    {/* Perimeter trace (hover-only) */}
                    <div className="hero-cta-trace" />
                    {/* Gunmetal frame */}
                    <div className="hero-cta-frame" />
                    {/* Button */}
                    <button className="hero-cta" id="hero-find-vibe" ref={ctaRef} onClick={onStart}>
                        Find My Vibe
                        <span className="hero-cta-arrow">→</span>
                    </button>
                    {/* Hover glow */}
                    <div className="hero-cta-glow" />
                    {/* Micro-particle canvas (button-local) */}
                    <canvas className="hero-cta-particles" ref={canvasRef} />
                </div>
            </div>
        </section>
    );
}

export default Hero;
