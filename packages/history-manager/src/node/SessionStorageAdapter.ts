import { Storage } from "./NodeManager.type";

/**
 * SessionStorage 기반 스토리지 어댑터
 *
 * 각 탭 마다 히스토리가 관리되어야 하기 때문에 sessionStorage 를 사용한다.
 */
export class SessionStorageAdapter<T> implements Storage<T> {
  constructor(private readonly key: string) {}

  save(data: T): void {
    try {
      sessionStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save to ${this.key}:`, error);
    }
  }

  restore(defaultValue: T): T {
    try {
      const data = sessionStorage.getItem(this.key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.warn(`Failed to restore from ${this.key}:`, error);
      return defaultValue;
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
