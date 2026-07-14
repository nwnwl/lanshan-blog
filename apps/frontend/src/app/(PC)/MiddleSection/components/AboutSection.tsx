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

export const PC_AboutSection = () => {
  return (
    <section
      id="about"
      className="relative section h-screen w-full bg-white text-black overflow-hidden"
    >
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
          <span className="text-8xl tracking-tight">ABOUT US</span>
          <span className="text-2xl tracking-wider">PIONEERS OF EXPLORETION</span>
        </header>

        <main className="grid grid-cols-[1fr_3fr_1fr] flex-1 min-h-0">
          <div className="flex flex-col border-r-2 border-[#D1D1D1] gap-4 ">
            <span className="text-md  pt-8 pr-4 tracking-widest pl-8">
              LET THE WORLD SEE YOUR POTENTIAL
            </span>
            <div className="flex flex-col gap-4 pl-8">
              <span>____</span>
              <span>____</span>
              <span>____</span>
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

              <div className="absolute top-[-140] left-40 bg-[#00D4FF] w-50 h-50 flex flex-col justify-between ">
                <div className="bg-black w-4 h-4 m-4"></div>

                <div className="m-4">
                  <div className="bg-black w-4 h-20 "></div>

                  <div className="bg-black h-4 w-20"></div>
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

          <div className="pl-25 pr-6 flex flex-col ">
            <p className="indent-12 tracking-widest text-2xl font-medium mt-20">
              蓝山工作室是重庆邮电大学教育信息化办公室/信息中心指导的，专注于教育数字化，智能化创新应用研发的学生团体.工作室以开源为导向，通过开源生态构建来培养复合型人才，在我们的github官网分享了各部门培训课件，也在字节开源组织，apache基金会等其他云原生基金会开源组织积极参与贡献，获得了不错的影响力，是一支富有创造力、朝气蓬勃的数字化队伍
            </p>
          </div>
          <div className="border-l-2 border-[#D1D1D1] flex flex-col text-center pt-10 gap-4 tracking-wider">
            <p className="text-2xl pr-30 pl-10">TOWARD THE FUTURE</p>
            <p className="pr-15 text-sm  ">BEYOND LANSHAN</p>
          </div>
        </main>
      </div>

      <div className="absolute w-100 h-40 bottom-[-40] right-[-60] font-bold">
        <p className="flex flex-col gap-2 text-xs">
          <span>THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT</span>
          <span className="indent-15">MAKE IT WORK, MAKE IT RIGHT, MAKE IT FAST</span>
          <span className="indent-29">TAKE IS CHEAP, SHOW ME THE CODE</span>
        </p>
      </div>
    </section>
  );
};
