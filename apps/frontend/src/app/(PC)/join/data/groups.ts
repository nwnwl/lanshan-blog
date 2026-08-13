export interface JoinGroup {
  key: string;
  cn: string;
  en: string;
  /** 左侧导航用短标题；缺省 = en 去除 & 两侧空格 */
  nav?: string;
  sider: string;
  /** 招募文案 */
  text: string;
}

export const JOIN_GROUPS: JoinGroup[] = [
  {
    key: 'product',
    cn: '产品及运营组',
    en: 'PRODUCT & OPERATIONS',
    nav: 'PRODUCT',
    sider: '产品',
    text: '负责工作室产品从 0 到 1 的需求分析与市场调研，定义产品形态与迭代方向。在研发、设计、运维等各团队之间沟通协作，推进项目按期落地，并承担产品的日常运营与对外推广。如果你对互联网产品嗅觉敏锐、擅长沟通与策划，欢迎加入我们，一起打磨每一款作品。',
  },
  {
    key: 'design',
    cn: 'UI设计部',
    en: 'UI DESIGN',
    sider: '设计',
    text: '负责工作室所有产品的视觉设计与交互体验，使用 Figma、Sketch、Photoshop 等设计工具，完成从界面到品牌系统的设计表达。追求美观、便捷且高效的用户体验，让好设计真正被用户看见和使用。如果你热爱设计、审美在线、注重细节，欢迎带着作品集加入我们。',
  },
  {
    key: 'dev',
    cn: '研发部',
    en: 'R & D',
    sider: '研发',
    text: '研发部聚焦前端与后端两大方向：前端使用 HTML、CSS、JavaScript、React 等现代技术，构建高效友好的交互页面；后端使用 Java、Go、Python 等语言，打造高并发、可扩展的接口与系统，并探索大模型应用、智能体等前沿方向。无论你主攻哪一端，都能在这里找到属于你的成长战场。',
  },
  {
    key: 'ops',
    cn: '运维组',
    en: 'IT OPERATIONS',
    sider: '运维',
    text: '承接研发团队的项目落地，负责产品部署上线、生产环境稳定与容器化基础设施建设。日常开展网络日志巡检与告警处置，保障数据交互安全，并协同产品新版本的迭代更新与发布。如果你熟悉 Linux、Docker 与云服务，乐于保障系统平稳运行，欢迎加入我们。',
  },
  {
    key: 'security',
    cn: '安全组',
    en: 'SECURITY',
    sider: '安全',
    text: '安全组分为渗透测试与应急响应两大方向：渗透测试主动挖掘服务器与应用的安全漏洞；应急响应负责抵御外部攻击、处置安全事件并排查漏洞点。如果你对攻防博弈充满热情、具备扎实的网络基础，欢迎加入，共同守护工作室的安全边界。',
  },
];
