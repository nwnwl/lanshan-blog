'use client';

import { DEPARTMENTS } from '../data/departments';
import styles from '../OrganizationSection.module.css';
import { useEffect } from 'react';
interface Props {
  deptKey: string;
  direction: 'left' | 'right';
  visible: boolean;
  inView: boolean;
  initialEntrance?: boolean;
  isToggle?: boolean;
}

export const DepartmentPanel = ({
  deptKey,
  direction,
  visible,
  inView,
  initialEntrance = false,
  isToggle,
}: Props) => {
  const dept = DEPARTMENTS.find((d) => d.key === deptKey);
  const dir = direction === 'left' ? 'Left' : 'Right';
  // 入场动画开关：面板已展示（visible）且组织区块进入视口（inView，由 observer 触发）才播放
  const animateIn = visible && inView;
  // 初次进入（滚动进入视口）或视口从大屏跨入小屏时延迟 -1s，点击切换恢复完整延迟

  const cnDelay = initialEntrance ? 'delay-[100ms]' : 'delay-[1000ms]';
  const enDelay = initialEntrance ? 'delay-[150ms]' : 'delay-[1100ms]';
  const bodyDelay = initialEntrance ? 'delay-[250ms]' : 'delay-[1200ms]';
  return (
    <div
      className={`flex flex-col justify-center h-full text-white
        transition-[width] max-lg:transition-none
        ${isToggle ? '' : 'overflow-hidden'}
       ${visible ? 'max-lg:px-16 max-lg:w-full lg:w-[21.875rem] xl:w-[25rem] delay-[500ms] duration-1000' : 'opacity-0 w-0'}`}
    >
      <div className="w-full flex flex-col">
        {/* 中文标题 */}
        <div
          className={`max-lg:h-[4.2rem] h-[3.5rem] overflow-hidden
          ${isToggle ? styles[`textChinese${dir}`] : ''}`}
        >
          <span
            className={`max-lg:text-[3.8rem] text-[2.8rem] font-bold leading-[3.5rem]
            transition-all duration-800 ease-in-out
            ${animateIn ? `${cnDelay} translate-y-0` : 'translate-y-[4.4rem] lg:translate-y-[3.5rem]'}`}
          >
            {dept?.cn ?? ''}
          </span>
        </div>

        {/* 英文副标题 */}
        <div
          className={`max-lg:h-[2.2rem] h-[1.8rem] overflow-hidden
          ${isToggle ? styles[`textEnglish${dir}`] : ''}`}
        >
          <span
            className={`max-lg:text-[1.9rem] text-[1.4rem] font-bold leading-[1.8rem]
            transition-all duration-800 ease-in-out
            ${animateIn ? `${enDelay} translate-y-0` : 'translate-y-[2.2rem] lg:translate-y-[1.8rem]'}`}
          >
            {dept?.en ?? ''}
          </span>
        </div>
      </div>

      {/* 虚线分割 */}
      <div
        className="max-lg:hidden w-full h-[1px] my-2"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 0.25rem, transparent 0.25rem, transparent 0.5rem)',
        }}
      />

      {/* 正文 */}
      <div
        className={`max-lg:mt-6 max-lg:w-full lg:w-[21.875rem] xl:w-[25rem] max-lg:h-[4.4rem] lg:h-[3.6rem] overflow-hidden
      ${isToggle ? styles[`text${dir}`] : ''}`}
      >
        <span
          className={`max-lg:text-[1rem] text-[0.6rem]
          transition-all duration-800 ease-in-out
          ${animateIn ? `${bodyDelay} -translate-y-[0]` : '-translate-y-[3.6rem] lg:-translate-y-[2.8rem]'}`}
        >
          {dept?.desc ?? ''}
        </span>
      </div>
    </div>
  );
};
