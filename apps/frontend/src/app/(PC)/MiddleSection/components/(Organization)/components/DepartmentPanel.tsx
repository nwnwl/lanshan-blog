'use client';

import { DEPARTMENTS } from '../data/departments';
import styles from '../OrganizationSection.module.css';
interface Props {
  deptKey: string;
  direction: 'left' | 'right';
  visible: boolean;
  isToggle?: boolean;
}

export const DepartmentPanel = ({ deptKey, direction, visible, isToggle }: Props) => {
  const dept = DEPARTMENTS.find((d) => d.key === deptKey);
  const dir = direction === 'left' ? 'Left' : 'Right';

  return (
    <div
      className={`flex flex-col justify-center h-full text-white
        transition-[width] 
        ${isToggle ? '' : 'overflow-hidden'}
       ${visible ? 'w-[300px] lg:w-[350px] xl:w-[400px] delay-[500ms] duration-1000' : 'w-0 opacity-0'}`}
    >
      <div className="w-[300px] lg:w-[350px] xl:w-[400px] flex flex-col">
        {/* 中文标题 */}
        <div
          className={`h-[3.5rem] overflow-hidden
          ${isToggle ? styles[`textChinese${dir}`] : ''}`}
        >
          <span
            className={`text-[2.8rem] font-bold leading-[3.5rem]
            transition-all duration-800 ease-in-out
            ${visible ? 'delay-[1000ms] translate-y-[0]' : 'translate-y-[3.5rem]'}`}
          >
            {dept?.cn ?? ''}
          </span>
        </div>

        {/* 英文副标题 */}
        <div
          className={`h-[1.8rem] overflow-hidden
          ${isToggle ? styles[`textEnglish${dir}`] : ''}`}
        >
          <span
            className={`text-[1.4rem] font-bold leading-[1.8rem]
            transition-all duration-800 ease-in-out
            ${visible ? 'delay-[1100ms] translate-y-[0rem]' : 'translate-y-[1.8rem]'}`}
          >
            {dept?.en ?? ''}
          </span>
        </div>
      </div>

      {/* 虚线分割 */}
      <div
        className="w-[300px] lg:w-[350px] xl:w-[400px] h-[1px] my-2"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 4px, transparent 4px, transparent 8px)',
        }}
      />

      {/* 正文 */}
      <div
        className={`w-[300px] lg:w-[350px] xl:w-[400px] h-[3rem] overflow-hidden
      ${isToggle ? styles[`text${dir}`] : ''}`}
      >
        <span
          className={`text-[0.6rem] max-w-[520px]
          transition-all duration-800 ease-in-out
          ${visible ? 'delay-[1200ms] translate-y-[0]' : '-translate-y-[2.8rem]'}`}
        >
          {dept?.desc ?? ''}
        </span>
      </div>
    </div>
  );
};
