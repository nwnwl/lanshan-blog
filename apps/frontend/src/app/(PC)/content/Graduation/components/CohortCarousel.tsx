'use client';

import { useEffect, useState } from 'react';
import { DestinationArchive } from './DestinationArchive';
import { COHORTS } from '../data/destinations';
import styles from '../GraduationSection.module.css';

const SCALE = 0.8;
const GAP = 2; // rem：表格间距（由父级 flex gap 提供）

interface CohortCarouselProps {
  current: number;
  isSmall: boolean;
}

// 直接渲染多张表格盒子作为父 flex 容器的子元素，父级负责 overflow-hidden / gap / items-center
export const CohortCarousel = ({ current, isSmall }: CohortCarouselProps) => {
  const [tableW, setTableW] = useState(50);

  useEffect(() => {
    const read = () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue('--table-w');
      const num = parseFloat(val);
      if (!isNaN(num)) setTableW(num);
    };
    read();
    const mq = window.matchMedia('(max-width: 1024px)');
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, []);

  const TABLE_W = tableW;
  const SCALED_W = TABLE_W * SCALE;

  // 表格 i 的视觉起始位置 = 其左侧各表格（主 TABLE_W / 非主 SCALED_W）宽度 + 间距之和
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
        if (isSmall && i !== current) return null; // 小屏只显示当前届
        const isCurrent = i === current;
        const scale = isCurrent ? 1 : SCALE;
        return (
          <div
            key={cohort}
            className={`relative h-full ${styles.tableCard}
            pt-4
              transition-transform duration-700 ease-out`}
            style={{
              transform: isSmall
                ? 'translateX(0rem) scale(1)'
                : `translateX(${visualStart(i) - layoutX(i) - rowOffset - (TABLE_W * (1 - scale)) / 2}rem) scale(${scale})`,
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
