'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import styles from './OrganizationSection.module.css';
import { IconParticleCanvas } from './components/IconParticleCanvas';
import { LightDotsCanvas } from './components/LightDotsCanvas';
import { DEPARTMENTS } from './data/departments';

const ICON_ORDER = [
  'project',
  'figma',
  'react',
  'java',
  'golang',
  'python',
  'docker',
  'usersecret',
] as const;

export const PC_OrganizationSection = () => {
  const [currentIcon, setCurrentIcon] = useState<string>('lanshan');
  const [displayDept, setDisplayDept] = useState<string>('lanshan');
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isToggle, setIsToggle] = useState(false);
  const [lastDeptKey, setLastDeptKey] = useState<string | null>(null);
  const prevIconRef = useRef<string>('lanshan');
  // 记录上一次检测时的视口是否为小屏（<1024px），用于只在小屏「刚进入」时触发自动切换
  const autoSmallRef = useRef(false);

  const showContent = currentIcon !== 'lanshan';
  // 锚点使用的 key：内容展示时用当前，返回后用上次位置保持
  const anchorKey = showContent ? currentIcon : lastDeptKey;

  const handleIconChange = useCallback(
    (key: string) => {
      if (isToggle || key === currentIcon) return;
      const prev = prevIconRef.current;
      const prevIdx = ICON_ORDER.indexOf(prev as (typeof ICON_ORDER)[number]);
      const newIdx = ICON_ORDER.indexOf(key as (typeof ICON_ORDER)[number]);
      setDirection(newIdx >= prevIdx ? 'left' : 'right');
      prevIconRef.current = key;
      setLastDeptKey(key);
      if (showContent) {
        setIsToggle(true);
        setCurrentIcon(key); // 粒子立即切换
        setTimeout(() => setDisplayDept(key), 500); // 文案 500ms 后切换
        setTimeout(() => setIsToggle(false), 1000);
      } else {
        setCurrentIcon(key);
        setDisplayDept(key);
      }
    },
    [showContent, isToggle, currentIcon],
  );
  // 响应式自动进入「产品」页：
  // - 移动端首载（<1024px）直接进入产品页
  // - 视口从大屏缩到小屏时，若处于 lanshan 首页则同样自动进入
  // - 仅在「跨入小屏」时触发一次，手动返回后不再重复触发（否则返回会被顶回）
  useEffect(() => {
    const applyResponsive = () => {
      const small = window.innerWidth < 1024;
      const crossedToSmall = small && !autoSmallRef.current;
      autoSmallRef.current = small;
      if (crossedToSmall && currentIcon === 'lanshan') {
        prevIconRef.current = 'project';
        setLastDeptKey('project');
        setButtonsVisible(false); // 隐藏部门按钮列，与点击按钮一致
        setIsToggle(true);
        setCurrentIcon('project'); // 粒子立即切换
        setTimeout(() => setDisplayDept('project'), 500); // 文案 500ms 后切换
        setTimeout(() => setIsToggle(false), 1000);
      }
    };

    applyResponsive(); // 首载立即检测一次
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(applyResponsive, 150); // 防抖：停止拉伸 150ms 后再执行
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, [currentIcon]);
  const handleBack = useCallback(() => {
    prevIconRef.current = 'lanshan';
    setCurrentIcon('lanshan');
    setDisplayDept('lanshan');
    setButtonsVisible(true);
    // lastDeptKey 保持不变，锚点留在原位
  }, []);

  const handlePrev = useCallback(() => {
    if (isToggle) return;
    const idx = ICON_ORDER.indexOf(currentIcon as (typeof ICON_ORDER)[number]);
    const next = idx <= 0 ? ICON_ORDER[ICON_ORDER.length - 1] : ICON_ORDER[idx - 1];
    handleIconChange(next);
  }, [isToggle, currentIcon, handleIconChange]);

  const handleNext = useCallback(() => {
    if (isToggle) return;
    const idx = ICON_ORDER.indexOf(currentIcon as (typeof ICON_ORDER)[number]);
    const next = idx >= ICON_ORDER.length - 1 ? ICON_ORDER[0] : ICON_ORDER[idx + 1];
    handleIconChange(next);
  }, [isToggle, currentIcon, handleIconChange]);

  return (
    <section id="organization" className={`h-screen w-full ${styles.section_org}`}>
      <div
        className={`${styles.overlay}
        relative
        h-full w-full
        bg-[#3a3a3a]`}
      >
        {/* 背景层 */}
        <div className="absolute inset-0">
          <Icon
            name="organizationBg2"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          />
        </div>
        {/* 米字格线 — organizationBg2 之上，organizationBg1 之下，仅覆盖左侧面板区域 */}
        <div
          className={`absolute top-0 left-0 h-full w-[calc((100%-1rem)*14/15-1rem)] ${styles.miziBg}`}
        />
        <div className="absolute inset-0">
          <img src="/picture/organizationBg1.png" alt="" className="w-full h-full object-cover" />
        </div>
        {/* 光点背景层 */}
        <div className="absolute inset-0 z-10">
          <LightDotsCanvas />
        </div>

        {/* 内容层 */}
        <div className="relative h-full w-full pr-[1rem] flex z-10">
          {/* 左侧：按钮/文案面板 + canvas */}
          <div
            className={`relative w-[calc(100%*14/15-1rem)] mr-[1rem] border-r-1 border-r-[#606060]
            ${styles.miziGrid}
            `}
          >
            <div className="absolute inset-0">
              <IconParticleCanvas
                currentIcon={currentIcon}
                panelDeptKey={displayDept}
                onIconChange={handleIconChange}
                showContent={showContent}
                direction={direction}
                buttonsVisible={buttonsVisible}
                setButtonsVisible={setButtonsVisible}
                isToggle={isToggle}
              />
            </div>

            {/* 左右切换箭头 — showContent 时出现，相对左侧面板定位 */}
            {/* 左箭头 — 到头循环至最右 */}
            <div
              onClick={handlePrev}
              className={`absolute left-12 top-1/2 -translate-y-1/2 z-30
                text-white/50 hover:text-white
                transition-opacity duration-500 ease-out
                bg-transparent border-0 cursor-pointer
                p-2
                ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <svg viewBox="0 0 6 18" className="w-[1.6rem] h-[3.2rem]">
                <path d="M9 0 L9 3 L5 9 L9 15 L9 18 L3 9 Z" fill="currentColor" />
              </svg>
            </div>

            {/* 右箭头 — 到头循环至最左，180° 翻转 */}
            <div
              onClick={handleNext}
              className={`absolute right-12 top-1/2 -translate-y-1/2 z-30
                text-white/50 hover:text-white
                transition-opacity duration-500 ease-out
                bg-transparent border-0 cursor-pointer
                p-2
                ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <svg viewBox="0 0 6 18" className="w-[1.6rem] h-[3.2rem] rotate-180">
                <path d="M9 0 L9 3 L5 9 L9 15 L9 18 L3 9 Z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* 右侧：页面标题（静态，不变化） */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col font-bold select-none tracking-widest">
              <div className="h-[2rem] overflow-hidden">
                <span className="font-mono-slash text-[3rem] text-[#00d4ff] leading-none">03</span>
              </div>
              <div className=" leading-none text-end">
                <span className="align-top text-white text-[0.8rem]">DEPT.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部线 + 标签栏 + 返回按钮 */}
        <div className="absolute bottom-[calc((100vw-1rem)*1/15+1rem)] w-full z-20">
          {/* 1px 底线 */}
          <div className="absolute bottom-0 w-full h-[1px] bg-[#606060]" />
          {/* ORGANIZATION 标题 */}
          <div
            className="absolute top-full h-[4rem] overflow-hidden left-1/10
          text-[#242424] text-[4rem] leading-none z-[-1]"
          >
            <span className="-translate-y-[0.2em]">ORGANIZATION</span>
          </div>

          {/* 锚点标签栏 — 10px 高，返回后消失且不可交互 */}
          <div
            className={`absolute bottom-0 
            h-[10px] max-lg:h-[5px] w-[calc(100%-230px)] max-lg:w-[calc((100%-1rem)*14/15-1rem)]
            mr-[230px] max-lg:mr-0
            flex bg-[#606060]
            transition-all duration-500 ease-out
            ${showContent ? 'visible opacity-100' : 'invisible opacity-0'}`}
            style={{ right: showContent ? '230px' : 0, left: 0 }}
          >
            {/* 滑动锚点指示器 */}
            <div
              className="absolute top-0 h-[10px] max-lg:h-[5px] bg-[#00d4ff] 
              transition-all duration-500 ease-out 
              cursor-pointer 
              z-20"
              style={{
                width: `${100 / DEPARTMENTS.length}%`,
                left: `${(DEPARTMENTS.findIndex((d) => d.key === anchorKey) / DEPARTMENTS.length) * 100}%`,
              }}
            />

            {/* 透明点击区 */}
            {showContent &&
              DEPARTMENTS.map((dept) => (
                <button
                  key={dept.key}
                  onClick={() => handleIconChange(dept.key)}
                  className="relative z-10 flex-1 h-full 
                  border-0 cursor-pointer 
                  transition-all duration-300 ease-out 
                  bg-transparent hover:bg-[#909090]"
                />
              ))}
          </div>

          {/* 返回按钮 */}
          <div
            onClick={handleBack}
            className={`absolute right-0 top-0 -translate-y-1/2
              w-[230px] h-[50px] z-30
              bg-[#585858] text-[#ffffff]
              hover:bg-white hover:text-black
              flex flex items-center justify-evenly
              transition-all duration-500 ease-out
              border-0 cursor-pointer
              font-bold
              max-lg:hidden
              ${
                showContent
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-full opacity-0 pointer-events-none'
              }`}
          >
            {/* 向左箭头 — 垂直切面朝底边 */}
            <svg viewBox="0 0 6 18" className="w-[0.8rem] h-[1.6rem]" fill="currentColor">
              <path d="M9 0 L9 3 L5 9 L9 15 L9 18 L3 9 Z" />
            </svg>

            <div className="flex flex-col text-[1rem]">
              <span className="text-[0.8rem] leading-none">返回</span>
              <span className="text-[0.6rem] leading-none">Go Back</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
