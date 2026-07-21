import ProjectRow from './components/ProjectRow';
import styles from './ProjectSection.module.css';

export const PC_ProjectSection = () => {
  return (
    <div
      id="project"
      className="h-screen w-full grid grid-rows-4 bg-white text-black relative px-10 py-40"
    >
      <ProjectRow id="01" title="We CQUPT" subTitle="We 重邮" borderT="border-t-4" />
      <ProjectRow id="02" title="CQ-CMS" subTitle="2023年重庆市辅导员大赛竞赛系统" />
      <ProjectRow id="03" title="WECOME QR CODE CHECK-IN" subTitle="企业微信扫码签到功能" />
      <ProjectRow id="04" title="CDEGOC" subTitle="重庆数字教育治理运行中心" />

      {/* 遮罩层：用 ref 直接控制 opacity */}
      <div className={styles.Project_darkOverlay} />
    </div>
  );
};
