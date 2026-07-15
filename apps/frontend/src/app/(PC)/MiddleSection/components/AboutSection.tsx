import Marquee from '@/components/Marquee';
import styles from './AboutSection.module.css';
import Image from 'next/image';

const barcodeData = [
  { x: 0, w: 2 },
  { x: 4, w: 1 },
  { x: 6, w: 3 },
  { x: 10, w: 1 },
  { x: 13, w: 2 },
  { x: 16, w: 1 },
  { x: 19, w: 4 },
  { x: 25, w: 1 },
  { x: 28, w: 2 },
  { x: 32, w: 3 },
  { x: 38, w: 1 },
  { x: 42, w: 2 },
  { x: 46, w: 1 },
  { x: 50, w: 4 },
  { x: 56, w: 1 },
  { x: 59, w: 2 },
  { x: 63, w: 1 },
  { x: 66, w: 2 },
  { x: 70, w: 3 },
  { x: 75, w: 1 },
  { x: 79, w: 2 },
  { x: 83, w: 1 },
  { x: 87, w: 4 },
  { x: 93, w: 2 },
  { x: 97, w: 1 },
  { x: 101, w: 3 },
  { x: 106, w: 1 },
  { x: 110, w: 2 },
  { x: 114, w: 3 },
  { x: 118, w: 2 },
];

const text = ' // LANSHAN-BEYOND LANSHAN  YOUR POTENTIAL AWAITS ';

export const PC_AboutSection = () => {
  return (
    <section id="about" className="section h-screen w-full flex flex-col overflow-hidden">
      {/* 滚动字幕 */}
      <Marquee
        text={text}
        bgColor={'#EEEDED'}
        textColor={'#CECECE'}
        lgText={'text-9xl'}
        normalTextSize={'text-8xl'}
      />

      <div className="flex-1 relative bg-white text-black overflow-hidden ">
        {/* 波点背景 */}
        <div className="absolute inset-x-0 top-0 bg-[radial-gradient(circle,#000_1.6px,transparent_1.2px)] bg-size-[8px_8px] h-15 w-full"></div>

        {/* 斜线背景 */}
        <div className="absolute bottom-0 top-14 right-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,#C0C0C0_6px,#C0C0C0_5px)] h-full w-15"></div>

        {/* 小圆点装饰-左 */}
        <div className="absolute top-4 left-6">
          <div className={`${styles.dotsBase} ${styles.dotsLt} absolute `}></div>
        </div>

        {/* 小圆点装饰-右 */}
        <div className="absolute top-20 right-20">
          <div className={`${styles.dotsBase} ${styles.dotsRt} absolute`}></div>
        </div>

        <div className="w-full h-full font-semibold flex flex-col relative">
          <header className="flex flex-col pl-20 pt-4 gap-2 pb-15 border-b-2 border-[#D1D1D1]">
            <span className="xl:text-8xl lg:text-7xl text-6xl tracking-tight">ABOUT US</span>
            <span className="xl:text-2xl lg:text-xl lg:tracking-wider">
              PIONEERS OF EXPLORETION
            </span>
          </header>

          <main className="grid grid-cols-[1fr_3fr_1fr] flex-1 min-h-0">
            <div className="flex flex-col border-r-2 border-[#D1D1D1] gap-4 ">
              <span className="xl:text-md lg:text-sm  pt-8 pr-4 tracking-widest pl-8">
                LET THE WORLD SEE YOUR POTENTIAL
              </span>
              <div className="flex flex-col gap-4 pl-8">
                <span>___</span>
                <span>___</span>
                <span>___</span>
              </div>
              <div className="flex flex-col gap-4 text-xs pl-8">
                <span>01</span>
                <span>02</span>
                <span>03</span>
              </div>

              <div className="w-full h-48 bg-[#D9D9D9] mt-20 relative">
                <div className="absolute top-0 left-0 w-8 h-4 bg-[#FF19AB]"></div>
                <div className="absolute top-6 left-0 w-8 h-3 bg-[#FFFA00]"></div>
                <div className="absolute top-11 left-0 w-8 h-1.5 bg-[#00D4FF]"></div>

                <div className="absolute bottom-0 right-0">
                  <svg width="120" height="30" viewBox="0 0 120 30">
                    {barcodeData.map((bar, i) => (
                      <rect key={i} x={bar.x} y={0} width={bar.w} height={30} fill="black" />
                    ))}
                  </svg>
                </div>

                <div className="absolute 2xl:top-[-120] xl:top-[-80] md:top-[-60] sm:top-[-40]   2xl:left-45 lg:left-30 md:left-25 sm:left-14 bg-[#00D4FF] 2xl:w-70 2xl:h-50 xl:w-50 xl:h-40 md:w-45 md:h-45 sm:w-40 sm:h-40 h-0 w-0 flex flex-col justify-between ">
                  <div className="bg-black sm:w-4 sm:h-4 m-4"></div>

                  <div className="mb-4 ml-4">
                    <div className="bg-black sm:w-4 md:h-20 sm: h-15 "></div>

                    <div className="bg-black sm:h-4 sm:w-20"></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pl-10 absolute bottom-4">
                <div className="w-8 h-8 bg-[#D9D9D9]">
                  <Image src="/icon/aboutus.svg" height={60} width={60} alt="" />
                </div>
                <div className="w-8 h-8 bg-[#D9D9D9] flex justify-center items-center">
                  <div className="w-6 h-6 border-6"></div>
                </div>
              </div>
            </div>

            <div className="sm:pl-25 pl-4 sm:pr-6 pr-3 flex flex-col ">
              <p className="indent-12 tracking-widest xl:text-2xl md:text-xl text-md font-medium mt-20">
                蓝山工作室是重庆邮电大学教育信息化办公室/信息中心指导的，专注于教育数字化，智能化创新应用研发的学生团体.工作室以开源为导向，通过开源生态构建来培养复合型人才，在我们的github官网分享了各部门培训课件，也在字节开源组织，apache基金会等其他云原生基金会开源组织积极参与贡献，获得了不错的影响力，是一支富有创造力、朝气蓬勃的数字化队伍
              </p>
            </div>
            <div className="border-l-2 border-[#D1D1D1] flex flex-col text-center pt-10 gap-4 xl:tracking-wider">
              <p className="xl:text-2xl lg:text-xl  pr-30 pl-10">TOWARD THE FUTURE</p>
              <p className="pr-15 xl:text-sm text-xs  ">BEYOND LANSHAN</p>
            </div>
          </main>
        </div>

        <div className="absolute w-100 h-40 bottom-[-40] right-[-60] font-bold">
          <p className="flex flex-col gap-2 text-xs">
            <span>THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT</span>
            <span className="indent-15">MAKE IT WORK, MAKE IT RIGHT, MAKE IT FAST</span>
            <span className="indent-29">TALK IS CHEAP, SHOW ME THE CODE</span>
          </p>
        </div>
      </div>
    </section>
  );
};
