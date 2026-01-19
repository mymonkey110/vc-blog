'use client';

import React, { useState } from 'react';
import { login } from '@/actions/auth';
import { Turnstile } from '@/components/Turnstile';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState('');

  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      setError('请完成人机验证');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const result = await login(password, turnstileToken);
      if (result && !result.success) {
        setError(result.message);
        console.error('Login error:', result.message);
      }
    } catch (err) {
      // Next.js redirect throws a special error, ignore it
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        return;
      }
      setError(
        typeof err === 'string' ? err : err instanceof Error ? err.message : '登录失败，请重试',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-[400px] bg-white border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex justify-center mb-8">
          <h1 className="title-2 text-primary-text">VC-BLOG</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="输入访问密码"
                className={`w-full pl-4 pr-10 py-3 bg-background border ${error ? 'border-red-300' : 'border-border'} rounded-lg text-primary-text placeholder-secondary-text font-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-text hover:text-accent focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.744 1.143L3.707 2.293zM14 10a4 4 0 11-8 0 4 4 0 018 0zm-4-2a2 2 0 11-4 0 2 2 0 014 0zm-6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm font-ui">{error}</p>}
          </div>

          {/* Cloudflare Turnstile Widget */}
          <div className="space-y-2">
            {turnstileError && <p className="text-red-500 text-sm font-ui">{turnstileError}</p>}
            <Turnstile
              sitekey={sitekey}
              action="login"
              theme="light"
              onVerify={(token) => {
                setTurnstileToken(token);
                setError('');
                setTurnstileError('');
              }}
              onError={(errorCode) => {
                setTurnstileToken(null);
                setTurnstileError(`验证码错误: ${errorCode}`);
              }}
              onExpire={() => {
                setTurnstileToken(null);
                setTurnstileError('验证码已过期，请刷新');
              }}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-accent text-primary-text font-bold rounded-lg transition-all duration-200 font-ui ${isLoading || !turnstileToken ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            disabled={isLoading || !turnstileToken}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
