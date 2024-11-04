'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  /**
   * useRouter        創建路由
   * usePathname      讀取當前url路徑  /dashboard/invoices
   * useSearchParams  讀取當前url路徑中的參數
   * handleSearch     查詢欄位改變時，將值帶入到URL的query傳參
   * searchParams.get('query')  從 URL 的查詢參數中獲取名為 query 的參數的值。
   * ?.toString()               可選鏈接運算符。它的作用是確保在獲取到的值存在的情況下調用，
                                不存在：則不會執行 toString()，整體結果為 undefined。
   * defaultValue={searchParams.get('query')?.toString()} 
                                => 同步查詢框
                                => 用於查詢進行路由跳轉時 => 頁面+URL刷新 => 取得URL query值 回寫到欄位
                                  (因為只需，執行1次，故用非受控的defaultValue處理)
  */
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  
  const handleSearch = useDebouncedCallback((term:string | number)=>{
    // params 作為修改後的參數對象
    const params = new URLSearchParams(searchParams.toString())
    // 查詢更新時，重回第1頁
    params.set('page', '1')
    // 查詢值：有=>將值寫入到路徑的query中 | 無=>將刪除query
    if(term){
      params.set('query', term.toString())
    }else{
      params.delete('query')
    }
    // console.log('查詢條件', term)
    // 根據查詢的URL路徑，透過路由跳轉到新的地址
    return router.replace(`${pathName}?${params.toString()}`)
  }, 500)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={ (e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
