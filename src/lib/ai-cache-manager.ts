/**
 * AI Cache Manager
 * Implements request caching for AI operations to improve performance and reduce API calls
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

export class AICacheManager {
  private static instance: AICacheManager;
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_SIZE = 100;

  private constructor() {
    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60 * 1000); // Every minute
  }

  public static getInstance(): AICacheManager {
    if (!AICacheManager.instance) {
      AICacheManager.instance = new AICacheManager();
    }
    return AICacheManager.instance;
  }

  /**
   * Generate cache key from content and options
   */
  private generateKey(type: string, content: string, options?: any): string {
    const optionsStr = options ? JSON.stringify(options) : '';
    const contentHash = this.simpleHash(content);
    return `${type}:${contentHash}:${this.simpleHash(optionsStr)}`;
  }

  /**
   * Simple hash function for cache keys
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get cached result
   */
  public get<T>(type: string, content: string, options?: any): T | null {
    const key = this.generateKey(type, content, options);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached result
   */
  public set<T>(
    type: string, 
    content: string, 
    data: T, 
    options?: any, 
    cacheOptions?: CacheOptions
  ): void {
    const key = this.generateKey(type, content, options);
    const ttl = cacheOptions?.ttl || this.DEFAULT_TTL;
    const maxSize = cacheOptions?.maxSize || this.MAX_SIZE;

    // Remove oldest entries if cache is full
    if (this.cache.size >= maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    };

    this.cache.set(key, entry);
  }

  /**
   * Check if result is cached
   */
  public has(type: string, content: string, options?: any): boolean {
    const key = this.generateKey(type, content, options);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cache entries
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Clear cache entries by type
   */
  public clearByType(type: string): void {
    for (const [key] of this.cache) {
      if (key.startsWith(`${type}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  public getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{ key: string; timestamp: number; expiresAt: number }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      timestamp: entry.timestamp,
      expiresAt: entry.expiresAt
    }));

    return {
      size: this.cache.size,
      maxSize: this.MAX_SIZE,
      hitRate: 0, // TODO: Implement hit rate tracking
      entries
    };
  }
}

// Export singleton instance
export const aiCacheManager = AICacheManager.getInstance();