import styles from '../ProjectSection.module.css';

interface ProjectProps {
  id: string;
  title: string;
  subTitle: string;
  borderT?: boolean;
  onHover: () => void;
}

function ProjectRow({ id, title, subTitle, borderT, onHover }: ProjectProps) {
  return (
    <div
      className={`${styles.row} border-b-2 flex gap-4 items-center pl-12 
      group 
      h-40 sm:h-48 lg:h-44 xl:h-49 2xl:h-60 
      ${borderT ? 'border-t-2' : ''}`}
      onMouseEnter={onHover}
    >
      <div
        className="text-white 
        lg:[-webkit-text-stroke:2px_black]
        2xl:[-webkit-text-stroke:3px_black]
        lg:text-[4.4rem] xl:text-[4.9rem] 
        2xl:text-[5.2rem] 3xl:text-[5.6rem]
        font-bold
        group-hover:text-[#00D4FF] 
        group-hover:[-webkit-text-stroke:0]
        transition-all duration-400 ease-in-out z-10"
      >
        {id}
      </div>
      <div
        className="flex flex-col gap-4 min-w-0 flex-1 z-10
        group-hover:text-white
        transition-colors duration-400 ease-in-out"
      >
        <span className="2xl:text-[3.6rem] lg:text-[2.8rem] md:text-5xl sm:text-4xl text-2xl font-black indent-3">
          {title}
        </span>
        <span className="2xl:text-base lg:text-sm sm:text-xl text-sm font-semibold pl-4 whitespace-pre-wrap">
          {'+  ' + subTitle + '  +'}
        </span>
      </div>
    </div>
  );
}

export default ProjectRow;
