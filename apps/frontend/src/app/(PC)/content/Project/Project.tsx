'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ProjectRow from './components/ProjectRow';
import gsap from 'gsap';
import styles from './ProjectSection.module.css';

interface ProjectData {
  id: string;
  title: string;
  subTitle: string;
  imageUrl: string;
  cardContent: {
    description: string;
  };
}

const projects: ProjectData[] = [
  {
    id: '01',
    title: 'We CQUPT',
    subTitle: 'We 重邮小程序',
    imageUrl: '/picture/project-1.png',
    cardContent: {
      description:
        '全国高校第一个上线的微信小程序，入选2017年度中国"互联网+"优秀案例50强，获第五届中国"互联网＋"大学生创新创业大赛重庆市银奖',
    },
  },
  {
    id: '02',
    title: 'AI Form-Filling Agent',
    subTitle: 'AI填表智能体',
    imageUrl: '/picture/project-2.png',
    cardContent: {
      description:
        '支持各类表格一键上传、表格结构智能解析。系统依据已有智能填写，将师生从繁重的填表工作中解放出来，获重庆市首批人工智能+高等教育典型案例，重庆市首届AI大模型创新应用大赛一等奖',
    },
  },
  {
    id: '03',
    title: 'Campus AI Assistant',
    subTitle: '校园AI助理',
    imageUrl: '/picture/project-3.png',
    cardContent: {
      description:
        '依托校内知识库，整理学习了百万余字文件，全天候提供政策解读、文献翻译、事务咨询、学习指导等服务，为师生提供智能、精准、高效的帮助与解答',
    },
  },
  {
    id: '04',
    title: 'CQEITC',
    subTitle: '重庆数字教育治理运行中心',
    imageUrl: '/picture/project-4.png',
    cardContent: {
      description:
        '完成重庆数字教育治理运行中心搭建，有效治理全市教师、学生等数据600万条，实现了全市教育数据的一屏统览，一键调度，为全市教育治理决策提供了系统支撑。获得市教委广泛好评',
    },
  },
];

export const PC_ProjectSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [cardEnabled] = useState(() => navigator.maxTouchPoints <= 0);

  // Preload all images on mount
  useEffect(() => {
    projects.forEach((project) => {
      const img = new Image();
      img.src = project.imageUrl;
    });
  }, []);

  // Switch card image with GSAP rotation/scale entrance
  const changePhoto = useCallback((index: number) => {
    const img = imgRef.current;
    if (!img) return;
    const nextSrc = projects[index].imageUrl;
    if (img.src.endsWith(nextSrc)) return;
    img.src = nextSrc;
    gsap.fromTo(
      img,
      { rotate: '30deg', scale: 1.3 },
      { rotate: 0, scale: 1, duration: 0.5, ease: 'power4.out' },
    );
  }, []);

  // Container-level delegated card events via GSAP
  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card || !cardEnabled) return;

    const onEnter = (e: MouseEvent) => {
      gsap
        .timeline()
        .set(card, { x: e.clientX, y: e.clientY })
        .to(card, { scale: 1, rotate: '-15deg', duration: 0.5, ease: 'power4.out' });
    };

    const onMove = (e: MouseEvent) => {
      gsap.to(card, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
    };

    const onLeave = () => {
      gsap.to(card, { scale: 0, rotate: '30deg', duration: 0.5, ease: 'power4.out' });
    };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [cardEnabled]);

  return (
    <section id="project" className="w-full px-12 mt-30 mb-30 relative bg-white text-black">
      <div ref={containerRef} className="relative z-1 w-full flex flex-col">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            id={project.id}
            title={project.title}
            subTitle={project.subTitle}
            borderT={index === 0}
            onHover={() => cardEnabled && changePhoto(index)}
          />
        ))}
      </div>

      {/* Floating card — GSAP-controlled, hidden by default via CSS scale(0) rotate(30deg) */}
      <div ref={cardRef} className={styles.card}>
        <img
          ref={imgRef}
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt=""
        />
      </div>
    </section>
  );
};
