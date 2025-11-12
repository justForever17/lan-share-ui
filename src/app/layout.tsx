import type { Metadata } from "next";
import "./globals.css";
import "./buttons.css";
import StyledComponentsRegistry from '@/components/registry';

export const metadata: Metadata = {
  title: "文件共享平台",
  description: "内网文件共享平台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="">
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
