import styles from './ProjectSection.module.css';

export const PC_ProjectSection = () => {
  return (
    <section
      id="project"
      className="h-screen w-full flex flex-col items-center justify-center bg-white text-black relative"
    >
      {/* 遮罩层：用 ref 直接控制 opacity */}
      <div className={styles.Project_darkOverlay} />
      <span>PC_PROJECT</span>
    </section>
  );
};
