import React from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';

/**
 * Next.js应用程序的自定义入口组件
 * 用于全局样式和组件的初始化
 */
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;