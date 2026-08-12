'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import styles from './About.module.css';
import {
  MyCarousel,
  images_1,
  images_2,
  textData_1,
  textData_2,
} from '@/components/MyCarousel/MyCarousel';

export const PC_AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const part2Ref = useRef<HTMLDivElement>(null);
  const [part2Visible, setPart2Visible] = useState(false);

  // useLayoutEffect 在首次绘制前执行，避免打断 CSS 入场动画
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const apply = () => {
      el.style.fontSize = window.innerWidth / 95 + 'px';
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  useEffect(() => {
    const el = part2Ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPart2Visible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-12.5% 0px 0px 0px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full"
      style={{ height: '78em', marginTop: '2.5em', marginBottom: '11.5em' }}
    >
      {/* ============================== Part 1: OVERVIEW ============================== */}

      {/* pageTitle + decoLeft */}
      <div
        className={`header_about absolute flex flex-col justify-center ${styles.aboutHeader}`}
        style={{ top: '0.5em', left: 'calc(50% - 37em)' }}
      >
        <div className={`flex flex-col ${styles.aboutDecoration}`}>
          <div className="flex items-center">
            <div className="h-4 w-16 md:h-5 md:w-[4rem]">
              <div className="animationEl entrance-anchor widthGrow pr-1 bg-[#D9D9D9] flex h-full overflow-hidden justify-end items-center">
                <Icon name="arrow" className="animationEl widthGrowSon1 md:w-3 md:h-3 w-2 h-2" />
              </div>
            </div>
            <span className="animationEl widthGrowSon2 lg:text-xl md:text-[1.4rem] text-sm font-medium pl-1">
              OVERVIEW
            </span>
          </div>
          <div className="font-bold 2xl:text-[30px] xl:text-2xl lg:text-xl md:text-[1.8rem] tracking-tight">
            工作室概况
          </div>
        </div>
      </div>

      {/* itemIcon */}
      <div
        className={`absolute p-2 bg-[#D9D9D9] flex items-center justify-center ${styles.fadeInUp}`}
        style={{ top: '25em', left: 'calc(50% - 37em)', width: '5.25em', height: '5.25em' }}
      >
        <Icon
          name="gameplay"
          className="__05-Gameplay_icon__Yiqki w-[3.25em] h-auto text-[#A6A6A6]"
        />
      </div>

      {/* gameplayAlbum = [轮播][蓝条] */}
      <div className="absolute" style={{ top: '0em', left: 'calc(50% - 21em)' }}>
        <div className="relative">
          <MyCarousel images={images_1} textData={textData_1} blink />
          <div className={styles.unifiedMask} />
        </div>
        <div
          className="bg-[#00D4FF] py-3 pl-4"
          style={{
            position: 'absolute',
            left: 'calc(51.25em - 1px)',
            top: '0',
            width: '10.5em',
            height: '30em',
          }}
        >
          <img
            src="/picture/decoration-4.png"
            className="absolute z-10"
            style={{ height: '5.4em', width: 'auto', bottom: '1.4em', left: '1.2em' }}
            alt=""
          />
          <div className="bg-white h-full w-4 relative">
            <span className="absolute top-1 [writing-mode:vertical-rl] -left-2 text-[2.4em] font-bold tracking-wider">
              OVERVIEW
            </span>
          </div>
        </div>
      </div>

      {/* 移动端 */}
      <div className="lg:hidden absolute" style={{ top: '33em', left: 'calc(50% + 30em)' }}>
        <span className="text-[6rem] font-[1000] tracking-tighter">// LANSHAN</span>
      </div>

      {/* ============================== Part 2: BENEFITS ============================== */}

      {/* gameplayAlbum = [灰条][轮播] */}
      <div ref={part2Ref} className="absolute" style={{ top: '43em', left: 'calc(50% - 37em)' }}>
        <div
          className="lg:bg-[#EDEDED] bg-[#00D4FF] py-3 pl-4"
          style={{ position: 'absolute', left: '0', top: '0', width: '10.5em', height: '30em' }}
        >
          <img
            src="/picture/decoration-4.png"
            className="absolute z-10"
            style={{ height: '5.4em', width: 'auto', bottom: '1.4em', left: '1.2em' }}
            alt=""
          />
          <div className="bg-white h-full w-4 relative">
            <span className="absolute top-1 [writing-mode:vertical-rl] -left-2 text-[2.4em] font-bold tracking-wider">
              BENEFITS
            </span>
          </div>
        </div>
        <div className="relative" style={{ position: 'absolute', left: '10.5em', top: '0' }}>
          <MyCarousel images={images_2} textData={textData_2} shouldEnter={part2Visible} blink />
          {part2Visible && <div className={styles.unifiedMask2} />}
        </div>
      </div>

      {/* pageTitle + decoLeft — 右侧 */}
      <div
        className={`header_about absolute flex flex-col justify-center ${styles.aboutHeader}`}
        style={{ top: '43em', left: 'calc(50% + 27em)' }}
      >
        <div className={`flex flex-col ${styles.aboutDecoration}`}>
          <div className="flex items-center">
            <div className="h-4 w-16 md:h-5 md:w-[4rem]">
              <div className="animationEl entrance-anchor widthGrow pr-1 bg-[#D9D9D9] flex h-full overflow-hidden justify-end items-center">
                <Icon name="arrow" className="animationEl widthGrowSon1 md:w-3 md:h-3 w-2 h-2" />
              </div>
            </div>
            <span className="animationEl widthGrowSon2 lg:text-xl md:text-[1.4rem] text-sm font-medium pl-1">
              BENEFITS
            </span>
          </div>
          <div className="font-bold 2xl:text-[30px] xl:text-2xl lg:text-xl md:text-[1.8rem] tracking-tight">
            成员权益
          </div>
        </div>
      </div>

      {/* itemIcon — 右侧 */}
      <div
        className={`absolute p-2 bg-[#D9D9D9] flex items-center justify-center ${part2Visible ? styles.fadeInUp : 'opacity-0'}`}
        style={{ top: '67.75em', left: 'calc(50% + 27em)', width: '5.25em', height: '5.25em' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 57 47"
          className="__08-AIC_icon__lIZuJ w-[3.25em] h-auto text-[#A6A6A6]"
        >
          <path
            fillRule="evenodd"
            fill="currentColor"
            d="M27.127,12.817 C21.471,12.817 16.885,17.503 16.885,23.282 C16.885,29.065 21.471,33.751 27.127,33.751 C27.557,33.751 27.981,33.721 28.397,33.668 L28.397,46.516 L14.001,46.516 L0.876,23.282 L14.001,0.052 L40.253,0.052 L50.379,17.969 L35.953,17.969 C34.170,14.886 30.886,12.817 27.127,12.817 ZM40.479,26.382 L36.055,21.862 L46.634,21.862 L46.631,30.607 L46.631,31.722 L56.119,41.418 L50.711,46.944 L41.223,37.249 L31.572,37.249 L31.572,26.443 L35.995,30.963 L40.479,26.382 Z"
          />
        </svg>
      </div>
    </section>
  );
};
