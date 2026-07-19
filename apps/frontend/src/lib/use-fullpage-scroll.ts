'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useMarqueeStore } from '../components/MarqueeStore';

/**
 * 全屏滚动 Hook
 *
 * ====== 页面结构 ======
 *
 *   container (h-screen, overflow-y-auto, flex-col)
 *   ├── [0] HeroSection    h-screen   Hero 首屏
 *   ├── [1] MiddleSection  自适应高度  5 个子 section 各 h-screen
 *   └── [2] EndSection     h-[435px]  页脚
 *
 *   secondTop = MiddleSection 顶部在容器内的 scrollTop 偏移（≈ window.innerHeight）
 *
 * ====== 滚动策略 ======
 *
 *   Hero ↔ Middle 之间：整屏 snap（一次滚轮 = 跳一整屏）
 *   Middle 内部：完全自由滚动（浏览 About / Project / Contact 等内容）
 *   Middle → End：自然到达页面底部
 *
 * ====== 核心设计：justLeftHero 状态机 ======
 *
 *   整个系统只有一个状态位 —— justLeftHero —— 追踪用户是否"刚离开 Hero"
 *
 *            snap 到 Middle 时设为 true
 *   ┌──────────┐               ┌──────────────────┐
 *   │  Hero    │ ───────────→  │  justLeftHero    │
 *   │  区域    │ ←───────────  │  = true          │
 *   │          │  向上 snap    │  刚离开，可回     │
 *   └──────────┘               └────────┬─────────┘
 *                                       │
 *                          用户往下滚 > SNAP_ZONE（handleScroll 检测）
 *                          意味：用户想浏览 Middle 内容
 *                                       │
 *                                       ▼
 *                               ┌──────────────────┐
 *                               │  justLeftHero    │
 *                               │  = false         │
 *                               │  浏览模式        │
 *                               │  全部自由滚动    │
 *                               └────────┬─────────┘
 *                                       │
 *                           自由滚动中跨过 secondTop 边界
 *                           （从 Middle 滚回了 Hero 区域）
 *                                       │
 *                                       ▼
 *                               ┌──────────────────┐
 *                               │  兜底 snap       │
 *                               │  scrollTo(0)     │
 *                               └──────────────────┘
 *
 *   为什么这解决了之前所有问题：
 *   - 之前用 scrollTop 裸值判断 → smooth scroll 落地偏差导致 scrollTop 比 secondTop
 *     小几 px → "往下一格往上一格就跳回 Hero"
 *   - justLeftHero 不依赖像素精度：只要用户往下滚过（哪怕 1px），立刻退出 snap 模式
 *   - 向上 snap 只在"刚离开 Hero + 还没往下滚过 + 在 snap 区间内"时触发
 *
 * ====== 三大机制 ======
 *
 * 1. handleWheel（主动拦截，唯二的 snap 入口）
 *    - 向下 + scrollTop 在 Hero 区域 → snap 到 Middle，justLeftHero = true
 *    - 向上 + justLeftHero + 在 snap 区间内 → snap 回 Hero
 *    - 动画中 → preventDefault 吃掉所有滚轮事件
 *    - 其余 → 放行，浏览器自由滚动
 *
 * 2. handleScroll（状态维护 + 边界兜底）
 *    - st > s2 + 2：用户往下滚了 → justLeftHero = false，进入浏览模式
 *    - st < s2 - 10：回到 Hero 区域 → 重置状态
 *    - prev>=s2 && st<s2：自由滚动中跨过边界 → 兜底 snap 到 Hero 顶部
 *    - 动画进行中只更新 prevScrollTopRef，不干预滚动
 *
 * 3. scrollToSection（rAF 自定义动画，600ms easeOutCubic）
 *    - 不用浏览器 scroll-behavior: smooth（兼容性差、PixiJS 同主线程抢帧会卡顿）
 *    - 不用 IntersectionObserver（root: container 在各浏览器行为不一致）
 *    - 直接用 container.scrollTop 逐帧写值，完全掌控动画曲线
 *    - easeOutCubic: 1-(1-t)³ → 起步快收尾柔，体感干脆
 *    - 动画期间 isAnimating = true，handleWheel 会 preventDefault 阻止原生滚动
 */

const SNAP_ZONE = 50; // 向上 snap 区间（安全兜底）：Middle 顶部下方多少 px 内仍算"刚离开"

export const useFullpageScroll = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const isAnimating = useRef(false); // 动画锁，防止重入 + 阻止原生滚动
  const justLeftHero = useRef(false); // 唯一状态位，true = 刚离开 Hero 可 snap 回去
  const secondTopRef = useRef(0); // MiddleSection 顶部在容器内的 scrollTop 偏移
  const prevScrollTopRef = useRef(0); // 上一次 scrollTop，用于边界跨越检测

  /** 获取 section[index] 在容器内的 scrollTop 偏移（index=0 直接返回 0） */
  const getSectionTop = useCallback(
    (index: number): number => {
      const container = containerRef.current;
      if (!container) return 0;
      if (index === 0) return 0;
      const sections = container.querySelectorAll('.part');
      if (index >= sections.length) return 0;
      const s = sections[index] as HTMLElement;
      const cr = container.getBoundingClientRect();
      const sr = s.getBoundingClientRect();
      return sr.top - cr.top + container.scrollTop;
    },
    [containerRef],
  );

  const updateSecondTop = useCallback(() => {
    secondTopRef.current = getSectionTop(1);
  }, [getSectionTop]);

  /** rAF 自定义滚动动画：600ms easeOutCubic */
  const scrollToSection = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || isAnimating.current) return;
      const sections = container.querySelectorAll('.part');
      if (index < 0 || index >= sections.length) return;

      isAnimating.current = true;

      const startTop = container.scrollTop;
      const endTop = getSectionTop(index);
      const distance = endTop - startTop;

      // 已在目标位置，无需动画
      if (Math.abs(distance) < 1) {
        container.scrollTop = endTop;
        isAnimating.current = false;
        return;
      }

      const duration = 600;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        // easeOutCubic: f(t) = 1 - (1-t)³，起步快收尾柔
        const eased = 1 - (1 - t) * (1 - t) * (1 - t);
        container.scrollTop = startTop + distance * eased;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          container.scrollTop = endTop; // 精确落点
          isAnimating.current = false;
        }
      };

      requestAnimationFrame(animate);
    },
    [containerRef, getSectionTop],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.querySelectorAll('.part').length < 2) return;

    updateSecondTop();
    prevScrollTopRef.current = container.scrollTop;

    // ====== handleWheel：主动拦截，唯二的 snap 入口 ======
    const handleWheel = (e: WheelEvent) => {
      // 动画进行中：阻止浏览器原生滚动，避免与 self-animation 冲突
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;

      // 字幕方向切换
      const { isReversed, toggleReverse } = useMarqueeStore.getState();
      if (dir === 1 && !isReversed) {
        toggleReverse(); // 向下滑 -> 反转
      } else if (dir === -1 && isReversed) {
        toggleReverse(); // 向上滑 -> 恢复
      }

      const st = container.scrollTop;
      const s2 = secondTopRef.current;

      // 向下 snap：仅在 Hero 区域时触发（st 明显小于 secondTop）
      if (dir === 1 && st < s2 - 2) {
        e.preventDefault();
        justLeftHero.current = true; // 进入"刚离开 Hero"状态
        scrollToSection(1);
        return;
      }

      // 向上 snap：刚离开 Hero + 未往下探索 + 在 snap 区间内
      if (dir === -1 && justLeftHero.current && st <= s2 + SNAP_ZONE && st > 0) {
        e.preventDefault();
        justLeftHero.current = false;
        scrollToSection(0);
        return;
      }

      // 其余：放行，浏览器自由滚动
    };

    // ====== handleScroll：状态维护 + 边界兜底 ======
    const handleScroll = () => {
      const s2 = secondTopRef.current;
      const st = container.scrollTop;
      const prev = prevScrollTopRef.current;

      // 始终更新 prevScrollTopRef，动画结束后也不会有过期值
      prevScrollTopRef.current = st;

      // 动画进行中只更新 prevScrollTopRef，不干预滚动
      if (isAnimating.current) return;

      updateSecondTop();

      // 用户往下滚了（哪怕 > s2+2）→ 退出"刚离开"状态，进入浏览模式
      if (justLeftHero.current && st > s2 + 2) {
        justLeftHero.current = false;
      }

      // 已经回到 Hero 区域 → 重置状态
      if (st < s2 - 10) {
        justLeftHero.current = false;
      }

      // 边界兜底：自由滚动中从 Middle（≥s2）跨回 Hero（<s2）→ snap 到顶部
      // 典型场景：用户在 Middle 深处往上连续滚，跨过 secondTop 边界
      if (prev >= s2 && st < s2) {
        justLeftHero.current = false;
        scrollToSection(0);
      }
    };

    // resize 时只需更新 secondTop 偏移
    const handleResize = () => {
      updateSecondTop();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    container.scrollTop = 0;

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, updateSecondTop, scrollToSection]);
};
