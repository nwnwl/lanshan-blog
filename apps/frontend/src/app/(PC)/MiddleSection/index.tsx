import { PC_AboutSection } from './components/(About)/About';
import { PC_GraduationSection } from './components/(Graduation)/Graduation';
import { PC_ProjectSection } from './components/(Project)/Project';
import { PC_OrganizationSection } from './components/(Organization)/Organization';
import { PC_ContactSection } from './components/(Contact)/Contact';
import { Siderbar } from '@/components/Siderbar';
export const PC_MiddleSection = () => {
  return (
    <div className="flex w-full ">
      <div
        className="
      sticky top-0 h-screen w-[3.6rem] z-50"
      >
        <Siderbar />
      </div>

      <div
        className="flex-1 flex flex-col"
        style={{ 'timeline-scope': '--org-appears' } as React.CSSProperties}
      >
        <PC_AboutSection />
        <PC_ProjectSection />
        <PC_OrganizationSection />
        <PC_GraduationSection />
        <PC_ContactSection />
      </div>
    </div>
  );
};
