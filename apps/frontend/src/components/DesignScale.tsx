'use client';

import { useDesignScale } from '@/lib/useDesignScale';

/**
 * 全局设计稿等比缩放（contain）。
 * 客户端壳组件：挂到根 layout 的 <body> 内，全站生效。
 * 不想要了，从根 layout 移除 <DesignScale /> 即可。
 */
export const DesignScale = () => {
  useDesignScale();
  return null;
};
