declare module 'fullpage.js' {
  interface FullpageOptions {
    scrollingSpeed?: number;
    autoScrolling?: boolean;
    fitToSection?: boolean;
    scrollBar?: boolean;
    scrollOverflow?: boolean;
    easing?: string;
    navigation?: boolean;
    credits?: Record<string, unknown>;
    [key: string]: unknown;
  }

  interface FullpageApi {
    moveTo(section: number): void;
    getActiveSection(): { index: number };
    destroy(): void;
    [key: string]: unknown;
  }

  function fullpage(element: HTMLElement, options?: FullpageOptions): FullpageApi;

  export default fullpage;
}
