'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  sitekey?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  onVerify?: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  action?: string;
}

export function Turnstile({
  sitekey,
  theme = 'auto',
  size = 'normal',
  onVerify,
  onError,
  onExpire,
  action,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 使用 Ref 保持回调函数的最新状态，而不触发 useEffect 重运行
  // 解决了 "验证成功后组件重置" 的 BUG
  const callbacks = useRef({ onVerify, onError, onExpire });
  callbacks.current = { onVerify, onError, onExpire };

  // 1. 加载脚本 (只加载一次，不要在 cleanup 里移除 script 标签)
  useEffect(() => {
    if (document.getElementById('cf-turnstile-script')) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.id = 'cf-turnstile-script';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 2. 渲染 Widget
  useEffect(() => {
    if (!isScriptLoaded || !sitekey || !containerRef.current || !window.turnstile) {
      return;
    }

    // 如果已经有 Widget ID，说明已经渲染过了，防止 Strict Mode 下的双重渲染
    if (widgetId.current) return;

    const id = window.turnstile.render(containerRef.current, {
      sitekey,
      theme,
      size,
      action,
      // 在这里调用 ref 中的回调，而不是直接依赖 props
      callback: (token: string) => callbacks.current.onVerify?.(token),
      'error-callback': (err: string) => callbacks.current.onError?.(err),
      'expired-callback': () => callbacks.current.onExpire?.(),
    });

    widgetId.current = id;

    // 清理函数
    return () => {
      if (widgetId.current) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
    // 注意：这里移除了 onVerify 等回调依赖，只依赖核心配置
  }, [isScriptLoaded, sitekey, theme, size, action]);

  if (!sitekey) {
    return <div className="text-red-500 text-sm">Turnstile sitekey missing</div>;
  }

  return <div ref={containerRef} className="cf-turnstile" />;
}
