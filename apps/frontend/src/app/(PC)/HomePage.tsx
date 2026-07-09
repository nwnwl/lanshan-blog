import { PC_HeroSection } from './HeroSection';
import { PC_EndSection } from './EndSection';
import { PC_MiddleSection } from './MiddleSection';
export const PC_HomePage = () => {
  return (
    <div
      className="h-screen w-full
	    flex flex-col
	    overflow-y-auto scroll-smooth
	    "
    >
      <PC_HeroSection />
      <PC_MiddleSection />
      <PC_EndSection />
    </div>
  );
};
