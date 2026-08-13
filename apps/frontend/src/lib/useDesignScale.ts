'use client';

import { useEffect } from 'react';

/**
 * 设计稿等比缩放（contain）
 *
 * 思路迁移自另一个项目的 handleResize：按「视口 ÷ 设计稿」的比例算出 html 根字体，
 * 让 About 这类全 em 布局连续缩放，替代 globals.css 里的断点式跳变。
 *
 * 挂载时通过 inline style 覆盖断点体系（inline > 媒体查询）；
 * 卸载时清掉 inline style，自动恢复 globals.css 的断点回退。
 */
export function useDesignScale() {
  useEffect(() => {
    const root = document.documentElement;

    // ============================================================
    // 基准参数：改这里即可调缩放效果（改完热更新即可对比）
    // ------------------------------------------------------------
    // landscape：横屏/PC 设计基准。默认 1440×900 → 16px，
    //   与当前断点体系主档位（globals.css 1280→16px）对齐，
    //   1920×1080 下约 21.3px（现为 20px），2560×1440 下约 28px。
    //   想以 1920×1080/20px 为基准，改成 { 1920, 1080, 20, true } 即可。
    // constrainHeight: true = contain（宽高谁紧按谁，超宽屏不失控）
    //                  false = 纯宽度缩放（只按 iw/designWidth）
    // ============================================================
    const CONFIG = {
      landscape: {
        designWidth: 1440,
        designHeight: 900,
        baseFontSize: 16,
        constrainHeight: true,
      },
      // 竖屏/手机：本项目移动端是响应式布局（max-lg: 类 + CSS 断点），默认不参与缩放。
      // 想启用，把 null 换成对象即可，如：
      //   { designWidth: 1080, designHeight: 1920, baseFontSize: 10, constrainHeight: true }
      portrait: null as null | {
        designWidth: number;
        designHeight: number;
        baseFontSize: number;
        constrainHeight: boolean;
      },
    };

    let cachedW = 0;
    let cachedH = 0;
    let lastFontSize = '';

    const apply = () => {
      const iw = window.innerWidth;
      const ih = window.innerHeight;
      // 视口没变就不重算（对应原脚本 _innerWidth/_innerHeight 缓存）
      if (iw === cachedW && ih === cachedH) return;
      cachedW = iw;
      cachedH = ih;

      const cfg = ih >= iw ? CONFIG.portrait : CONFIG.landscape;
      if (!cfg) {
        // 竖屏不参与 → 交还 CSS 断点
        if (lastFontSize) {
          root.style.fontSize = '';
          lastFontSize = '';
        }
        return;
      }

      const { designWidth, designHeight, baseFontSize, constrainHeight } = cfg;
      let fontSize = baseFontSize;
      if (constrainHeight) {
        // contain：视口比设计稿更宽 → 按高度缩放，否则按宽度
        if (iw / ih > designWidth / designHeight) {
          fontSize *= ih / designHeight;
        } else {
          fontSize *= iw / designWidth;
        }
      } else {
        fontSize *= iw / designWidth;
      }

      const px = `${fontSize}px`;
      root.style.fontSize = px;
      if (px !== lastFontSize) {
        lastFontSize = px;
        console.info(`[useDesignScale] html font-size = ${px} (${iw}×${ih})`);
      }
    };

    apply();
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('resize', apply);
      root.style.fontSize = ''; // 卸载时恢复 globals.css 断点体系
    };
  }, []);
}
