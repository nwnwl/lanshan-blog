'use client';

import { DestinationArchive } from './DestinationArchive';
import { COHORTS } from '../data/destinations';

const TABLE_W = 50; // rem：主表格宽度
const SCALED_W = 40; // rem：非主表格按 0.8 缩放后的视觉宽度
const GAP = 2; // rem：表格间距（由父级 flex gap 提供）

interface CohortCarouselProps {
  current: number;
}

// 直接渲染多张表格盒子作为父 flex 容器的子元素，父级负责 overflow-hidden / gap / items-center
export const CohortCarousel = ({ current }: CohortCarouselProps) => {
  // 表格 i 的视觉起始位置 = 其左侧各表格（主 50 / 非主 40）宽度 + 间距之和
  const visualStart = (i: number) => {
    let v = 0;
    for (let j = 0; j < i; j++) {
      v += (j === current ? TABLE_W : SCALED_W) + GAP;
    }
    return v;
  };
  // 布局位置：固定 50rem 宽 + 父级 2rem 间距
  const layoutX = (i: number) => i * (TABLE_W + GAP);
  // 让当前表格落到 x=0
  const rowOffset = visualStart(current);

  return (
    <>
      {COHORTS.map((cohort, i) => {
        const isCurrent = i === current;
        const scale = isCurrent ? 1 : 0.8;
        return (
          <div
            key={cohort}
            className="relative h-full w-[50rem]
            pt-4
              transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(${visualStart(i) - layoutX(i) - rowOffset - (TABLE_W * (1 - scale)) / 2}rem) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <DestinationArchive cohort={cohort} index={i} total={COHORTS.length} />
            {/* 非主表格暗色遮罩 */}
            <div
              className={`pointer-events-none absolute inset-0 bg-black/40 transition-opacity duration-700 ${
                isCurrent ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>
        );
      })}
    </>
  );
};
