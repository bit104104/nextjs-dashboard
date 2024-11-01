import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// import { 
//   fetchRevenue, 
//   fetchLatestInvoices,
//   fetchCardData
// } from '@/app/lib/data';
import { Suspense } from 'react';
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';


export default async function Page() {
  /*請求瀑布寫法：請求執行完成後，才執行下一個
    用於：請求之間需等待結果
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices()
    const {
      totalPaidInvoices,
      totalPendingInvoices,
      numberOfInvoices,
      numberOfCustomers
    } = await fetchCardData()
  */
  
  // 解決請求瀑布的寫法-因為請求之間，無需等待彼此的結果
  /*
    const [
      revenue,
      latestInvoices,
      {
        totalPaidInvoices,
        totalPendingInvoices,
        numberOfInvoices,
        numberOfCustomers
      }
    ] = await Promise.all([
      fetchRevenue(),
      fetchLatestInvoices(),
      fetchCardData(),
    ]);
  */

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton/>}>
          <CardWrapper />
        </Suspense>
        {/* <Card title="Collected"  type="collected" />
        <Card title="Pending"  type="pending" />
        <Card title="Total Invoices" type="invoices" />
        <Card
          title="Total Customers"
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* 異步流式渲染處理， fallback是加載完成前顯示的組件畫面*/}
        <Suspense fallback={ <RevenueChartSkeleton /> }>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={ <LatestInvoicesSkeleton /> }>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}