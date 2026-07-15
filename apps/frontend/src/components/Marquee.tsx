interface MarqueeProps {
  text: string;
  bgColor: string;
  textColor: string;
  lgText: string;
  normalTextSize: string;
}

function Marquee({ text, bgColor, textColor, lgText, normalTextSize }: MarqueeProps) {
  return (
    <div className={`"bg-[${bgColor}] text-[${textColor}] overflow-hidden w-full"`}>
      <div className="flex w-fit whitespace-nowrap animate-marquee">
        <span className={`${normalTextSize} lg:${lgText} font-bold  tracking-widest`}>{text}</span>
        <span className={`${normalTextSize} lg:${lgText} font-bold  tracking-widest`}>{text}</span>
      </div>
    </div>
  );
}

export default Marquee;
