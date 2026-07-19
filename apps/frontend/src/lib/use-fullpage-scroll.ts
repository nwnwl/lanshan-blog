'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useMarqueeStore } from '../components/MarqueeStore';

export const useFullpageScroll = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const secondSectionTopRef = useRef(0);

  /** 更新 secondSection 的偏移值（缓存） */
  const updateSecondSectionTop = useCallback(() => {
    const container = containerRef.current;
    const sections = container?.querySelectorAll('.part');
    if (!container || !sections || sections.length < 2) return;

    const secondSection = sections[1] as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const sectionRect = secondSection.getBoundingClientRect();
    secondSectionTopRef.current = sectionRect.top - containerRect.top + container.scrollTop;
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll('.part');
    if (sections.length < 2) return;

    // 初始化偏移值
    updateSecondSectionTop();

    const scrollToSection = (index: number) => {
      if (isAnimating.current) return;
      if (index < 0 || index >= sections.length) return;

      isAnimating.current = true;
      currentIndex.current = index;

      container.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth',
      });

      // 用 scrollend 精准监听滚动结束
      const onScrollEnd = () => {
        isAnimating.current = false;
        container.removeEventListener('scrollend', onScrollEnd);
      };
      container.addEventListener('scrollend', onScrollEnd);

      // 兜底：防止 scrollend 在部分浏览器不触发
      setTimeout(() => {
        isAnimating.current = false;
        container.removeEventListener('scrollend', onScrollEnd);
      }, 1200);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      // 新增：判断滚动方向并切换字幕方向
      const { isReversed, toggleReverse } = useMarqueeStore.getState();
      if (direction === 1 && !isReversed) {
        toggleReverse(); // 向下滑 -> 反转
      } else if (direction === -1 && isReversed) {
        toggleReverse(); // 向上滑 -> 恢复
      }

      const secondTop = secondSectionTopRef.current;
      const isAtSecondTop = Math.abs(container.scrollTop - secondTop) < 10;
      const isNearSecondTop =
        container.scrollTop > secondTop - 20 && container.scrollTop < secondTop + 20;

      // 向下：Hero → MiddleSection
      if (direction === 1 && currentIndex.current === 0) {
        e.preventDefault();
        scrollToSection(1);
        return;
      }

      // 向上：从 MiddleSection 顶部回到 Hero
      if (direction === -1 && currentIndex.current === 1 && (isAtSecondTop || isNearSecondTop)) {
        e.preventDefault();
        scrollToSection(0);
        return;
      }

      // 其余情况：自由滚动
    };

    const handleScroll = () => {
      // 动态更新偏移（如果内容高度变化）
      updateSecondSectionTop();

      const secondTop = secondSectionTopRef.current;
      if (container.scrollTop >= secondTop - 10) {
        currentIndex.current = 1;
      } else {
        currentIndex.current = 0;
      }
    };

    // 窗口大小变化时重新计算偏移
    const handleResize = () => {
      updateSecondSectionTop();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    container.scrollTop = 0;
    currentIndex.current = 0;

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, updateSecondSectionTop]);
};
