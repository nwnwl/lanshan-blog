'use client';
import { PC_AboutSection } from './About/About';
import { PC_GraduationSection } from './Graduation/Graduation';
import { PC_ProjectSection } from './Project/Project';
import { PC_OrganizationSection } from './Organization/Organization';
import { PC_ContactSection } from './Contact/Contact';
import { SiderbarPC } from '@/components/SiderbarPC';
import { SiderbarMB } from '@/components/SiderbarMB';
import { PC_EndSection } from './End';
import { Marquee } from '@/components/Marquee';
import { useMarqueeStore } from '@/lib/MarqueeStore';
import { useTransitionStore } from '@/store/transitionStore';
import { useEffect } from 'react';
import './content.css';

const text_1 = ' // BEYOND LANSHAN · YOUR POTENTIAL AWAITS';
const text_2 = '\\\\ UI DESIGN \\\\PRODUCT  \\\\OPERATION \\\\SECURITY  \\\\FRONTEND  \\\\BACKEND';

export default function ContentPage() {
  const setReversed = useMarqueeStore((state) => state.setReversed);
  const phase = useTransitionStore((state) => state.phase);

  useEffect(() => {
    // 路由跳转遮罩切入期间（phase 'in'）不观察，等遮罩切出后再触发入场动画
    if (phase === 'in') return;
    let blinkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // entrance-anchor 是区块入场锚点：一旦进入视野，整个 section 内所有 .animationEl 一起入场
            if (entry.target.classList.contains('entrance-anchor')) {
              const section = entry.target.closest('section');
              if (section) {
                section.querySelectorAll('.animationEl').forEach((el) => {
                  el.classList.add('play');
                  blinkObserver.unobserve(el);
                });
              }
            } else {
              entry.target.classList.add('play');
              blinkObserver.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0,
      },
    );
    document.querySelectorAll('.animationEl').forEach((el) => {
      blinkObserver.observe(el);
    });
    return () => {
      blinkObserver.disconnect();
    };
  }, [phase]);

  useEffect(() => {
    const applyDirection = (deltaY: number) => {
      if (deltaY === 0) return;
      const next = deltaY > 0; // 向下滚动 → 反转
      if (useMarqueeStore.getState().isReversed !== next) {
        setReversed(next);
      }
    };

    const handleWheel = (e: WheelEvent) => applyDirection(e.deltaY);

    let lastTouchY: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? null;
      if (lastTouchY === null || y === null) return;
      applyDirection(lastTouchY - y); // 手指上滑(内容下移) → deltaY > 0
      lastTouchY = y;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [setReversed]);

  return (
    <div className="contain flex min-h-screen w-full flex-col">
      <div className="flex w-full ">
        <div className="hide-nav-desktop fixed top-0 w-screen h-[6rem] z-50">
          <SiderbarMB />
        </div>
        <div className="hide-nav-mobile sticky top-0 left-0 h-screen w-[4rem] z-50">
          <SiderbarPC />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden z-40">
          <PC_AboutSection />
          <PC_GraduationSection />
          <div className="my-6 lg:mt-18">
            <Marquee text={text_1} bgColor={'bg-white'} textColor={'text-black'} direction="left" />
            <Marquee
              text={text_2}
              bgColor={'bg-white'}
              textColor={'text-black'}
              direction="right"
            />
          </div>
          <PC_ProjectSection />
          <PC_OrganizationSection />
          <PC_ContactSection />
        </div>
      </div>

      <PC_EndSection />
    </div>
  );
}
