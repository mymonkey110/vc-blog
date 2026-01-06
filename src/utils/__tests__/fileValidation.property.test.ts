import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { validateFile, ValidationRules } from '../fileValidation';

describe('File Validation Property Tests', () => {
  /**
   * Feature: cover-image-upload, Property 1: File validation rejects invalid inputs
   * For any file input, files that are not valid image types (jpg, jpeg, png, webp, gif) 
   * or exceed 5MB should be rejected with appropriate error messages
   * Validates: Requirements 1.3, 1.4, 5.1
   */
  it('Property 1: File validation rejects invalid inputs', () => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const invalidImageTypes = ['text/plain', 'application/pdf', 'video/mp4', 'audio/mp3'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    fc.assert(
      fc.property(
        fc.oneof(
          // Generate invalid file types
          fc.record({
            type: fc.constantFrom(...invalidImageTypes),
            size: fc.integer({ min: 1, max: maxSize })
          }),
          // Generate files that are too large
          fc.record({
            type: fc.constantFrom(...validImageTypes),
            size: fc.integer({ min: maxSize + 1, max: maxSize * 2 })
          })
        ),
        fc.string({ minLength: 1, maxLength: 50 }), // filename
        (fileProps, filename) => {
          // Create a mock File object
          const mockFile = {
            name: filename,
            type: fileProps.type,
            size: fileProps.size,
            lastModified: Date.now()
          } as File;

          const result = validateFile(mockFile);

          // Invalid files should always be rejected
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
          expect(typeof result.error).toBe('string');
          expect(result.error!.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 1b: Valid files are accepted', () => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    fc.assert(
      fc.property(
        fc.constantFrom(...validImageTypes),
        fc.integer({ min: 1, max: maxSize }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (type, size, filename) => {
          // Create a mock File object with valid properties
          const mockFile = {
            name: filename,
            type: type,
            size: size,
            lastModified: Date.now()
          } as File;

          const result = validateFile(mockFile);

          // Valid files should always be accepted
          expect(result.isValid).toBe(true);
          expect(result.error).toBeUndefined();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});