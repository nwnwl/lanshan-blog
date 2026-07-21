interface ProjectProps {
  id: string;
  title: string;
  subTitle: string;
  borderT?: string;
}

function ProjectRow({ id, title, subTitle, borderT }: ProjectProps) {
  return (
    <div
      className={`border-b-4
         flex gap-6 items-center
          pl-14
           group hover:bg-black 
           [-webkit-text-stroke:0px_transparent] transition-[background-color,color,-webkit-text-stroke] duration-300 ease-out ${borderT}`}
    >
      <div
        className="text-[#00D4FF] text-7xl font-semibold
       group-hover:text-white group-hover:[-webkit-text-stroke:4px_black]"
      >
        {id}
      </div>
      <div className="flex flex-col gap-4 group-hover:text-white">
        <span className="text-5xl font-black tracking-wider">{title}</span>
        <span className="text-xl font-semibold pl-4">+ {subTitle} +</span>
      </div>
    </div>
  );
}

export default ProjectRow;
