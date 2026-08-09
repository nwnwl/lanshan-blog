import { Icon } from '@/components/Icon';
import styles from './Contact.module.css';
import { MountainCanvas } from './MountainCanvas';

export const PC_ContactSection = () => {
  return (
    <section id="contact" className="min-h-screen w-full flex flex-col gap-20 bg-white text-black">
      {/* 上部 */}
      <div className="min-h-0 flex justify-between ml-12">
        {/* 左侧 */}
        <div className="flex flex-col gap-12 mt-16">
          <div className={`${styles.contactDecoration}`}>
            <div className="flex items-center">
              <div
                className="flex 
                md:w-14
                h-4 w-10  
                 bg-[#D9D9D9] justify-end items-center pr-0.5
                 2xl:pr-1
                 xl:pb-0 lg:pb-0.5"
              >
                <Icon
                  name="arrow"
                  className="SectionTitle_arrow__qXHl 
                  w-3 h-3
                  "
                />
              </div>
              <span className="lg:text-base text-xs font-medium pl-1">CONTACT US</span>
            </div>

            <div className="font-bold 2xl:text-[30px] xl:text-2xl lg:text-xl tracking-tight -mt-1">
              联系我们
            </div>
          </div>

          <div className="flex flex-col gap-2 font-medium">
            <div>
              <span className="pr-4 text-2xl">QQ.</span>
              {'[  ' + '1065475643' + ' ]'}
            </div>
            <div>
              <span className="pr-4 text-2xl">ADDR.</span>
              {'[  ' + '重庆市南岸区南山街道崇文路2号 ]（重庆邮电大学内）400065' + ' ]'}
            </div>
            <div>
              <span className="pr-4 text-2xl">MAIL.</span>
              {'[  ' + 'lanshan@lanshan.email' + ' ]'}
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="pr-12 flex flex-col gap-16 mt-8  text-right">
          <div className="font-extrabold tracking-widest">
            <div className="text-8xl">CONTACT</div>
            <div className="text-7xl text-[#00D4FF]">US</div>
          </div>

          <div className="text-[#D9D9D9] font-semibold">
            29.535567°N
            <br />
            106.605065°E
          </div>
        </div>
      </div>

      {/* 下部 */}
      <div className="mt-12 mx-auto max-w-[700px] w-full">
        <MountainCanvas />
      </div>
    </section>
  );
};
