'use client';
import { PC_AboutSection } from './About/About';
import { PC_GraduationSection } from './Graduation/Graduation';
import { PC_ProjectSection } from './Project/Project';
import { PC_OrganizationSection } from './Organization/Organization';
import { PC_ContactSection } from './Contact/Contact';
import { Siderbar } from '@/components/Siderbar';
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
            entry.target.classList.add('play');
            blinkObserver.unobserve(entry.target);
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
        <div className="sticky top-0 h-screen w-[3.6rem] z-50">
          <Siderbar />
        </div>

        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ timelineScope: '--org-appears' } as React.CSSProperties}
        >
          <PC_AboutSection />
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
