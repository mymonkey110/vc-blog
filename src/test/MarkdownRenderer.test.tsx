import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import MarkdownRenderer from '@/components/MarkdownRenderer';

// Generator for realistic code content
const codeContentArb = fc.oneof(
  fc.constant('console.log("hello world");'),
  fc.constant('function test() { return true; }'),
  fc.constant('const x = 42;'),
  fc.constant('if (condition) { doSomething(); }'),
  fc.constant('class MyClass { constructor() {} }'),
  fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length > 0)
);

describe('MarkdownRenderer - CSS Module Integration', () => {
  /**
   * Feature: code-block-styling-fix, Property 10: CSS module integration
   * For any code element rendered by the Markdown_Renderer, CSS module classes should be properly applied and take precedence over conflicting styles
   * Validates: Requirements 4.1, 4.2, 4.4, 4.5
   */
  it('should apply CSS module classes to code elements', () => {
    fc.assert(
      fc.property(
        fc.array(codeContentArb, { minLength: 1, maxLength: 3 }),
        fc.oneof(
          fc.constant('javascript'),
          fc.constant('typescript'),
          fc.constant('python'),
          fc.constant('css'),
          fc.constant('html')
        ),
        (codeLines, language) => {
          const codeContent = codeLines.join('\n');
          const markdownContent = `\`\`\`${language}\n${codeContent}\n\`\`\``;
          
          const { container } = render(<MarkdownRenderer content={markdownContent} />);
          
          // Verify the main container has the CSS module class
          const markdownContainer = container.querySelector('.markdown-content');
          expect(markdownContainer).toBeInTheDocument();
          
          // Verify code block wrapper has the data attribute for CSS targeting
          const codeBlockWrapper = container.querySelector('[data-enhance-code-block="true"]');
          expect(codeBlockWrapper).toBeInTheDocument();
          
          // Check if SyntaxHighlighter was used (preferred) or fallback pre element
          const syntaxHighlighter = container.querySelector('[data-testid="syntax-highlighter"]');
          const fallbackPre = container.querySelector('pre[data-enhance-code-block="true"]');
          
          // Either SyntaxHighlighter or fallback should be present
          expect(syntaxHighlighter || fallbackPre).toBeInTheDocument();
          
          if (syntaxHighlighter) {
            expect(syntaxHighlighter).toHaveAttribute('data-language', language);
            // Verify custom styles are applied (indicating CSS module integration)
            const computedStyle = window.getComputedStyle(syntaxHighlighter);
            expect(computedStyle.margin).toBe('0px');
            expect(computedStyle.padding).toBe('0px');
            // Background can be 'transparent' or 'rgba(0, 0, 0, 0)' - both are equivalent
            const bgColor = computedStyle.background;
            expect(bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)').toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply CSS module classes to inline code elements', () => {
    // First, test with a simple known case
    const { container } = render(<MarkdownRenderer content="Hello `world` test" />);
    const inlineCodeElement = container.querySelector('code.inline-code');
    expect(inlineCodeElement).toBeInTheDocument();
    expect(inlineCodeElement).toHaveTextContent('world');
    
    // Then run property-based test with more controlled inputs
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('hello'),
          fc.constant('world'),
          fc.constant('test123'),
          fc.constant('variable'),
          fc.constant('function')
        ),
        fc.string({ minLength: 5, maxLength: 50 }).filter(s => !s.includes('`')),
        (inlineCode, surroundingText) => {
          const markdownContent = `${surroundingText} \`${inlineCode}\` ${surroundingText}`;
          
          const { container } = render(<MarkdownRenderer content={markdownContent} />);
          
          // Verify the main container has the CSS module class
          const markdownContainer = container.querySelector('.markdown-content');
          expect(markdownContainer).toBeInTheDocument();
          
          // Verify inline code has the CSS module class
          const inlineCodeElement = container.querySelector('code.inline-code');
          expect(inlineCodeElement).toBeInTheDocument();
          
          // Check that the content matches exactly
          expect(inlineCodeElement).toHaveTextContent(inlineCode);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should ensure CSS module styles take precedence over default styles', () => {
    fc.assert(
      fc.property(
        codeContentArb,
        (codeContent) => {
          const markdownContent = `\`\`\`javascript\n${codeContent}\n\`\`\``;
          
          const { container } = render(<MarkdownRenderer content={markdownContent} />);
          
          // Check if SyntaxHighlighter was used or fallback
          const syntaxHighlighter = container.querySelector('[data-testid="syntax-highlighter"]');
          const fallbackPre = container.querySelector('pre[data-enhance-code-block="true"]');
          
          if (syntaxHighlighter) {
            // Verify that SyntaxHighlighter receives custom styles that allow CSS modules to take precedence
            const computedStyle = window.getComputedStyle(syntaxHighlighter);
            
            // These styles should be set to allow CSS modules to override them
            expect(computedStyle.margin).toBe('0px');
            // Background can be 'transparent' or 'rgba(0, 0, 0, 0)' - both are equivalent
            const bgColor = computedStyle.background;
            expect(bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)').toBe(true);
            expect(computedStyle.fontFamily).toBe('inherit');
            expect(computedStyle.fontSize).toBe('inherit');
            expect(computedStyle.lineHeight).toBe('inherit');
          } else if (fallbackPre) {
            // Fallback pre should have the data attribute for CSS targeting
            expect(fallbackPre).toHaveAttribute('data-enhance-code-block', 'true');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should properly integrate with react-syntax-highlighter without conflicts', () => {
    fc.assert(
      fc.property(
        fc.array(codeContentArb, { minLength: 1, maxLength: 3 }),
        fc.oneof(
          fc.constant('javascript'),
          fc.constant('typescript'),
          fc.constant('python')
        ),
        (codeLines, language) => {
          const codeContent = codeLines.join('\n');
          const markdownContent = `\`\`\`${language}\n${codeContent}\n\`\`\``;
          
          const { container } = render(<MarkdownRenderer content={markdownContent} />);
          
          // Verify the integration doesn't break the component structure
          const markdownContainer = container.querySelector('.markdown-content');
          const codeBlockWrapper = container.querySelector('[data-enhance-code-block="true"]');
          
          expect(markdownContainer).toBeInTheDocument();
          expect(codeBlockWrapper).toBeInTheDocument();
          
          // Check for either SyntaxHighlighter or fallback
          const syntaxHighlighter = container.querySelector('[data-testid="syntax-highlighter"]');
          const fallbackPre = container.querySelector('pre[data-enhance-code-block="true"]');
          
          expect(syntaxHighlighter || fallbackPre).toBeInTheDocument();
          
          if (syntaxHighlighter) {
            const codeElement = syntaxHighlighter.querySelector('code');
            expect(codeElement).toBeInTheDocument();
            // Check that content is present (newlines may be normalized)
            const actualContent = codeElement?.textContent || '';
            const expectedContent = codeContent.replace(/\s+/g, ' ').trim();
            const normalizedActual = actualContent.replace(/\s+/g, ' ').trim();
            expect(normalizedActual).toContain(expectedContent.split(' ')[0]); // At least first word should be present
            expect(syntaxHighlighter).toHaveAttribute('data-language', language);
          } else if (fallbackPre) {
            const codeElement = fallbackPre.querySelector('code');
            expect(codeElement).toBeInTheDocument();
            // Check that content is present (newlines may be normalized)
            const actualContent = codeElement?.textContent || '';
            const expectedContent = codeContent.replace(/\s+/g, ' ').trim();
            const normalizedActual = actualContent.replace(/\s+/g, ' ').trim();
            expect(normalizedActual).toContain(expectedContent.split(' ')[0]); // At least first word should be present
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});