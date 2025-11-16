import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.VC_ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('VC_ADMIN_PASSWORD environment variable is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (password === adminPassword) {
      const res = NextResponse.redirect(new URL('/admin', req.url), { status: 302 })
      res.headers.set('Set-Cookie', 'admin_token=true; Path=/admin; Max-Age=86400; SameSite=Strict')
      return res
    } else {
      return NextResponse.json({ error: '密码错误，请重新输入' }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: '登录失败，请重试' }, { status: 500 })
  }
}

