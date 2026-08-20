import type { MouseEvent } from 'react';
import styles from '../ProjectSection.module.css';

interface ProjectProps {
  id: string;
  title: string;
  subTitle: string;
  borderT?: boolean;
  active?: boolean;
  onHover: () => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

function ProjectRow({ id, title, subTitle, borderT, active, onHover, onClick }: ProjectProps) {
  return (
    <div
      className={`${styles.row} border-b-2 flex gap-4 items-center pl-12
      group
      h-40 sm:h-48 lg:h-44 xl:h-49 2xl:h-60
      ${borderT ? 'border-t-2' : ''} ${active ? styles.active : ''}`}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <div
        className={`${styles.number} text-white
        text-[3.4rem] md:text-[4rem]
        lg:text-[4.4rem] xl:text-[4.9rem]
        2xl:text-[5.2rem] 3xl:text-[5.6rem]
        font-bold
        transition-all duration-400 ease-in-out z-10`}
      >
        {id}
      </div>
      <div
        className={`${styles.textGroup} flex flex-col gap-4 min-w-0 flex-1 z-10
        transition-colors duration-400 ease-in-out ${active ? 'text-white' : ''}`}
      >
        <span className="2xl:text-[3.6rem] lg:text-[2.8rem] md:text-[2.6rem] sm:text-[2.2rem] text-[1.8rem] font-black indent-3">
          {title}
        </span>
        <span
          className="2xl:text-base lg:text-sm md:text-[1rem] text-[0.8rem] font-semibold pl-4 whitespace-pre-wrap 
        max-[1024px]:-mt-2"
        >
          {'+  ' + subTitle + '  +'}
        </span>
      </div>
    </div>
  );
}

export default ProjectRow;
