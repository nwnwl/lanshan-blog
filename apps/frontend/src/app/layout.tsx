import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const harmonyOSSans = localFont({
  src: [
    {
      path: '../../public/fonts/HarmonyOS Sans/HarmonyOS_Sans/HarmonyOS_Sans_Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HarmonyOS Sans/HarmonyOS_Sans/HarmonyOS_Sans_Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HarmonyOS Sans/HarmonyOS_Sans/HarmonyOS_Sans_Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-harmonyos-sans',
  display: 'swap',
});

const notoSans = localFont({
  src: [
    {
      path: '../../public/fonts/Noto-sans/NotoSans-Regular-2.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Noto-sans/NotoSans-Bold-5.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-noto-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lanshan Blog',
  description: 'A blog about web development and programming',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={` ${harmonyOSSans.variable} ${notoSans.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
