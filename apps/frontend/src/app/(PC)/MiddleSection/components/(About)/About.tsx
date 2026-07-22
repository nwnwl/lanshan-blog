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
          <div className="flex flex-1">
            <div className="flex flex-col justify-between flex-1 gap-20 min-w-0 pb-0 lg:p-6 lg:pb-0 xl:p-10 xl:pb-0">
              <div className="indent-12 tracking-widest lg:text-2xl md:text-xl text-md font-medium pt-10 2xl:leading-loose leading-relaxed">
                <p>
                  蓝山工作室是由重庆邮电大学信息中心、信息化办指导的技术型学生社团，是学校教育数字化转型与智能化升级的排头兵。工作室以"AI赋能教育，技术服务师生，实践收获成长"为理念，聚焦教育场景下数字化工具、AI智能体研发、应用落地等关键方向，打造"AI+教育"数字化产品。我们深耕校园服务应用开发，在实践中淬炼技术落地；我们探索AI智能体工具研发，在创新中激发科研潜力；我们构建多元化培养模式，在团队协作中提升求职竞争力。工作室内90%毕业后的学生斩获众多offer，进入字节跳动、腾讯、小米、美团等互联网头部企业工作。
                </p>
                <p>
                  蓝山工作室下设产品及运营部、运维与安全部、研发部、UI设计部4个部门7个组，其中研发部根据不同的技术栈分为前端开发组、GO语言开发组、Java开发组、Python开发组。
                </p>
              </div>

              <div className="flex flex-col gap-4 xl:tracking-wider">
                <p className="xl:text-2xl lg:text-xl text-sm">TOWARD THE FUTURE</p>
                <p className="pr-15 xl:text-sm text-xs">BEYOND LANSHAN</p>
              </div>
            </div>

            <div className="bg-linear-to-b from-[#00D4FF] to-transparent md:w-40 w-30 h-full p-4 min-w-0">
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
