// 中間件
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/*  授權檢測執行的中間件
    時機：每次路由切換進行
    從NextAuth(authConfig)加工出來的
    解構會有這些
    auth            用於做檢測的方法，會調用auth.config.ts中的authorized()
    signIn/signOut  登入/登出時的方法
*/ 
export default NextAuth(authConfig).auth;

/* 設定要執行授權中間件的路徑匹配
  排除不是這些地址的其他地址都執行
  => api、_next/static、_next/image
*/ 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
