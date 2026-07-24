interface ProjectProps {
  id: string;
  title: string;
  subTitle: string;
  borderT?: string;
  onHover: () => void;
  onLeave: () => void;
}

function ProjectRow({ id, title, subTitle, borderT, onHover, onLeave }: ProjectProps) {
  return (
    <div
      className={`border-b-2
         flex gap-10 items-center
          pl-16
           group 
          ${borderT}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={`text-white [-webkit-text-stroke:3px_black] 
        sm:text-8xl text-6xl 
        font-semibold
        group-hover:text-[#00D4FF] group-hover:[-webkit-text-stroke:2px_#00D4FF]
        transition-[color,-webkit-text-stroke] duration-300 ease-out`}
      >
        {id}
      </div>
      <div className="flex flex-col gap-4 min-w-0 flex-1">
        <span className="md:text-5xl sm:text-4xl text-2xl font-semibold tracking-normal">
          {title}
        </span>
        <span className="sm:text-xl text-sm font-normal pl-4">+ {subTitle} +</span>
      </div>
    </div>
  );
}

export default ProjectRow;
