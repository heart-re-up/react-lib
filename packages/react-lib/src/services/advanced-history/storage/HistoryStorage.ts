// 공통 Storage 인터페이스
export interface Storage<T> {
  save(data: T): void;
  restore(): T | null;
  clear(): void;
}

// SessionStorage 기반 구현
export class SessionStorageAdapter<T> implements Storage<T> {
  constructor(private readonly key: string) {}

  save(data: T): void {
    try {
      sessionStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save to ${this.key}:`, error);
    }
  }

  restore(): T | null {
    try {
      const data = sessionStorage.getItem(this.key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`Failed to restore from ${this.key}:`, error);
      return null;
    }
  }

  clear(): void {
    try {
      sessionStorage.removeItem(this.key);
    } catch (error) {
      console.warn(`Failed to clear ${this.key}:`, error);
    }
  }
}
