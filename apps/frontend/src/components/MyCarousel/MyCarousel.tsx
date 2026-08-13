'use client';
import { useState, useCallback, useEffect } from 'react';
import styles from './MyCarousel.module.css';
interface ImageItem {
  id: number;
  src: string;
  alt: string;
  thresholdSrc: string;
}

interface ImageDescription {
  title: string;
  description: string;
}

export const images_1: ImageItem[] = [
  {
    id: 1,
    src: '/picture/studio-1.png',
    alt: 'studio picture',
    thresholdSrc: '/picture/studio-threshold-1.png',
  },
  {
    id: 2,
    src: '/picture/studio-2.png',
    alt: 'studio picture',
    thresholdSrc: '/picture/studio-threshold-2.png',
  },
  {
    id: 3,
    src: '/picture/studio-3.png',
    alt: 'graduate employment status',
    thresholdSrc: '/picture/studio-threshold-3.png',
  },
];

export const images_2: ImageItem[] = [
  {
    id: 4,
    src: '/picture/studio-4.webp',
    alt: 'studio desk',
    thresholdSrc: '/picture/studio-threshold-4.png',
  },
  {
    id: 5,
    src: '/picture/studio-5.webp',
    alt: 'studio picture',
    thresholdSrc: '/picture/studio-threshold-5.png',
  },
  {
    id: 6,
    src: '/picture/studio-6.webp',
    alt: 'Content coverage',
    thresholdSrc: '/picture/studio-threshold-6.png',
  },
];

export const textData_1: ImageDescription[] = [
  {
    title: '了解工作室',
    description:
      '蓝山工作室是由教育信息化办公室/信息中心指导的，从事互联网产品、教育信息化产品开发运营和服务全体师生的校级学生组织。',
  },
  {
    title: '工作室构成',
    description:
      '工作室下设产品及运营部、运维与安全部、研发部、UI设计部4个部门8个组，其中研发部根据不同的技术栈分为前端开发组、GO语言开发组、Java开发组、Python开发组。',
  },
  {
    title: '成员发展去向',
    description:
      '多年来，工作室孕育了一大批优秀的IT互联网人才，进入腾讯、阿里巴巴、字节跳动、美团等知名互联网企业。',
  },
];

export const textData_2: ImageDescription[] = [
  {
    title: '工位申请',
    description:
      '工作室成员可申请蓝山工作室的工位。获批后，申请人须妥善保管个人物品，并积极履行工作室的开发职责。',
  },
  {
    title: '真实项目实践与团队协作',
    description:
      '参与真实项目实践，你不仅能在实际开发中锤炼技术、积累经验，还能结识一群志同道合的伙伴，在团队协作中互相激励、共同成长。',
  },
  {
    title: '学姐学长互助',
    description:
      '学姐学长倾情传授互联网行业知识，为你答疑解惑，大厂工作的学姐学长会传授工作经验，更有内推资源等你来。',
  },
];

interface MyCarouselProps {
  images: ImageItem[];
  textData: ImageDescription[];
  shouldEnter?: boolean;
  blink?: boolean;
  revealFrom?: 'left' | 'right';
}

export const MyCarousel = ({
  images,
  textData,
  shouldEnter = true,
  blink = false,
  revealFrom = 'right',
}: MyCarouselProps) => {
  const [current, setCurrent] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [curtainPhase, setCurtainPhase] = useState<
    'idle' | 'blackEnter' | 'blackExit' | 'thresholdExit'
  >('idle');
  const [thresholdSrc, setThresholdSrc] = useState('');
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [hasEntered, setHasEntered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const total = images.length;

  useEffect(() => {
    if (!shouldEnter) return;
    const timer = setTimeout(() => setHasEntered(true), 1800);
    return () => clearTimeout(timer);
  }, [shouldEnter]);

  useEffect(() => {
    if (!shouldEnter) return;
    const timer = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(timer);
  }, [shouldEnter]);

  const isAnimating = curtainPhase !== 'idle';

  const goNext = useCallback(() => {
    if (isAnimating) return;
    const newIndex = currentIndex >= total - 1 ? 0 : currentIndex + 1;

    // 预加载 next 图 + 阈值图
    const preloadNext = new Image();
    preloadNext.src = images[newIndex].src;
    const preloadThreshold = new Image();
    preloadThreshold.src = images[newIndex].thresholdSrc;

    setDirection('next');
    setPrevIndex(currentIndex);
    setTargetIndex(newIndex);
    setThresholdSrc(images[newIndex].thresholdSrc);
    setCurtainPhase('blackEnter');

    // 350ms：黑色铺满，切图，黑色开始退场
    setTimeout(() => {
      setCurrentIndex(newIndex); // 原图已被遮住，安全切换
      setCurtainPhase('blackExit');
    }, 350);

    // 500ms：黑色已完全退场，阈值短暂显示后开始退场
    setTimeout(() => {
      setCurtainPhase('thresholdExit');
    }, 500);

    // 900ms：阈值退场完毕，最终状态
    setTimeout(() => {
      setCurtainPhase('idle');
      setCurrent(newIndex + 1);
    }, 900);
  }, [isAnimating, currentIndex, total]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    const newIndex = currentIndex <= 0 ? total - 1 : currentIndex - 1;

    const preloadNext = new Image();
    preloadNext.src = images[newIndex].src;
    const preloadThreshold = new Image();
    preloadThreshold.src = images[newIndex].thresholdSrc;

    setDirection('prev');
    setPrevIndex(currentIndex);
    setTargetIndex(newIndex);
    setThresholdSrc(images[newIndex].thresholdSrc);
    setCurtainPhase('blackEnter');

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setCurtainPhase('blackExit');
    }, 350);

    setTimeout(() => {
      setCurtainPhase('thresholdExit');
    }, 500);

    setTimeout(() => {
      setCurtainPhase('idle');
      setCurrent(newIndex + 1);
    }, 900);
  }, [isAnimating, currentIndex, total]);

  return (
    <div
      className="relative"
      style={{ width: 'var(--carousel-w, 51.25em)', height: 'var(--carousel-h, 30em)' }}
    >
      {/* 图片区：overflow-hidden 截断幕布，不溢出全屏 */}
      <div
        className={`relative w-full h-full overflow-hidden ${revealFrom === 'left' ? styles.revealLeft : styles.revealRight} ${revealed ? styles.revealEntered : ''}`}
      >
        {images.map((img, i) => (
          <img
            key={img.id}
            src={img.src}
            alt={img.alt}
            className={`absolute inset-0 w-full h-full object-cover ${
              i === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* 阈值图：clip-path 裁切退场，不会压缩 */}
        {(curtainPhase === 'blackExit' || curtainPhase === 'thresholdExit') && (
          <img
            src={thresholdSrc}
            alt="threshold"
            className={`absolute inset-0 z-20 w-full h-full object-cover opacity-85 ${
              curtainPhase === 'thresholdExit'
                ? direction === 'next'
                  ? styles.thresholdExitLeft
                  : styles.thresholdExitRight
                : ''
            }`}
          />
        )}

        {/* 黑色幕布：clip-path 横扫，不会压缩 */}
        {(curtainPhase === 'blackEnter' || curtainPhase === 'blackExit') && (
          <div
            className={`absolute inset-0 z-30 bg-[#191919] ${
              curtainPhase === 'blackEnter'
                ? direction === 'next'
                  ? styles.blackEnterLeft
                  : styles.blackEnterRight
                : curtainPhase === 'blackExit'
                  ? direction === 'next'
                    ? styles.blackExitLeft
                    : styles.blackExitRight
                  : ''
            }`}
          />
        )}
      </div>

      {/* 按钮放到 overflow-hidden 外面，不受裁剪 */}
      {/* 左按钮 */}
      <div
        className={`${styles.carouselBg} ${shouldEnter ? (blink ? styles.blinkBtn : styles.carouselBgEnter) : 'opacity-0'} absolute w-fit carouselInfo carouselBtnBox
        left-[1.5em]
        bottom-[2em]
         z-50
        lg:bg-black/60 bg-[#E6E6E6]
        rounded-full flex
        gap-[2em]
        p-[0.1875em]`}
      >
        <div className="p-0.5 bg-[#FAFAFA] rounded-full z-1 group">
          <button
            onClick={goPrev}
            className={`${styles.carouselBtn} rounded-full carouselBtnItem
            p-[0.625em]
            border-2
            border-[#E6E6E6]
            transition-all duration-500 ease-out
            group-hover:bg-[#00d5ffca] cursor-pointer
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 27"
              className="Pagination_arrow__xgX6n w-3.5 h-3.5 carouselArrow"
            >
              <path
                fillRule="evenodd"
                fill="currentColor"
                d="M14.142,0.127 L17.753,3.737 L7.963,13.527 L17.753,23.318 L14.142,26.928 L0.743,13.527 L14.142,0.127 Z"
              ></path>
            </svg>
          </button>
        </div>
        {/* 右按钮 */}
        <div className="p-0.5 bg-[#FAFAFA]  rounded-full z-1 group">
          <button
            onClick={goNext}
            className={`${styles.carouselBtn} rounded-full carouselBtnItem
            p-[0.625em]
            border-2
            border-[#E6E6E6]
            transition-all duration-500 ease-out
            group-hover:bg-[#00d5ffca] cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 27"
              className="Pagination_arrow__xgX6n Pagination_right__NDQb6 w-3.5 h-3.5 rotate-180 carouselArrow"
            >
              <path
                fillRule="evenodd"
                fill="currentColor"
                d="M14.142,0.127 L17.753,3.737 L7.963,13.527 L17.753,23.318 L14.142,26.928 L0.743,13.527 L14.142,0.127 Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 数字指示器 - 退场层：黑色阶段 */}
      {(curtainPhase === 'blackEnter' || curtainPhase === 'blackExit') && (
        <div
          className={`${styles.textExit} absolute paginationInfo
          -bottom-[6em]
          z-10
          pointer-events-none
          text-[0.5em]
          font-bold
          left-0`}
        >
          {current} / {total}
        </div>
      )}

      {/* 数字指示器 - 进场层：阈值退场及之后 */}
      {(curtainPhase === 'thresholdExit' || curtainPhase === 'idle') && (
        <div
          className={`${
            curtainPhase === 'idle' && !hasEntered
              ? styles.blinkTitle
              : curtainPhase === 'thresholdExit'
                ? styles.textEnter
                : ''
          } absolute paginationInfo
           -bottom-[6em]
           z-10
           pointer-events-none
          text-[0.5em]
           font-bold
           left-0

           `}
        >
          {targetIndex + 1} / {total}
        </div>
      )}

      {/* 信息栏 - 退场层：黑色阶段 */}
      {(curtainPhase === 'blackEnter' || curtainPhase === 'blackExit') && (
        <div
          className={`${styles.textExit} absolute carouselInfo
         w-[35em]
          top-[calc(100%+0.5em)]
           left-[1.5em]
           mt-[1.5em]
           `}
        >
          <div className="text-[1.6em] font-[550] lg:font-medium carouselTitle">
            {textData[prevIndex]?.title}
          </div>
          <div
            className="text-[1.05em]
           font-medium carouselDesc"
          >
            {textData[prevIndex]?.description}
          </div>
        </div>
      )}

      {/* 信息栏 - 进场层：阈值退场及之后 */}
      {(curtainPhase === 'thresholdExit' || curtainPhase === 'idle') && (
        <div
          className={`${
            curtainPhase === 'idle' && !hasEntered
              ? ''
              : curtainPhase === 'thresholdExit'
                ? styles.textEnter
                : ''
          }
          absolute carouselInfo
          w-[35em]
          top-[calc(100%+0.5em)]
          left-[1.5em]
          mt-[1.5em]
          `}
        >
          <div
            className={`text-[1.6em] font-[550] lg:font-medium carouselTitle
          ${curtainPhase === 'idle' && !hasEntered ? styles.blinkTitle : ''}`}
          >
            {textData[targetIndex]?.title}
          </div>
          <div
            className={`text-[1.05em]
           font-medium carouselDesc ${curtainPhase === 'idle' && !hasEntered ? styles.blinkDesc : ''}`}
          >
            {textData[targetIndex]?.description}
          </div>
        </div>
      )}
    </div>
  );
};
