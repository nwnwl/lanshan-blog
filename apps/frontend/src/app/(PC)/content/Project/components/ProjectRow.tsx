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
           relative
          ${borderT}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={`text-white [-webkit-text-stroke:3px_black]
        sm:text-8xl text-6xl
        font-bold
        group-hover:text-[#00D4FF]
        transition-all duration-600 ease-in-out`}
      >
        {id}
      </div>
      <div
        className="flex flex-col gap-4 min-w-0 flex-1 z-10
      group-hover:text-white
      transition-colors duration-600 ease-in-out"
      >
        <span className="md:text-5xl sm:text-4xl text-2xl font-black tracking-normal">{title}</span>
        <span className="sm:text-xl text-sm font-normal pl-4">+ {subTitle} +</span>
      </div>
      <div
        className="z-[-1] absolute -top-[2px] -bottom-[2px] left-0 right-0
      bg-black
      origin-center
      scale-y-0 group-hover:scale-y-100
      transition-transform duration-400 ease-in-out"
      ></div>
    </div>
  );
}

export default ProjectRow;
