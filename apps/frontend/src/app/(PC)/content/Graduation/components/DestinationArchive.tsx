'use client';

import { useState } from 'react';
import styles from '../GraduationSection.module.css';
import { DESTINATIONS } from '../data/destinations';
import { useMouseFollower } from '@/hooks/useMouseFollower';

const PAGE_SIZE = 8;
const RING_RADIUS = 30; // 环半径(rem)
const RING_PERSPECTIVE = '1500px';

const ACADEMY_SVG_CLASS = 'h-3 w-3 fill-none stroke-current stroke-[1.8] [stroke-linecap:square]';

function CollegeIcon({ college }: { college: string }) {
  if (college.includes('网络'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="网络安全学院" role="img">
        <path d="M12 2 20 5v6c0 5-3.2 8.7-8 11-4.8-2.3-8-6-8-11V5l8-3Z" />
        <path d="m8 12 2.3 2.3L16 8.7" />
      </svg>
    );
  if (college.includes('人工智能'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="人工智能学院" role="img">
        <circle cx="5" cy="6" r="1.8" />
        <circle cx="5" cy="18" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="19" cy="6" r="1.8" />
        <circle cx="19" cy="18" r="1.8" />
        <path d="M6.8 6.8 10.6 11M6.8 17.2 10.6 13M17.2 6.8 13.4 11M17.2 17.2 13.4 13" />
      </svg>
    );
  if (college.includes('数据'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="数据科学学院" role="img">
        <circle cx="5" cy="6" r="2" />
        <circle cx="19" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="m6.8 7.2 3.8 8m6.6-8-3.8 8M7 6h10" />
      </svg>
    );
  if (college.includes('电子'))
    return (
      <svg
        className={ACADEMY_SVG_CLASS}
        viewBox="0 0 24 24"
        aria-label="电子信息工程学院"
        role="img"
      >
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 2v5m3-5v5m3-5v5M9 17v5m3-5v5m3-5v5M2 9h5m-5 3h5m-5 3h5m10-6h5m-5 3h5m-5 3h5" />
      </svg>
    );
  if (college.includes('信息管理'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="信息管理学院" role="img">
        <path d="M4 4h16v16H4zM8 8h8m-8 4h8m-8 4h5" />
      </svg>
    );
  if (college.includes('软件'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="软件学院" role="img">
        <path d="m9 6-5 6 5 6M15 6l5 6-5 6M13 4l-2 16" />
      </svg>
    );
  if (college.includes('通信'))
    return (
      <svg
        className={ACADEMY_SVG_CLASS}
        viewBox="0 0 24 24"
        aria-label="通信与信息工程学院"
        role="img"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        <path d="M8 9h.01M12 9h.01M16 9h.01" />
      </svg>
    );
  if (college.includes('经济'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="经济管理学院" role="img">
        <path d="M4 20v-7M10 20v-12M16 20v-9M2 20h20" />
      </svg>
    );
  if (college.includes('光电'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="光电半导体学院" role="img">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </svg>
    );
  if (college.includes('国际'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="国际学院" role="img">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
      </svg>
    );
  if (college.includes('传媒'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="传媒学院" role="img">
        <path d="M4 11v2a1 1 0 0 0 1 1h2l8 5V5L7 10H5a1 1 0 0 0-1 1Z" />
        <path d="M16 9a3 3 0 0 1 0 6" />
      </svg>
    );
  if (college.includes('制造'))
    return (
      <svg
        className={ACADEMY_SVG_CLASS}
        viewBox="0 0 24 24"
        aria-label="先进制造工程学院"
        role="img"
      >
        <path d="M3 21h18" />
        <path d="M6 21v-4" />
        <circle cx="6" cy="17" r="2" />
        <path d="M6 17l7-5" />
        <circle cx="13" cy="12" r="2" />
        <path d="M13 12l-3-5" />
        <path d="M10 7l-3-4M10 7l3-4" />
      </svg>
    );
  if (college.includes('自动化'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="自动化学院" role="img">
        <rect x="5" y="8" width="14" height="10" rx="2" />
        <circle cx="9.5" cy="13" r="1.2" />
        <circle cx="14.5" cy="13" r="1.2" />
        <path d="M12 8V5M9 5h6M9 18v1.5M15 18v1.5" />
      </svg>
    );
  if (college.includes('生物'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="生物学院" role="img">
        <path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12M8 6h8M6.5 12h11M8 18h8" />
      </svg>
    );
  if (college.includes('理学院'))
    return (
      <svg className={ACADEMY_SVG_CLASS} viewBox="0 0 24 24" aria-label="理学院" role="img">
        <circle cx="12" cy="12" r="2" />
        <ellipse cx="12" cy="12" rx="9" ry="4" />
        <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />
      </svg>
    );
  return (
    <svg
      className={ACADEMY_SVG_CLASS}
      viewBox="0 0 24 24"
      aria-label="计算机科学与技术学院"
      role="img"
    >
      <path d="M7 5h10v10H7zM4 19h16M10 15v4m4-4v4" />
    </svg>
  );
}

export const DestinationArchive = ({ cohort }: { cohort: string }) => {
  const [current, setCurrent] = useState(0);
  const [rot, setRot] = useState(180); // 环累计转角（不回落，CSS 自行处理大角度）
  const [busy, setBusy] = useState(false);
  // 鼠标跟随（排斥 + 纯惯性版，无弹簧）：检测范围 = 整块档案区(destinationGrid)，目标 = 当前正面那一页的网格
  // 注意：网格上不再加 will-change-transform——它在 3D 环里会被强制提升成合成层、每帧重投影，正是"只有第一页卡"的元凶
  const { containerRef, targetRef } = useMouseFollower({
    maxOffset: 1, // 幅度(rem)
    friction: 0.96, // 摩擦力：速度每帧保留 96%，鼠标停后余速磨没得更慢、惯性更大（0.94~0.97 区间）
    returnEase: 0.01, // 回程缓动：鼠标移出后滑回中心的速度，越小回得越慢（0.02 更慢、更悠）
  });
  const records = DESTINATIONS.filter((item) => item.cohort === cohort);
  const pageCount = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const pages = Array.from({ length: pageCount }, (_, i) =>
    records.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE),
  );
  // 环上相邻页夹角 = 360/N（按页数动态），每次切换转过同样的角，转满一圈回到第 1 页；
  // N≥3 时转角 <180°，途中两页同时可见、重叠衔接；N=2 只能各占 180° 对面
  const SWING = pageCount > 1 ? 360 / pageCount : 360;

  // 切换：整环旋转把目标页转到正面；环是闭环，可一直转（取模回绕），单页时不动
  const go = (dir: -1 | 1) => {
    if (busy || pageCount <= 1) return; // 转动中阻止再次切换
    setBusy(true);
    setCurrent((c) => (c + dir + pageCount) % pageCount);
    setRot((r) => r + dir * SWING); // 下一页 → 当前页向左出、新页从右侧提前进
    setTimeout(() => setBusy(false), 600); // 与环旋转时长一致
  };

  return (
    <div
      className="h-full w-full
      flex flex-col"
      style={{
        backgroundImage:
          'radial-gradient(circle, #707070 0, #707070 1.5px, transparent 1.6px), linear-gradient(90deg, #191919 0%, #000000 50%,#191919 100%)',
        backgroundSize: '3rem 3rem, 100% 100%',
      }}
    >
      <div
        className="absolute -translate-y-[0.5rem] z-5
            text-black tracking-[.16em]
            flex flex-col justify-end gap-[0.2rem]"
      >
        <div className="text-[#808080] text-[0.5rem] font-medium leading-none">
          <span>//RECORDS： {String(records.length).padStart(2, '0')}</span>
        </div>
        <div className="leading-none">
          <span className=" font-semibold text-[1.2rem] ">「20{cohort}届」</span>
        </div>
      </div>
      <div className="-translate-x-[1px] -translate-y-[1px] h-[2rem] w-[62%] [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)] bg-white "></div>

      {/* 所有页常驻 DOM、围绕一个环站一圈；非当前页转到背面/容器外被裁掉 */}
      <div
        ref={containerRef}
        className={`${styles.destinationGrid} relative isolate flex-1 overflow-hidden text-white`}
      >
        <div className="relative h-full w-full" style={{ perspective: RING_PERSPECTIVE }}>
          <div
            className="relative h-full w-full transition-transform duration-[0.6s] ease-in-out"
            style={{
              transformStyle: 'preserve-3d',
              // 环心前移 +R，页面向环心（内侧）；rot 保证当前页停在观察者正面
              transform: `translateZ(${RING_RADIUS}rem) rotateY(${rot}deg)`,
            }}
          >
            {pages.map((pageRows, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  backfaceVisibility: 'hidden',
                  // 页站在环上、面朝环心（内侧），观察者在环外看内壁；-i*SWING 使整环向前旋转时当前页从左侧离开
                  transform: `rotateY(${-i * SWING}deg) translateZ(${RING_RADIUS}rem) rotateY(180deg)`,
                }}
              >
                <div
                  ref={(el) => {
                    if (el && i === current) targetRef.current = el;
                  }}
                  className="grid h-full w-full grid-cols-2 place-content-center gap-y-4 py-10 px-12 perspective-[600px]"
                >
                  {pageRows.map((row, index) => (
                    <div
                      key={row.name}
                      className="max-h-[5rem]
                    flex flex-col mx-4"
                      style={{ transform: index % 2 === 0 ? 'rotateY(10deg)' : 'rotateY(-10deg)' }}
                    >
                      <div
                        className={`flex-3 flex ${index % 2 === 1 ? 'flex-row-reverse' : ''} justify-evenly`}
                      >
                        {/* 顶部：姓名 + 拼音缩写 */}
                        <div className="relative flex flex-col gap-[0.3rem] pb-[0.3rem]">
                          <div
                            className={`${index % 2 === 1 ? 'text-end' : ''} text-[0.6rem] leading-none`}
                          >
                            <span className={`${index % 2 === 1 ? 'pr-1' : 'pl-1'} font-semibold`}>
                              {row.initials}
                            </span>
                          </div>
                          <div className="h-[2rem] text-[2rem] font-bold leading-none tracking-[-0.1em]">
                            {row.name}
                          </div>
                          {/* 底部：学院图标 + 学院 */}
                          <div
                            className={`absolute top-full pt-[0.3rem]
                            flex items-center gap-[0.3rem]
                            ${index % 2 === 1 ? 'flex-row-reverse' : ''}
                            whitespace-nowrap text-ellipsis text-[0.625rem] font-bold`}
                          >
                            <div
                              className="h-full
                            flex items-center"
                            >
                              <CollegeIcon college={row.college} />
                            </div>
                            <span>{row.college}</span>
                          </div>
                        </div>
                        {/* 所去公司：内联展示，不单独放盒子 */}
                        <div
                          className={`flex items-end pb-[0.3rem] gap-[0.3rem] text-[0.7rem] font-bold leading-none ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
                        >
                          <span>{index % 2 === 1 ? '↙' : '↘'}</span>
                          <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                            {row.destination}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex-1 pt-[0.3rem]
                        flex items-center gap-[0.3rem]
                        border-t-4 border-white/50
                         ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[2rem] flex items-center justify-between gap-3 bg-[#d9d9d9] px-5 py-3 text-[10px] tracking-wide md:px-6">
        <div className="flex flex-col text-[0.4rem] text-[#808080]">
          <span className="">ACADEMIC CAREER OFFICE</span>
          <span>ARCHIVE SYSTEM</span>
        </div>

        <div className="text-[#191919] flex items-center gap-1">
          <button
            aria-label="上一页"
            disabled={pageCount <= 1}
            onClick={() => go(-1)}
            className="cursor-pointer h-[1rem] w-[0.8rem] 
            text-[0.8rem] font-bold
            flex justify-center items-center 
            disabled:cursor-auto disabled:opacity-[0.3]"
          >
            <svg
              viewBox="0 0 12 18"
              className="w-[0.6rem] h-[0.8rem] rotate-180 "
              fill="currentColor"
            >
              <path d="M0 0 L0 3 L4 9 L0 15 L0 18 L6 9 Z" />
            </svg>
          </button>
          <span className="text-[1rem]">
            <span className="font-mono-slash">{String(current + 1).padStart(2, '0')}</span> /{' '}
            <span className="font-mono-slash">{String(pageCount).padStart(2, '0')}</span>
          </span>
          <button
            aria-label="下一页"
            disabled={pageCount <= 1}
            onClick={() => go(1)}
            className="cursor-pointer h-[1rem] w-[0.8rem] 
            text-[0.8rem] font-bold
            flex justify-center items-center 
            disabled:cursor-auto disabled:opacity-[0.3]"
          >
            <svg viewBox="0 0 12 18" className="w-[0.6rem] h-[0.8rem]" fill="currentColor">
              <path d="M0 0 L0 3 L4 9 L0 15 L0 18 L6 9 Z" />
            </svg>
          </button>
        </div>
        <span>※ 已收集到的数据如上</span>
      </div>
    </div>
  );
};
