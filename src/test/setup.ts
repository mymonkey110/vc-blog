import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock CSS modules
const mockCSSModule = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return prop;
      }
      return undefined;
    },
  },
);

// Mock CSS module imports
vi.mock('@/styles/markdown.module.css', () => ({
  default: mockCSSModule,
  'markdown-content': 'markdown-content',
  'inline-code': 'inline-code',
  codeBlock: 'codeBlock',
}));

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: (props: any) => {
    const { children, language, style, customStyle, codeTagProps, ...otherProps } = props;
    return React.createElement(
      'pre',
      {
        'data-testid': 'syntax-highlighter',
        'data-language': language,
        style: customStyle,
        ...otherProps,
      },
      React.createElement('code', { style: codeTagProps?.style }, children),
    );
  },
}));

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}));
