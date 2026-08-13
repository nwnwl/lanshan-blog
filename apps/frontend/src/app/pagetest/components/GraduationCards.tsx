'use client';

import { useMemo, useState } from 'react';
import type { Destination } from '../data/gra';
import styles from './GraduationCards.module.css';

/* ------------------------------------------------------------------ */
/*  毕业去向 · 届数卡片样式合集
/*  约束：
/*    1) 一张卡片最多展示 4 人，人员上下（纵向）排列；
/*    2) 某届超过 4 人时，卡片内翻页（届数内切换）。
/*  保留样式：04 深色旗帜 / 08 左右分栏
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 4;

interface CardProps {
  people: Destination[]; // 某届的完整数据，内部自动分页
}

interface CardEntry {
  label: string;
  View: (props: CardProps) => React.ReactNode;
}

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/** 届数内翻页共用逻辑：每页最多 4 人 */
function useCohortPages(people: Destination[]) {
  const pages = useMemo(() => chunk(people, PAGE_SIZE), [people]);
  const [page, setPage] = useState(0);
  const total = pages.length;
  const safePage = Math.min(page, total - 1);
  const go = (dir: -1 | 1) => setPage((p) => Math.min(Math.max(p + dir, 0), total - 1));
  return { pagePeople: pages[safePage] ?? [], page: safePage, total, go };
}

/* 单个学长的小卡片：
   从上到下 = 名字缩写 → 名字 → 学院 → 毕业去向；
   修饰 = 半调网点背景 + 左侧渐变强调线 + 缩写行右侧延伸线 + 虚线分隔 + 去向箭头 */
function MiniCard({ p, index }: { p: Destination; index: number }) {
  return (
    <div
      className={`${styles.rowIn} relative overflow-hidden rounded-lg border border-[#e6e9ee] bg-white p-3.5 flex flex-col justify-center shadow-sm`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* 半调网点背景 */}
      <div className={`${styles.halftone} absolute inset-0 opacity-60 pointer-events-none`} />
      {/* 左侧渐变强调线 */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00d4ff] to-[#4b7bff]" />
      {/* 缩写 + 延伸线 */}
      <div className="relative flex items-center gap-1.5">
        <span className="font-mono text-[0.55rem] tracking-[.2em] text-[#00a8cf] font-bold">
          {p.initials}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-[#00d4ff]/60 to-transparent" />
      </div>
      {/* 名字 */}
      <span className="relative mt-1.5 font-bold text-[1.15rem] text-[#191919] leading-none">
        {p.name}
      </span>
      {/* 虚线分隔 */}
      <div className="relative my-2 border-t border-dashed border-[#e0e4ea]" />
      {/* 学院 */}
      <span className="relative text-[0.62rem] text-[#8a8f98] truncate">{p.college}</span>
      {/* 去向 + 箭头 */}
      <div className="relative mt-1.5 flex items-center gap-1">
        <span className="text-[0.7rem] text-[#00a8cf] font-bold leading-none">↗</span>
        <span className="text-[0.75rem] font-semibold text-[#191919] truncate">
          {p.destination}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 04 深色旗帜 · 大字号年份 —— 顶部旗帜 + 底部翻页                     */
/* ------------------------------------------------------------------ */
function V4({ people }: CardProps) {
  const { pagePeople, page, total, go } = useCohortPages(people);
  return (
    <div className="w-[24rem] rounded-lg overflow-hidden shadow-lg border border-[#ededed]">
      <div className="bg-gradient-to-r from-[#191919] to-[#3a3a3a] text-white px-5 py-3.5 flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-[2.4rem] font-bold leading-none text-[#00d4ff]">
            {people[0]?.cohort}
          </span>
          <span className="text-[0.85rem] font-medium text-white/85">届</span>
        </div>
        <span className="text-[0.55rem] tracking-[.3em] text-white/45 pb-1">GRADUATION</span>
      </div>
      {/* 2×2 田字布局：固定高度，记录少时卡片高度不塌缩；key=page 触发翻页重渲染动画 */}
      <div key={page} className="bg-white p-4 h-[17rem] grid grid-cols-2 gap-3">
        {pagePeople.map((p, i) => (
          <MiniCard key={`${p.name}-${page}`} p={p} index={i} />
        ))}
      </div>
      {/* 翻页条 */}
      <div className="flex items-center justify-center gap-3 bg-[#fafafa] border-t border-[#eee] py-2">
        <button
          aria-label="上一页"
          disabled={page === 0}
          onClick={() => go(-1)}
          className="w-6 h-6 rounded border border-[#ddd] text-[#191919] text-[0.7rem] leading-none
            flex items-center justify-center cursor-pointer transition-colors
            hover:bg-[#00d4ff] hover:text-white hover:border-[#00d4ff]
            disabled:opacity-30 disabled:cursor-auto disabled:hover:bg-transparent disabled:hover:text-[#191919] disabled:hover:border-[#ddd]"
        >
          ‹
        </button>
        <span className="font-mono text-[0.7rem] text-[#808080]">
          {String(page + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          aria-label="下一页"
          disabled={page === total - 1}
          onClick={() => go(1)}
          className="w-6 h-6 rounded border border-[#ddd] text-[#191919] text-[0.7rem] leading-none
            flex items-center justify-center cursor-pointer transition-colors
            hover:bg-[#00d4ff] hover:text-white hover:border-[#00d4ff]
            disabled:opacity-30 disabled:cursor-auto disabled:hover:bg-transparent disabled:hover:text-[#191919] disabled:hover:border-[#ddd]"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 08 左右分栏 · 年份立标 —— 左侧年份柱 + 右侧列表 + 底部翻页            */
/* ------------------------------------------------------------------ */
function V8({ people }: CardProps) {
  const { pagePeople, page, total, go } = useCohortPages(people);
  return (
    <div className="w-[24rem] rounded-xl overflow-hidden shadow-lg flex flex-col">
      <div className="flex">
        <div className="w-24 bg-[#191919] text-white flex flex-col items-center justify-between py-4 shrink-0">
          <span
            className="text-[0.5rem] tracking-[.4em] text-white/35 font-medium"
            style={{ writingMode: 'vertical-rl' }}
          >
            GRADUATION
          </span>
          <div className="flex flex-col items-center">
            <span className="text-[2rem] font-bold text-[#00d4ff] leading-none">
              {people[0]?.cohort}
            </span>
            <span className="text-[0.6rem] text-white/70 mt-1">届</span>
          </div>
          <span
            className={`${styles.centeredCircle} w-6 h-6 rounded-full border border-[#00d4ff]/60 text-[#00d4ff] text-[0.6rem]`}
          >
            {people.length}
          </span>
        </div>
        {/* 2×2 田字布局：固定高度，记录少时卡片高度不塌缩；key=page 触发翻页重渲染动画 */}
        <div key={page} className="flex-1 bg-white p-3 h-[17rem] grid grid-cols-2 gap-2 min-w-0">
          {pagePeople.map((p, i) => (
            <MiniCard key={`${p.name}-${page}`} p={p} index={i} />
          ))}
        </div>
      </div>
      {/* 翻页条 */}
      <div className="flex items-center justify-center gap-3 bg-[#fafafa] border-t border-[#eee] py-2">
        <button
          aria-label="上一页"
          disabled={page === 0}
          onClick={() => go(-1)}
          className="w-6 h-6 rounded border border-[#ddd] text-[#191919] text-[0.7rem] leading-none
            flex items-center justify-center cursor-pointer transition-colors
            hover:bg-[#00d4ff] hover:text-white hover:border-[#00d4ff]
            disabled:opacity-30 disabled:cursor-auto disabled:hover:bg-transparent disabled:hover:text-[#191919] disabled:hover:border-[#ddd]"
        >
          ‹
        </button>
        <span className="font-mono text-[0.7rem] text-[#808080]">
          {String(page + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          aria-label="下一页"
          disabled={page === total - 1}
          onClick={() => go(1)}
          className="w-6 h-6 rounded border border-[#ddd] text-[#191919] text-[0.7rem] leading-none
            flex items-center justify-center cursor-pointer transition-colors
            hover:bg-[#00d4ff] hover:text-white hover:border-[#00d4ff]
            disabled:opacity-30 disabled:cursor-auto disabled:hover:bg-transparent disabled:hover:text-[#191919] disabled:hover:border-[#ddd]"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/** 保留的 2 种样式清单：直接 map 渲染即可对比 */
export const CARD_STYLES: CardEntry[] = [
  { label: '04 深色旗帜 · 大字号年份', View: V4 },
  { label: '08 左右分栏 · 年份立标', View: V8 },
];
