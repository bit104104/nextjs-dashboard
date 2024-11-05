/**
 * 這裡存放所有Server Actions
 * 'use server' 表示此檔案中，export的code，都執行在服務器端
*/ 
'use server'
import { sql } from '@vercel/postgres';
import { error } from 'console';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// 第三方庫：用來檢測驗證數據
import { z } from 'zod';
/*2.建立一個整體大方向的表單驗證的物件
    完善表單驗證
    customerId  設定 error message
    amount 用coerce強制轉換成 數字類型，且gt(0)=大於0，否則顯示message
    status 枚舉2個狀態。且設定 error message
*/ 
const FormSchema = z.object({
    id:z.string(),
    customerId:z.string({ invalid_type_error:'請選擇客戶名稱' }),
    amount:z.coerce.number().gt(0, { message:'請輸入大於0的數字' }),
    status:z.enum(['pending', 'paid'], { invalid_type_error:'請選擇一個狀態' }),
    date:z.string()
})
 
/*3.創建新增發票的驗證器 & createInvoice 的Action功能
    CreateInvoice:：基於驗證器FormSchema，omit()將id、date略過不驗證
    prevState：NextJS內建，抓取之前的狀態
    type State：錯誤訊息-類型描述
    parse、safeParse：差在有錯誤時，前者會馬上報錯，後者不會馬上但會把報錯訊息返回
*/ 
export type State = {
    errors?:{
        customerId?:string[],
        amount?:string[],
        status?:string[],
    },
    message?:string | null
}
const CreateInvoice = FormSchema.omit({id:true, date:true})
export async function createInvoice(prevState:State, formData:FormData){
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
    // 模擬1個error => 這時會導向error.tsx
    // throw new Error('創建失敗')
    // const {customerId, amount, status} = CreateInvoice.parse({
    // 驗證並得到結果
    const validatedFields = CreateInvoice.safeParse({
        customerId:formData.get('customerId'),
        amount:formData.get('amount'), 
        status:formData.get('status')
    })
    console.log('validatedFields',validatedFields)
    // 驗證失敗返回錯誤訊息
    if(!validatedFields.success){
        return {
            errors:validatedFields.error.flatten().fieldErrors,
            message:''
        }
    }

    /*  5.補全：
        amountInCents   以美分儲存值，以消除 JavaScript 浮點錯誤並確保更高的準確性。
        date            取得當前日期，作為建立日期
        {customerId, amount, status}    驗證成功，從validatedFields.data解構出欄位值
    */
    const {customerId, amount, status} = validatedFields.data
    const amountInCents = amount * 100
    const date = new Date().toISOString().split('T')[0]

    // 6.將資料插入資料庫 + 操作數據庫出錯處理
    try{
        await sql `
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (
                ${customerId},
                ${amountInCents},
                ${status},
                ${date}
            )
        `
        console.log('新增成功！')
    }catch(error){
        console.log('新增失敗')
        return { message: '新增失敗',}
    }
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
export async function updateInvoice(id:string, prevState:State, formData:FormData){
    const validatedFields = UpdateInvoice.safeParse({
        customerId:formData.get('customerId'),
        amount:formData.get('amount'), 
        status:formData.get('status')
    })
    if(!validatedFields.success){
        return {
            errors:validatedFields.error.flatten().fieldErrors,
            message:''
        }
    }
    const {customerId, amount, status } = validatedFields.data 
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
