'use client';
import { useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import styles from './MyCarousel.module.css';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
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

const images_1: ImageItem[] = [
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

const textData_1: ImageDescription[] = [
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
      '多年来，工作室孕育了一大批优秀的IT互联网人才，进入腾讯、阿里巴巴、字节跳动、美团等知名互联网企业。蓝山工作室，从不止步于蓝山，我们期待志同道合的你。',
  },
];

const textData_2: ImageDescription[] = [
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
      '学姐学长倾情传授互联网行业知识，为你答疑解惑。大厂工作的学姐学长会传授工作经验，更有内推资源等你来',
  },
];

export const MyCarousel = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [current, setCurrent] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [curtainPhase, setCurtainPhase] = useState<
    'idle' | 'blackEnter' | 'blackExit' | 'thresholdExit'
  >('idle');
  const [thresholdSrc, setThresholdSrc] = useState('');
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const total = images_1.length;

  const isAnimating = curtainPhase !== 'idle';

  const goNext = useCallback(() => {
    if (isAnimating || !swiper) return;
    const newIndex = currentIndex >= total - 1 ? 0 : currentIndex + 1;

    // 预加载 next 图 + 阈值图
    const preloadNext = new Image();
    preloadNext.src = images_1[newIndex].src;
    const preloadThreshold = new Image();
    preloadThreshold.src = images_1[newIndex].thresholdSrc;

    setDirection('next');
    setPrevIndex(currentIndex);
    setThresholdSrc(images_1[newIndex].thresholdSrc);
    setCurtainPhase('blackEnter');

    // 400ms：黑色铺满，swiper 切图，阈值就位，黑色开始退场
    setTimeout(() => {
      swiper.slideTo(newIndex, 0); // 原图已被遮住，安全切换
      setCurtainPhase('blackExit');
    }, 400);

    // 650ms：黑色已完全退场，阈值完整显示一瞬后开始退场
    setTimeout(() => {
      setCurtainPhase('thresholdExit');
    }, 650);

    // 1050ms：阈值退场完毕，最终状态
    setTimeout(() => {
      setCurtainPhase('idle');
      setCurrent(newIndex + 1);
      setCurrentIndex(newIndex);
    }, 1050);
  }, [isAnimating, swiper, currentIndex, total]);

  const goPrev = useCallback(() => {
    if (isAnimating || !swiper) return;
    const newIndex = currentIndex <= 0 ? total - 1 : currentIndex - 1;

    const preloadNext = new Image();
    preloadNext.src = images_1[newIndex].src;
    const preloadThreshold = new Image();
    preloadThreshold.src = images_1[newIndex].thresholdSrc;

    setDirection('prev');
    setPrevIndex(currentIndex);
    setThresholdSrc(images_1[newIndex].thresholdSrc);
    setCurtainPhase('blackEnter');

    setTimeout(() => {
      swiper.slideTo(newIndex, 0);
      setCurtainPhase('blackExit');
    }, 400);

    setTimeout(() => {
      setCurtainPhase('thresholdExit');
    }, 650);

    setTimeout(() => {
      setCurtainPhase('idle');
      setCurrent(newIndex + 1);
      setCurrentIndex(newIndex);
    }, 1050);
  }, [isAnimating, swiper, currentIndex, total]);

  return (
    <div className="relative w-[922.312px] h-[542.542px]">
      {/* 图片区：overflow-hidden 截断幕布，不溢出全屏 */}
      <div className="relative w-full h-full overflow-hidden">
        <Swiper
          modules={[Navigation]}
          loop={true}
          slidesPerView={1}
          spaceBetween={30}
          speed={0}
          allowTouchMove={false}
          onSwiper={setSwiper}
        >
          {images_1.map((img) => (
            <SwiperSlide key={img.id}>
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: '922.312px', height: '542.542px', objectFit: 'cover' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 阈值图：只在 blackExit / thresholdExit 挂载，黑色铺满后才贴上 */}
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

        {/* 黑色幕布 */}
        {(curtainPhase === 'blackEnter' || curtainPhase === 'blackExit') && (
          <div
            className={`absolute inset-0 z-30 bg-black ${
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
      <div
        className={`${styles.carouselBg} absolute w-fit left-6 bottom-8 z-50 bg-black/60 rounded-full flex gap-8 p-0.5`}
      >
        <div className="p-0.5 bg-[#FAFAFA] rounded-full z-1 group">
          <button
            onClick={goPrev}
            className={`${styles.carouselBtn} rounded-full p-2.5 border-2 border-[#E6E6E6]
              transition-all duration-500 ease-out 
              group-hover:bg-[#00d5ffca]
              `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 27"
              className="Pagination_arrow__xgX6n w-3.5 h-3.5"
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
            className={`${styles.carouselBtn} rounded-full p-2.5 border-2 border-[#E6E6E6]
              transition-all duration-500 ease-out
              group-hover:bg-[#00d5ffca]`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 27"
              className="Pagination_arrow__xgX6n Pagination_right__NDQb6 w-3.5 h-3.5 rotate-180"
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

      {/* 数字指示器 - 退场层 */}
      {curtainPhase !== 'idle' && (
        <div
          className={`${styles.textExit} absolute -bottom-14 z-10 pointer-events-none text-[10px] font-bold`}
        >
          {current} / {total}
        </div>
      )}

      {/* 数字指示器 - 进场层 */}
      {curtainPhase === 'idle' && (
        <div
          className={`${styles.textEnter} absolute -bottom-14 z-10 pointer-events-none text-[10px] font-bold`}
        >
          {current} / {total}
        </div>
      )}

      {/* 信息栏 - 退场层 */}
      {curtainPhase !== 'idle' && (
        <div className={`${styles.textExit} absolute w-[811.375px] -bottom-30 left-6`}>
          <div className="text-[29.9333px] font-semibold">{textData_1[prevIndex]?.title}</div>
          <div className="text-[18.7083px] font-medium">{textData_1[prevIndex]?.description}</div>
        </div>
      )}

      {/* 信息栏 - 进场层 */}
      {curtainPhase === 'idle' && (
        <div className={`${styles.textEnter} absolute w-[811.375px] -bottom-30 left-6`}>
          <div className="text-[29.9333px] font-semibold">{textData_1[currentIndex]?.title}</div>
          <div className="text-[18.7083px] font-medium">
            {textData_1[currentIndex]?.description}
          </div>
        </div>
      )}
    </div>
  );
};
