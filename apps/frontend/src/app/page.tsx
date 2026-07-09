import { PC_HomePage } from './(PC)/HomePage';
export default function Home() {
  // //判断平板以及手机为移动端
  // const isMobile = navigator.maxTouchPoints > 0
  // console.log("isMobile", isMobile)
  return (
    <div className="h-full w-full ">
      <PC_HomePage />
    </div>
  );
}
