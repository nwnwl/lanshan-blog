import { Icon } from '@/components/Icon';
import styles from './page.module.css';

export default function testPage() {
  return (
    <div className="h-full w-full">
      <div className="relative h-full w-full flex flex-col items-center justify-center">
        <div
          className={`${styles.stripe} absolute
          left-[1rem] bottom-[2rem]
          w-[2rem] h-[5rem]
          flex flex-col items-center justify-center gap-[8px]
          group
          hover:w-[10rem] hover:h-[2rem]
          transition-all duration-300 ease-in-out
          overflow-hidden`}
        >
          <div
            className="absolute top-0 left-0
          w-full h-full bg-[#fffa00] 
          opacity-0 group-hover:opacity-100
          transition-all duration-200 z-0"
          ></div>
          <Icon
            name="joinus"
            size="1rem"
            className={`
          absolute top-[0.5rem] left-[0.5rem]
          text-[#ffffff]
          group-hover:text-[#000000]`}
          />
          <div
            className={`absolute h-[2px] w-[1.4rem] 
            bg-[#ffffff4d] 
            top-[2rem] left-[0.3rem]
            group-hover:top-[4rem]
            `}
          />
          <div
            className="absolute
          top-[2.5rem] left-0
          w-[2rem]
          text-center text-[0.7rem] text-[#ffffff] font-bold  
          group-hover:top-[4.5rem]"
          >
            <span>加入我们</span>
          </div>
          <div
            className={`absolute bottom-[0.3rem] left-[3rem]
             w-[2px] h-[1.4rem] bg-[#0000004d]
             opacity-0 group-hover:opacity-100
             transition-all duration-800 ease-in-out `}
          />
          <div
            className="absolute
          bottom-[0.5rem] left-[5rem]
          w-[2rem]
          text-center text-[0.7rem] text-[#000000] font-bold 
          opacity-0 group-hover:opacity-100
          transition-all duration-800 ease-in-out 
          "
          >
            <span className="text-[0.7rem] text-black font-bold whitespace-nowrap">加入我们</span>
          </div>
        </div>
      </div>
    </div>
  );
}
