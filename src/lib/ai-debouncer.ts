/**
 * AI Debouncer
 * Provides debouncing functionality for AI operations to prevent excessive API calls
 */

export interface DebounceOptions {
  delay?: number;
  immediate?: boolean;
}

export class AIDebouncer {
  private timers = new Map<string, NodeJS.Timeout>();
  private readonly DEFAULT_DELAY = 500; // 500ms

  /**
   * Debounce a function call
   */
  public debounce<T extends (...args: any[]) => any>(
    key: string,
    func: T,
    options?: DebounceOptions
  ): (...args: Parameters<T>) => void {
    const delay = options?.delay || this.DEFAULT_DELAY;
    const immediate = options?.immediate || false;

    return (...args: Parameters<T>) => {
      const existingTimer = this.timers.get(key);
      
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      if (immediate && !existingTimer) {
        func(...args);
      }

      const timer = setTimeout(() => {
        this.timers.delete(key);
        if (!immediate) {
          func(...args);
        }
      }, delay);

      this.timers.set(key, timer);
    };
  }

  /**
   * Cancel a debounced function
   */
  public cancel(key: string): void {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  /**
   * Cancel all debounced functions
   */
  public cancelAll(): void {
    for (const [key, timer] of this.timers) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }

  /**
   * Check if a function is pending
   */
  public isPending(key: string): boolean {
    return this.timers.has(key);
  }

  /**
   * Get all pending keys
   */
  public getPendingKeys(): string[] {
    return Array.from(this.timers.keys());
  }
}

// Export singleton instance
export const aiDebouncer = new AIDebouncer();