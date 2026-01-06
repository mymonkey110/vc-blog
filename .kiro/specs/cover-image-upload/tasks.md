# Implementation Plan: Cover Image Upload

## Overview

This implementation plan adds cover image upload functionality to the blog admin's article creation and editing pages. The solution integrates with existing Vercel Blob infrastructure while maintaining backward compatibility with URL-based cover images.

## Tasks

- [ ] 1. Create CoverImageInput component with dual input modes

  - Create new component with URL input and file upload options
  - Implement mode switching between URL and file upload
  - Add basic UI structure with Tailwind CSS styling
  - _Requirements: 1.1, 1.2, 3.4_

- [ ] 1.1 Write unit tests for CoverImageInput component

  - Test component rendering with both input modes
  - Test mode switching behavior
  - _Requirements: 1.1, 1.2_

- [ ] 1.2 Write property test for mode switching

  - **Property 6: Mode switching clears previous input**
  - **Validates: Requirements 3.4**

- [ ] 2. Implement file validation and upload logic

  - [ ] 2.1 Create file validation utility

    - Validate file types (jpg, jpeg, png, webp, gif)
    - Validate file size (5MB limit)
    - Return descriptive error messages
    - _Requirements: 1.3, 1.4, 5.1_

  - [ ] 2.2 Write property test for file validation

    - **Property 1: File validation rejects invalid inputs**
    - **Validates: Requirements 1.3, 1.4, 5.1**

  - [ ] 2.3 Create upload service utility

    - Generate filename with required naming pattern
    - Integrate with existing auth API
    - Handle Vercel Blob direct upload
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 2.4 Write property test for upload naming convention

    - **Property 2: Upload naming convention compliance**
    - **Validates: Requirements 2.2**

  - [ ] 2.5 Write property test for authentication requirement
    - **Property 3: Authentication requirement for uploads**
    - **Validates: Requirements 2.1**

- [ ] 3. Add drag and drop functionality

  - Implement drag and drop event handlers
  - Add visual feedback for drag over states
  - Integrate with file validation and upload flow
  - _Requirements: 3.1_

- [ ] 3.1 Write property test for drag and drop

  - **Property 10: Drag and drop functionality**
  - **Validates: Requirements 3.1**

- [ ] 4. Implement upload progress and state management

  - Add progress indicator during uploads
  - Disable upload controls during upload
  - Handle upload cancellation
  - _Requirements: 3.2, 3.3, 3.5_

- [ ] 4.1 Write property test for upload state management

  - **Property 5: Upload state management**
  - **Validates: Requirements 3.2, 3.3**

- [ ] 5. Add image preview functionality

  - [ ] 5.1 Implement preview for uploaded images

    - Display preview after successful upload
    - Handle preview loading states
    - _Requirements: 1.5, 2.4_

  - [ ] 5.2 Implement preview for URL-based images

    - Validate URL format
    - Display preview for valid URLs
    - Handle image loading errors
    - _Requirements: 4.1, 4.2_

  - [ ] 5.3 Write property test for upload completion

    - **Property 4: Upload completion provides valid URL**
    - **Validates: Requirements 1.5, 2.4**

  - [ ] 5.4 Write property test for URL validation
    - **Property 7: URL validation and preview**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 6. Implement comprehensive error handling

  - Handle network connectivity issues with retry option
  - Handle authentication failures with clear messages
  - Handle storage quota exceeded errors
  - Maintain URL input as fallback for all errors
  - _Requirements: 2.5, 5.2, 5.3, 5.4, 5.5_

- [ ] 6.1 Write property test for error handling

  - **Property 9: Comprehensive error handling**
  - **Validates: Requirements 2.5, 5.2, 5.3, 5.4, 5.5**

- [ ] 7. Checkpoint - Ensure component tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Integrate CoverImageInput into article creation page

  - Replace existing URL input with new CoverImageInput component
  - Update form handling to work with new component
  - Maintain existing form validation and submission logic
  - _Requirements: 1.1, 4.3, 4.4, 4.5_

- [ ] 9. Integrate CoverImageInput into article editing page

  - Replace existing URL input with new CoverImageInput component
  - Ensure proper loading of existing cover image values
  - Maintain backward compatibility with existing articles
  - _Requirements: 1.2, 4.3, 4.4, 4.5_

- [ ] 9.1 Write property test for data persistence

  - **Property 8: Data persistence consistency**
  - **Validates: Requirements 4.3, 4.4, 4.5**

- [ ] 10. Add integration tests

  - [ ] 10.1 Write integration tests for article creation flow

    - Test complete flow from file upload to article save
    - Test URL input flow for backward compatibility
    - _Requirements: 4.3, 4.4, 4.5_

  - [ ] 10.2 Write integration tests for article editing flow
    - Test editing articles with existing cover images
    - Test switching between URL and upload modes
    - _Requirements: 4.3, 4.4, 4.5_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation maintains full backward compatibility with existing URL-based cover images
