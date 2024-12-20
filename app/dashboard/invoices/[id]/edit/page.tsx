import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

type PageParamsType = {
    id:string;
}

export default async function Page(props: { params: Promise<PageParamsType> }) {
 //取得發票編輯頁id、發票數據、 用戶數據
  const params = await props.params;
 console.log('props.params', params)
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id).catch(()=>{}), //若error，則返回undefined
    fetchCustomers()
  ])
  if(!invoice){
    notFound()
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}