function Marquee() {
  const text = ' // LANSHAN-BEYOND LANSHAN  YOUR POTENTIAL AWAITS ';

  return (
    <div className="bg-[#EEEDED] text-[#CECECE] overflow-hidden w-full">
      <div className="flex w-fit whitespace-nowrap animate-marquee">
        <span className="text-xl md:text-8xl font-bold  tracking-widest">{text}</span>
        <span className="text-xl md:text-8xl font-bold tracking-widest">{text}</span>
      </div>
    </div>
  );
}

export default Marquee;
