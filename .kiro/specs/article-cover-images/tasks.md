# Implementation Plan: Article Cover Images

## Overview

This implementation plan breaks down the article cover images feature into discrete coding tasks that build incrementally. Each task focuses on a specific component while ensuring backward compatibility and proper error handling throughout the development process.

## Tasks

- [x] 1. Database schema update and model changes

  - Update Prisma schema to add coverPic field with @map("cover_pic") directive
  - Use `npx prisma db push` to sync schema changes to database
  - Regenerate Prisma client types with `npx prisma generate`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ]\* 1.1 Write property test for database schema

  - **Property 1: Article creation accepts optional cover images**
  - **Validates: Requirements 1.2**

- [ ]\* 1.2 Write property test for URL validation

  - **Property 2: URL validation enforces constraints**
  - **Validates: Requirements 1.3, 4.2**

- [ ]\* 1.3 Write property test for null handling

  - **Property 3: Null coverPic handling**
  - **Validates: Requirements 1.4**

- [x] 2. Update API endpoints for cover image support

  - Modify article creation endpoint to accept coverPic field
  - Modify article update endpoint to handle coverPic updates
  - Add URL validation logic for coverPic field
  - Update API response types to include coverPic
  - _Requirements: 1.2, 1.3, 4.1, 4.2_

- [ ]\* 2.1 Write unit tests for API endpoints

  - Test article creation with and without coverPic
  - Test URL validation edge cases
  - Test error handling for invalid URLs
  - _Requirements: 1.2, 4.1, 4.2_

- [ ] 3. Checkpoint - Ensure database and API tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Update BlogList component for cover image display

  - Modify BlogList component to display cover images
  - Implement fallback placeholder for articles without cover images
  - Add error handling for failed image loads
  - Use Next.js Image component for optimized loading
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.3, 4.4_

- [ ]\* 4.1 Write property test for image display logic

  - **Property 4: Cover image display and fallback**
  - **Validates: Requirements 2.1, 2.2, 2.3, 3.3**

- [ ]\* 4.2 Write property test for error handling

  - **Property 6: Error handling for invalid URLs**
  - **Validates: Requirements 4.1, 4.3**

- [x] 5. Update article queries to include coverPic field

  - Modify database queries in blog list page to select coverPic
  - Update article detail queries if needed
  - Ensure backward compatibility with existing articles
  - _Requirements: 2.1, 3.2, 3.3_

- [ ]\* 5.1 Write property test for migration compatibility

  - **Property 5: Migration preserves existing articles**
  - **Validates: Requirements 3.2**

- [x] 6. Update admin interface for cover image management

  - Add coverPic field to article creation form
  - Add coverPic field to article editing form
  - Implement URL input validation in admin interface
  - Add preview functionality for cover images
  - _Requirements: 1.2, 4.2_

- [ ]\* 6.1 Write unit tests for admin interface

  - Test form submission with coverPic
  - Test validation feedback
  - Test preview functionality
  - _Requirements: 1.2, 4.2_

- [x] 7. Add placeholder image and styling

  - Create or source a default placeholder image
  - Implement responsive CSS for cover images
  - Ensure proper aspect ratio maintenance
  - Add loading states and transitions
  - _Requirements: 2.3, 2.4_

- [x] 8. Final integration and testing

  - Test complete flow from admin creation to blog display
  - Verify migration works with existing articles
  - Test responsive behavior across screen sizes
  - Verify image loading performance
  - _Requirements: 2.4, 2.5, 3.1, 3.3_

- [ ]\* 8.1 Write integration tests

  - Test end-to-end article creation with cover image
  - Test blog list display with mixed articles (with/without images)
  - Test error scenarios and fallback behavior
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.3_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and integration points
- Database schema changes are handled with `npx prisma db push` instead of migrations for simpler development workflow
