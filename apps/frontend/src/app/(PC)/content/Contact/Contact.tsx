import { useRef, useState, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import styles from './Contact.module.css';
import FallingText from './components/FallingText';
import DecryptedText from './components/DecryptedText';
import VariableProximity from '@/components/VariableProximity/VariableProximity';

const FULL =
  'HTML CSS JavaScript React Node.js Java Go Python MySQL Docker Git•Github Codex Sketch Figma Linux TailwindCSS VSCode DeepSeek Claude•Code ChatGPT';
const SHORT =
  'HTML CSS JavaScript React Node.js Java Go Python MySQL Docker Git•Github Figma DeepSeek Claude•Code ChatGPT';
const MINI = 'HTML CSS JavaScript Java Go Python Git•Github Claude•Code';

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
      2xl:gap-24 gap-36
       text-black bg-[#fafafa]
       "
    >
      {/* 上部 */}
      <div
        className="min-h-0 flex justify-between ml-20 
      xl:mt-20 mt-30"
      >
        {/* 左侧 */}
        <div className="flex flex-col gap-12">
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
              <span className="xl:text-base lg:text-sm text-[0.92rem] font-medium pl-1">
                CONTACT US
              </span>
            </div>

            <div
              className="font-bold 
            2xl:text-[30px] xl:text-2xl lg:text-xl text-[1.4rem] tracking-tight -mt-1"
            >
              联系我们
            </div>
          </div>

          <div className="flex flex-col gap-4 font-medium">
            <div>
              <span className="pr-4 xl:text-2xl lg:text-lg">QQ.</span>
              <span className="xl:text-lg lg:text-sm">
                <DecryptedText
                  text="[  1065475643"
                  animateOn="hover"
                  revealDirection="start"
                  speed={30}
                  maxIterations={10}
                  sequential
                  useOriginalCharsOnly
                />{' '}
                ]
              </span>
            </div>
            <div>
              <span className="pr-4 xl:text-2xl lg:text-lg">ADDR.</span>
              <span className="xl:text-lg lg:text-sm">
                <DecryptedText
                  text="[  重庆市南岸区南山街道崇文路2号 ]（重庆邮电大学内）400065"
                  animateOn="hover"
                  revealDirection="start"
                  speed={30}
                  maxIterations={15}
                  sequential
                  useOriginalCharsOnly
                />{' '}
                ]
              </span>
            </div>
            <div>
              <span className="pr-4 xl:text-2xl lg:text-lg">MAIL.</span>
              <span className="xl:text-lg lg:text-sm">
                <DecryptedText
                  text="[  lanshan@lanshan.email"
                  animateOn="hover"
                  revealDirection="start"
                  speed={30}
                  maxIterations={10}
                  sequential
                  useOriginalCharsOnly
                />{' '}
                ]
              </span>
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="mr-20 flex flex-col gap-6  text-right">
          <div className="tracking-widest">
            <div className="2xl:text-8xl xl:text-[5rem] lg:text-[4rem] text-[3.8rem] font-extrabold">
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
              className="2xl:text-7xl xl:text-[4rem] lg:text-[3rem] text-[2.6rem]
            font-extrabold text-[#00D4FF]
            2xl:mt-0 xl:-mt-4 -mt-6"
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

          <div className="text-[#D9D9D9] font-semibold lg:text-xs">
            29.535567°N
            <br />
            106.605065°E
          </div>
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
            highlightWords={['HTML', 'JavaScript', 'Java', 'Go', 'Python', 'Docker', 'Figma']}
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

        <div className="absolute -top-8 right-26 text-xs flex items-center">
          <span className={styles.blinkDot} />
          Drag & throw — every tag here runs in production systems we operate
        </div>
      </div>
    </section>
  );
};
