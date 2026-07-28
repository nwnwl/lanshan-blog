'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

const images_1: ImageItem[] = [
  { id: 1, src: '/picture/studio-1.png', alt: 'studio picture' },
  { id: 2, src: '/picture/studio-2.png', alt: 'studio picture' },
  { id: 3, src: '/picture/studio-3.png', alt: 'github picture' },
];

export const MyCarousel = () => {
  const [current, setCurrent] = useState(1);
  const total = images_1.length;

  return (
    <div className="relative w-[1305px] h-[767.891px]">
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
          setCurrent(swiper.realIndex + 1);
        }}
      >
        {images_1.map((img) => (
          <SwiperSlide key={img.id}>
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: '1305.420px', height: '767.891px', objectFit: 'cover' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 自定义按钮 — 放 Swiper 外面或里面都可以 */}
      <div className="absolute left-10 -bottom-2 z-20 bg-black/60 rounded-full  flex gap-10">
        <button className="swiper-custom-prev p-4 bg-white rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 27"
            className="Pagination_arrow__xgX6n w-6 h-6"
          >
            <path
              fillRule="evenodd"
              fill="currentColor"
              d="M14.142,0.127 L17.753,3.737 L7.963,13.527 L17.753,23.318 L14.142,26.928 L0.743,13.527 L14.142,0.127 Z"
            ></path>
          </svg>
        </button>
        <button className="swiper-custom-next p-4 bg-white rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 27"
            className="Pagination_arrow__xgX6n Pagination_right__NDQb6 w-6 h-6 rotate-180"
          >
            <path
              fillRule="evenodd"
              fill="currentColor"
              d="M14.142,0.127 L17.753,3.737 L7.963,13.527 L17.753,23.318 L14.142,26.928 L0.743,13.527 L14.142,0.127 Z"
            ></path>
          </svg>
        </button>
      </div>

      {/* 自定义数字指示器容器 */}
      <div className="custom-pagination absolute -bottom-16 z-10 pointer-events-none text-xs font-bold">
        {current} / {total}
      </div>
    </div>
  );
};
