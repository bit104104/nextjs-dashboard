// 頂層的根佈局
import '@/app/ui/global.css';
import { inter } from './ui/fonts';

// 將字體加入<body>以下元素
export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="en">
      {/* <body>{children}</body> */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
