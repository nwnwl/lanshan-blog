// ====== 开屏加载配置：所有动画时机统一从这里管理 ======

// 最短展示时长：避免资源秒加载（缓存/本地）导致进度条闪一下就消失
export const MIN_DISPLAY_MS = 800;
// 最长兜底：防止某个资源卡死导致开屏永不退出
export const MAX_DISPLAY_MS = 5000;
// 加载完成 → 开始渐隐的延迟（移动端让扫屏动画播完）
export const FADE_DELAY_MOBILE_MS = 500;
export const FADE_DELAY_DESKTOP_MS = 250;

// ====== hero 页需要预加载的资源 ======
export const HERO_IMAGE_MOBILE = '/picture/lm.png';
export const HERO_IMAGE_DESKTOP = '/picture/lm-2.png';
export const LOGO_IMAGE = '/picture/logoW.png';
export const BG_IMAGE = '/picture/animebg.webp';
