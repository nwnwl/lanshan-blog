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
import { useEffect } from 'react';
import './content.css';

const text_1 = ' // BEYOND LANSHAN · YOUR POTENTIAL AWAITS';
const text_2 = '\\\\ UI DESIGN \\\\PRODUCT  \\\\OPERATION \\\\SECURITY  \\\\FRONTEND  \\\\BACKEND';

export default function ContentPage() {
  const setReversed = useMarqueeStore((state) => state.setReversed);

  useEffect(() => {
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
        root: document.querySelector('.contain') || null,
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
  });

  useEffect(() => {
    const container = document.querySelector('.contain') as HTMLElement | null;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const next = e.deltaY > 0;
      if (useMarqueeStore.getState().isReversed !== next) {
        setReversed(next);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [setReversed]);

  return (
    <div className="contain flex h-screen w-full flex-col overflow-y-auto">
      <div className="flex w-full ">
        <div
          className="hide-nav-desktop fixed top-0 w-screen h-[6rem] z-50

        "
        >
          <SiderbarMB />
        </div>
        <div className="hide-nav-mobile sticky top-0 left-0 h-screen w-[4rem] z-50">
          <SiderbarPC />
        </div>

        <div
          className="flex-1 flex flex-col overflow-hidden z-40"
          style={{ timelineScope: '--org-appears' } as React.CSSProperties}
        >
          <PC_AboutSection />
          <div className="h-20" />
          <PC_GraduationSection />
          <div className="my-6">
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
