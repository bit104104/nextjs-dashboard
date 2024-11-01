import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { 
  fetchRevenue, 
  fetchLatestInvoices,
  fetchCardData
} from '@/app/lib/data';


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

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}