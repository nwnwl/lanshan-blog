import { PC_AboutSection } from './(middle)/AboutSection';
import { PC_GraduationSection } from './(middle)/GraduationSection';
import { PC_ProjectSection } from './(middle)/ProjectSection';
import { PC_OrganizationSection } from './(middle)/OrganizationSection';
import { PC_ContactSection } from './(middle)/ContactSection';
import { Siderbar } from './(middle)/Siderbar';
export const PC_MiddleSection = () => {
  return (
    <div className="flex w-full">
      <div className="sticky top-0 h-screen w-[3.6rem]">
        <Siderbar />
      </div>

      <div className="flex-1 flex flex-col ">
        <PC_AboutSection />
        <PC_OrganizationSection />
        <PC_ProjectSection />
        <PC_GraduationSection />
        <PC_ContactSection />
      </div>
    </div>
  );
};
