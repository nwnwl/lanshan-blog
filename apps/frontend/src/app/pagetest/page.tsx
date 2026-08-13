'use client';

import { CARD_STYLES } from './components/GraduationCards';
import { DESTINATIONS } from './data/gra';

// 整届数据传入卡片：每张卡一页最多 4 人，超过 4 人时卡片内翻页（届数内切换）
const COHORT_21 = DESTINATIONS.filter((d) => d.cohort === '21'); // 6 人 → 2 页
const COHORT_25 = DESTINATIONS.filter((d) => d.cohort === '25'); // 16 人 → 4 页

function CardColumn({ title, people }: { title: string; people: typeof COHORT_21 }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-lg font-bold text-[#191919]">{title}</h2>
        <p className="mt-1 text-xs text-[#808080]">{people.length} 人 · 每卡一页 4 人</p>
      </div>
      {CARD_STYLES.map(({ label, View }) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <span className="text-xs tracking-wide text-[#191919]/60">{label}</span>
          <View people={people} />
        </div>
      ))}
    </div>
  );
}

export default function TestPage() {
  return (
    <div className="min-h-screen w-full bg-[#eef0f3] px-10 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-[#191919]">毕业去向 · 届数卡片样式对比</h1>
        <p className="mt-2 text-sm text-[#808080]">
          一卡最多 4 人 · 上下排列 · 超过 4 人时卡片内翻页切换
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 justify-items-center">
        <CardColumn title="21 届（2 页演示）" people={COHORT_21} />
        <CardColumn title="25 届（4 页演示）" people={COHORT_25} />
      </div>
    </div>
  );
}
