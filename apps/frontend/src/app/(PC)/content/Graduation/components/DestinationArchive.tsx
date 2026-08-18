'use client';

import { useEffect, useState } from 'react';
import styles from '../GraduationSection.module.css';
import { DESTINATIONS } from '../data/destinations';

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

export const DestinationArchive = ({
  cohort,
  index,
  total,
}: {
  cohort: string;
  index: number;
  total: number;
}) => {
  const records = DESTINATIONS.filter((item) => item.cohort === cohort);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const pageSize = isMobile ? records.length : 8;
  const pages: (typeof records)[] = [];
  for (let i = 0; i < records.length; i += pageSize) {
    pages.push(records.slice(i, i + pageSize));
  }

  return (
    <div
      className="relative h-full w-full
      flex flex-col"
      style={{
        backgroundImage: 'linear-gradient(90deg, #191919 0%, #000000 50%,#191919 100%)',
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

      {/* PC 分页（下滑翻页）/ 移动端单页滚动 */}
      <div
        className={`${styles.destinationGrid} relative isolate flex-1 overflow-y-auto overflow-x-hidden text-white  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {pages.map((pageRows, pageIdx) => (
          <div
            key={pageIdx}
            className={`${isMobile ? '' : 'h-full'} grid content-start gap-x-[2rem] gap-y-5 lg:py-16 pt-10 pb-5 px-12 ${styles.archiveGrid}`}
          >
            {pageRows.map((row, index) => (
              <div key={row.name} className={`max-h-[5rem] flex flex-col ${styles.archiveItem}`}>
                <div
                  className={`flex-3 flex ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}
                  gap-[1rem]
                  px-[1rem]`}
                >
                  {/* 顶部：姓名 + 拼音缩写 */}
                  <div className="relative flex flex-col gap-[0.2rem] pb-0 lg:pb-[0.2rem] w-[6rem]">
                    <div
                      className={`${index % 2 === 1 ? 'lg:text-end' : ''}
                      lg:text-[0.5rem] text-[0.4rem]
                      leading-none`}
                    >
                      <span
                        className={`${index % 2 === 1 ? 'pl-1 lg:pl-0 lg:pr-1' : 'pl-1'} font-semibold`}
                      >
                        {row.initials}
                      </span>
                    </div>
                    <div
                      className={`${index % 2 === 1 ? 'lg:text-end' : ''} h-[1.8rem]
                      lg:text-[1.6rem] text-[1.2rem]
                      font-bold leading-none tracking-[-0.1em]`}
                    >
                      {row.name}
                    </div>
                    {/* 底部：学院图标 + 学院 */}
                    <div
                      className={`absolute top-full pt-[0.3rem]
                    hidden lg:flex items-center gap-[0.3rem]
                    ${index % 2 === 1 ? 'lg:flex-row-reverse lg:right-0' : ''}
                    whitespace-nowrap text-ellipsis text-[0.5rem] font-bold`}
                    >
                      <div className="h-full flex items-center">
                        <CollegeIcon college={row.college} />
                      </div>
                      <span>{row.college}</span>
                    </div>
                  </div>
                  {/* 移动端：学院盒子（图标 + 学院名），与去向平分剩余空间 */}
                  <div className="lg:hidden flex items-end pb-[0.3rem] gap-[0.3rem] lg:flex-1 min-w-0">
                    <span className="shrink-0 flex items-center">
                      <CollegeIcon college={row.college} />
                    </span>
                    <span className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis max-[400px]:text-[0.5rem] text-[0.7rem] font-bold leading-none">
                      {row.college}
                    </span>
                  </div>
                  {/* 所去公司：内联展示，不单独放盒子 */}
                  <div
                    className={`flex items-end pb-[0.3rem] gap-[0.3rem]
                      max-[400px]:text-[0.5rem] text-[0.7rem] font-bold leading-none lg:flex-1 min-w-0 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                  >
                    <span className={index % 2 === 1 ? 'lg:!hidden' : ''}>↘</span>
                    {index % 2 === 1 && <span className="!hidden lg:!inline">↙</span>}
                    <span className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                      {row.destination}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex-1 pt-0 lg:pt-[0.3rem]
               w-full
                flex items-center gap-[0.3rem]
                lg:border-t-2 border-t-1 border-[#808080]
                 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                ></div>
              </div>
            ))}
          </div>
        ))}

        {!isMobile && pages.length > 1 && (
          <img
            src="/picture/scroll-tip.webp"
            alt="下滑查看更多"
            className={styles.scrollTip}
            loading="lazy"
          />
        )}
      </div>

      <div className="relative h-[2rem] flex items-center justify-between gap-3 bg-[#d9d9d9] px-5 py-3 text-[10px] tracking-wide md:px-6">
        <div className="flex flex-col text-[0.4rem] text-[#808080]">
          <span className="">ACADEMIC CAREER OFFICE</span>
          <span>ARCHIVE SYSTEM</span>
        </div>

        <span className="text-[#191919] lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <span className="font-mono-slash text-[1rem]">{String(index + 1).padStart(2, '0')}</span>{' '}
          / <span className="font-mono-slash text-[1rem]">{String(total).padStart(2, '0')}</span>
        </span>

        <span className="!hidden lg:!block">※ 已收集到的数据如上</span>
      </div>
    </div>
  );
};
