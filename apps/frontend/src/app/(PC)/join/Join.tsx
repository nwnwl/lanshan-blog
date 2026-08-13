'use client';

import { useRef, useState } from 'react';
import styles from './Join.module.css';
import { JOIN_GROUPS } from './data/groups';
import { useTransitionStore } from '@/store/transitionStore';
import { useRouter } from 'next/navigation';
const EXIT_MS = 300;

export const PC_JoinPage = () => {
  const router = useRouter();
  const navigate = useTransitionStore((s) => s.navigate);
  // activeIdx：当前选中的组名；displayIdx：右侧实际展示的文案
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  // up：从下方进入（向列表下方切换）；down：从上方进入（向列表上方切换）
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  // idle：首屏静止；out：旧文案滑出；in：新文案滑入
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const isTransitioning = useRef(false);

  const handleSelect = (idx: number) => {
    if (idx === displayIdx || isTransitioning.current) return;
    isTransitioning.current = true;
    setActiveIdx(idx);
    setDirection(idx > displayIdx ? 'up' : 'down');
    setPhase('out');
    // 旧文案滑出完成后，替换为新文案并滑入
    window.setTimeout(() => {
      setDisplayIdx(idx);
      setPhase('in');
    }, EXIT_MS);
    window.setTimeout(() => {
      isTransitioning.current = false;
    }, EXIT_MS + 400);
  };

  const group = JOIN_GROUPS[displayIdx];
  const isUp = direction === 'up';

  let contentAnim: string | undefined;
  if (phase === 'out') contentAnim = isUp ? styles.slideOutUp : styles.slideOutDown;
  else if (phase === 'in') contentAnim = isUp ? styles.slideInUp : styles.slideInDown;

  return (
    <section
      className={`relative min-h-[650px] h-screen w-full 
    ${styles.joinSection}`}
    >
      {/* 顶部标题 */}
      <div className="absolute top-[2rem] left-[4vw] z-20 flex flex-col">
        <span className="font-semibold text-[1rem] leading-none text-[#9a9a9a]">JOIN US</span>
        <span className="font-bold text-[3rem] leading-none text-[#111111]">加入我们</span>
      </div>
      <div
        onClick={() => navigate('/content', router.push)}
        className={`${styles.homeButton} absolute top-[3rem] right-[6vw] z-20
        w-[8rem] h-[2.2rem] overflow-hidden
        flex items-center justify-evenly
        group cursor-pointer`}
      >
        <div
          className="absolute top-0 left-0 w-[8rem] h-full bg-white z-[-2]
          scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
        ></div>
        <span
          className=" text-white font-bold text-[1.2rem]
        group-hover:text-[#191919] group-hover:translate-x-[0.5rem]
        transition-all duration-300 ease-in-out"
        >
          HOME
        </span>
        <div
          className="w-[1rem] h-[1rem] text-[#00d4ff]
        group-hover:translate-x-[2.5rem] transition-transform duration-500 ease-in-out"
        >
          <svg viewBox="0 0 50 50" stroke="currentColor" fill="none" strokeWidth="8">
            <polyline points="24.4,2.9 46.5,25 24.4,47.1" />
            <line x1="3.5" y1="25" x2="46.5" y2="25" />
          </svg>
        </div>
      </div>
      {/* 二维码 */}
      <div className="absolute right-[1rem] md:right-[10rem] bottom-[1rem] md:bottom-[2rem] xl:bottom-[4rem]">
        <img src="/picture/ewm.jpg" alt="二维码" className="h-[7rem] w-[7rem] object-cover" />
      </div>
      {/* 水平两栏布局，各占一半 */}
      <div
        className="w-full h-full px-[4rem]
        relative z-10 flex flex-col-reverse 
        xl:flex-row justify-center sm:justify-center items-center 
        gap-30 sm:gap-20
      "
      >
        {/* 左侧：五个组名 + 二维码占位 */}
        <div
          className="xl:ml-[8rem] 
        xl:flex-1 flex flex-col justify-center"
        >
          <div
            className="flex xl:flex-col items-center xl:items-start
          justify-center
          xl:gap-y-7 gap-x-20 xl:flex-nowrap flex-wrap"
          >
            {JOIN_GROUPS.map((g, idx) => {
              const active = activeIdx === idx;
              // 左侧导航用：优先取 nav 短标题；缺省 = en 去除 & 两侧空格（右侧标题小字保持原样）
              const navText = g.nav ?? g.en.replace(/\s*&\s*/g, '&');
              return (
                <div
                  key={g.key}
                  onClick={() => handleSelect(idx)}
                  aria-current={active ? 'true' : undefined}
                  data-text={navText}
                  className={`${styles.groupName} 
                    relative group
                    cursor-pointer select-none
                    whitespace-nowrap text-left
                    text-[3rem] sm:text-[4rem] font-bold lg:leading-none tracking-wide text-[#111111]
                    ${active ? styles.active : ''}`}
                >
                  <div
                    className={`absolute right-full h-full w-[1rem] text-[1rem] ${active ? 'text-[#00D4FF]' : ''}
                    group-hover:text-[#00D4FF] transition-text duration-300 ease-in-out
                    flex flex-col justify-center items-center`}
                  >
                    <span>{g.sider[0]}</span>
                    <span>×</span>
                    <span>{g.sider[1]}</span>
                  </div>
                  <span className="">{navText}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：对应招募文案 */}
        <div
          className="
          h-[20rem]
          xl:flex-1
          max-xl:w-4/5
          max-sm:w-full
          flex justify-center items-center 
          xl:-translate-y-1/8
        "
        >
          <div
            key={displayIdx}
            className={`${contentAnim ?? ''} 
            flex-1
          flex flex-col items-start
          `}
          >
            <div className="px-[1rem] text-[4rem] lg:text-[3rem] xl:text-[2.6rem] font-bold leading-none text-[#111111]">
              {group.cn}
            </div>
            <div className="px-[1.1rem] mt-1 text-[2rem] md:text-[1.2rem] xl:text-[0.85rem] text-[#8f8f8f]">
              {group.en}
            </div>
            <div className="mt-6 xl:mt-4 h-[3px] w-full bg-[#111111]" />
            <p className="px-[1rem] mt-6 xl:mt-4 text-[1.2rem] sm:text-[1.5rem] md:text-[1.4rem] xl:text-[1.1rem] leading-[1.9] text-[#3a3a3a]">
              {group.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
