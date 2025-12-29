import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/actions/auth';

// 中间件函数，用于保护后台页面
export async function proxy(request: NextRequest) {
  // 获取认证cookie
  const token = request.cookies.get('admin_token')?.value;
  let isLoggedIn = false;

  if (token) {
    isLoggedIn = await verifySession(token);
  }

  console.log(
    `中间件调试 - URL: ${request.nextUrl.pathname}, 已登录: ${isLoggedIn}, token: ${token}`,
  );

  // 如果用户在登录页面且已登录，重定向到后台首页
  if (isLoggedIn && request.nextUrl.pathname === '/admin/login') {
    console.log('中间件: 用户已登录且在登录页，重定向到/admin');
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 检查是否为API请求
  const isApiRequest = request.nextUrl.pathname.startsWith('/admin/api');

  // 如果用户未登录且尝试访问受保护的路径
  if (
    !isLoggedIn &&
    ((request.nextUrl.pathname.startsWith('/admin') &&
      request.nextUrl.pathname !== '/admin/login') ||
      request.nextUrl.pathname.startsWith('/api/articles'))
  ) {
    console.log(`中间件: 用户未登录且访问受保护路径，URL: ${request.nextUrl.pathname}`);

    if (isApiRequest || request.nextUrl.pathname.startsWith('/api')) {
      // API请求返回JSON响应
      return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
    } else {
      // 页面请求重定向到登录页
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 其他情况允许继续
  return NextResponse.next();
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
