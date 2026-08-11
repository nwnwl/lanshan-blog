import { useRef, useState, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import styles from './Contact.module.css';
import FallingText from './components/FallingText';
import VariableProximity from '@/components/VariableProximity/VariableProximity';
import SplitText from '@/components/SplitText/SplitText';

const FULL =
  'HTML CSS JavaScript React Node.js Java Go Python MySQL Docker Git•Github Codex Sketch Figma Linux TailwindCSS VSCode DeepSeek Claude•Code ChatGPT';
const SHORT =
  'HTML CSS JavaScript React Node.js Java Go Python MySQL Docker Git•Github Figma DeepSeek Claude•Code ChatGPT';
const MINI = 'HTML Codex JavaScript Java Go Python Git•Github Claude•Code';

export const PC_ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [toolkit, setToolkit] = useState(FULL);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setToolkit(w >= 1280 ? FULL : w >= 768 ? SHORT : MINI);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-0 w-full flex flex-col
      2xl:gap-24 xl:gap-36 gap-42
       text-black bg-[#fafafa]
       "
    >
      {/* 上部 */}
      <div
        className="min-h-0 flex justify-between ml-20
      xl:mt-20 mt-30 relative"
      >
        {/* 左侧 */}
        <div className="flex flex-col gap-12 min-w-0">
          <div className={`${styles.contactDecoration}`}>
            <div className="flex items-center">
              <div
                className="flex
                h-4 w-14
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
              <span className="xl:text-base lg:text-sm text-[0.92rem] font-medium pl-1">
                CONTACT US
              </span>
            </div>

            <div
              className="font-bold
            2xl:text-[30px] lg:text-[2rem] text-[1.6rem] tracking-tight -mt-1"
            >
              联系我们
            </div>
          </div>

          <div className="flex flex-col sm:gap-4 gap-6 font-medium">
            <div>
              <span className="sm:pr-11.5 pr-9.5 lg:text-2xl text-[1.2rem]">QQ.</span>
              <span
                className="text-lg
              cursor-pointer
              md:bg-[length:0%_2px]
              md:hover:bg-[length:100%_2px]
              bg-[length:0%_1px]
              hover:bg-[length:100%_1px] bg-no-repeat bg-left-bottom pb-0.5 transition-[background-size] duration-300 bg-gradient-to-r from-black to-black"
              >
                [ 1065475643 ]
              </span>
            </div>
            <div className="relative">
              <span className="lg:text-2xl text-[1.2rem] absolute top-1.75 sm:relative sm:inline sm:top-0">
                ADDR.
              </span>
              <span
                className="max-[640px]:pl-18.5 pl-4 text-lg cursor-pointer
              bg-origin-content
              md:bg-[length:0%_2px]
              md:hover:bg-[length:100%_2px]
              bg-[length:0%_1px]
              hover:bg-[length:100%_1px]
              bg-no-repeat bg-left-bottom pb-0.5 transition-[background-size] duration-300 bg-gradient-to-r from-black to-black"
              >
                [ 重庆市南岸区南山街道崇文路2号 <br className="sm:hidden" />
                （重庆邮电大学内）400065 ]
              </span>
            </div>
            <div>
              <span className="sm:pr-6.5 pr-6 lg:text-2xl text-[1.2rem]">MAIL.</span>
              <span
                className="text-lg cursor-pointer
              md:bg-[length:0%_2px]
              md:hover:bg-[length:100%_2px]
              bg-[length:0%_1px]
              hover:bg-[length:100%_1px]
              bg-no-repeat bg-left-bottom pb-0.5 transition-[background-size] duration-300 bg-gradient-to-r from-black to-black"
              >
                [ lanshan@lanshan.email ]
              </span>
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="mr-20 flex-col md:gap-6 sm:gap-16 text-right hidden sm:flex">
          <div className="tracking-widest">
            <div className="2xl:text-[6rem] xl:text-[5.4rem] lg:text-[4rem] text-[3.8rem] font-extrabold leading-none">
              <VariableProximity
                label="CONTACT"
                containerRef={sectionRef}
                fromFontVariationSettings="'wght' 600, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                radius={150}
                falloff="gaussian"
              />
            </div>
            <div
              className="2xl:text-[4.5rem] xl:text-[4rem] lg:text-[3rem] text-[2.6rem]
            font-extrabold text-[#00D4FF] leading-none"
            >
              <VariableProximity
                label="US"
                containerRef={sectionRef}
                fromFontVariationSettings="'wght' 600, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                radius={150}
                falloff="gaussian"
              />
            </div>
          </div>

          <div className="invisible font-semibold text-xs pointer-events-none" aria-hidden>
            29.535567°N
            <br />
            106.605065°E
          </div>
        </div>
        <div className="hidden sm:block sm:absolute right-20 bottom-0 text-right">
          <SplitText
            text={'29.535567°N\n106.605065°E'}
            className="text-[#D9D9D9] font-semibold text-xs whitespace-pre-line"
            tag="div"
            delay={30}
            threshold={0}
          />
        </div>
      </div>

      {/* 下部 */}
      <div
        className="flex justify-between ml-20
      items-end relative mb-30"
      >
        <div
          className="flex-1 border-2 rounded-2xl bg-[#1a1a1a]
        xl:h-75 lg:h-85 md:h-100 h-120
        flex items-center justify-center mr-20 font-bold"
        >
          <FallingText
            text={toolkit}
            highlightWords={['React', 'JavaScript', 'Java', 'Go', 'Python', 'Docker', 'Figma']}
            altWords={['DeepSeek', 'Claude•Code', 'ChatGPT', 'Codex']}
            altClass="alt"
            trigger="scroll"
            backgroundColor="transparent"
            wireframes={false}
            gravity={1}
            fontSize="clamp(15px, 1.6vw, 21px)"
            mouseConstraintStiffness={0.9}
          />
        </div>

        <div className="absolute sm:-top-8 right-26 sm:text-xs text-lg -top-16  flex items-center">
          <span className={styles.blinkDot} />
          Drag & throw — every tag here runs in production systems we operate
        </div>
      </div>
    </section>
  );
};
