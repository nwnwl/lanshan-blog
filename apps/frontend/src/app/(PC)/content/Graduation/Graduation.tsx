'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import styles from './GraduationSection.module.css';
import { CohortCarousel } from './components/CohortCarousel';
import { COHORTS } from './data/destinations';

const SWITCH_MS = 700; // 与表格 transform 过渡时长一致（duration-700, ease-out）
const SWITCH_FALLBACK_MS = SWITCH_MS + 250; // 兜底：万一 transitionend 没触发也保证解锁

export const PC_GraduationSection = () => {
  const [current, setCurrent] = useState(0);
  // 切换动画进行中：直接忽略点击（纯节流），避免连续点击叠加并发过渡 → 卡顿
  const busyRef = useRef(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const cycle = (dir: number) => {
    if (busyRef.current) return; // 动画中：忽略本次点击
    busyRef.current = true;
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current); // 清掉上一轮兜底，防它提前误解锁
    setCurrent((c) => Math.min(Math.max(c + dir, 0), COHORTS.length - 1));
    fallbackTimer.current = setTimeout(() => {
      busyRef.current = false;
      fallbackTimer.current = null;
    }, SWITCH_FALLBACK_MS);
  };

  // 解锁以"表格 transform 动画真正播完"（transitionend）为准，而不是点击起算的 setTimeout：
  // 过渡要到 React 渲染 + 样式提交后才开始，固定时长会提前 ~1 帧解锁，
  // 动画尾巴还没播完时点进去就插入一个并发过渡 → 卡顿残留。
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const onTransitionEnd = (e: TransitionEvent) => {
      // 只认表格自身（容器直接子元素）的 transform 过渡；
      // 内部 3D 环 / 遮罩的 transitionend 冒泡上来时 target 不是直接子元素，跳过
      if (e.propertyName !== 'transform') return;
      if ((e.target as HTMLElement).parentElement === carousel) {
        busyRef.current = false;
        if (fallbackTimer.current) {
          clearTimeout(fallbackTimer.current);
          fallbackTimer.current = null;
        }
      }
    };
    carousel.addEventListener('transitionend', onTransitionEnd);
    return () => carousel.removeEventListener('transitionend', onTransitionEnd);
  }, []);

  return (
    <section id="graduation" className="h-screen w-full">
      <div className="w-full h-full flex items-center justify-center xl:justify-end">
        <div className="w-[50rem] md:w-[55rem] xl:w-[70rem] 2xl:w-9/10  h-[40rem] flex gap-[3.5rem] items-end">
          <div className="relative h-full">
            <div className="animationEl heightGrow w-[4.5rem] self-start overflow-hidden">
              <div
                className="w-[4.5rem] h-[40rem] bg-[#00d4ff] 
          flex flex-col items-center justify-end"
              >
                <div className="animationEl heightGrowSon absolute top-0 w-[12rem] -translate-x-[0.8rem]">
                  <img src="/picture/cdlm.png" alt="cdlm" />
                </div>
                <div
                  className="animationEl heightGrowSon2 
                w-full flex flex-col items-center"
                >
                  <div
                    className="w-[2.6rem] h-[2rem]
                    border-b-2
                    font-bold text-[1.2rem] text-center"
                  >
                    <span>最新</span>
                  </div>
                  <div className="w-full h-[8rem] flex justify-center items-center">
                    <Icon name="newRF" className="h-[7rem] w-[6rem] rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 h-full flex flex-col">
            <div
              className="w-full h-[6rem] pt-[1rem] mb-[1rem] 
            flex flex-col justify-between"
            >
              <div className="relative flex flex-col justify-center">
                <div className="absolute bottom-[calc(100%-10px)]">
                  <Icon name="rowfont" className="w-[5rem]" />
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-10 md:h-5 md:w-15   ">
                    <div
                      className="animationEl widthGrow
                    pr-1 bg-[#D9D9D9] 
                    flex h-full
                    overflow-hidden justify-end items-center "
                    >
                      <Icon
                        name="arrow"
                        className="
                      animationEl widthGrowSon1
                      md:w-3 md:h-3 w-2 h-2"
                      />
                    </div>
                  </div>
                  <span
                    className="animationEl widthGrowSon2
                  lg:text-xl text-xs font-medium pl-2"
                  >
                    GO
                  </span>
                </div>
                <div
                  className="animationEl widthGrowSon3 
                font-bold text-[1.5rem]
                w-[6rem]"
                >
                  <span>毕业去向</span>
                </div>
              </div>
              <div
                className="animationEl borderEl
              h-[2px] w-full bg-[#d9d9d9]"
              ></div>
            </div>
            <div className="w-full h-[30rem] flex">
              <div
                ref={carouselRef}
                className="
                animationEl tableEl
                flex-1 overflow-hidden
                flex gap-[2rem] items-center"
              >
                <CohortCarousel current={current} />
              </div>
            </div>
            {/* 切换 */}
            <div
              className="animationEl widthGrowSon3
            h-[4rem] flex items-center"
            >
              <div
                className={`${styles.carouselBg} w-fit flex gap-8 p-0.5 rounded-full bg-[#e6e6e6]`}
              >
                <div className="p-0.5 bg-[#FAFAFA] rounded-full z-1 group">
                  <button
                    aria-label="上一届"
                    disabled={current === 0}
                    onClick={() => cycle(-1)}
                    className={`${styles.carouselBtn} rounded-full p-2.5 border-2 border-[#E6E6E6]
                    transition-all duration-300 ease-out
                    group-hover:enabled:bg-[#00d5ffca] cursor-pointer
                    disabled:opacity-40 disabled:cursor-auto`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 18 27"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        fill="currentColor"
                        d="M14.142,0.127 L17.753,3.737 L7.963,13.527 L17.753,23.318 L14.142,26.928 L0.743,13.527 L14.142,0.127 Z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-0.5 bg-[#FAFAFA] rounded-full z-1 group">
                  <button
                    aria-label="下一届"
                    disabled={current === COHORTS.length - 1}
                    onClick={() => cycle(1)}
                    className={`${styles.carouselBtn} rounded-full p-2.5 border-2 border-[#E6E6E6]
                    transition-all duration-300 ease-out
                    group-hover:enabled:bg-[#00d5ffca] cursor-pointer
                    disabled:opacity-40 disabled:cursor-auto`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 18 27"
                      className="w-3.5 h-3.5 rotate-180"
                    >
                      <path
                        fillRule="evenodd"
                        fill="currentColor"
                        d="M14.142,0.127 L17.753,3.737 L7.963,13.527 L17.753,23.318 L14.142,26.928 L0.743,13.527 L14.142,0.127 Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
