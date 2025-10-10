import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Next.js的自定义文档组件
 * 用于服务器端渲染的HTML文档结构
 */
export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700;900&family=Work+Sans:wght@400;500;700;900&family=Playfair+Display:wght@700&family=Merriweather:wght@700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional"
        />
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}