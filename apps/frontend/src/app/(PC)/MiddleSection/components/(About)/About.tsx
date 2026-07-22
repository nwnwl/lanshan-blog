'use client';
import { Icon } from '@/components/Icon';

export const PC_AboutSection = () => {
  return (
    <section id="about" className="h-screen w-full flex flex-col relative">
      <div className="w-full h-full font-semibold flex ">
        {/* 左侧 */}
        <div className="header_about flex-1 flex flex-col pl-10 gap-1 py-4 my-10">
          <div className="flex flex-col justify-center">
            <div className="flex items-center">
              <div className="flex h-5 w-15 bg-[#D9D9D9] justify-end items-center pr-1">
                <Icon name="arrow" className="SectionTitle_arrow__qXHl7" size={16} />
              </div>
              <span className="md:text-xl text-xs font-medium pl-2">ABOUT US</span>
            </div>
            <div>
              <span className="md:text-4xl sm:text-2xl text-xl tracking-tight">关于我们</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-4 pl-4 md:pl-10">
              <span className="lg:text-sm text-xs  pt-8 pr-4 tracking-widest">
                LET THE WORLD SEE YOUR POTENTIAL
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

            <div className="p-4 bg-[#D9D9D9] w-fit ">
              <Icon
                name="gameplay"
                className="__05-Gameplay_icon__Yiqki md:w-15 md:h-15 h-10 w-10"
              />
            </div>
          </div>
        </div>
        {/* 右侧信息栏 */}
        <div className="main_about flex-6 flex pl-10 gap-1 py-4 my-10">
          <div className="flex flex-1 ">
            <div className="flex flex-col justify-between flex-1 gap-20 min-w-0 pb-0 lg:p-6 lg:pb-0 xl:p-10 xl:pb-0">
              <div className="indent-12 tracking-widest lg:text-2xl md:text-xl text-md font-medium leading-relaxed">
                蓝山工作室是重庆邮电大学教育信息化办公室/信息中心指导的，专注于教育数字化、智能化创新应用研发的学生团队，开发了“We重邮”微信小程序、重庆市高校辅导员素质能力大赛系统等。工作室以开源为导向，通过开源生态构建来培养复合型人才，在我们的github官网分享了各部门培训课件，也在字节开源组织，apache基金会等其他云原生基金会开源组织积极参与贡献，获得了不错的影响力，是一支富有创造力、朝气蓬勃的数字化队伍
              </div>

              <div className="flex flex-col gap-4 xl:tracking-wider">
                <p className="xl:text-2xl lg:text-xl text-sm">TOWARD THE FUTURE</p>
                <p className="pr-15 xl:text-sm text-xs">BEYOND LANSHAN</p>
              </div>
            </div>

            <div className="bg-[#00D4FF] md:w-40 w-30 h-full p-4 min-w-0">
              <div className="bg-white h-full w-4 relative">
                <span className="absolute top-2 [writing-mode:vertical-rl] md:text-4xl text-2xl font-medium tracking-widest">
                  INTRODUCTION
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
