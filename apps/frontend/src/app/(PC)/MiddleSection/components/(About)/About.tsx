import Marquee from './components/Marquee';

const text_1 = ' // LANSHAN-BEYOND LANSHAN  YOUR POTENTIAL AWAITS\u00A0';
const text_2 = ' \\\\ UI DESIGN PRODUCT OPERATIONS OPERATION SECURITY FRONTEND BACKEND\u00A0';

export const PC_AboutSection = () => {
  return (
    <section id="about" className="section h-screen w-full flex flex-col overflow-hidden relative">
      <div className="w-full h-full font-semibold flex flex-col flex-1">
        <div className="header_about flex flex-col pl-10 pt-4 gap-1 pb-4 mb-10 bg-[#f0f0f076]">
          <div>
            <div className="inline-flex h-5 w-15 bg-[#D9D9D9] justify-end pr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 23 23"
                className="SectionTitle_arrow__qXHl7 w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  fill="currentColor"
                  d="M2.673,22.418 L2.673,19.398 L17.146,19.398 L0.740,2.992 L2.875,0.857 L19.280,17.263 L19.280,2.791 L22.300,2.791 L22.300,22.418 L2.673,22.418 Z"
                ></path>
              </svg>
            </div>
            <span className="md:text-xl text-xs font-medium pl-2">ABOUT US</span>
          </div>
          <span className="md:text-4xl sm:text-2xl text-xl tracking-tight">关于我们</span>
        </div>

        <div className="main_about min-h-0 flex md:gap-2 gap-1">
          <div className="flex flex-col gap-36">
            <div className="flex flex-col gap-4 pl-10">
              <span className="lg:text-sm text-xs  pt-8 pr-4 tracking-widest">
                LET THE WORLD
                <span className="block">SEE YOUR POTENTIAL</span>
              </span>
              <div className="flex flex-col gap-4">
                <span>___</span>
                <span>___</span>
                <span>___</span>
              </div>
              <div className="flex flex-col">
                <span className="bg-[#FF1AAC] h-6 w-1"></span>
                <span className="bg-[#01FFA2] h-8 w-1"></span>
                <span className="bg-[#FFFA00] h-10 w-1"></span>
              </div>
            </div>

            <div className="p-4 bg-[#D9D9D9] w-fit ml-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 41 48"
                className="__05-Gameplay_icon__Yiqki text-[#A6A6A6] md:w-18 md:h-18 h-12 w-12"
              >
                <path
                  fillRule="evenodd"
                  fill="currentColor"
                  d="M5.049,47.298 L5.049,41.157 L34.758,41.157 L34.758,12.322 L40.768,12.322 L40.768,41.157 L40.768,44.969 L40.768,47.298 L5.049,47.298 ZM0.243,0.899 L24.037,0.899 C26.983,3.909 28.645,5.607 31.591,8.617 L31.591,38.231 L0.243,38.231 L0.243,0.899 ZM6.587,31.401 L25.246,31.401 L25.246,26.809 L6.587,26.809 L6.587,31.401 Z"
                ></path>
              </svg>
            </div>
          </div>

          <div className="flex flex-1 mt-10">
            <div className="flex flex-col flex-1 gap-20 min-w-0 xl:p-20 lg:p-10 p-6">
              <div className="indent-12 tracking-widest lg:text-2xl md:text-xl text-md font-medium leading-relaxed">
                蓝山工作室是重庆邮电大学教育信息化办公室/信息中心指导的，专注于教育数字化、智能化创新应用研发的学生团队，开发了“We重邮”微信小程序、重庆市高校辅导员素质能力大赛系统等。工作室以开源为导向，通过开源生态构建来培养复合型人才，在我们的github官网分享了各部门培训课件，也在字节开源组织，apache基金会等其他云原生基金会开源组织积极参与贡献，获得了不错的影响力，是一支富有创造力、朝气蓬勃的数字化队伍
              </div>

              <div className="flex flex-col gap-4 xl:tracking-wider">
                <p className="xl:text-2xl lg:text-xl text-sm">TOWARD THE FUTURE</p>
                <p className="pr-15 xl:text-sm text-xs">BEYOND LANSHAN</p>
              </div>
            </div>

            <div className="bg-linear-to-b from-[#00D4FF] to-transparent  md:w-40 w-30 h-full p-4">
              <div className="bg-white h-full w-4 relative">
                <span className="absolute top-2 [writing-mode:vertical-rl] md:text-4xl text-2xl font-medium tracking-widest">
                  INTRODUCTION
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 滚动字幕 */}
      <Marquee text={text_1} bgColor={'bg-white'} textColor={'text-black'} direction="left" />
      <Marquee text={text_2} bgColor={'bg-white'} textColor={'text-black'} direction="right" />
    </section>
  );
};
