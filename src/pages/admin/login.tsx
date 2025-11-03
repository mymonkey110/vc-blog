import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 通过API路由进行登录验证
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password }),
        credentials: 'include' // 包含cookies
        // 注意：我们不使用redirect: 'follow'，因为我们想手动处理响应
      });
      
      // 检查是否是重定向响应
      if (response.redirected) {
        // 如果是重定向响应，直接跳转到重定向的URL
        console.log('检测到API重定向，跳转到:', response.url);
        window.location.href = response.url;
      } else {
        // 如果不是重定向，尝试解析JSON
        try {
          const data = await response.json();
          
          if (response.ok) {
            // 登录成功的JSON响应情况
            console.log('登录成功，检查cookie...');
            setTimeout(() => {
              router.push('/admin');
            }, 500);
          } else {
            setError(data.error || '登录失败，请重试');
          }
        } catch (jsonError) {
          // 处理JSON解析错误
          console.error('JSON解析错误:', jsonError);
          setError('服务器响应格式错误，请重试');
        }
      }
    } catch (err) {
      setError('登录失败，请重试');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="w-[400px] bg-white border border-[#e5e2dc] rounded-2xl p-8 shadow-lg">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-[#181511]">VC-BLOG</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="输入访问密码"
                className={`w-full pl-4 pr-10 py-3 bg-white border ${error ? 'border-red-300' : 'border-[#e5e2dc]'} rounded-lg text-[#181511] placeholder-[#887c63] focus:outline-none focus:ring-2 focus:ring-[#e6a219] focus:border-transparent transition-all duration-200`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#887c63] hover:text-[#e6a219] focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {/* 眼睛图标 - 这里使用SVG代码 */}
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.744 1.143L3.707 2.293zM14 10a4 4 0 11-8 0 4 4 0 018 0zm-4-2a2 2 0 11-4 0 2 2 0 014 0zm-6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 bg-[#e6a219] text-[#181511] font-bold rounded-lg transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d39015]'}`}
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}