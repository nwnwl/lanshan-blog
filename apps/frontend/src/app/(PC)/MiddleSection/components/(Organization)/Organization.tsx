import { Icon } from '@/components/Icon';
import styles from './OrganizationSection.module.css';
import IconParticleCanvas from './components/IconParticleCanvas';

export const PC_OrganizationSection = () => {
  return (
    <section
      id="organization"
      className={`${styles.overlay} h-screen w-full
      flex flex-col items-center justify-center
      bg-[#272727]
      text-black relative overflow-hidden`}
    >
      <Icon name="organizationBg2" className="w-full h-full" preserveAspectRatio="xMidYMid slice" />
      <div className="absolute inset-0">
        <img src="/picture/organizationBg1.png" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 z-10">
        <IconParticleCanvas />
      </div>
    </section>
  );
};
