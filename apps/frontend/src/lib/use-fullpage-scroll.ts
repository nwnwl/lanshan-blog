'use client';
import { useEffect, useRef, useCallback } from 'react';

/**
 * 全屏滚动 Hook
 *
 * === 整体思路 ===
 *
 * 页面结构（DOM 顺序）：
 *   [0] PC_HeroSection    — h-screen（一屏高），Hero 首屏
 *   [1] PC_MiddleSection  — 内容自适应高度（可能很长），包含 About / Project / Contact 等子区块
 *   [2] PC_EndSection     — h-[435px] 固定高度，页脚
 *
 * 滚动策略（混合模式）：
 *   - Hero ↔ Middle 之间：**整屏 snap**（一次滚轮 = 跳一整屏）
 *   - Middle 内部：**自由滚动**（用户可以慢慢浏览长内容）
 *   - Middle → End：自然到达页面底部，不需要 snap
 *
 * === 两大核心机制 ===
 *
 * 1. handleWheel（主动拦截）
 *    在用户滚动滚轮时判断是否需要 snap，如果需要则 preventDefault + scrollTo。
 *    - 向下：scrollTop 还在 Hero 区域（< secondTop）→ snap 到 Middle 顶部
 *    - 向上：scrollTop 在 Middle 顶部附近（≤ secondTop + 150px）→ snap 到 Hero 顶部
 *    - 其他情况：不拦截，让浏览器自由滚动
 *
 *    150px 向上 snap 区域的设计原因：
 *    - 浏览器单次滚轮约滚 100px，150px 覆盖约 1.5 次滚轮
 *    - 用户在 Middle 浅层（刚滚下来一点）想回去 → 一滚即回
 *    - 用户在 Middle 深处（远超 150px）→ 自由向上滚，不会误触发 snap
 *
 * 2. handleScroll（被动兜底）
 *    在每次 scroll 事件中检测是否跨过了 Middle 顶部边界。
 *    如果从 >= secondTop 跨到 < secondTop（即从 Middle 滚回了 Hero 区域），
 *    自动 snap 到 Hero 顶部 —— 这是 handleWheel 的"安全网"。
 *
 *    典型场景：用户快速滚轮，浏览器一次滚了 200px+，
 *    handleWheel 没拦住（因为还在 > secondTop + 150px），
 *    但 handleScroll 检测到跨过了 secondTop 边界 → 补救 snap。
 *
 * === 关键边界值 ===
 *
 *   secondTop = Middle 区顶部在容器内的绝对偏移（scrollTop 坐标）
 *   容器 scrollTop = 0         → Hero 顶部
 *   容器 scrollTop = secondTop  → Middle 顶部（≈ window.innerHeight）
 *
 *   currentIndex: 0 = 当前在 Hero 区, 1 = 当前在 Middle/End 区
 */

const SNAP_UP_ZONE = 150; // 向上 snap 的触发区域（px），从 secondTop 往下算
const SCROLL_END_FALLBACK = 1000; // scrollend 事件兜底超时（ms）

export const useFullpageScroll = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const secondSectionTopRef = useRef(0);
  const prevScrollTopRef = useRef(0);

  /** 获取指定索引 section 的实际 scrollTop 偏移 */
  const getSectionTop = useCallback(
    (index: number): number => {
      const container = containerRef.current;
      const sections = container?.querySelectorAll('.part');
      if (!container || !sections || index >= sections.length) return 0;
      if (index === 0) return 0;

      const section = sections[index] as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      return sectionRect.top - containerRect.top + container.scrollTop;
    },
    [containerRef],
  );

  /** 更新 secondSection 的偏移值（缓存） */
  const updateSecondSectionTop = useCallback(() => {
    secondSectionTopRef.current = getSectionTop(1);
  }, [getSectionTop]);

  /** 滚动到指定 section */
  const scrollToSection = useCallback(
    (index: number) => {
      const container = containerRef.current;
      const sections = container?.querySelectorAll('.part');
      if (!container || !sections) return;
      if (isAnimating.current) return;
      if (index < 0 || index >= sections.length) return;

      isAnimating.current = true;
      currentIndex.current = index;

      const targetTop = getSectionTop(index);

      container.scrollTo({
        top: targetTop,
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
      }, SCROLL_END_FALLBACK);
    },
    [containerRef, getSectionTop],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll('.part');
    if (sections.length < 2) return;

    // 初始化
    updateSecondSectionTop();
    prevScrollTopRef.current = container.scrollTop;

    // ====== handleWheel：主动拦截 ======
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const secondTop = secondSectionTopRef.current;
      const scrollTop = container.scrollTop;

      // 向下：Hero → Middle
      if (direction === 1 && scrollTop < secondTop - 2) {
        e.preventDefault();
        scrollToSection(1);
        return;
      }

      // 向上：Middle 浅层 → Hero（SNAP_UP_ZONE 范围内触发 snap）
      if (direction === -1 && scrollTop > 0 && scrollTop <= secondTop + SNAP_UP_ZONE) {
        e.preventDefault();
        scrollToSection(0);
        return;
      }

      // 其余：不拦截，自由滚动
    };

    // ====== handleScroll：被动兜底 ======
    const handleScroll = () => {
      // 动画进行中不干预（避免与 scrollTo 冲突）
      if (isAnimating.current) return;

      // 动态更新偏移（以防内容高度变化）
      updateSecondSectionTop();

      const secondTop = secondSectionTopRef.current;
      const scrollTop = container.scrollTop;
      const prevTop = prevScrollTopRef.current;

      // 更新当前 section 索引
      if (scrollTop >= secondTop - 2) {
        currentIndex.current = 1;
      } else {
        currentIndex.current = 0;
      }

      // 兜底检测：如果从 Middle 区域（>= secondTop）跨回 Hero 区域（< secondTop）
      // 说明用户在自由滚动中跨过了边界 → snap 到 Hero 顶部
      if (prevTop >= secondTop && scrollTop < secondTop) {
        // 使用 rAF 避免在 scroll 事件中直接 scrollTo 导致的抖动
        requestAnimationFrame(() => {
          scrollToSection(0);
        });
      }

      prevScrollTopRef.current = scrollTop;
    };

    // ====== handleResize：窗口变化时修正 ======
    const handleResize = () => {
      updateSecondSectionTop();

      // 如果当前在 Middle 区域但 secondTop 变了，保持视觉位置
      const secondTop = secondSectionTopRef.current;
      if (currentIndex.current === 1 && container.scrollTop < secondTop - 10) {
        // resize 后可能错位，修正到 Middle 顶部
        container.scrollTo({ top: secondTop, behavior: 'instant' as ScrollBehavior });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // 初始状态：确保从顶部开始
    container.scrollTop = 0;
    currentIndex.current = 0;

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, updateSecondSectionTop, scrollToSection, getSectionTop]);
};
