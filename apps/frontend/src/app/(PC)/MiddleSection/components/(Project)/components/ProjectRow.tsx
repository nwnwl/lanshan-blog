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
         flex gap-6 items-center
          pl-14
           group 
          ${borderT}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={`text-white [-webkit-text-stroke:3px_black] text-7xl font-semibold
        group-hover:text-[#00D4FF] group-hover:[-webkit-text-stroke:2px_#00D4FF]
        transition-[color,-webkit-text-stroke] duration-300 ease-out`}
      >
        {id}
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-4xl font-normal tracking-normal">{title}</span>
        <span className="text-xl font-normal pl-4">+ {subTitle} +</span>
      </div>
    </div>
  );
}

export default ProjectRow;
