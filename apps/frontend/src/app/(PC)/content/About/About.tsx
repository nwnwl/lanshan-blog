'use client';
import { Icon } from '@/components/Icon';
import styles from './About.module.css';
import { MyCarousel } from '@/components/MyCarousel/MyCarousel';

export const PC_AboutSection = () => {
  return (
    <section id="about" className="min-h-screen w-full">
      {/* 第一部分 */}
      <div className="w-full min-h-0 flex ml-30 mt-12 pb-40">
        {/* 左侧 */}
        <div
          className={`header_about flex flex-col justify-between
          ${styles.aboutHeader}`}
        >
          {/* header部分 */}
          <div
            className={`flex flex-col
            ${styles.aboutDecoration}`}
          >
            <div className="flex items-center">
              <div
                className="flex 
              md:w-14
              h-4 w-10  
               bg-[#D9D9D9] justify-end items-center pr-1"
              >
                <Icon
                  name="arrow"
                  className="SectionTitle_arrow__qXHl 
                w-3 h-3
                "
                />
              </div>
              <span className="lg:text-base text-xs font-medium pl-1">OVERVIEW</span>
            </div>
            <div className="font-bold md:text-2xl text-xl tracking-tight -mt-1">工作室概况</div>
          </div>

          {/* 左侧装饰 */}
          <div className="p-2 bg-[#D9D9D9] w-fit">
            <Icon name="gameplay" className="__05-Gameplay_icon__Yiqki md:w-15 md:h-15 h-10 w-10 p-1" />
          </div>
        </div>

        {/* 右侧 */}
        <div className="pl-20 flex">
          {/* 右侧图片 */}
          <div className="relative">
            <MyCarousel />
          </div>
          {/* 蓝色装饰 */}
          <div className={`bg-[#00D4FF] w-[189.573px] py-4 pl-4 ${styles.aboutRight}`}>
            <div className="bg-white h-full w-4 relative">
              <span className="absolute top-1 [writing-mode:vertical-rl] md:text-4xl text-2xl font-semibold tracking-wider">
                OVERVIEW
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 第二部分 */}
      <div className="w-full min-h-0 flex ml-30 mt-16">
        {/* 左侧 */}
        <div className="pr-20 flex">
          {/* 灰色装饰 */}
          <div className={`bg-[#EDEDED] w-[189.573px] py-4 pl-4 ${styles.aboutRight}`}>
            <div className="bg-white h-full w-4 relative">
              <span className="absolute top-2 [writing-mode:vertical-rl] md:text-4xl text-2xl font-semibold tracking-wider">
                BENEFITS
              </span>
            </div>
          </div>
          {/* 左侧图片 */}
          <div className="relative">
            <MyCarousel />
          </div>
        </div>

        {/* 右侧 */}
        <div
          className={`header_about flex flex-col justify-between
          ${styles.aboutHeader}`}
        >
          {/* header部分 */}
          <div
            className={`flex flex-col justify-center
            ${styles.aboutDecoration}`}
          >
            <div className="flex items-center">
              <div
                className="flex 
              md:w-14
              h-4 w-10  
               bg-[#D9D9D9] justify-end items-center pr-1"
              >
                <Icon
                  name="arrow"
                  className="SectionTitle_arrow__qXHl 
                w-3 h-3
                "
                />
              </div>
              <span className="lg:text-base text-xs font-medium pl-1 ">BENEFITS</span>
            </div>
            <div className="font-bold lg:text-2xl md:text-2xl text-xl tracking-tight -mt-1">成员权益</div>
          </div>

          {/* 左侧装饰 */}
          <div className="p-2 bg-[#D9D9D9] w-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 57 47"
              className="__08-AIC_icon__lIZuJ p-1 md:w-15 md:h-15 h-10 w-10
              text-[#A6A6A6]"
            >
              <path
                fillRule="evenodd"
                fill="currentColor"
                d="M27.127,12.817 C21.471,12.817 16.885,17.503 16.885,23.282 C16.885,29.065 21.471,33.751 27.127,33.751 C27.557,33.751 27.981,33.721 28.397,33.668 L28.397,46.516 L14.001,46.516 L0.876,23.282 L14.001,0.052 L40.253,0.052 L50.379,17.969 L35.953,17.969 C34.170,14.886 30.886,12.817 27.127,12.817 ZM40.479,26.382 L36.055,21.862 L46.634,21.862 L46.631,30.607 L46.631,31.722 L56.119,41.418 L50.711,46.944 L41.223,37.249 L31.572,37.249 L31.572,26.443 L35.995,30.963 L40.479,26.382 Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
