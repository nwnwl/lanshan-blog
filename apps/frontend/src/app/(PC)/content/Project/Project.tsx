'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import ProjectRow from './components/ProjectRow';
import gsap from 'gsap';
import styles from './ProjectSection.module.css';

interface ProjectData {
  id: string;
  title: string;
  subTitle: string;
  imageUrl: string;
}

const projects: ProjectData[] = [
  {
    id: '01',
    title: 'We CQUPT',
    subTitle: 'We 重邮小程序',
    imageUrl: '/picture/project-1.webp',
  },
  {
    id: '02',
    title: 'AI Form-Filling Agent',
    subTitle: 'AI填表智能体',
    imageUrl: '/picture/project-2.webp',
  },
  {
    id: '03',
    title: 'Campus AI Assistant',
    subTitle: '校园AI助理',
    imageUrl: '/picture/project-3.webp',
  },
  {
    id: '04',
    title: 'CQEITC',
    subTitle: '重庆数字教育治理运行中心',
    imageUrl: '/picture/project-4.webp',
  },
];

export const PC_ProjectSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const currentIndexRef = useRef<number | null>(null);
  const [cardEnabled, setCardEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCardEnabled(navigator.maxTouchPoints <= 0);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Switch card image with GSAP rotation/scale entrance
  const changePhoto = useCallback((index: number) => {
    const imgs = imgRefs.current;
    if (!imgs.length) return;
    if (currentIndexRef.current === index) return;
    currentIndexRef.current = index;

    imgs.forEach((img, i) => {
      if (!img) return;
      // 先杀掉该图进行中的 tween，否则「隐藏」会被仍在跑的入场动画覆盖回去
      gsap.killTweensOf(img);
      if (i === index) {
        gsap.fromTo(
          img,
          { rotate: '30deg', scale: 1.3, opacity: 1 },
          { rotate: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power4.out' },
        );
      } else {
        gsap.set(img, { opacity: 0 });
      }
    });
  }, []);

  // Mobile (≤1024px): reveal card at tap position, auto-hide after 0.5s
  const handleCardClick = useCallback(
    (index: number, e: ReactMouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      gsap.killTweensOf(card);
      gsap.set(card, { x: e.clientX, y: e.clientY });
      changePhoto(index);
      gsap.to(card, { scale: 1, rotate: '-15deg', duration: 0.5, ease: 'power4.out' });
      setActiveIndex(index);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        gsap.to(card, { scale: 0, rotate: '30deg', duration: 0.5, ease: 'power4.out' });
        setActiveIndex(null);
      }, 500);
    },
    [changePhoto],
  );

  // Container-level delegated card events via GSAP
  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card || !cardEnabled || isMobile) return;

    const onEnter = (e: MouseEvent) => {
      gsap
        .timeline()
        .set(card, { x: e.clientX, y: e.clientY })
        .to(card, { scale: 1, rotate: '-15deg', duration: 0.5, ease: 'power4.out' });
    };

    const onMove = (e: MouseEvent) => {
      gsap.to(card, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
    };

    const onLeave = () => {
      gsap.to(card, { scale: 0, rotate: '30deg', duration: 0.5, ease: 'power4.out' });
    };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [cardEnabled, isMobile]);

  return (
    <section id="project" className="w-full px-12 mt-30 mb-30 relative bg-white text-black">
      <div ref={containerRef} className="relative z-1 w-full flex flex-col">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            id={project.id}
            title={project.title}
            subTitle={project.subTitle}
            borderT={index === 0}
            active={activeIndex === index}
            onHover={() => cardEnabled && !isMobile && changePhoto(index)}
            onClick={(e) => isMobile && handleCardClick(index, e)}
          />
        ))}
      </div>

      {/* Floating card — GSAP-controlled, hidden by default via CSS scale(0) rotate(30deg) */}
      <div ref={cardRef} className={styles.card}>
        {projects.map((project, index) => (
          <img
            key={project.id}
            ref={(el) => {
              imgRefs.current[index] = el;
            }}
            src={project.imageUrl}
            alt={project.title}
            loading="eager"
            decoding="async"
          />
        ))}
      </div>
    </section>
  );
};
