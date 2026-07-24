export interface Department {
  key: string;
  cn: string;
  en: string;
  desc: string;
}

export const DEPARTMENTS: Department[] = [
  {
    key: 'project',
    cn: '产品及运营组',
    en: 'PRODUCT & OPERATIONS',
    desc: '分析用户需求，调研市场动态，设计产品功能，明晰研发流程。在各部门之间沟通协作，推进项目实现。考虑后续产品更新的内容，并进行日常运营与推广。',
  },
  {
    key: 'figma',
    cn: 'UI 设计部',
    en: 'UI DESIGN',
    desc: '使用Figma、Sketch、PS等设计工具，负责产品的视觉设计与交互体验，为用户打造便捷、美观且高效的交互页面。',
  },
  {
    key: 'react',
    cn: '前端组',
    en: 'FRONTEND',
    desc: '专注于用户界面和用户体验的开发，主要使用HTML、CSS、JavaScript等前端技术，构建用户与后台数据交互的桥梁。',
  },
  {
    key: 'java',
    cn: 'Java组',
    en: 'JAVA',
    desc: '负责用Java进行后端开发，处理各种业务需求，确保多个服务器和程序之间高效协作，推动业务的顺利运行。',
  },
  {
    key: 'golang',
    cn: 'Go组',
    en: 'GOLANG',
    desc: '负责后端逻辑的开发和维护，主要使用Go语言构建高效、可扩展的服务端架构，处理数据存储、业务逻辑和API接口。',
  },
  {
    key: 'python',
    cn: 'Python组',
    en: 'PYTHON',
    desc: '使用Python进行大模型应用与开发，主要涉及人工智能，大模型微调，RAG，提示词工程，智能体及MCP开发。',
  },
  {
    key: 'docker',
    cn: '运维组',
    en: 'IT OPERATIONS',
    desc: '承接研发部门的项目落地，负责产品部署上线与生产环境的稳定维护。日常开展网络日志巡检与告警处置，保障数据交互安全，协同产品新版本的迭代更新与发布。',
  },
  {
    key: 'usersecret',
    cn: '安全组',
    en: 'SECURITY',
    desc: '安全分为渗透测试和应急响应两个方向，渗透测试是寻找服务器存在的漏洞，应急响应负责防御服务器遭受攻击，并排查存在的漏洞点。',
  },
];
