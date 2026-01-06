import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { generateCoverImageFilename } from '../uploadService';

describe('Upload Service Property Tests', () => {
  /**
   * Feature: cover-image-upload, Property 2: Upload naming convention compliance
   * For any successful upload to Vercel Blob, the generated filename should follow 
   * the pattern `cover/{filename}+{16位base64随机值}.${ext}`
   * Validates: Requirements 2.2
   */
  it('Property 2: Upload naming convention compliance', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('/')), // base filename
        fc.constantFrom('jpg', 'jpeg', 'png', 'webp', 'gif'), // extension
        (baseName, ext) => {
          const originalFilename = `${baseName}.${ext}`;
          const generatedFilename = generateCoverImageFilename(originalFilename);
          
          // Check pattern: cover/{filename}+{16位base64随机值}.${ext}
          const pattern = /^cover\/(.+)\+([A-Za-z0-9]{16})\.([a-z]+)$/;
          const match = generatedFilename.match(pattern);
          
          expect(match).toBeTruthy();
          expect(match![1]).toBe(baseName); // filename part should match
          expect(match![2]).toHaveLength(16); // random value should be 16 chars
          expect(match![3]).toBe(ext); // extension should match
          
          // Verify random part is base64-like (alphanumeric)
          const randomPart = match![2];
          expect(/^[A-Za-z0-9]+$/.test(randomPart)).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2b: Generated filenames are unique', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.constantFrom('jpg', 'png', 'gif'),
        (baseName, ext) => {
          const originalFilename = `${baseName}.${ext}`;
          
          // Generate multiple filenames for the same input
          const filename1 = generateCoverImageFilename(originalFilename);
          const filename2 = generateCoverImageFilename(originalFilename);
          const filename3 = generateCoverImageFilename(originalFilename);
          
          // They should be different due to random component
          expect(filename1).not.toBe(filename2);
          expect(filename2).not.toBe(filename3);
          expect(filename1).not.toBe(filename3);
          
          // But they should all follow the same pattern
          const pattern = /^cover\/(.+)\+([A-Za-z0-9]{16})\.([a-z]+)$/;
          expect(filename1).toMatch(pattern);
          expect(filename2).toMatch(pattern);
          expect(filename3).toMatch(pattern);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});