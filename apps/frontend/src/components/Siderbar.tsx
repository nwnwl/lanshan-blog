'use client';
import { useEffect, useRef } from 'react';
import { Icon } from '@/components/Icon';
import { useState } from 'react';

const links = [
  { name: 'aboutus' as const, href: '#about', cn_name: '关于我们' },
  { name: 'pastproject' as const, href: '#project', cn_name: '过往项目' },
  { name: 'organization' as const, href: '#organization', cn_name: '组织架构' },
  { name: 'headto' as const, href: '#graduation', cn_name: '毕业去向' },
  { name: 'contact' as const, href: '#contact', cn_name: '联系我们' },
];

export const Siderbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isScroll = useRef(false);
  const timeRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (isScroll.current) return;
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = parseInt(target.dataset.index || '0');
            setActiveIndex(index);
          }
        });
      },
      { threshold: [0.5] },
    );

    // 类型断言解决 dataset 问题
    document.querySelectorAll('section').forEach((el, index) => {
      (el as HTMLElement).dataset.index = String(index);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isScroll]);
  //点击跳转，带防抖，防止滚动时检测；同时标记锚点跳转，避免全屏滚动 hook 的边界兜底误触发
  const scrollToSection = (href: string, index: number) => {
    setActiveIndex(index);
    (window as any).__isAnchorScrolling = true;
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

    isScroll.current = true;
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      isScroll.current = false;
    }, 800);
  };

  return (
    <div
      className={`siderbar h-screen w-full relative
	    flex flex-col items-center justify-between
      group
        `}
    >
      {/* 蓝色logo */}
      <div className="absolute w-[2.5rem] left-1/2 -translate-x-1/2 top-[1rem] pointer-events-none">
        <img src="/picture/logoB.png" alt="logo" />
      </div>
      {/* 导航锚点 */}
      <div className="w-full flex flex-col gap-[3px] relative mt-[6rem]">
        <div
          className="absolute left-0 box-content
          w-[2.7rem] h-[2.5rem]
          group-hover:w-[9.6rem]
          border-l-8 border-[#191919] bg-[#e6e6e6]
          transition-top duration-300 ease-out"
          style={{ top: `calc(${activeIndex} * (2.5rem + 3px))` }}
        ></div>
        {links.map(({ name, href, cn_name }, index) => (
          <div key={name} className="relative" onClick={() => scrollToSection(href, index)}>
            <div
              className={`${activeIndex === index ? 'navSelected' : 'navItem'}  flex justify-center items-center
              w-full h-[2.5rem]
              cursor-pointer`}
            >
              <Icon
                name={name}
                size="1.5rem"
                className={`${activeIndex === index ? 'text-[#191919]' : 'text-[#d9d9d9] navicon'} `}
              />
              <div
                className={`navText absolute left-[3.6rem] 
                whitespace-nowrap text-[0.6rem]`}
              >
                <span>{cn_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 加入我们 */}
      <div
        className={`stripe absolute
          left-[0.8rem] bottom-[4rem]
          w-[2rem] h-[5rem]
          flex flex-col items-center justify-center gap-[8px]
          group-hover:w-[9.2rem] group-hover:h-[2rem]
          transition-all duration-300 ease-in-out
          overflow-hidden `}
      >
        {/* hover背景颜色 */}
        <div
          className="absolute top-0 left-0
          w-full h-full rounded-[4px]
          bg-[#00e5ff] 
          opacity-0 hover:opacity-100
          transition-opacity duration-100 z-0"
        ></div>
        <Icon
          name="joinus"
          size="1rem"
          className={`
          pointer-events-none
          absolute top-[0.5rem] left-[0.5rem]
          text-[#ffffff]
          transition-colors duration-300 ease-in-out
          `}
        />
        <div
          className={`joinLine
            absolute h-[2px] w-[1.4rem] 
            bg-[#ffffff4d] 
            top-[2rem] left-[0.3rem]
            group-hover:top-[5rem]
            transition-[top,background-color] duration-300 ease-in-out
            `}
        />
        <div
          className={`joinText
          absolute
          top-[2.5rem] left-0
          w-[2rem]
          text-center text-[0.7rem] text-[#ffffff] font-bold  
          group-hover:top-[5.5rem]
          transition-[top,color] duration-300 ease-in-out`}
        >
          <span>加入我们</span>
        </div>
        {/* 横向 */}
        <div
          className={`joinLine
            absolute bottom-[0.3rem] left-[2.5rem]
            w-[2px] h-[1.4rem] bg-[#ffffff4d]
            opacity-0 group-hover:opacity-100
            transition-[opacity,background-color] duration-300 ease-in-out
            pointer-events-none`}
        />
        <div
          className={`joinText
          absolute
          bottom-[0.5rem] left-[4.5rem]
          w-[2rem]
          text-center text-[0.7rem] text-[#ffffff] font-bold whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-[opacity,color] duration-300 ease-in-out
          pointer-events-none`}
        >
          <span>加入我们</span>
        </div>
      </div>
      <div
        className={`
        absolute bottom-[0.5rem] left-1/2 -translate-x-1/2 
        flex flex-col items-center
        w-[2rem] h-[2rem]
        group-hover:left-[9.3rem]
        transition-all duration-300 ease-in-out`}
      >
        <Icon
          name="spread"
          size="1rem"
          className="
        group-hover:rotate-180
        "
        />
        <Icon name="littletext" size="1.5rem" className="mt-[-8px]" />
      </div>
    </div>
  );
};
