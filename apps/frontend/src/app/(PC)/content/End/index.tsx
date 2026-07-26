export const PC_EndSection = () => {
  return (
    <div
      id="end"
      className="h-[435px] w-full flex items-center justify-center bg-[#252726] text-[#ffffff]"
    >
      {/* Logo */}
      <img
        src="/picture/logoW.png"
        alt="logo"
        className="h-auto w-auto max-h-[120px] object-contain"
      />

      {/* 版本 / 更新 / 开发者 / 版权信息 */}
      <div className="flex flex-col gap-2 text-sm text-[#aaaaaa] ml-16">
        <span>版本：0.1.0</span>
        <span>更新时间：2026-07-25</span>
        <span>开发者：LanShan Studio</span>
        <span>© 2025 蓝山工作室</span>
      </div>
    </div>
  );
};
