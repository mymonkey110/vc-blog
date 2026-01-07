/**
 * AI Progress Tracker
 * Tracks progress of AI operations and provides cancellation support
 */

export interface ProgressState {
  id: string;
  type: 'description' | 'image';
  status: 'pending' | 'running' | 'completed' | 'cancelled' | 'error';
  progress: number; // 0-100
  message?: string;
  startTime: number;
  endTime?: number;
  error?: string;
}

export interface ProgressCallback {
  (state: ProgressState): void;
}

export class AIProgressTracker {
  private static instance: AIProgressTracker;
  private operations = new Map<string, ProgressState>();
  private callbacks = new Map<string, ProgressCallback[]>();
  private abortControllers = new Map<string, AbortController>();

  private constructor() {}

  public static getInstance(): AIProgressTracker {
    if (!AIProgressTracker.instance) {
      AIProgressTracker.instance = new AIProgressTracker();
    }
    return AIProgressTracker.instance;
  }

  /**
   * Start tracking an operation
   */
  public startOperation(
    id: string,
    type: 'description' | 'image',
    message?: string
  ): AbortController {
    const abortController = new AbortController();
    
    const state: ProgressState = {
      id,
      type,
      status: 'pending',
      progress: 0,
      message,
      startTime: Date.now()
    };

    this.operations.set(id, state);
    this.abortControllers.set(id, abortController);
    this.notifyCallbacks(id, state);

    return abortController;
  }

  /**
   * Update operation progress
   */
  public updateProgress(
    id: string,
    progress: number,
    message?: string,
    status?: ProgressState['status']
  ): void {
    const operation = this.operations.get(id);
    if (!operation) {
      return;
    }

    const updatedState: ProgressState = {
      ...operation,
      progress: Math.max(0, Math.min(100, progress)),
      message: message || operation.message,
      status: status || (progress >= 100 ? 'completed' : 'running')
    };

    if (updatedState.status === 'completed' || updatedState.status === 'error' || updatedState.status === 'cancelled') {
      updatedState.endTime = Date.now();
    }

    this.operations.set(id, updatedState);
    this.notifyCallbacks(id, updatedState);

    // Clean up completed operations after a delay
    if (updatedState.status === 'completed' || updatedState.status === 'error' || updatedState.status === 'cancelled') {
      setTimeout(() => {
        this.cleanup(id);
      }, 5000); // Keep for 5 seconds after completion
    }
  }

  /**
   * Mark operation as completed
   */
  public completeOperation(id: string, message?: string): void {
    this.updateProgress(id, 100, message, 'completed');
  }

  /**
   * Mark operation as failed
   */
  public failOperation(id: string, error: string): void {
    const operation = this.operations.get(id);
    if (!operation) {
      return;
    }

    const updatedState: ProgressState = {
      ...operation,
      status: 'error',
      error,
      endTime: Date.now()
    };

    this.operations.set(id, updatedState);
    this.notifyCallbacks(id, updatedState);
  }

  /**
   * Cancel an operation
   */
  public cancelOperation(id: string): void {
    const abortController = this.abortControllers.get(id);
    if (abortController) {
      abortController.abort();
    }

    this.updateProgress(id, 0, '操作已取消', 'cancelled');
  }

  /**
   * Get operation state
   */
  public getOperation(id: string): ProgressState | null {
    return this.operations.get(id) || null;
  }

  /**
   * Get all operations
   */
  public getAllOperations(): ProgressState[] {
    return Array.from(this.operations.values());
  }

  /**
   * Get operations by type
   */
  public getOperationsByType(type: 'description' | 'image'): ProgressState[] {
    return Array.from(this.operations.values()).filter(op => op.type === type);
  }

  /**
   * Subscribe to operation updates
   */
  public subscribe(id: string, callback: ProgressCallback): () => void {
    if (!this.callbacks.has(id)) {
      this.callbacks.set(id, []);
    }
    
    this.callbacks.get(id)!.push(callback);

    // Send current state if operation exists
    const operation = this.operations.get(id);
    if (operation) {
      callback(operation);
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(id);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          this.callbacks.delete(id);
        }
      }
    };
  }

  /**
   * Get abort controller for operation
   */
  public getAbortController(id: string): AbortController | null {
    return this.abortControllers.get(id) || null;
  }

  /**
   * Check if operation is running
   */
  public isRunning(id: string): boolean {
    const operation = this.operations.get(id);
    return operation?.status === 'running' || operation?.status === 'pending';
  }

  /**
   * Get operation duration
   */
  public getDuration(id: string): number | null {
    const operation = this.operations.get(id);
    if (!operation) {
      return null;
    }

    const endTime = operation.endTime || Date.now();
    return endTime - operation.startTime;
  }

  /**
   * Notify callbacks
   */
  private notifyCallbacks(id: string, state: ProgressState): void {
    const callbacks = this.callbacks.get(id);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(state);
        } catch (error) {
          console.error('Error in progress callback:', error);
        }
      });
    }
  }

  /**
   * Clean up completed operation
   */
  private cleanup(id: string): void {
    this.operations.delete(id);
    this.callbacks.delete(id);
    this.abortControllers.delete(id);
  }

  /**
   * Clean up all operations
   */
  public clearAll(): void {
    // Cancel all running operations
    for (const [id, controller] of this.abortControllers) {
      controller.abort();
    }

    this.operations.clear();
    this.callbacks.clear();
    this.abortControllers.clear();
  }

  /**
   * Get statistics
   */
  public getStats(): {
    total: number;
    running: number;
    completed: number;
    failed: number;
    cancelled: number;
    averageDuration: number;
  } {
    const operations = Array.from(this.operations.values());
    const completed = operations.filter(op => op.status === 'completed');
    const averageDuration = completed.length > 0 
      ? completed.reduce((sum, op) => sum + (op.endTime! - op.startTime), 0) / completed.length
      : 0;

    return {
      total: operations.length,
      running: operations.filter(op => op.status === 'running' || op.status === 'pending').length,
      completed: completed.length,
      failed: operations.filter(op => op.status === 'error').length,
      cancelled: operations.filter(op => op.status === 'cancelled').length,
      averageDuration
    };
  }
}

// Export singleton instance
export const aiProgressTracker = AIProgressTracker.getInstance();