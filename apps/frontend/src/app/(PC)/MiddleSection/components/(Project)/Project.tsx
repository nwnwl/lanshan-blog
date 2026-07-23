'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProjectRow from './components/ProjectRow';
import styles from './ProjectSection.module.css';

interface ProjectData {
  id: string;
  title: string;
  subTitle: string;
  borderT?: string;
  cardContent: {
    description: string;
  };
}

const projects: ProjectData[] = [
  {
    id: '01',
    title: 'We CQUPT',
    subTitle: 'We 重邮',
    borderT: 'border-t-2',
    cardContent: {
      description:
        '全国高校第一个上线的微信小程序，入选2017年度中国“互联网+”优秀案例50强，获第五届中国“互联网＋”大学生创新创业大赛重庆市银奖',
    },
  },
  {
    id: '02',
    title: 'Counselor Competition System',
    subTitle: '2023年重庆市辅导员大赛竞赛系统',
    cardContent: {
      description:
        '研发 2023 年重庆市辅导员大赛竞赛系统，确保重庆市辅导员大赛的顺利进行，收获重庆市教委和参赛老师的一致好评',
    },
  },
  {
    id: '03',
    title: 'WeCom QR Check-in',
    subTitle: '企业微信扫码签到功能',
    cardContent: {
      description:
        '设计企业微信扫码签到功能，为师生提供便捷签到服务，被企业微信官方纳入优秀案例进行分享',
    },
  },
  {
    id: '04',
    title: 'CQEITC',
    subTitle: '重庆数字教育治理运行中心',
    cardContent: {
      description:
        '完成重庆数字教育治理运行中心搭建，有效治理全市教师、学生等数据600万条，实现了全市教育数据的一屏统览，一键调度，为全市教育治理决策提供了系统支撑。获得市教委广泛好评',
    },
  },
];

export const PC_ProjectSection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cardPosRef = useRef({ x: 0, y: 0 }); // 卡片当前实际位置

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const activeProject = projects.find((p) => p.id === hoveredId);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (cardRef.current) {
        const targetX = mouseRef.current.x + 20;
        const targetY = mouseRef.current.y + 10;
        // 缓动系数：0.08 = 每帧走剩余距离的 8%，数值越小延迟越明显
        const ease = 0.08;
        cardPosRef.current.x += (targetX - cardPosRef.current.x) * ease;
        cardPosRef.current.y += (targetY - cardPosRef.current.y) * ease;
        cardRef.current.style.transform = `translate3d(${cardPosRef.current.x}px, ${cardPosRef.current.y}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="project" className="h-screen w-full px-10 pt-30 pb-50 relative">
      <div
        className="h-full w-full grid grid-rows-4 bg-white text-black"
        onMouseMove={handleMouseMove}
      >
        {projects.map((project) => (
          <ProjectRow
            key={project.id}
            id={project.id}
            title={project.title}
            subTitle={project.subTitle}
            borderT={project?.borderT}
            onHover={() => setHoveredId(project.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>

      {/* 底部装饰 */}
      <div
        className="absolute bottom-8 inset-x-0
       h-16 bg-[#00D4FF] "
      ></div>

      {/* 鼠标跟随卡片 */}
      <div
        ref={cardRef}
        className={`${activeProject ? 'opacity-100' : 'opacity-0'}
        fixed pointer-events-none z-50
        w-80 h-56
        transition-opacity duration-150 ease-out
        top-0 left-0
        bg-white rounded-2xl border border-black shadow-xl
        `}
      >
        {activeProject && (
          <div
            className={`h-full min-w-0 px-4 py-6 flex flex-col justify-between items-end ${styles.card}`}
          >
            <div className="bg-[#D9D9D9] w-full h-6 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 57 57"
                className="__20-NoticeDetail_close__SEu18 w-10 h-10
                absolute top-[-10]"
              >
                <path
                  fillRule="evenodd"
                  fill="currentColor"
                  d="M28.137,20.301 L48.026,0.414 L55.651,8.038 L35.762,27.925 L28.137,20.301 ZM56.625,48.787 L49.000,56.411 L28.137,35.550 L35.762,27.925 L56.625,48.787 ZM8.428,55.256 L0.803,47.632 L20.511,27.925 L28.137,35.550 L8.428,55.256 ZM1.777,9.193 L9.402,1.568 L28.137,20.301 L20.511,27.925 L1.777,9.193 Z"
                ></path>
              </svg>
            </div>

            <div className="text-sm font-light indent-6">
              {activeProject.cardContent.description}
            </div>

            <div>
              <img src="/picture/logoB.png" alt="logo" height={40} width={40} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
