'use client';

import { useEffect, useRef } from 'react';

interface Options {
  maxOffset?: number; // 最大偏移(rem)：鼠标到边缘时卡片最多被排斥多远（随根字号缩放）
  friction?: number; // 摩擦力(每帧速度保留比例 0~1)：越小停得越快，越接近 1 惯性越大
  returnEase?: number; // 回程缓动系数(0~1)：鼠标移出后滑回中心的速度，越小回得越慢
  drive?: number; // 驱动增益：鼠标移动量转成卡片速度的放大倍数（默认由 friction 自动配平）
}

/**
 * 鼠标悬浮跟随（排斥 + 纯惯性版，无弹簧力）：
 * - 排斥：卡片往鼠标反方向偏移；
 * - 无弹簧：卡片没有被"拉向某个位置"，速度只由鼠标的移动量驱动——
 *   鼠标动 → 卡片被推着走；鼠标停 → 不再加力，只剩摩擦把速度一点点磨没
 *   （"速度过会儿才归零"）；移开时卡片带着余速滑一小段再停稳；
 * - 回程：鼠标移出后没有弹簧可依赖，改用指数缓动滑回中心（慢而稳，不振荡）。
 * 速度衰减是纯乘性的，无位置反馈，数学上不可能产生振荡/抖动。
 */
export const useMouseFollower = (options: Options = {}) => {
  const { maxOffset = 24, friction = 0.92, returnEase = 0.05, drive: driveOverride } = options;
  // 让"跟踪速度"随 friction 自动配平：f 大 → 卡片的跟手速度同比例减小，避免冲飞
  const drive = driveOverride ?? (1 - friction) / friction;
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    // 防御性检查，防止组件未挂载、ref 未绑定或卸载后报错
    if (!container) {
      console.warn('useMouseFollower: container element not found');
      return;
    }
    // 排斥目标（-0.5 ~ 0.5，负号 = 向鼠标反方向）
    let repelX = 0;
    let repelY = 0;
    let hovering = false;
    let prevHovering = false;
    // 上一帧的排斥目标，用来算"鼠标移动量"
    let lastX = 0;
    let lastY = 0;
    // 卡片位移与速度：速度只被鼠标移动量驱动，然后被摩擦逐帧磨没
    let posX = 0;
    let posY = 0;
    let velX = 0;
    let velY = 0;
    // 软限位（略大于 0.5，允许快速甩动时有一点惯性越界）
    const limit = 0.55;
    let animationId: number | null = null;
    // 上一次写入的 transform 与其目标元素：值没变就不重写，
    // 避免静止/收尾后仍每帧把合成层标记为"需要重合成"（第一页一直卡的根源）
    let lastTarget: HTMLElement | null = null;
    let lastTransform = '';

    // 鼠标进入 / 移动：更新排斥目标
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      repelX = -((e.clientX - rect.left) / rect.width - 0.5);
      repelY = -((e.clientY - rect.top) / rect.height - 0.5);
      hovering = true;
    };
    // 鼠标离开：进入回程缓动
    const handleMouseLeave = () => {
      hovering = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      // 目标可动态切换（如轮播当前页），每帧取当前 target
      const target = targetRef.current;
      if (target) {
        const tx = hovering ? repelX : 0;
        const ty = hovering ? repelY : 0;

        if (hovering) {
          // 刚进入：直接以当前位置为基准，避免一帧"跳变冲量"把卡片弹飞
          if (!prevHovering) {
            lastX = tx;
            lastY = ty;
          }
          // 鼠标移动量 → 速度增量；鼠标停住 → 无推力，只剩摩擦在磨速度
          velX += (tx - lastX) * drive;
          velY += (ty - lastY) * drive;
          lastX = tx;
          lastY = ty;
          // 摩擦：速度每帧衰减，惯性由此而来
          velX *= friction;
          velY *= friction;
          // 积分：位置 += 速度
          posX += velX;
          posY += velY;
          // 软限位，防止快速甩动把卡片甩出可视范围
          posX = Math.max(-limit, Math.min(limit, posX));
          posY = Math.max(-limit, Math.min(limit, posY));
        } else {
          // 鼠标移出：无弹簧，指数缓动滑回中心（回弹慢而稳）
          velX = 0;
          velY = 0;
          posX += (0 - posX) * returnEase;
          posY += (0 - posY) * returnEase;
          // 已基本回中 → 硬归零，切断尾残
          if (Math.abs(posX) < 0.001 && Math.abs(posY) < 0.001) {
            posX = 0;
            posY = 0;
          }
        }
        prevHovering = hovering;
        // 收敛到 0.001rem 精度，物理收尾后字符串稳定 → 不再逐帧改写
        const round = (v: number) => Math.round(v * 1000) / 1000;
        const nextTransform = `translate(${round(posX * maxOffset)}rem, ${round(posY * maxOffset)}rem)`;
        if (target !== lastTarget || nextTransform !== lastTransform) {
          target.style.transform = nextTransform;
          lastTarget = target;
          lastTransform = nextTransform;
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [maxOffset, friction, returnEase, drive]);

  return { containerRef, targetRef };
};
