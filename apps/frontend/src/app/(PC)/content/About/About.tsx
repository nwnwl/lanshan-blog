'use client';
import { Icon } from '@/components/Icon';
import styles from './About.module.css';

export const PC_AboutSection = () => {
  return (
    <section id="about" className="min-h-screen w-full">
      <div className="w-full min-h-0 flex ml-60 mt-16">
        {/* 左侧 */}
        <div
          className={`header_about flex flex-col justify-between
          ${styles.aboutHeader}`}
        >
          {/* header部分 */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center">
              <div
                className="flex 
              md:h-5 md:w-18
              h-4 w-10  
               bg-[#D9D9D9] justify-end items-center pr-1"
              >
                <Icon
                  name="arrow"
                  className="SectionTitle_arrow__qXHl 
                md:w-4 md:h-4
                w-3 h-3
                "
                />
              </div>
              <span className="lg:text-2xl text-xs font-medium pl-2">ABOUT US</span>
            </div>
            <div className="font-bold lg:text-4xl md:text-2xl text-xl tracking-tight">关于我们</div>
          </div>

          {/* 左侧装饰 */}
          <div className="p-4 bg-[#D9D9D9] w-fit">
            <Icon name="gameplay" className="__05-Gameplay_icon__Yiqki md:w-15 md:h-15 h-10 w-10" />
          </div>
        </div>

        {/* 右侧图片 */}
        <div className="pl-32 flex">
          <div className="relative">
            <img
              src="/picture/studio-1.png"
              alt="studio picture"
              className="w-[1305.420px] h-[767.891px]"
            />

            {/* 下侧信息栏 */}
            <div className="absolute w-[811.375px] mt-10 left-10">
              <div className="relative text-[42.3333px] font-semibold">
                <span>探索工作室</span>
                <div className="absolute text-xs top-2 -left-10">1 / 4</div>
              </div>
              <div className="text-[26.4583px] font-medium ">
                蓝山工作室是由教育信息化办公室/信息中心指导的，从事互联网产品、教育信息化产品开发运营和服务全体师生的校级学生组织。
              </div>
            </div>
          </div>
          {/* 蓝色装饰 */}
          <div className={`bg-[#00D4FF] w-[268.109px] py-4 pl-6 ${styles.aboutRight}`}>
            <div className="bg-white h-full w-6 relative">
              <span className="absolute top-2 [writing-mode:vertical-rl] md:text-5xl text-2xl font-semibold tracking-wider">
                OVERVIEW
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* 装饰文字 */

{
  /* <div className="flex flex-col gap-4 xl:tracking-wider">
                <p className="xl:text-2xl lg:text-xl text-sm">TOWARD THE FUTURE</p>
                <p className="pr-15 xl:text-sm text-xs">BEYOND LANSHAN</p>
              </div> */
}
