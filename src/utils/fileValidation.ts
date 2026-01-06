export interface ValidationRules {
  maxSize: number; // 5MB
  allowedTypes: string[]; // ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const DEFAULT_VALIDATION_RULES: ValidationRules = {
  maxSize: 5 * 1024 * 1024, // 5MB in bytes
  allowedTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ]
};

/**
 * Validates a file against the specified rules
 * @param file - The file to validate
 * @param rules - Validation rules (optional, uses defaults if not provided)
 * @returns ValidationResult indicating if file is valid and any error message
 */
export function validateFile(
  file: File, 
  rules: ValidationRules = DEFAULT_VALIDATION_RULES
): ValidationResult {
  // Check file type
  if (!rules.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `不支持的文件格式。请选择 ${rules.allowedTypes.map(type => 
        type.replace('image/', '').toUpperCase()).join('、')} 格式的图片`
    };
  }

  // Check file size
  if (file.size > rules.maxSize) {
    const maxSizeMB = Math.round(rules.maxSize / (1024 * 1024));
    const fileSizeMB = Math.round(file.size / (1024 * 1024) * 100) / 100;
    return {
      isValid: false,
      error: `文件大小超出限制。当前文件 ${fileSizeMB}MB，最大允许 ${maxSizeMB}MB`
    };
  }

  return {
    isValid: true
  };
}

/**
 * Validates multiple files
 * @param files - Array of files to validate
 * @param rules - Validation rules (optional)
 * @returns Array of validation results
 */
export function validateFiles(
  files: File[], 
  rules: ValidationRules = DEFAULT_VALIDATION_RULES
): ValidationResult[] {
  return files.map(file => validateFile(file, rules));
}

/**
 * Gets a human-readable error message for common validation scenarios
 * @param error - The error type
 * @returns Formatted error message
 */
export function getValidationErrorMessage(error: string): string {
  if (error.includes('不支持的文件格式')) {
    return '请选择有效的图片文件（JPG、PNG、WebP、GIF）';
  }
  
  if (error.includes('文件大小超出限制')) {
    return '图片文件过大，请选择小于 5MB 的图片';
  }
  
  return error;
}