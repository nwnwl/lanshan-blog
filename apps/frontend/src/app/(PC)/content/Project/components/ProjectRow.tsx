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
      className={`${styles.row} border-b-2 flex gap-10 items-center pl-16 group ${borderT ? 'border-t-2' : ''}`}
      onMouseEnter={onHover}
    >
      <div
        className="text-white [-webkit-text-stroke:3px_black]
        sm:text-8xl text-6xl font-bold
        group-hover:text-[#00D4FF] group-hover:[-webkit-text-stroke-color:#00D4FF]
        transition-all duration-400 ease-in-out z-10"
      >
        {id}
      </div>
      <div
        className="flex flex-col gap-4 min-w-0 flex-1 z-10
        group-hover:text-white
        transition-colors duration-400 ease-in-out"
      >
        <span className="md:text-5xl sm:text-4xl text-2xl font-black tracking-normal">{title}</span>
        <span className="sm:text-xl text-sm font-bold pl-4">+ {subTitle} +</span>
      </div>
    </div>
  );
}

export default ProjectRow;
