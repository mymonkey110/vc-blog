import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MarkdownRenderer from '@/components/MarkdownRenderer';

describe('Syntax Highlighting Debug', () => {
  it('should debug what gets rendered for code blocks', () => {
    const javaScriptCode = `function greet() { return "hello"; }`;
    const markdownContent = `\`\`\`javascript\n${javaScriptCode}\n\`\`\``;
    
    const { container } = render(<MarkdownRenderer content={markdownContent} />);
    
    // Debug: Log the entire HTML structure
    console.log('Rendered HTML:', container.innerHTML);
    
    // Check what elements are actually present
    const codeBlockWrapper = container.querySelector('[data-enhance-code-block="true"]');
    const syntaxHighlighter = container.querySelector('[data-testid="syntax-highlighter"]');
    const fallbackPre = container.querySelector('pre');
    const codeElements = container.querySelectorAll('code');
    
    console.log('Code block wrapper:', codeBlockWrapper);
    console.log('Syntax highlighter:', syntaxHighlighter);
    console.log('Fallback pre:', fallbackPre);
    console.log('Code elements:', codeElements.length);
    
    // At minimum, we should have the wrapper
    expect(codeBlockWrapper).toBeInTheDocument();
    
    // And some code content
    expect(container.textContent).toContain('function');
    expect(container.textContent).toContain('greet');
  });
});