import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "WordNest · 词汇学习", description: "考研英语与日语 N2–N1 词汇学习工具" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="zh-CN"><body>{children}</body></html>; }
