import { useRef } from 'react';
import { Icon } from '@/components/Icon';
import styles from './Contact.module.css';
import FallingText from './components/FallingText';
import DecryptedText from './components/DecryptedText';
import VariableProximity from '@/components/VariableProximity/VariableProximity';

export const PC_ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen w-full flex flex-col gap-24 text-black bg-[#fafafa]"
    >
      {/* 上部 */}
      <div className="min-h-0 flex justify-between ml-20 mt-20">
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
              <span className="lg:text-base text-xs font-medium pl-1">CONTACT US</span>
            </div>

            <div className="font-bold 2xl:text-[30px] xl:text-2xl lg:text-xl tracking-tight -mt-1">
              联系我们
            </div>
          </div>

          <div className="flex flex-col gap-4 font-medium">
            <div>
              <span className="pr-4 text-2xl">QQ.</span>
              <span className="text-lg">
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
              <span className="pr-4 text-2xl">ADDR.</span>
              <span className="text-lg">
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
              <span className="pr-4 text-2xl">MAIL.</span>
              <span className="text-lg">
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
            <div className="text-8xl font-extrabold">
              <VariableProximity
                label="CONTACT"
                containerRef={sectionRef}
                fromFontVariationSettings="'wght' 600, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                radius={150}
                falloff="gaussian"
              />
            </div>
            <div className="text-7xl font-extrabold text-[#00D4FF]">
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

          <div className="text-[#D9D9D9] font-semibold text-xs">
            29.535567°N
            <br />
            106.605065°E
          </div>
        </div>
      </div>

      {/* 下部 */}
      <div className="flex justify-between ml-20 mb-16 items-end relative">
        {/* 右侧 —— 宽度到内容区中间 */}
        <div className="w-[80rem] border-2 rounded-2xl bg-[#1a1a1a] h-75 flex items-center justify-center mr-20 font-bold">
          <FallingText
            text="HTML CSS JavaScript React Node.js Java Go Python MySQL Docker Git•Github Adobe Sketch Figma Linux TailwindCSS VSCode DeepSeek Claude•Code ChatGPT"
            highlightWords={['HTML', 'JavaScript', 'Java', 'Go', 'Python', 'Docker', 'Figma']}
            altWords={['DeepSeek', 'Claude•Code', 'ChatGPT']}
            altClass="alt"
            trigger="scroll"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            fontSize="1.2rem"
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
