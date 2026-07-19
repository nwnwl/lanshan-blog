import { useEffect, useRef } from 'react';
import styles from './ProjectSection.module.css';

export const PC_ProjectSection = () => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.querySelector('.contain') as HTMLElement;
    const project = document.getElementById('project');
    if (!container || !project) return;

    const handleScroll = () => {
      const sectionTop = project.offsetTop;
      const sectionHeight = project.offsetHeight;
      const scrollTop = container.scrollTop;

      // 计算 section 的退出进度：0（刚进入视口顶部）~ 1（完全滚走）
      const progress = Math.max(0, Math.min(1, (scrollTop - sectionTop) / sectionHeight));

      if (overlayRef.current) {
        const opacity = Math.min(1, progress * 2);
        overlayRef.current.style.opacity = String(opacity);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="project"
      className="h-screen w-full flex flex-col items-center justify-center bg-white text-black relative"
    >
      {/* 遮罩层：用 ref 直接控制 opacity */}
      <div ref={overlayRef} className={styles.darkOverlay} />
      <span>PC_PROJECT</span>
    </section>
  );
};
