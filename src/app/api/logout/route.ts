import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url), { status: 302 })
  res.cookies.delete('admin_token')
  return res
}