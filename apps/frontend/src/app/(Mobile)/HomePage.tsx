import { Mobile_HeroSection } from './HeroSection';
import { Mobile_AboutSection } from './AboutSection';
import { Mobile_GraduationSection } from './GraduationSection';
import { Mobile_ProjectSection } from './ProjectSection';
import { Mobile_OrganizationSection } from './OrganizationSection';
import { Mobile_ContactSection } from './ContactSection';

export const Mobile_HomePage = () => {
  return (
    <div
      className="h-full w-full
	    flex flex-col
	    overflow-y-auto
	    "
    >
      <Mobile_HeroSection />
      <Mobile_AboutSection />
      <Mobile_GraduationSection />
      <Mobile_ProjectSection />
      <Mobile_OrganizationSection />
      <Mobile_ContactSection />
    </div>
  );
};
