'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { useState } from 'react';
import { useTransitionStore } from '@/store/transitionStore';

const links = [
  { name: 'aboutus' as const, href: '#about', cn_name: '关于我们' },
  { name: 'headto' as const, href: '#graduation', cn_name: '毕业去向' },
  { name: 'pastproject' as const, href: '#project', cn_name: '过往项目' },
  { name: 'organization' as const, href: '#organization', cn_name: '组织架构' },
  { name: 'contact' as const, href: '#contact', cn_name: '联系我们' },
];

export const SiderbarPC = () => {
  const router = useRouter();
  const navigate = useTransitionStore((s) => s.navigate);
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
      {/* 蓝山logo */}
      <div className="absolute w-[2.5rem] left-1/2 -translate-x-1/2 top-[1rem] pointer-events-none">
        <img src="/picture/logoB.png" alt="logo" />
      </div>
      {/* 导航锚点 */}
      <div className="w-full flex flex-col gap-[3px] relative mt-[6rem]">
        <div
          className="box-content absolute left-0 
          w-[3rem] h-[2.5rem]
          group-hover:w-[11.5rem]
          border-l-[0.5rem] border-[#191919] bg-[#e6e6e6]
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
                className={`navText absolute left-[4rem]
                whitespace-nowrap text-[0.6rem] font-medium`}
              >
                <span>{cn_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 加入我们 */}
      <div
        onClick={() => navigate('/join', router.push)}
        className={`stripe absolute
          left-[0.8rem] bottom-[5rem]
          w-[2.4rem] h-[5.4rem]
          flex flex-col items-center justify-center gap-[8px]
          group-hover:w-[10.9rem] group-hover:h-[2.2rem]
          transition-all duration-300 ease-in-out
          overflow-hidden cursor-pointer `}
      >
        {/* hover背景颜色 */}
        <div
          className="absolute top-0 left-0
          w-full h-full rounded-[4px]
          bg-[#00e5ff]
          opacity-0 hover:opacity-100
          transition-opacity duration-200 z-0"
        ></div>
        <Icon
          name="joinus"
          size="1.2rem"
          className={`
          pointer-events-none
          absolute top-[0.5rem] left-[0.6rem]
          text-[#ffffff]
          group-hover:top-[0.5rem]
          transition-[top,color] duration-300 ease-in-out
          `}
        />
        <div
          className={`
            absolute h-[2px] w-[1.5rem]
            bg-[#ffffff4d]
            top-[2.4rem] left-[0.45rem]
            pointer-events-none`}
        />
        <div
          className={`
          absolute
          top-[3rem] left-[0.2rem]
          w-[2rem]
          text-center text-[0.65rem] text-[#ffffff] font-bold`}
        >
          <span>加入</span>
          <span>我们</span>
        </div>
        {/* 横向 */}
        <div
          className={`joinLine
            absolute bottom-[0.4rem] left-[3rem]
            w-[2px] h-[1.4rem] bg-[#ffffff4d]
            opacity-0 group-hover:opacity-100
            transition-[opacity,background-color] duration-300 ease-in-out
            pointer-events-none`}
        />
        <div
          className={`joinText
          absolute
          bottom-[0.6rem] left-[5rem]
          w-[2rem]
          text-center text-[0.7rem] text-[#ffffff] font-bold whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-[opacity,color] duration-300 ease-in-out pointer-events-none`}
        >
          <span>加入我们</span>
        </div>
      </div>
      {/* 社交媒体图标：折叠时只显示 tz，展开后显示平台图标 */}
      <div
        className=" w-[2.4rem] group-hover:w-[10.9rem] h-[1.5rem] rounded-[4px]
        absolute left-[0.8rem] bottom-[3rem]
         flex items-center justify-center
         transition-all duration-300 ease-in-out
         bg-[#e5e5e5]"
      >
        <Icon
          name="tz"
          size="1rem"
          className="absolute left-[0.7rem]
          transition-opacity duration-100 group-hover:opacity-0"
        />
        <div className="absolute left-[3.5rem] flex flex-row items-center gap-[0.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <a href="https://xhslink.cn/m/6worIanti1C" target="_blank" rel="noopener noreferrer">
            <Icon
              name="xhs"
              size="1rem"
              className="cursor-pointer text-[#b3b3b3] hover:text-[#191919]
            transition-text duration-300 ease-in-out"
            />
          </a>
          <a href=" https://b23.tv/Nb6Bd5s" target="_blank" rel="noopener noreferrer">
            <Icon
              name="blbl"
              size="1rem"
              className="cursor-pointer text-[#b3b3b3] hover:text-[#191919]
            transition-text duration-300 ease-in-out"
            />
          </a>
          <a
            href="https://juejin.cn/user/4075207411898764?share_token=cfaf5964-6764-4fa2-9546-25dac9ada184"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              name="juejin"
              size="1rem"
              className="cursor-pointer text-[#b3b3b3] hover:text-[#191919]
            transition-text duration-300 ease-in-out"
            />
          </a>
        </div>
      </div>
      <div
        className={`
        absolute bottom-[0.5rem] left-1/2 -translate-x-1/2 
        flex flex-col items-center
        w-[2rem] h-[2rem]
        group-hover:left-[10.8rem]
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
