// Adding a primary font
import { Inter, Lusitana, Noto_Sans_JP } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

// 添加輔助字體
export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin'], 
})

export const NotoSansJP = Noto_Sans_JP({
    weight: ['400', '700'],
    subsets: ['latin'], 
})