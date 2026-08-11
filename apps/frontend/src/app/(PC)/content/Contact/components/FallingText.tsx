import { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';
import './FallingText.css';

interface FallingTextProps {
  className?: string;
  text?: string;
  highlightWords?: string[];
  highlightClass?: string;
  altWords?: string[];
  altClass?: string;
  trigger?: 'auto' | 'scroll' | 'click' | 'hover';
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
}

const FallingText = ({
  className = '',
  text = '',
  highlightWords = [],
  highlightClass = 'highlighted',
  altWords = [],
  altClass = '',
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem',
}: FallingTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [effectStarted, setEffectStarted] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');
    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        const isAlt = altWords.some((aw) => word.startsWith(aw));
        const extraClass = isHighlighted ? highlightClass : isAlt ? altClass : '';
        return `<span class="word ${extraClass}">${word}</span>`;
      })
      .join(' ');
    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords, highlightClass]);

  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true);
      return;
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted || !containerRef.current || !textRef.current || !canvasContainerRef.current)
      return;

    const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

    const r = containerRef.current.getBoundingClientRect();
    const W = r.width;
    const H = r.height;
    if (W <= 0 || H <= 0) return;

    const engine = Engine.create();
    engine.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: { width: W, height: H, background: backgroundColor, wireframes },
    });

    const wo = { isStatic: true, render: { visible: false } };
    const T = 220;
    const makeWalls = (w: number, h: number) => [
      Bodies.rectangle(w / 2, h + T / 2, w + T * 2, T, wo),
      Bodies.rectangle(-T / 2, h / 2, T, h * 3, wo),
      Bodies.rectangle(w + T / 2, h / 2, T, h * 3, wo),
      Bodies.rectangle(w / 2, -T / 2 - h, w + T * 2, T, wo),
    ];
    let walls = makeWalls(W, H);

    const pills = textRef.current.querySelectorAll('.word');
    const items: { el: HTMLElement; body: Matter.Body }[] = [];
    pills.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      const pw = htmlEl.offsetWidth;
      const ph = htmlEl.offsetHeight;
      const x = 70 + Math.random() * Math.max(1, W - 140);
      const y = -10 - i * 15 - Math.random() * 20;
      const body = Bodies.rectangle(x, y, pw, ph, {
        restitution: 0.45,
        friction: 0.35,
        frictionAir: 0.012,
        chamfer: { radius: ph / 2 },
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);
      htmlEl.style.position = 'absolute';
      htmlEl.style.top = '0';
      htmlEl.style.left = '0';
      htmlEl.style.visibility = 'visible';
      items.push({ el: htmlEl, body });
    });

    const mouse = Mouse.create(containerRef.current);
    const el = containerRef.current;
    const m = mouse as unknown as Record<string, EventListener>;
    el.removeEventListener('wheel', m.mousewheel);
    el.removeEventListener('touchstart', m.mousedown);
    el.removeEventListener('touchmove', m.mousemove);
    el.addEventListener('touchstart', m.mousedown, { passive: true });
    el.addEventListener('touchmove', m.mousemove, { passive: true });
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: mouseConstraintStiffness, render: { visible: false } },
    });
    render.mouse = mouse;

    World.add(engine.world, [...walls, mc, ...items.map((it) => it.body)]);

    // resize — CS style
    const resizeObserver = new ResizeObserver(() => {
      const br = containerRef.current?.getBoundingClientRect();
      if (!br || br.width <= 0 || br.height <= 0) return;
      Matter.Body.setPosition(walls[0], { x: br.width / 2, y: br.height + T / 2 });
      Matter.Body.setPosition(walls[1], { x: -T / 2, y: br.height / 2 });
      Matter.Body.setPosition(walls[2], { x: br.width + T / 2, y: br.height / 2 });
      Matter.Body.setPosition(walls[3], { x: br.width / 2, y: -T / 2 - br.height });
    });
    resizeObserver.observe(containerRef.current);

    // CS-style loop
    const IDLE_SPEED = 0.08;
    const IDLE_TIMEOUT = 2200;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let active = true;

    const wake = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
      active = true;
    };
    el.addEventListener('mouseenter', wake);

    const loop = () => {
      const box = containerRef.current;
      if (!box) {
        requestAnimationFrame(loop);
        return;
      }
      const br = box.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = br.bottom > -120 && br.top < vh + 120;

      if (visible && active) {
        Engine.update(engine, 1000 / 60);
        const allIdle = items.every(
          (it) =>
            Math.abs(it.body.velocity.x) < IDLE_SPEED &&
            Math.abs(it.body.velocity.y) < IDLE_SPEED &&
            Math.abs(it.body.angularVelocity) < IDLE_SPEED,
        );
        if (allIdle) {
          if (!idleTimer)
            idleTimer = setTimeout(() => {
              active = false;
              idleTimer = null;
            }, IDLE_TIMEOUT);
        } else {
          if (idleTimer) {
            clearTimeout(idleTimer);
            idleTimer = null;
          }
        }
      }

      if (visible) {
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          it.el.style.transform = `translate(${(it.body.position.x - it.el.offsetWidth / 2).toFixed(1)}px,${(it.body.position.y - it.el.offsetHeight / 2).toFixed(1)}px) rotate(${it.body.angle.toFixed(3)}rad)`;
        }
      }

      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      resizeObserver.disconnect();
      if (idleTimer) clearTimeout(idleTimer);
      el.removeEventListener('mouseenter', wake);
      el.removeEventListener('touchstart', m.mousedown);
      el.removeEventListener('touchmove', m.mousemove);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [effectStarted, text, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${className}`}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        ref={textRef}
        className="falling-text-target"
        style={{
          fontSize: fontSize,
          lineHeight: 1.4,
        }}
      />
      <div ref={canvasContainerRef} className="falling-text-canvas" />
    </div>
  );
};

export default FallingText;
