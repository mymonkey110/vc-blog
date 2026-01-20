'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { validateTurnstile } from '@/lib/turnstile';

export async function login(password: string, turnstileToken?: string) {
  // Turnstile token validation for bot detection
  if (!turnstileToken) {
    console.warn('Turnstile token not provided');
    return { success: false, message: '请完成人机验证' };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY environment variable is not set');
    return { success: false, message: '服务器配置错误' };
  }

  const validation = await validateTurnstile(turnstileToken, secret);

  if (!validation.success) {
    console.warn('Turnstile validation failed:', validation.error);
    return { success: false, message: '人机验证失败' };
  }

  const adminPassword = process.env.VC_ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('VC_ADMIN_PASSWORD environment variable is not set');
    return { success: false, message: 'Server configuration error' };
  }

  if (password === adminPassword) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return { success: false, message: 'Server configuration error' };
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      path: '/',
      maxAge: 86400,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    redirect('/admin/articles');
  } else {
    return { success: false, message: '密码错误，请重新输入' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('admin_token', '', { path: '/', maxAge: 0 });
  redirect('/admin/login');
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return false;
    }

    const secret = new TextEncoder().encode(jwtSecret);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}
