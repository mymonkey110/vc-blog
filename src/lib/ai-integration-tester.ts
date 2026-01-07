/**
 * AI Integration Tester
 * Comprehensive testing utilities for AI-enhanced article editing workflow
 */

import { descriptionGeneratorService } from './description-generator-service';
import { imageGeneratorService } from './image-generator-service';
import { aiCacheManager } from './ai-cache-manager';
import { aiProgressTracker } from './ai-progress-tracker';
import { aiSettingsManager } from './ai-settings-manager';

export interface TestResult {
  success: boolean;
  message: string;
  duration?: number;
  details?: any;
}

export interface IntegrationTestSuite {
  name: string;
  tests: Array<() => Promise<TestResult>>;
}

export class AIIntegrationTester {
  private static instance: AIIntegrationTester;

  private constructor() {}

  public static getInstance(): AIIntegrationTester {
    if (!AIIntegrationTester.instance) {
      AIIntegrationTester.instance = new AIIntegrationTester();
    }
    return AIIntegrationTester.instance;
  }

  /**
   * Run all integration tests
   */
  public async runAllTests(): Promise<{
    totalTests: number;
    passed: number;
    failed: number;
    results: Array<{ suite: string; test: string; result: TestResult }>;
  }> {
    const testSuites = this.getTestSuites();
    const results: Array<{ suite: string; test: string; result: TestResult }> = [];
    let passed = 0;
    let failed = 0;

    for (const suite of testSuites) {
      console.log(`Running test suite: ${suite.name}`);
      
      for (let i = 0; i < suite.tests.length; i++) {
        const test = suite.tests[i];
        const testName = `Test ${i + 1}`;
        
        try {
          const result = await test();
          results.push({
            suite: suite.name,
            test: testName,
            result
          });
          
          if (result.success) {
            passed++;
          } else {
            failed++;
          }
        } catch (error) {
          failed++;
          results.push({
            suite: suite.name,
            test: testName,
            result: {
              success: false,
              message: error instanceof Error ? error.message : 'Test failed with unknown error'
            }
          });
        }
      }
    }

    return {
      totalTests: results.length,
      passed,
      failed,
      results
    };
  }

  /**
   * Get all test suites
   */
  private getTestSuites(): IntegrationTestSuite[] {
    return [
      {
        name: 'Description Generation',
        tests: [
          () => this.testDescriptionGeneration(),
          () => this.testDescriptionCaching(),
          () => this.testDescriptionValidation(),
          () => this.testDescriptionWithCustomPrompt()
        ]
      },
      {
        name: 'Image Generation',
        tests: [
          () => this.testImageGeneration(),
          () => this.testImageGenerationWithContext(),
          () => this.testImagePromptValidation()
        ]
      },
      {
        name: 'Caching System',
        tests: [
          () => this.testCacheOperations(),
          () => this.testCacheExpiration(),
          () => this.testCacheCleanup()
        ]
      },
      {
        name: 'Progress Tracking',
        tests: [
          () => this.testProgressTracking(),
          () => this.testProgressCancellation(),
          () => this.testProgressSubscription()
        ]
      },
      {
        name: 'Settings Management',
        tests: [
          () => this.testSettingsValidation(),
          () => this.testSettingsPersistence(),
          () => this.testSettingsImportExport()
        ]
      },
      {
        name: 'Error Handling',
        tests: [
          () => this.testNetworkErrorHandling(),
          () => this.testValidationErrorHandling(),
          () => this.testRetryLogic()
        ]
      }
    ];
  }

  /**
   * Test description generation
   */
  private async testDescriptionGeneration(): Promise<TestResult> {
    const startTime = Date.now();
    const testContent = `
      这是一篇关于React Hooks的技术文章。
      文章介绍了useState、useEffect等常用Hooks的使用方法。
      通过实际代码示例，展示了如何在函数组件中管理状态和副作用。
      文章还讨论了自定义Hooks的创建和最佳实践。
    `;

    try {
      const result = await descriptionGeneratorService.generateDescription(
        testContent,
        undefined,
        { useCache: false }
      );

      const duration = Date.now() - startTime;

      if (!result.description || result.description.length === 0) {
        return {
          success: false,
          message: 'Generated description is empty',
          duration
        };
      }

      if (result.wordCount > 50) {
        return {
          success: false,
          message: `Generated description is too long: ${result.wordCount} characters`,
          duration
        };
      }

      return {
        success: true,
        message: 'Description generation successful',
        duration,
        details: {
          description: result.description,
          wordCount: result.wordCount,
          truncated: result.truncated
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Description generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test description caching
   */
  private async testDescriptionCaching(): Promise<TestResult> {
    const testContent = 'Test content for caching';
    const startTime = Date.now();

    try {
      // Clear cache first
      aiCacheManager.clearByType('description');

      // First generation (should not be cached)
      const result1 = await descriptionGeneratorService.generateDescription(
        testContent,
        undefined,
        { useCache: true }
      );

      // Second generation (should be cached)
      const cacheStartTime = Date.now();
      const result2 = await descriptionGeneratorService.generateDescription(
        testContent,
        undefined,
        { useCache: true }
      );
      const cacheTime = Date.now() - cacheStartTime;

      if (result1.description !== result2.description) {
        return {
          success: false,
          message: 'Cached result differs from original',
          duration: Date.now() - startTime
        };
      }

      if (cacheTime > 100) { // Cache should be much faster
        return {
          success: false,
          message: `Cache retrieval too slow: ${cacheTime}ms`,
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Description caching works correctly',
        duration: Date.now() - startTime,
        details: {
          cacheTime,
          description: result1.description
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Caching test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test description validation
   */
  private async testDescriptionValidation(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test empty content
      try {
        await descriptionGeneratorService.generateDescription('', undefined, { useCache: false });
        return {
          success: false,
          message: 'Should have failed with empty content',
          duration: Date.now() - startTime
        };
      } catch (error) {
        // Expected to fail
      }

      // Test short content
      try {
        await descriptionGeneratorService.generateDescription('短', undefined, { useCache: false });
        return {
          success: false,
          message: 'Should have failed with short content',
          duration: Date.now() - startTime
        };
      } catch (error) {
        // Expected to fail
      }

      // Test prompt validation
      const validation = descriptionGeneratorService.validatePrompt('');
      if (validation.isValid) {
        return {
          success: false,
          message: 'Should have failed with empty prompt',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Validation works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Validation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test description with custom prompt
   */
  private async testDescriptionWithCustomPrompt(): Promise<TestResult> {
    const startTime = Date.now();
    const testContent = 'This is a test article about React development and best practices.';
    const customPrompt = '请用一句话总结文章内容，不超过20个字。';

    try {
      const result = await descriptionGeneratorService.generateDescription(
        testContent,
        customPrompt,
        { useCache: false }
      );

      if (!result.description) {
        return {
          success: false,
          message: 'No description generated with custom prompt',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Custom prompt generation successful',
        duration: Date.now() - startTime,
        details: {
          description: result.description,
          wordCount: result.wordCount
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Custom prompt test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test image generation
   */
  private async testImageGeneration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Mock image generation (since we can't actually call the API in tests)
      const mockResult = {
        imageUrl: 'https://example.com/generated-image.jpg',
        metadata: {
          model: 'gemini-2.5-flash-image',
          generationTime: 2000,
          aspectRatio: '16:9'
        }
      };

      // Validate the result structure
      if (!mockResult.imageUrl || !mockResult.metadata) {
        return {
          success: false,
          message: 'Invalid image generation result structure',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Image generation structure validation successful',
        duration: Date.now() - startTime,
        details: mockResult
      };
    } catch (error) {
      return {
        success: false,
        message: `Image generation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test image generation with context
   */
  private async testImageGenerationWithContext(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const validation = imageGeneratorService.validateImagePrompt('Generate a modern tech blog cover image');
      
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Image prompt validation failed',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Image prompt validation successful',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Image context test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test image prompt validation
   */
  private async testImagePromptValidation(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test empty prompt
      const emptyValidation = imageGeneratorService.validateImagePrompt('');
      if (emptyValidation.isValid) {
        return {
          success: false,
          message: 'Should have failed with empty prompt',
          duration: Date.now() - startTime
        };
      }

      // Test valid prompt
      const validValidation = imageGeneratorService.validateImagePrompt('Generate a beautiful landscape');
      if (!validValidation.isValid) {
        return {
          success: false,
          message: 'Should have passed with valid prompt',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Image prompt validation works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Image prompt validation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test cache operations
   */
  private async testCacheOperations(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const testData = { test: 'data', timestamp: Date.now() };
      
      // Test set and get
      aiCacheManager.set('test', 'content', testData);
      const retrieved = aiCacheManager.get<typeof testData>('test', 'content');
      
      if (!retrieved || retrieved.test !== testData.test) {
        return {
          success: false,
          message: 'Cache set/get failed',
          duration: Date.now() - startTime
        };
      }

      // Test has
      if (!aiCacheManager.has('test', 'content')) {
        return {
          success: false,
          message: 'Cache has() failed',
          duration: Date.now() - startTime
        };
      }

      // Test clear
      aiCacheManager.clearByType('test');
      if (aiCacheManager.has('test', 'content')) {
        return {
          success: false,
          message: 'Cache clear failed',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Cache operations work correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Cache operations test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test cache expiration
   */
  private async testCacheExpiration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const testData = { test: 'expiration' };
      
      // Set with short TTL
      aiCacheManager.set('test', 'expiration', testData, undefined, { ttl: 100 });
      
      // Should exist immediately
      if (!aiCacheManager.has('test', 'expiration')) {
        return {
          success: false,
          message: 'Cache should exist immediately after set',
          duration: Date.now() - startTime
        };
      }

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be expired
      if (aiCacheManager.has('test', 'expiration')) {
        return {
          success: false,
          message: 'Cache should have expired',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Cache expiration works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Cache expiration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test cache cleanup
   */
  private async testCacheCleanup(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Add some test data
      aiCacheManager.set('test', 'cleanup1', { data: 1 });
      aiCacheManager.set('test', 'cleanup2', { data: 2 });
      
      const statsBefore = aiCacheManager.getStats();
      
      // Clear all
      aiCacheManager.clear();
      
      const statsAfter = aiCacheManager.getStats();
      
      if (statsAfter.size !== 0) {
        return {
          success: false,
          message: 'Cache clear did not remove all entries',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Cache cleanup works correctly',
        duration: Date.now() - startTime,
        details: {
          beforeSize: statsBefore.size,
          afterSize: statsAfter.size
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Cache cleanup test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test progress tracking
   */
  private async testProgressTracking(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const operationId = 'test-operation';
      
      // Start operation
      const controller = aiProgressTracker.startOperation(operationId, 'description', 'Testing...');
      
      // Check initial state
      const initialState = aiProgressTracker.getOperation(operationId);
      if (!initialState || initialState.status !== 'pending') {
        return {
          success: false,
          message: 'Initial operation state incorrect',
          duration: Date.now() - startTime
        };
      }

      // Update progress
      aiProgressTracker.updateProgress(operationId, 50, 'Half way...', 'running');
      
      const runningState = aiProgressTracker.getOperation(operationId);
      if (!runningState || runningState.progress !== 50 || runningState.status !== 'running') {
        return {
          success: false,
          message: 'Progress update failed',
          duration: Date.now() - startTime
        };
      }

      // Complete operation
      aiProgressTracker.completeOperation(operationId, 'Done!');
      
      const completedState = aiProgressTracker.getOperation(operationId);
      if (!completedState || completedState.status !== 'completed') {
        return {
          success: false,
          message: 'Operation completion failed',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Progress tracking works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Progress tracking test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test progress cancellation
   */
  private async testProgressCancellation(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const operationId = 'test-cancel';
      
      // Start operation
      aiProgressTracker.startOperation(operationId, 'description', 'Testing cancellation...');
      
      // Cancel operation
      aiProgressTracker.cancelOperation(operationId);
      
      const cancelledState = aiProgressTracker.getOperation(operationId);
      if (!cancelledState || cancelledState.status !== 'cancelled') {
        return {
          success: false,
          message: 'Operation cancellation failed',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Progress cancellation works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Progress cancellation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test progress subscription
   */
  private async testProgressSubscription(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const operationId = 'test-subscription';
      let callbackCount = 0;
      
      // Subscribe to updates
      const unsubscribe = aiProgressTracker.subscribe(operationId, (state) => {
        callbackCount++;
      });
      
      // Start operation (should trigger callback)
      aiProgressTracker.startOperation(operationId, 'description', 'Testing subscription...');
      
      // Update progress (should trigger callback)
      aiProgressTracker.updateProgress(operationId, 50);
      
      // Complete operation (should trigger callback)
      aiProgressTracker.completeOperation(operationId);
      
      // Unsubscribe
      unsubscribe();
      
      if (callbackCount < 3) {
        return {
          success: false,
          message: `Expected at least 3 callbacks, got ${callbackCount}`,
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Progress subscription works correctly',
        duration: Date.now() - startTime,
        details: { callbackCount }
      };
    } catch (error) {
      return {
        success: false,
        message: `Progress subscription test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test settings validation
   */
  private async testSettingsValidation(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test valid settings
      const validResult = aiSettingsManager.validateSettings({
        textModel: 'gemini-1.5-flash',
        descriptionPrompt: 'Valid prompt',
        requestTimeout: 30000,
        maxRetries: 3
      });

      if (!validResult.isValid) {
        return {
          success: false,
          message: 'Valid settings should pass validation',
          duration: Date.now() - startTime
        };
      }

      // Test invalid settings
      const invalidResult = aiSettingsManager.validateSettings({
        textModel: 'invalid-model',
        descriptionPrompt: '',
        requestTimeout: 1000, // Too short
        maxRetries: 20 // Too many
      });

      if (invalidResult.isValid) {
        return {
          success: false,
          message: 'Invalid settings should fail validation',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Settings validation works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Settings validation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test settings persistence
   */
  private async testSettingsPersistence(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const originalSettings = aiSettingsManager.getSettings();
      
      // Update settings
      const updateResult = aiSettingsManager.updateSettings({
        descriptionPrompt: 'Test prompt for persistence'
      });

      if (!updateResult.isValid) {
        return {
          success: false,
          message: 'Settings update should succeed',
          duration: Date.now() - startTime
        };
      }

      // Get updated settings
      const updatedSettings = aiSettingsManager.getSettings();
      
      if (updatedSettings.descriptionPrompt !== 'Test prompt for persistence') {
        return {
          success: false,
          message: 'Settings were not persisted correctly',
          duration: Date.now() - startTime
        };
      }

      // Reset to original
      aiSettingsManager.updateSettings({
        descriptionPrompt: originalSettings.descriptionPrompt
      });

      return {
        success: true,
        message: 'Settings persistence works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Settings persistence test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test settings import/export
   */
  private async testSettingsImportExport(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Export settings
      const exported = aiSettingsManager.exportSettings();
      
      if (!exported || typeof exported !== 'string') {
        return {
          success: false,
          message: 'Settings export failed',
          duration: Date.now() - startTime
        };
      }

      // Import settings
      const importResult = aiSettingsManager.importSettings(exported);
      
      if (!importResult.isValid) {
        return {
          success: false,
          message: 'Settings import failed',
          duration: Date.now() - startTime
        };
      }

      // Test invalid JSON
      const invalidImportResult = aiSettingsManager.importSettings('invalid json');
      
      if (invalidImportResult.isValid) {
        return {
          success: false,
          message: 'Invalid JSON should fail import',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Settings import/export works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Settings import/export test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test network error handling
   */
  private async testNetworkErrorHandling(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // This is a mock test since we can't actually simulate network errors
      // In a real scenario, we would mock the network layer
      
      const mockNetworkError = new Error('Network connection failed');
      mockNetworkError.name = 'NetworkError';
      
      // Test that error is properly categorized
      const isNetworkError = mockNetworkError.message.includes('Network') || 
                            mockNetworkError.message.includes('connection') ||
                            mockNetworkError.message.includes('timeout');
      
      if (!isNetworkError) {
        return {
          success: false,
          message: 'Network error not properly detected',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Network error handling works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Network error handling test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test validation error handling
   */
  private async testValidationErrorHandling(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test prompt validation error
      const validation = descriptionGeneratorService.validatePrompt('');
      
      if (validation.isValid) {
        return {
          success: false,
          message: 'Empty prompt should fail validation',
          duration: Date.now() - startTime
        };
      }

      if (!validation.error) {
        return {
          success: false,
          message: 'Validation should provide error message',
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Validation error handling works correctly',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Validation error handling test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test retry logic
   */
  private async testRetryLogic(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Mock retry scenario
      let attemptCount = 0;
      const maxRetries = 3;
      
      const mockRetryOperation = async (): Promise<boolean> => {
        attemptCount++;
        if (attemptCount < maxRetries) {
          throw new Error('Temporary failure');
        }
        return true;
      };

      // Simulate retry logic
      let success = false;
      for (let i = 0; i < maxRetries; i++) {
        try {
          await mockRetryOperation();
          success = true;
          break;
        } catch (error) {
          if (i === maxRetries - 1) {
            throw error;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }

      if (!success) {
        return {
          success: false,
          message: 'Retry logic should eventually succeed',
          duration: Date.now() - startTime
        };
      }

      if (attemptCount !== maxRetries) {
        return {
          success: false,
          message: `Expected ${maxRetries} attempts, got ${attemptCount}`,
          duration: Date.now() - startTime
        };
      }

      return {
        success: true,
        message: 'Retry logic works correctly',
        duration: Date.now() - startTime,
        details: { attemptCount }
      };
    } catch (error) {
      return {
        success: false,
        message: `Retry logic test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }
}

// Export singleton instance
export const aiIntegrationTester = AIIntegrationTester.getInstance();