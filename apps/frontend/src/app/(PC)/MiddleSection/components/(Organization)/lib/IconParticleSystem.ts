// ===== Icon Particle System (PixiJS) =====
// 结合 Ark-Particle-Imitate 的粒子重组动画 + hero-particle-system 的物理互动效果。
// 将 SVG 图标渲染为粒子，支持鼠标排斥、弹性回归、阻尼、抖动、整体漂浮。
// 切换图标时粒子直接"跑过去"重组，粒子数量保持一致。

import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';

// ===== Types =====

export interface ParticleParams {
  gap: number;
  scale: number;
  stiffness: number;
  damping: number;
  jitter: number;
  size: number;
  repel: number;
  radius: number;
  float: number;
}

export const PARTICLE_DEFAULTS: ParticleParams = {
  gap: 4,
  scale: 3.0,
  stiffness: 0.001,
  damping: 0.001,
  jitter: 0,
  size: 2,
  repel: 1,
  radius: 100,
  float: 0.03,
};

export interface ParticleSliderDef {
  key: keyof ParticleParams;
  label: string;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}

export const PARTICLE_SLIDERS: ParticleSliderDef[] = [
  { key: 'gap', label: '间距', min: 1, max: 20, step: 1 },
  { key: 'scale', label: '缩放', min: 0.1, max: 5, step: 0.1, format: (v) => v.toFixed(1) },
  { key: 'size', label: '大小', min: 0.5, max: 20, step: 0.5, format: (v) => v.toFixed(1) },
  { key: 'radius', label: '半径', min: 10, max: 300, step: 5 },
  { key: 'float', label: '漂浮', min: 0, max: 0.5, step: 0.01, format: (v) => v.toFixed(2) },
];

interface ParticleData {
  sprite: Sprite;
  origX: number;
  origY: number;
  homeX: number;
  homeY: number;
}

export interface IconSvgDef {
  viewBox: string;
  paths: readonly { d: string; fill?: string; fillRule?: 'evenodd' | 'nonzero' }[];
}

// 采样点（含颜色和位置）
interface SamplePoint {
  origX: number;
  origY: number;
  homeX: number;
  homeY: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
}

// ===== SVG → ImageData 转换 =====

function svgIconToImageData(iconDef: IconSvgDef, size: number): Promise<ImageData> {
  const pathsSvg = iconDef.paths
    .map(
      (p) =>
        `<path d="${p.d}" fill="${p.fill || '#ffffff'}" ${
          p.fillRule ? `fill-rule="${p.fillRule}"` : ''
        } />`,
    )
    .join('');

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${iconDef.viewBox}" width="${size}" height="${size}">${pathsSvg}</svg>`;

  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const ctx = offscreen.getContext('2d')!;
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(ctx.getImageData(0, 0, size, size));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('SVG 图标渲染失败'));
    };
    img.src = url;
  });
}

// ===== 采样图标像素 =====

function sampleIcon(imageData: ImageData, gap: number, scale: number): SamplePoint[] {
  const sw = imageData.width;
  const sh = imageData.height;
  const pixels = imageData.data;
  const halfW = sw / 2;
  const halfH = sh / 2;
  const samples: SamplePoint[] = [];

  for (let y = 0; y < sh; y += gap) {
    for (let x = 0; x < sw; x += gap) {
      const idx = (y * sw + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = pixels[idx + 3];
      if (a < 10) continue;

      samples.push({
        origX: x,
        origY: y,
        homeX: (x - halfW) * scale,
        homeY: (y - halfH) * scale,
        r,
        g,
        b,
        alpha: a / 255,
      });
    }
  }

  return samples;
}

/** 从 samples 中随机选取恰好 count 个，不足时随机复制补齐 */
function normalizeSampleCount(samples: SamplePoint[], count: number): SamplePoint[] {
  if (samples.length === 0) return [];

  if (samples.length === count) return samples;

  if (samples.length > count) {
    // 随机移除多余的
    const shuffled = [...samples];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }

  // 不足：随机复制补齐
  const result = [...samples];
  while (result.length < count) {
    const idx = Math.floor(Math.random() * samples.length);
    const src = samples[idx];
    // 复制的粒子稍微抖动原始位置，避免完全重叠
    result.push({
      ...src,
      origX: src.origX + (Math.random() - 0.5) * 2,
      origY: src.origY + (Math.random() - 0.5) * 2,
    });
  }
  return result;
}

// ===== Particle System =====

export class IconParticleSystem {
  private app: Application | null = null;
  private container: Container | null = null;
  private particles: ParticleData[] = [];
  params: ParticleParams;
  private whiteTexture: Texture | null = null;
  private mouseX = -9999;
  private mouseY = -9999;
  private mouseOnCanvas = false;

  // 图像尺寸（采样时的原始像素尺寸）
  private imgWidth = 0;
  private imgHeight = 0;

  // 居中
  private centerX = 0;
  private centerY = 0;

  // 首次加载后的渐变（从随机位置飞入 + 淡入）
  private introFadeIn = true;

  // 重采样防抖
  needsResample = false;
  private isResampling = false;

  // 整体漂浮
  private currentFloat = 0;
  private smoothMX = 0;
  private smoothMY = 0;

  // Resize
  private resizeObserver: ResizeObserver | null = null;

  // 指针事件（用于清理）
  private _onPointerMove: (e: PointerEvent) => void;
  private _onPointerLeave: () => void;

  constructor() {
    this.params = { ...PARTICLE_DEFAULTS };

    this._onPointerMove = (e: PointerEvent) => {
      const canvas = this.app?.canvas as HTMLCanvasElement | undefined;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.mouseX = (e.clientX - rect.left) * dpr;
      this.mouseY = (e.clientY - rect.top) * dpr;
      this.mouseOnCanvas = true;
    };

    this._onPointerLeave = () => {
      this.mouseOnCanvas = false;
    };
  }

  // ===== 初始化 =====

  async init(
    hostElement: HTMLElement,
    iconDef: IconSvgDef,
    gapOverride?: number,
    scaleOverride?: number,
  ): Promise<void> {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.app = new Application();
    await this.app.init({
      width: hostElement.clientWidth * dpr,
      height: hostElement.clientHeight * dpr,
      backgroundAlpha: 0,
      antialias: true,
      resolution: dpr,
      autoDensity: false,
    });

    hostElement.appendChild(this.app.canvas as HTMLCanvasElement);

    const canvas = this.app.canvas as HTMLCanvasElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    this.container = new Container();
    this.app.stage.addChild(this.container);

    // 创建共享白色圆点纹理
    const g = new Graphics();
    g.circle(0, 0, 1);
    g.fill({ color: 0xffffff });
    this.whiteTexture = this.app.renderer.generateTexture(g);
    g.destroy();

    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerleave', this._onPointerLeave);

    this.app.ticker.add(this.tick);

    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0 && this.app) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.app.renderer.resize(width * dpr, height * dpr);
        this.app.renderer.resolution = dpr;
        this.centerComposition();
      }
    });
    this.resizeObserver.observe(hostElement);

    // 首次采样
    await this.createParticlesFirstTime(iconDef, gapOverride, scaleOverride);
    this.centerComposition();
  }

  // ===== 首次创建粒子（从随机位置飞入） =====

  private async createParticlesFirstTime(
    iconDef: IconSvgDef,
    gapOverride?: number,
    scaleOverride?: number,
  ): Promise<void> {
    if (!this.container || !this.app || !this.whiteTexture) return;

    const MAX_DIM = 200;
    const imageData = await svgIconToImageData(iconDef, MAX_DIM);
    this.imgWidth = imageData.width;
    this.imgHeight = imageData.height;

    const gap = gapOverride ?? this.params.gap;
    const scale = scaleOverride ?? this.params.scale;
    const samples = sampleIcon(imageData, gap, scale);

    for (const p of this.particles) p.sprite.destroy();
    this.particles = [];
    this.container.removeChildren();

    for (const s of samples) {
      const sprite = new Sprite(this.whiteTexture);
      sprite.tint = (s.r << 16) | (s.g << 8) | s.b;
      sprite.alpha = 0;
      sprite.anchor.set(0.5);
      sprite.scale.set(this.params.size);

      // 初始随机位置（飞入效果）
      sprite.x = (Math.random() - 0.5) * this.app.screen.width * 2;
      sprite.y = (Math.random() - 0.5) * this.app.screen.height * 2;

      this.container.addChild(sprite);
      this.particles.push({
        sprite,
        origX: s.origX,
        origY: s.origY,
        homeX: s.homeX,
        homeY: s.homeY,
      });
    }

    // 标记：让 tick 中粒子淡入
    this.introFadeIn = true;
  }

  // ===== 切换图标（粒子直接跑过去重组） =====

  async changeIcon(
    iconDef: IconSvgDef,
    gapOverride?: number,
    scaleOverride?: number,
  ): Promise<void> {
    if (this.isResampling) return;
    this.isResampling = true;

    const MAX_DIM = 200;
    const imageData = await svgIconToImageData(iconDef, MAX_DIM);
    this.imgWidth = imageData.width;
    this.imgHeight = imageData.height;

    // 采样新图标
    const gap = gapOverride ?? this.params.gap;
    const scale = scaleOverride ?? this.params.scale;
    let samples = sampleIcon(imageData, gap, scale);

    // 粒子数以最多的那个为准：只增不减，保证细节不丢失
    const targetCount = Math.max(this.particles.length, samples.length);
    samples = normalizeSampleCount(samples, targetCount);

    // Fisher-Yates 洗牌目标位置（Ark-Particle-Imitate 风格重组）
    for (let i = samples.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [samples[i], samples[j]] = [samples[j], samples[i]];
    }

    const oldParticles = this.particles;
    const count = Math.min(samples.length, oldParticles.length);

    // 更新现有粒子的目标位置和颜色
    for (let i = 0; i < count; i++) {
      const s = samples[i];
      const p = oldParticles[i];

      p.homeX = s.homeX;
      p.homeY = s.homeY;
      p.origX = s.origX;
      p.origY = s.origY;
      p.sprite.tint = (s.r << 16) | (s.g << 8) | s.b;
    }

    // 扩容：新采样点比旧粒子多，创建粒子（从随机位置飞入）
    if (samples.length > oldParticles.length) {
      for (let i = oldParticles.length; i < samples.length; i++) {
        const s = samples[i];
        const sprite = new Sprite(this.whiteTexture!);
        sprite.tint = (s.r << 16) | (s.g << 8) | s.b;
        sprite.alpha = 1;
        sprite.anchor.set(0.5);
        sprite.scale.set(this.params.size);
        sprite.x = (Math.random() - 0.5) * this.app!.screen.width * 2;
        sprite.y = (Math.random() - 0.5) * this.app!.screen.height * 2;

        this.container!.addChild(sprite);
        this.particles.push({
          sprite,
          origX: s.origX,
          origY: s.origY,
          homeX: s.homeX,
          homeY: s.homeY,
        });
      }
    }

    this.isResampling = false;
  }

  /** 强制重采样（用于 gap 参数变化时） */
  async forceResample(
    iconDef: IconSvgDef,
    gapOverride?: number,
    scaleOverride?: number,
  ): Promise<void> {
    if (this.isResampling) return;
    this.isResampling = true;

    const MAX_DIM = 200;
    const imageData = await svgIconToImageData(iconDef, MAX_DIM);
    this.imgWidth = imageData.width;
    this.imgHeight = imageData.height;

    const gap = gapOverride ?? this.params.gap;
    const scale = scaleOverride ?? this.params.scale;
    let samples = sampleIcon(imageData, gap, scale);

    // 粒子数以最多的那个为准：只增不减
    const targetCount = Math.max(this.particles.length, samples.length);
    samples = normalizeSampleCount(samples, targetCount);

    // 洗牌
    for (let i = samples.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [samples[i], samples[j]] = [samples[j], samples[i]];
    }

    const oldParticles = this.particles;
    const count = Math.min(samples.length, oldParticles.length);

    for (let i = 0; i < count; i++) {
      const s = samples[i];
      const p = oldParticles[i];
      p.homeX = s.homeX;
      p.homeY = s.homeY;
      p.origX = s.origX;
      p.origY = s.origY;
      p.sprite.tint = (s.r << 16) | (s.g << 8) | s.b;
    }

    if (samples.length > oldParticles.length) {
      for (let i = oldParticles.length; i < samples.length; i++) {
        const s = samples[i];
        const sprite = new Sprite(this.whiteTexture!);
        sprite.tint = (s.r << 16) | (s.g << 8) | s.b;
        sprite.alpha = 1;
        sprite.anchor.set(0.5);
        sprite.scale.set(this.params.size);
        sprite.x = (Math.random() - 0.5) * this.app!.screen.width * 2;
        sprite.y = (Math.random() - 0.5) * this.app!.screen.height * 2;
        this.container!.addChild(sprite);
        this.particles.push({
          sprite,
          origX: s.origX,
          origY: s.origY,
          homeX: s.homeX,
          homeY: s.homeY,
        });
      }
    }

    // 粒子数只增不减，不销毁多余的

    this.isResampling = false;
  }

  // ===== 参数更新 =====

  setParam(key: keyof ParticleParams, value: number): void {
    const old = this.params[key];
    (this.params as unknown as Record<string, number>)[key] = value;

    if (key === 'gap' && value !== old) {
      this.needsResample = true;
    }
    if (key === 'scale' && value !== old) {
      this.recalcHomePositions();
      this.centerComposition();
    }
    if (key === 'size' && value !== old) {
      for (const p of this.particles) p.sprite.scale.set(value);
    }
  }

  clearResampleFlag(): void {
    this.needsResample = false;
  }

  private recalcHomePositions(): void {
    const { scale } = this.params;
    const MAX_DIM = 200;
    let sw = this.imgWidth;
    let sh = this.imgHeight;
    if (sw === 0 || sh === 0) return;

    if (sw > MAX_DIM || sh > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / sw, MAX_DIM / sh);
      sw = Math.floor(sw * ratio);
      sh = Math.floor(sh * ratio);
    }
    const halfW = sw / 2;
    const halfH = sh / 2;
    for (const p of this.particles) {
      p.homeX = (p.origX - halfW) * scale;
      p.homeY = (p.origY - halfH) * scale;
    }
  }

  private centerComposition(): void {
    if (!this.container || !this.app) return;
    this.centerX = this.app.screen.width / 2;
    this.centerY = this.app.screen.height / 2;
    this.container.x = this.centerX;
    this.container.y = this.centerY;
  }

  // ===== 物理帧循环 =====
  // 与 hero-particle-system 完全一致的物理模型：
  // ease-to-home + 逆平方鼠标排斥 + 弹簧刚度 + 阻尼 + 抖动 + 整体漂浮

  private tick = (): void => {
    if (!this.container || !this.app) return;

    const { stiffness, damping, jitter, repel, radius } = this.params;
    const thicknessSq = radius * radius;

    let localMouseX = 0;
    let localMouseY = 0;
    if (this.mouseOnCanvas) {
      const local = this.container.toLocal({ x: this.mouseX, y: this.mouseY });
      localMouseX = local.x;
      localMouseY = local.y;
    }

    for (const p of this.particles) {
      const easeSpeed = 1 / 30;
      let vx = (p.homeX - p.sprite.x) * easeSpeed;
      let vy = (p.homeY - p.sprite.y) * easeSpeed;

      // 逆平方鼠标排斥力
      if (this.mouseOnCanvas) {
        const dx = p.sprite.x - localMouseX;
        const dy = p.sprite.y - localMouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq > 0.01) {
          let f = thicknessSq / distSq;
          f = f < 0.1 ? 0.1 : f;
          f = f > 7 ? 7 : f;

          const angle = Math.atan2(dy, dx);
          vx += f * Math.cos(angle) * repel;
          vy += f * Math.sin(angle) * repel;
        }
      }

      // 弹簧刚度
      vx += (p.homeX - p.sprite.x) * stiffness;
      vy += (p.homeY - p.sprite.y) * stiffness;

      // 阻尼
      vx *= 1 - damping;
      vy *= 1 - damping;

      // 抖动
      vx += (Math.random() - 0.5) * jitter * 2;
      vy += (Math.random() - 0.5) * jitter * 2;

      p.sprite.x += vx;
      p.sprite.y += vy;

      // 首次加载后淡入
      if (this.introFadeIn && p.sprite.alpha < 1) {
        p.sprite.alpha = Math.min(p.sprite.alpha + 0.015, 1);
        if (p.sprite.alpha >= 1) {
          // 检查是否所有粒子都淡入完成
          if (this.particles.every((pp) => pp.sprite.alpha >= 1)) {
            this.introFadeIn = false;
          }
        }
      }
    }

    // 整体漂浮
    {
      this.smoothMX += (this.mouseX - this.smoothMX) * 0.5;
      this.smoothMY += (this.mouseY - this.smoothMY) * 0.5;
      const targetFloat = this.mouseOnCanvas ? this.params.float : 0;
      this.currentFloat += (targetFloat - this.currentFloat) * 0.04;
      const targetX = this.centerX + (this.smoothMX - this.centerX) * this.currentFloat;
      const targetY = this.centerY + (this.smoothMY - this.centerY) * this.currentFloat;
      this.container.x += (targetX - this.container.x) * 0.03;
      this.container.y += (targetY - this.container.y) * 0.03;
    }
  };

  // ===== 清理 =====

  destroy(): void {
    if (this.app) {
      this.app.ticker.remove(this.tick);
      window.removeEventListener('pointermove', this._onPointerMove);
      window.removeEventListener('pointerleave', this._onPointerLeave);
      for (const p of this.particles) p.sprite.destroy();
      this.particles = [];
      this.whiteTexture?.destroy();
      this.whiteTexture = null;
      this.app.destroy(true);
      this.app = null;
      this.container = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}
