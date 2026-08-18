'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { useTransitionStore } from '@/store/transitionStore';
import styles from './About.module.css';
import {
  MyCarousel,
  images_1,
  images_2,
  textData_1,
  textData_2,
} from '@/components/MyCarousel/MyCarousel';

export const PC_AboutSection = () => {
  const part2Ref = useRef<HTMLDivElement>(null);
  const [part2Visible, setPart2Visible] = useState(false);
  const title2Ref = useRef<HTMLDivElement>(null);
  const [title2Visible, setTitle2Visible] = useState(false);
  const phase = useTransitionStore((s) => s.phase);
  const [part1Visible, setPart1Visible] = useState(false);

  useEffect(() => {
    if (phase === 'out' || phase === 'idle') {
      setPart1Visible(true);
    }
  }, [phase]);

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

  useEffect(() => {
    const el = title2Ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitle2Visible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-12.5% 0px 0px 0px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className={`${styles.about} relative w-full`}>
      {/* ============================== Part 1: OVERVIEW ============================== */}

      {/* 移动端 // LANSHAN 装饰（终末地 h5Icon） */}
      <div className={`absolute ${styles.h5Icon}`}>
        <span>// LANSHAN</span>
      </div>

      {/* pageTitle + decoLeft */}
      <div
        className={`header_about absolute flex flex-col justify-center ${styles.aboutHeader} ${styles.title1}`}
      >
        <div className={`flex flex-col ${styles.aboutDecoration}`}>
          <div className="flex items-center">
            <div className={`h-[1.25em] w-[4em] ${styles.arrowBox}`}>
              <div className="animationEl entrance-anchor widthGrow pr-1 bg-[#D9D9D9] flex h-full overflow-hidden justify-end items-center">
                <Icon
                  name="arrow"
                  className={`animationEl widthGrowSon1 w-[0.75em] h-[0.75em] ${styles.arrowIcon}`}
                />
              </div>
            </div>
            <span
              className={`animationEl widthGrowSon2 text-[1.25em] font-medium pl-1 ${styles.titleSub}`}
            >
              OVERVIEW
            </span>
          </div>
          <div
            className={`font-bold text-[1.875em] tracking-tight leading-none ${styles.blinkTitle} ${styles.titleText}`}
          >
            工作室概况
          </div>
        </div>
      </div>

      {/* itemIcon */}
      <div
        className={`absolute p-2 bg-[#D9D9D9] flex items-center justify-center ${styles.fadeInUp} ${styles.icon1}`}
      >
        <Icon name="gameplay" className="w-[3.25em] h-auto text-[#A6A6A6]" />
      </div>

      {/* gameplayAlbum = [轮播][蓝条] */}
      <div className={`absolute ${styles.album1}`}>
        <div className={`relative ${styles.carousel1}`}>
          <MyCarousel
            images={images_1}
            textData={textData_1}
            blink
            revealFrom="left"
            shouldEnter={part1Visible}
          />
          {part1Visible && <div className={styles.unifiedMask} />}
        </div>
        <div className={`bg-[#00D4FF] py-[0.75em] pl-[1em] absolute ${styles.bar1}`}>
          <img
            src="/picture/decoration-4.png"
            className="absolute z-10"
            style={{ height: '5.4em', width: 'auto', bottom: '1.4em', left: '1.2em' }}
            alt=""
            loading="lazy"
          />
          <div className="bg-white h-full w-[1em] relative">
            <span className="absolute top-[0.25em] [writing-mode:vertical-rl] -left-[0.25em] text-[2.4em] font-bold tracking-wider">
              OVERVIEW
            </span>
          </div>
        </div>
      </div>

      {/* 移动端黄色竖线 + 白条（背景，图片下方） */}
      <div className={`absolute ${styles.h5DecoLine}`}></div>
      {/* 文字 + 装饰（前景，图片上方） */}
      <span className={`absolute ${styles.h5Text1}`}>OVERVIEW</span>
      <img
        src="/picture/decoration-4.png"
        className={`absolute ${styles.h5Deco1}`}
        alt=""
        loading="lazy"
      />
      <span className={`absolute ${styles.h5Text2}`}>BENEFITS</span>
      <img
        src="/picture/decoration-4.png"
        className={`absolute ${styles.h5Deco2}`}
        alt=""
        loading="lazy"
      />

      {/* ============================== Part 2: BENEFITS ============================== */}

      {/* 移动端 // LANSHAN 装饰（Part2 h5Icon） */}
      <div className={`absolute ${styles.h5Icon2}`}>
        <span>// LANSHAN</span>
      </div>

      {/* gameplayAlbum = [灰条][轮播] */}
      <div ref={part2Ref} className={`absolute ${styles.album2}`}>
        <div
          className={`lg:bg-[#EDEDED] bg-[#00D4FF] py-[0.75em] pl-[1em] absolute ${styles.bar2}`}
        >
          <img
            src="/picture/decoration-4.png"
            className="absolute z-10"
            style={{ height: '5.4em', width: 'auto', bottom: '1.4em', left: '1.2em' }}
            alt=""
            loading="lazy"
          />
          <div className="bg-white h-full w-[1em] relative">
            <span className="absolute top-[0.25em] [writing-mode:vertical-rl] -left-[0.25em] text-[2.4em] font-bold tracking-wider">
              BENEFITS
            </span>
          </div>
        </div>
        <div className={`absolute ${styles.carousel2}`}>
          <MyCarousel
            images={images_2}
            textData={textData_2}
            shouldEnter={part2Visible}
            blink
            revealFrom="right"
          />
          {part2Visible && <div className={styles.unifiedMask2} />}
        </div>
      </div>

      {/* pageTitle + decoLeft — 右侧 */}
      <div
        className={`header_about absolute flex flex-col justify-center ${styles.aboutHeader} ${styles.title2}`}
      >
        <div className={`flex flex-col ${styles.aboutDecoration}`}>
          <div className="flex items-center">
            <div className={`h-[1.25em] w-[4em] ${styles.arrowBox}`}>
              <div className="animationEl entrance-anchor widthGrow pr-1 bg-[#D9D9D9] flex h-full overflow-hidden justify-end items-center">
                <Icon
                  name="arrow"
                  className={`animationEl widthGrowSon1 w-[0.75em] h-[0.75em] ${styles.arrowIcon}`}
                />
              </div>
            </div>
            <span
              className={`animationEl widthGrowSon2 text-[1.25em] font-medium pl-1 ${styles.titleSub}`}
            >
              BENEFITS
            </span>
          </div>
          <div
            ref={title2Ref}
            className={`font-bold text-[1.875em] leading-none tracking-tight ${title2Visible ? styles.blinkTitle : 'opacity-0'} ${styles.titleText}`}
          >
            成员权益
          </div>
        </div>
      </div>

      {/* itemIcon — 右侧 */}
      <div
        className={`absolute p-2 bg-[#D9D9D9] flex items-center justify-center ${part2Visible ? styles.fadeInUp : 'opacity-0'} ${styles.icon2}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 57 47"
          className="w-[3.25em] h-auto text-[#A6A6A6]"
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
