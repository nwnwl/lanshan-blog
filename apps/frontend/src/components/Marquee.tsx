import styles from './Marquee.module.css';

interface MarqueeProps {
  text: string;
  bgColor: string;
  textColor: string;
  direction?: 'left' | 'right';
}

function Marquee({ text, bgColor, textColor, direction = 'left' }: MarqueeProps) {
  const trackClass = direction === 'left' ? styles.trackLeft : styles.trackRight;

  return (
    <div className={`${bgColor} ${textColor} overflow-hidden w-full`}>
      <div className={`flex w-fit whitespace-nowrap ${trackClass} font-medium`}>
        <span className={`text-6xl md:text-8xl tracking-normal`}>{text}</span>
        <span className={`text-6xl md:text-8xl tracking-normal`}>{text}</span>
      </div>
    </div>
  );
}

export default Marquee;
