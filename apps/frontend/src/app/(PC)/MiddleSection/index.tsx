import { PC_AboutSection } from './components/AboutSection';
import { PC_GraduationSection } from './components/GraduationSection';
import { PC_ProjectSection } from './components/ProjectSection';
import { PC_OrganizationSection } from './components/OrganizationSection';
import { PC_ContactSection } from './components/ContactSection';
import { Siderbar } from '@/components/Siderbar';
export const PC_MiddleSection = () => {
  return (
    <div className="part flex w-full">
      <div
        className="
      sticky top-0 h-screen w-[3.6rem] z-50"
      >
        <Siderbar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <PC_AboutSection />
        <PC_ProjectSection />
        <PC_OrganizationSection />
        <PC_GraduationSection />
        <PC_ContactSection />
      </div>
    </div>
  );
};
