# Requirements Document

## Introduction

This feature adds cover image upload functionality to the blog admin's article creation and editing pages. Currently, users can only specify cover images via URL links. This enhancement will allow direct image uploads using Vercel Blob storage with client-side direct upload for better user experience and content management.

## Glossary

- **Admin_Dashboard**: The backend management system for content administration
- **Article_Editor**: The article creation and editing interface in the admin dashboard
- **Cover_Image**: The main image displayed with an article for visual appeal and identification
- **Vercel_Blob**: Cloud storage service for handling file uploads
- **Client_Upload**: Direct upload from browser to storage without server intermediary
- **Upload_Auth**: Authentication mechanism for secure upload permissions

## Requirements

### Requirement 1: Cover Image Upload Interface

**User Story:** As a blog administrator, I want to upload cover images directly from my device, so that I can easily add visual content without needing external hosting.

#### Acceptance Criteria

1. WHEN an administrator accesses the article creation page, THE Article_Editor SHALL display both URL input and file upload options for cover images
2. WHEN an administrator accesses the article editing page, THE Article_Editor SHALL display both URL input and file upload options for cover images
3. WHEN an administrator selects a file for upload, THE Article_Editor SHALL validate the file type is an image format (jpg, jpeg, png, webp, gif)
4. WHEN an administrator selects a file larger than 5MB, THE Article_Editor SHALL prevent upload and display an error message
5. WHEN an administrator uploads an image successfully, THE Article_Editor SHALL display a preview of the uploaded image

### Requirement 2: Vercel Blob Integration

**User Story:** As a blog administrator, I want my uploaded images to be stored securely and reliably, so that my content remains accessible and performant.

#### Acceptance Criteria

1. WHEN an administrator uploads a cover image, THE Upload_System SHALL authenticate the upload request using the existing auth API
2. WHEN uploading to Vercel Blob, THE Upload_System SHALL name files using the pattern `cover/{filename}+{16位base64随机值}.${ext}`
3. WHEN an upload is initiated, THE Upload_System SHALL use client-side direct upload to Vercel Blob
4. WHEN an upload completes successfully, THE Upload_System SHALL return the public URL of the uploaded image
5. IF an upload fails, THEN THE Upload_System SHALL display a descriptive error message to the administrator

### Requirement 3: User Experience Enhancement

**User Story:** As a blog administrator, I want a smooth and intuitive upload experience, so that I can efficiently manage article cover images.

#### Acceptance Criteria

1. WHEN an administrator drags and drops an image file onto the upload area, THE Article_Editor SHALL initiate the upload process
2. WHILE an upload is in progress, THE Article_Editor SHALL display a progress indicator
3. WHEN an upload is in progress, THE Article_Editor SHALL disable the upload button to prevent duplicate uploads
4. WHEN switching between URL input and file upload modes, THE Article_Editor SHALL clear the previous input
5. WHEN an administrator cancels an ongoing upload, THE Upload_System SHALL abort the upload process

### Requirement 4: Existing Functionality Preservation

**User Story:** As a blog administrator, I want to continue using URL-based cover images when needed, so that I maintain flexibility in content management.

#### Acceptance Criteria

1. WHEN an administrator enters a cover image URL, THE Article_Editor SHALL validate the URL format
2. WHEN an administrator provides a valid image URL, THE Article_Editor SHALL display a preview of the linked image
3. WHEN saving an article with a URL-based cover image, THE Article_Editor SHALL preserve the URL in the database
4. WHEN saving an article with an uploaded cover image, THE Article_Editor SHALL store the Vercel Blob URL in the database
5. THE Article_Editor SHALL maintain backward compatibility with existing articles that use URL-based cover images

### Requirement 5: Error Handling and Validation

**User Story:** As a blog administrator, I want clear feedback when upload issues occur, so that I can resolve problems quickly and continue my work.

#### Acceptance Criteria

1. WHEN an invalid file type is selected, THE Article_Editor SHALL display an error message specifying supported formats
2. WHEN network connectivity issues occur during upload, THE Upload_System SHALL display a retry option
3. WHEN authentication fails for upload, THE Upload_System SHALL display an authentication error message
4. WHEN Vercel Blob storage quota is exceeded, THE Upload_System SHALL display a storage limit error message
5. WHEN any upload error occurs, THE Article_Editor SHALL allow the administrator to switch to URL input as an alternative
