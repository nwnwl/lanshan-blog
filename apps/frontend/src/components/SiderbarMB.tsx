import { useTransitionStore } from '@/store/transitionStore';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { useEffect, useRef, useState } from 'react';

const links = [
  { name: 'aboutus' as const, href: '#about', cn_name: '关于我们' },
  { name: 'headto' as const, href: '#graduation', cn_name: '毕业去向' },
  { name: 'pastproject' as const, href: '#project', cn_name: '过往项目' },
  { name: 'organization' as const, href: '#organization', cn_name: '组织架构' },
  { name: 'contact' as const, href: '#contact', cn_name: '联系我们' },
];

export const SiderbarMB = () => {
  const router = useRouter();
  const navigate = useTransitionStore((s) => s.navigate);
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
    isScroll.current = true;
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      isScroll.current = false;
    }, 800);
  };

  return (
    <div className="siderbarMB relative w-full h-full bg-white">
      <div
        className={`fixed z-30 pointer-events-none
        transition-all duration-300 ease-in-out
        ${isOpen ? 'left-[calc(50%-16rem)] top-[calc(50%-28rem)] w-[9rem]' : 'left-[1rem] top-[1rem] w-[4rem]'}`}
      >
        <img src="/picture/logoB.png" alt="logo" />
      </div>
      {/* 汉堡菜单 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="group z-30 absolute top-[1.4rem] right-[2rem]
      h-[3.2rem] text-[#191919]"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            className={`[transform-box:fill-box] origin-center 
            transition-transform duration-300 
            ${isOpen ? 'translate-y-[6px] rotate-45' : ''}`}
          />
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
            className={`transition-opacity duration-200 
              ${isOpen ? 'opacity-0' : ''}`}
          />
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
            className={`[transform-box:fill-box] origin-center 
            transition-transform duration-300
            ${isOpen ? '-translate-y-[6px] -rotate-45' : ''}`}
          />
        </svg>
      </div>
      <div
        className={`siderFix fixed inset-0 bg-white z-20 overflow-hidden pointer-events-none
        transition-transform duration-300 ease-in-out
        ${isOpen ? '-translate-x-0' : '-translate-x-full'}`}
      >
        {/* 导航（绝对定位居中，垂直布局） */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[32rem]
          flex flex-col items-center gap-[2rem]"
        >
          <div className="w-full flex flex-col items-center gap-[1rem]">
            {links.map(({ name, href, cn_name }, index) => (
              <div
                key={name}
                onClick={() => scrollToSection(href, index)}
                className={`flex items-center justify-center pointer-events-auto
                w-full h-[4.5rem] text-[#191919]
                cursor-pointer transition-colors duration-500 ease-in-out
                ${activeIndex === index ? 'bg-[#00d4ff]' : 'bg-[#f2f2f2]'}`}
              >
                <Icon
                  name={name}
                  size="2rem"
                  className={`${activeIndex === index ? '' : 'text-[#bfbfbf]'}
                  w-[2.5rem] mx-[2rem] transition-colors duration-300`}
                />
                <div
                  className={`${activeIndex === index ? 'bg-black' : 'bg-[#bfbfbf]'} h-[3.3rem] w-[0.2rem] transition-colors duration-300`}
                ></div>
                <div className="flex-1 text-[1.5rem] ">
                  <span className="indent-8 font-medium">{cn_name}</span>
                </div>
                <div className="mx-[1rem]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[1.5rem] h-[1.5rem]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* 分割线 */}
          <div className="mt-[1rem] w-full h-[0.1rem] bg-[#191919]" />
          {/* 社交媒体（无背景） */}
          <div className="flex items-center gap-[2rem] text-[#bfbfbf] pointer-events-auto">
            <a href="https://xhslink.cn/m/6worIanti1C" target="_blank" rel="noopener noreferrer">
              <Icon name="xhs" size="3rem" className="cursor-pointer" />
            </a>
            <a href="https://b23.tv/Nb6Bd5s" target="_blank" rel="noopener noreferrer">
              <Icon name="blbl" size="3rem" className="cursor-pointer" />
            </a>
            <a
              href="https://juejin.cn/user/4075207411898764?share_token=cfaf5964-6764-4fa2-9546-25dac9ada184"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="juejin" size="3rem" className="cursor-pointer" />
            </a>
          </div>
        </div>
        {/* LANSHAN */}
        <div className="absolute left-1/2  bottom-0 -translate-x-1/2 translate-y-1/3 pointer-events-none">
          <img src="/picture/hatchLanshan.svg" alt="LANSHAN" className="opacity-50 min-w-[900px]" />
        </div>
      </div>
      <div
        onClick={() => navigate('/join', router.push)}
        className={`stripe absolute
          right-[7rem] bottom-[1.5rem]
          w-[10rem] h-[3rem]
          flex flex-col items-center justify-center gap-[8px]
          transition-all duration-300 ease-in-out
          cursor-pointer `}
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
          size="1.8rem"
          className={`
          pointer-events-none
          absolute top-[0.6rem] left-[0.6rem]
          text-[#ffffff]
          group-hover:top-[0.5rem]
          transition-[top,color] duration-300 ease-in-out
          `}
        />
        {/* 横向 */}
        <div
          className={`joinLine
            absolute bottom-[0.75rem] left-[3.2rem]
            w-[2px] h-[1.5rem] bg-[#ffffff8d]
            transition-bg duration-300 ease-in-out
            pointer-events-none`}
        />
        <div
          className={`joinText
          absolute
          bottom-[0.6rem] left-[4.4rem]
          w-[2rem]
          text-center text-[1.2rem] text-[#ffffff] font-bold whitespace-nowrap
          transition-color duration-300 ease-in-out pointer-events-none`}
        >
          <span>加入我们</span>
        </div>
      </div>
    </div>
  );
};
