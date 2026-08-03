'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import styles from './MyCarousel.module.css';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { title } from 'process';

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

interface ImageDescription {
  title: string;
  description: string;
}

const images_1: ImageItem[] = [
  { id: 1, src: '/picture/studio-1.png', alt: 'studio picture' },
  { id: 2, src: '/picture/studio-2.png', alt: 'studio picture' },
  { id: 3, src: '/picture/studio-3.png', alt: 'graduate employment status' },
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
  const [current, setCurrent] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const total = images_1.length;

  return (
    <div className="relative w-[922.312px] h-[542.542px]">
      <Swiper
        modules={[Navigation]}
        loop={true}
        slidesPerView={1}
        spaceBetween={30}
        navigation={{
          nextEl: '.swiper-custom-next',
          prevEl: '.swiper-custom-prev',
        }}
        onSlideChange={(swiper: SwiperType) => {
          const realIndex = swiper.realIndex;
          setTextVisible(false);
          setTimeout(() => {
            setCurrent(realIndex + 1);
            setCurrentIndex(realIndex);
            setTextVisible(true);
          }, 400);
        }}
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

      {/* 自定义按钮 — 放 Swiper 外面或里面都可以 */}
      {/* 左按钮 */}
      <div
        className={`${styles.carouselBg} absolute w-fit left-6 bottom-8 z-20 bg-black/60 rounded-full  flex gap-8 p-0.5`}
      >
        <div className="p-0.5 bg-[#FAFAFA] rounded-full z-1 group">
          <button
            className={`${styles.carouselBtn} swiper-custom-prev rounded-full p-2.5 border-2 border-[#E6E6E6]
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
            className={`${styles.carouselBtn} swiper-custom-next rounded-full p-2.5 border-2 border-[#E6E6E6]
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

      {/* 自定义数字指示器容器 */}
      <div
        className={`custom-pagination absolute -bottom-14 z-10 pointer-events-none text-[10px] font-bold
          transition-all duration-500 ease-out
        ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-x-2'}`}
      >
        {current} / {total}
      </div>

      {/* 下侧信息栏 */}
      <div
        className={`absolute w-[811.375px] -bottom-30 left-6 transition-all duration-500 ease-out ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-x-2'}`}
      >
        <div className="text-[29.9333px] font-semibold">
          <span>{textData_1[currentIndex]?.title}</span>
        </div>
        <div className="text-[18.7083px] font-medium">{textData_1[currentIndex]?.description}</div>
      </div>
    </div>
  );
};
