'use client';
import { useEffect, useRef, useState } from 'react';
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
  const part2Ref = useRef<HTMLDivElement>(null);
  const [part2Visible, setPart2Visible] = useState(false);

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
      {
        rootMargin: '-12.5% 0px 0px 0px',
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="min-h-0 w-full flex flex-col  3xl:gap-12 2xl:gap-16 lg:gap-20 mb-20"
    >
      {/* 第一部分 */}
      <div
        className="w-full min-h-0 flex
       3xl:ml-30
       xl:ml-22 lg:ml-18
       mt-12 pb-40"
      >
        {/* 左侧 */}
        <div
          className={`header_about flex flex-col justify-between
          ${styles.aboutHeader}`}
        >
          {/* header部分 */}
          <div
            className={`flex flex-col
            ${styles.aboutDecoration}`}
          >
            {/* OVERVIEW 遮罩行：由白色遮罩揭示，不淡入 */}
            <div className={`relative overflow-hidden w-fit ${styles.maskWrapper}`}>
              <div className={styles.whiteMask} />
              <div className="flex items-center">
                <div
                  className="flex 
                md:w-14
                h-4 w-10  
                 bg-[#D9D9D9] justify-end items-center pr-0.5
                 2xl:pr-1
                 xl:pb-0 lg:pb-0.5"
                >
                  <Icon
                    name="arrow"
                    className="SectionTitle_arrow__qXHl 
                  w-3 h-3
                  "
                  />
                </div>
                <span className="lg:text-base text-xs font-medium pl-1">OVERVIEW</span>
              </div>
            </div>
            <div
              className={`font-bold 2xl:text-[30px] xl:text-2xl lg:text-xl tracking-tight -mt-1 ${styles.blinkTitle}`}
            >
              工作室概况
            </div>
          </div>

          {/* 左侧装饰 */}
          <div className={`p-2 bg-[#D9D9D9] w-fit ${styles.fadeInUp}`}>
            <Icon
              name="gameplay"
              className="__05-Gameplay_icon__Yiqki
              2xl:w-16 2xl:h-16
              xl:w-15 xl:h-15
              lg:w-14 lg:h-14
              h-10 w-10 
              p-0.5"
            />
          </div>
        </div>

        {/* 右侧 */}
        <div
          className="xl:pl-21 lg:pl-14
         flex"
        >
          {/* 右侧图片 */}
          <div className="relative">
            <MyCarousel images={images_1} textData={textData_1} blink />
            {/* 统一遮罩：覆盖图片右侧 1/4 + 蓝色条 */}
            <div className={styles.unifiedMask} />
          </div>
          {/* 蓝色装饰 */}
          <div
            className={`bg-[#00D4FF] 
            3xl:w-[189.573px] 2xl:w-[182.635px] xl:w-[152.469px] lg:w-[121.833px]
            py-3 pl-4 ${styles.aboutRight}`}
          >
            <div className="bg-white h-full w-4 relative">
              <span className="absolute top-1 [writing-mode:vertical-rl] xl:text-4xl lg:text-3xl text-2xl font-semibold tracking-wider">
                OVERVIEW
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 第二部分 */}
      <div
        ref={part2Ref}
        className="w-full min-h-0 flex
      3xl:ml-30
      xl:ml-22 lg:ml-18
      pb-40"
      >
        {/* 左侧 */}
        <div
          className="lg:pr-10
         flex relative"
        >
          {/* 灰色装饰 */}
          <div
            className={`bg-[#EDEDED]
             3xl:w-[189.573px] 2xl:w-[182.635px] xl:w-[152.469px] lg:w-[121.833px]
            py-3 pl-4 ${styles.aboutRight}`}
          >
            <div className="bg-white h-full w-4 relative">
              <span className="absolute top-1 [writing-mode:vertical-rl]  xl:text-4xl lg:text-3xl text-2xl font-semibold tracking-wider">
                BENEFITS
              </span>
            </div>
          </div>
          {/* 左侧图片 */}
          <div className="relative">
            <MyCarousel images={images_2} textData={textData_2} shouldEnter={part2Visible} blink />
          </div>
          {/* 统一遮罩：覆盖灰色条 + 整张图片 */}
          {part2Visible && <div className={styles.unifiedMask2} />}
        </div>

        {/* 右侧 */}
        <div
          className={`header_about flex flex-col justify-between
          ${styles.aboutHeader}`}
        >
          {/* header部分 */}
          <div
            className={`flex flex-col justify-center
            ${styles.aboutDecoration}`}
          >
            {/* BENEFITS 遮罩行 */}
            <div className={`relative overflow-hidden w-fit ${styles.maskWrapper}`}>
              {part2Visible && <div className={styles.whiteMask} />}
              <div className="flex items-center">
                <div
                  className="flex 
                md:w-14
                h-4 w-10  
                 bg-[#D9D9D9] justify-end items-center pr-0.5
                 2xl:pr-1
                 xl:pb-0 lg:pb-0.5"
                >
                  <Icon
                    name="arrow"
                    className="SectionTitle_arrow__qXHl 
                  w-3 h-3
                  "
                  />
                </div>
                <span className="lg:text-base text-xs font-medium pl-1">BENEFITS</span>
              </div>
            </div>
            <div
              className={`font-bold xl:text-2xl lg:text-xl tracking-tight -mt-1 ${part2Visible ? styles.blinkTitle : 'opacity-0'}`}
            >
              成员权益
            </div>
          </div>

          {/* 右侧装饰 */}
          <div className={`p-2 bg-[#D9D9D9] w-fit ${part2Visible ? styles.fadeInUp : 'opacity-0'}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 57 47"
              className="__08-AIC_icon__lIZuJ
              xl:w-15 xl:h-15
              lg:w-14 lg:h-14 
              h-10 w-10
              text-[#A6A6A6]
              3xl:p-1.5 p-1"
            >
              <path
                fillRule="evenodd"
                fill="currentColor"
                d="M27.127,12.817 C21.471,12.817 16.885,17.503 16.885,23.282 C16.885,29.065 21.471,33.751 27.127,33.751 C27.557,33.751 27.981,33.721 28.397,33.668 L28.397,46.516 L14.001,46.516 L0.876,23.282 L14.001,0.052 L40.253,0.052 L50.379,17.969 L35.953,17.969 C34.170,14.886 30.886,12.817 27.127,12.817 ZM40.479,26.382 L36.055,21.862 L46.634,21.862 L46.631,30.607 L46.631,31.722 L56.119,41.418 L50.711,46.944 L41.223,37.249 L31.572,37.249 L31.572,26.443 L35.995,30.963 L40.479,26.382 Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
