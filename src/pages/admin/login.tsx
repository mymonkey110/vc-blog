import React, { useState } from 'react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 这里将在后续连接到真实的认证API
      // 暂时模拟登录过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username && password) {
        // 登录成功后的处理，比如保存token，重定向到后台主页
        console.log('Login successful');
        // 暂时重定向到首页，后续会改为后台首页
        window.location.href = '/admin';
      } else {
        setError('请填写用户名和密码');
      }
    } catch (err) {
      setError('登录失败，请重试');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-white overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4f3f0] px-10 py-3">
          <div className="flex items-center gap-4 text-[#181511]">
            <div className="size-4">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-[#181511] text-lg font-bold leading-tight tracking-[-0.015em]">Blog Admin</h2>
          </div>
        </header>
        <div className="px-40 flex flex-1 items-center justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5">
            <h2 className="text-[#181511] tracking-light text-[28px] font-bold leading-tight px-4 pb-3 pt-5">登录</h2>
            
            {error && (
              <div className="px-4 py-2">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#181511] text-base font-medium leading-normal pb-2">用户名/邮箱</p>
                  <input 
                    type="text" 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#181511] focus:outline-0 focus:ring-0 border border-[#e5e2dc] bg-white focus:border-[#e5e2dc] h-14 placeholder:text-[#887c63] p-[15px] text-base font-normal leading-normal" 
                    placeholder="请输入用户名或邮箱" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#181511] text-base font-medium leading-normal pb-2">密码</p>
                  <input 
                    type="password" 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#181511] focus:outline-0 focus:ring-0 border border-[#e5e2dc] bg-white focus:border-[#e5e2dc] h-14 placeholder:text-[#887c63] p-[15px] text-base font-normal leading-normal" 
                    placeholder="请输入密码" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <button 
                  type="submit" 
                  className={`flex min-w-[84px] max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#e6a219] text-[#181511] text-sm font-bold leading-normal tracking-[0.015em] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}