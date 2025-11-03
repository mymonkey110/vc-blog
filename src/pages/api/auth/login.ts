import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    const adminPassword = process.env.VC_ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('VC_ADMIN_PASSWORD environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (password === adminPassword) {
      // 设置cookie用于认证 - 暂时移除HttpOnly标志以便调试
      res.setHeader('Set-Cookie', 'admin_token=true; Path=/admin; Max-Age=86400; SameSite=Strict');
      // 直接重定向到后台首页，而不是返回JSON响应
      console.log('API: 密码验证成功，重定向到/admin');
      res.redirect(302, '/admin');
      return; // 简单的return，不返回任何值
    } else {
      return res.status(401).json({ error: '密码错误，请重新输入' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '登录失败，请重试' });
  }
}