// spreads authConfig
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { authConfig } from './auth.config';

/*  整體SOP
    1.導出signIn、signOut
    2.在action中創建authenticate，調用signIn
    3.登入表單中使用authenticate
    4.登入表單Login按鈕的pending狀態處理，提交表單完成前，使按鈕不被再次click

    getUser(email)：根據email 到 DB查詢並返回結果的第1筆資料，作為用戶訊息
*/ 
async function getUser(email:string): Promise<User | undefined> {
    try{
        const users = await sql<User>`SELECT * FROM users WHERE email=${email}`
        return users.rows[0]
    }catch(error){
        // 分別給服務器、客戶端傳遞error message
        console.error('取得用戶資訊失敗', error)
        throw new Error('取得用戶資訊失敗')
    }
}
export const { auth, signIn, signOut } = NextAuth({
  // allows users to log in with a username and a password.
  ...authConfig,
  providers:[
    Credentials({
        // credentials 接收登入表單數據
        async authorize(credentials){
            // 驗證數據
            const parseCredentials = z
            .object({
                email:z.string().email(),
                password:z.string().min(6)
            })
            .safeParse(credentials);

            if(parseCredentials.success){
                const {email, password} = parseCredentials.data
                /* SOP
                    => 根據email，查詢DB中的用戶訊息
                    => 若查無資料，返回null
                    => 若查有資料，進行密碼運算成hash進行匹配(表單密碼 vs DB密碼)
                                   passwordMatch：根據比較結果，返回布爾值
                    => 成功返回用戶訊息
                */ 
                const user = await getUser(email)
                if(!user) return null
                const passwordsMatch = await bcrypt.compare(password, user.password);
                if(passwordsMatch) {
                    console.log('auth.ts-user',user)
                    return user
                }
            }
            console.log('登入驗證失敗')
            return null
        }
    })
  ]
});