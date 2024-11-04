/**
 * 這裡存放所有Server Actions
 * 'use server' 表示此檔案中，export的code，都執行在服務器端
*/ 
'use server'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// 第三方庫：用來檢測驗證數據
import { z } from 'zod';
// 2.建立一個整體大方向的表單驗證的物件
const FormSchema = z.object({
    id:z.string(),
    customerId:z.string(),
    // amount 用coerce強制轉換成 數字類型
    amount:z.coerce.number(),
    status:z.string(),
    date:z.string()
})

// 3.創建新增發票的驗證器：基於驗證器FormSchema，omit()將id、date略過不驗證
const CreateInvoice = FormSchema.omit({id:true, date:true})


export async function createInvoice(formData:FormData){
    /* 1.取得表單數據-可在終端查看結果 => F12沒打印的原因在於，這是在服務器端執行的
       4.表單欄位檢查&驗證：使用驗證器CreateInvoice，解析(parse)取得的表單數據，進行驗證
        可這樣寫：
        const rawFormData = {
            customerId:formData.get('customerId'),
            amount:formData.get('amount'), 
            status:formData.get('status')
        }
        CreateInvoice.parse(rawFormData)

        也可如下合併寫入：
    */ 
    // 1.取得表單數據 + 4.表單欄位檢查&驗證
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId:formData.get('customerId'),
        amount:formData.get('amount'), 
        status:formData.get('status')
    })

    /*  5.補全：
        amountInCents   以美分儲存值，以消除 JavaScript 浮點錯誤並確保更高的準確性。
        date            取得當前日期，作為建立日期
    */
    const amountInCents = amount * 100
    const date = new Date().toISOString().split('T')[0]


    // 6.將資料插入資料庫
    await sql `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (
            ${customerId},
            ${amountInCents},
            ${status},
            ${date}
        )
    `
    /* 7.更新發票路由中顯示的數據
        revalidatePath()：指定強制更新緩存的頁面。
                          資料庫更新後，/dashboard/invoices路徑將重新驗證，並且將從伺服器取得新資料
                          => 因為該頁預設為靜態渲染，所以得這麼做
                          => 使得開發者能夠靈活控制何時更新緩存的頁面
                          => 確保用戶看到的是最新的數據，提升用戶體驗
        redirect()：重定向到發票查詢頁
    */ 
    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
} 

// 不須驗證id、date
const UpdateInvoice = FormSchema.omit({id:true, date:true})
export async function updateInvoice(id:string, formData:FormData){
    const {customerId, amount, status,} = UpdateInvoice.parse({
        customerId:formData.get('customerId'),
        amount:formData.get('amount'), 
        status:formData.get('status')
    })
    const amountInCents = amount * 100

    await sql `
        UPDATE invoices SET 
        customer_id = ${customerId},
        amount = ${amountInCents},
        status = ${status}
        WHERE id = ${id}
    `

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

export async function deleteInvoice(id:string){
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices')
}