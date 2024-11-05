# NextJS重點整理
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

--
# And other points to notice,
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

 ### 2.2 應用
 ### 1.檔案系統路由(file-system routing)：
    => Next.js 自動根據 pages 目錄中的檔案結構創建路由。
    => 創建1個資料夾，並創建一組page.tsx、layout.tsx => 一個可被訪問的頁面路徑的切換。

 ### 2. Link組件：取代a標籤，實現局部刷新，進行客戶端導航

 ### 3. 動態路由：使用方括號語法來創建動態路由。
    => 例如，pages/posts/[id].js 可以用來處理像 /posts/1 或 /posts/2
    => 這樣的路由，其中 id 是動態部分。

### 4. API 路由：可以在 pages/api 目錄中定義 API 路由。這些檔案會自動處理 HTTP 請求。
    =>例如，pages/api/users.js 可以處理 /api/users 的請求。

### 5. Router API：使用 Next.js 的 useRouter 鉤子來獲取路由資訊，進行路由導航等操作。
```js
    <!-- 例如： -->
    const router = useRouter()
    router.replace('/dashboard/invoice')
```

### 2.3 Hooks：
    usePathName()：取得當前路徑，ex.nav active樣式效果
    useRouter()：路由創建
    useSearchParams()：讀取當前url路徑中的參數，通常會跟new URLSearchParams搭配使用
---


## 3. research the focus point of rendering would be fine. 
 => 研究渲染的重點
 => 運作原理、基本重點使用&概念
 => 樣式渲染：
        TailWind
        CSS module
        clsx(函式庫)：用於條件渲染，根據條件返回對應樣式(basic)

### 3.1 預渲染 (Pre-rendering)：靜態/動態/串流渲染
### => 開發時無需在靜態渲染和動態渲染之間進行選擇。
### => 因為 Next.js 會根據所使用的功能和 API 自動為每個路線選擇最佳渲染策略。
    3.1.1 靜態渲染：渲染結果可以被分發、緩存
        位置：服務端渲染HTML
        時機：構建部署、數據重新生效時
        優點：更快的訪問體驗、減輕服務器的負擔、利於SEO
        使用場景：
        =>不經常變化的數據 & 頁面
        =>多頁面共享的數據 & 頁面
---
    3.1.2 動態渲染(預設)：
        位置：服務端渲染
        時機：每個USER請求時，生成HTML
        優點：顯示實時數據、特定用戶的特定數據
        使用場景：
        =>不同USER，顯示對應數據
        =>適合需要即時數據的頁面
---
    3.1.3 流式渲染：一大塊分成小塊處理，防止緩慢的資料請求阻塞整個頁面
    好處：改善載入效能&用戶體驗
    作法如下：
        1. 頁面級：即以頁面為單位的處理方式，如：Loading
            路由群組：資料夾命名使用(xxx)：xxx可自行定義名稱，
                => 可讓頁面級有隔離效果，這時只有該資料夾內的具有Loading效果
                Ex.只有Home才有頁面級流式渲染效果 http://localhost:3000/dashboard 

        2. 組件級：數據組件自身自行處理 + Suspense的異步使用 & fallback設定
            =>達到組件級別的流式渲染，用於較耗時獲取數據的組件
    參考：https://nextjs.org/learn/dashboard-app/streaming
---
    3.1.4 局部預先渲染(實驗性功能)：開發時，不推薦使用
    
---
### 3.2 數據獲取：Next.js 提供了 getStaticProps、getServerSideProps 方法，
    => 分別用於靜態生成和伺服器端渲染時獲取數據。
    => 正確使用這些方法可以提升應用的性能和用戶體驗。

### 3.3 客戶端渲染：對於某些互動性較強的頁面，可以使用客戶端渲染 (Client-side Rendering)。
    => 這意味著在用戶端加載 JavaScript 後，再通過 API 獲取數據和渲染內容。

### 3.4 動態路由和增量靜態再生 (ISR)：對於需要經常更新的頁面，
    => 可以使用動態路由和 ISR 來實現部分靜態生成，
    => 這樣能在不影響整體性能的情況下，定期更新某些頁面內容。
    補充：
    =>增量靜態再生：允許你在不重新構建整個網站的情況下，更新靜態頁面的內容。
      對應常用方法：使用 getStaticProps、getStaticPaths
---

## 4. how to handling the diffenert error & loading events in the standard way.
 => 用相同的SOP處理不同的error、載入事件

## 4.1 操作數據庫出錯：使用try/catch
    =>注意：redirect()，不可寫在try/catch內會報錯，改到try/catch之後寫即可
### 詳見：lib\actions.ts

## 4.2 項目代碼出錯：在xxx資料夾中，創建客戶端的error.tsx
    =>xxx資料夾中，當有任何項目代碼出錯時，會導向error.tsx
    =>好處：能統一處理所有錯誤
### 詳見：lib\actions.ts、dashboard\invoices\error.tsx

## 4.3 數據不存在出錯：在xxx資料夾中，創建客戶端的not-found.tsx
    =>xxx資料夾中，當有任何組件/頁面/圖層數據不存在，會導向not-found.tsx
### 詳見：dashboard\invoices\[id]\edit\not-found.tsx、edit\page.tsx

## 4.4 表單欄位錯誤設定&顯示：
### 大致使用如下：
    => 基於FormSchema，建立錯誤訊息-類型描述，並export
    => action function：
        => 添加prevState抓取之前的狀態，並使用錯誤訊息-類型描述
        => 創建validatedFields，用來存放CreateInvoice.safeParse
        => 判斷驗證-失敗，返回錯誤訊息
        => 判斷驗證-成功，解構validatedFields.data 中的表單欄位
    =>表單調用：
        => initialState：初始設定message、errors
        => 使用useActionState：經過實測，React 18 or19都改用這個       
           (useFormState已被重新命名useActionState)
        => const [state, formAction]：useActionState(fn, initialState, permalink?)
        => 錯誤訊息是否顯示與map，用state
        => 表單action屬性，用formAction

### 詳見：lib\actions.ts、ui\invoices\edit-form.tsx、create-form.tsx

---
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
### 2.1 'use xxx' 系列
=> 寫在文件的頂部
1. 'use client'：在客戶端渲染內容，如：選單
2. 'use server'(默認)：在伺服器端渲染。
3. 都不寫：默認等同'use server'