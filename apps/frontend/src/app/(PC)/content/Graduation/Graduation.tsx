import { Icon } from '@/components/Icon';

export const PC_GraduationSection = () => {
  return (
    <section id="graduation" className="h-screen w-full">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[68rem] h-[40rem] flex gap-[3rem] items-end">
          <div
            className="w-[4.5rem] h-full bg-[#00d4ff] 
          flex flex-col items-center justify-between"
          >
            <div className="w-[12rem] -translate-x-[0.8rem]">
              <img src="/picture/cdlm.png" alt="cdlm" />
            </div>
            <div className="w-full flex flex-col items-center">
              <div
                className="w-[2.6rem] h-[2rem] 
              border-b-2
              font-bold text-[1.2rem] text-center"
              >
                <span>最新</span>
              </div>
              <div className="w-full h-[8rem] flex justify-center items-center">
                <Icon name="newRF" className="h-[7rem] w-[6rem] rotate-90" />
              </div>
            </div>
          </div>

          <div className="flex-1 h-full flex">
            <div className="flex-1 flex flex-col">
              <div className="w-full h-[6rem] pt-[1rem]">
                <div className="relative flex flex-col justify-center">
                  <div className="absolute bottom-[calc(100%-10px)]">
                    <Icon name="mos" className="w-[5rem]" />
                  </div>
                  <div className="flex items-center">
                    <div className="flex h-4 w-10 md:h-5 md:w-15 bg-[#D9D9D9] justify-end items-center pr-1">
                      <Icon name="arrow" className="md:w-4 md:h-4 w-3 h-3" />
                    </div>
                    <span className="lg:text-xl text-xs font-medium pl-2">GO</span>
                  </div>
                  <div className="font-bold text-[1.5rem]">
                    <span>毕业去向</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-black"></div>
            </div>

            <div className="self-end h-[34rem] w-[10rem] bg-[#EDEDED] p-[1rem]">
              <div className="h-full w-[1rem] bg-white">
                <div
                  className="font-bold text-[2rem] leading-none
                rotate-90
                translate-x-[0.8rem]"
                >
                  <span>GO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
