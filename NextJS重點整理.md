# NextJS重點整理

And other points to notice,
## 1. research stable version, and pass the beta version, we don't use the new feat in the experimental stage.
    => 研究穩定版，不使用還在實驗階段的新功能
    => 目前穩定版本號：v15.0.2


## 2. notice routing method.
 => 注意路由的方法
 => 路由的使用、切換...etc基本功能
 ### 2.1 頁面&佈局概念
 1. file-system routing 
    創建1個資料夾，並創建一組page.tsx、layout.tsx => 一個可被訪問的頁面路徑的切換
 2. 多頁面共享，達到局部渲染：上層layout的內容，會共享給下層，ex.Nav
 3. layout：接收一個children prop，它可以是page or layout
 
 ### 2.2 組件應用
 1. Link組件：取代a標籤，實現局部刷新
 ### 2.3 Hooks：
    usePathName()：取得當前路徑，ex.nav active樣式效果





## 3. research the focus point of rendering would be fine. 
 => 研究渲染的重點
 => 運作原理、基本重點使用&概念
 => 樣式的渲染：
        TailWind
        CSS module
        clsx(函式庫)：用於條件渲染，根據條件返回對應樣式(basic)

 => 資料的渲染


## 4. how to handling the diffenert error & loading events in the standard way.
 => 用相同的SOP處理不同的error、載入事件



# 【前置】
## 1.什麼是NextJs?
    => 用來構建全棧Web應用的React框架
    特點
    =>簡化項目配置
    =>支持SSR：支持服務端的渲染(後端渲染好網頁 ===> 返回給客戶端)，利於SEO優化

## 2.安裝
    環境要求：NodeJS >= 18.18
    官推：pnpm 作為套件管理器 => 因為比npm、yarn快效率更好
    => MKey是打算用？

### 【踩坑】Windows - VScode - PowerShell pnpm i、pnpm dev 失敗
    => VScode 終端執行 Get-ExecutionPolicy
    => 若返回 Restricted，請在「管理員模式」下打開 PowerShell
    => 執行：Set-ExecutionPolicy RemoteSign
    => 之後就算不是「管理員模式」，也能成功執行


## 3.項目結構分析
    app/            主要開發項目都放這
    app/lib         函數庫：存放接口函數、工具函數、覆用高的函數
    app/ui          存放組件
    app/layout.tsx  根的佈局組件

    public          存放：靜態資源、第三方CSS...etc
    scripts         存放腳本文件
    next.config.js  配置文件

# 重點整理(條列)


# 其它
## 1.Optimizations
## 核心
    1.為何需要優化？
    2.如何使用？

### 1.1 字體
    字體設定：app\ui\fonts.ts
    優化原因：減輕下載時的負擔，且較快
```ts
    import { Inter, Lusitana, Noto_Sans_JP } from 'next/font/google';
    
    // 添加主要字體
    export const inter = Inter({ subsets: ['latin'] });

    // 添加輔助字體
    export const NotoSansJP = Noto_Sans_JP({
        weight: ['400', '700'],
        subsets: ['latin'], 
    })
```
----

### 字體使用：app\layout.tsx、app\page.tsx
    => 使用：fontName.className
    => fontName：export 字體名稱
    => className => 導入字體的樣式
```tsx
    // layout.tsx
    import { inter } from './ui/fonts';

    <body className={`${inter.className} antialiased`}>
        {children}
    </body>

    // page.tsx
    import { lusitana, NotoSansJP } from './ui/fonts';
    <h2 className={`${lusitana.className}`}>{'DEMO-添加輔助字體1'}</h2>
    <h2 className={`${NotoSansJP.className}`}>{'DEMO-添加輔助字體2-戦い'}</h2>
```


### 1.2 圖片
    優化原因：
    => 防止佈局偏移
    => 傳輸合適的尺寸圖片，到客戶端
    => Lazy Load
    => 以現代格式提供image
    圖片設定：使用內建的<Image />組件處理
### 使用：app\page.tsx
```tsx 
    // src="/hero-desktop.png"  / = public資料夾、打包後會把靜態資源放在根目錄
    import Image from 'next/image';
    <Image
        src="/hero-desktop.png"
        width={1000}
        height={700}
        className='hidden md:block'
        alt="Screenshots of the dashboard project showing desktop version"
    />
    <Image
        src="/hero-mobile.png"
        width={560}
        height={620}
        className='block md:hidden'
        alt="Screenshots of the dashboard project showing mobile version"
    />
```
## 2.Optimizations
### 2.1 'use client'：寫在文件的頂部，在客戶端渲染內容，如：選單