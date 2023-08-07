import chalk from "chalk";
import hash from "stable-hash";

export class LocalCache {
  private maxSize: number;
  private dataMap: Map<string, string>;
  private storage: Storage | null;
  private storagePrefix: string = "SWIRL_DATA";

  constructor({
    maxSize = Number.MAX_SAFE_INTEGER,
    useLocalStorage = false,
  }: {
    maxSize: number;
    useLocalStorage?: boolean;
  }) {
    this.maxSize = maxSize;
    this.dataMap = new Map();

    if (useLocalStorage) {
      this.storage = window?.localStorage ?? null;
      this.rehydrateFromLocalStorage();
    } else {
      this.storage = null;
    }
  }

  private rehydrateFromLocalStorage() {
    if (this.storage) {
      Object.keys(this.storage).forEach((key) => {
        if (key && key.startsWith(this.storagePrefix)) {
          const value = this.storage!.getItem(key);
          if (value) {
            this.dataMap.set(key, value);
          }
        }
      });
    } else {
      console.log(
        chalk.red(
          "LocalStorage not found, possibly because this is not running in the browser. Using only in-memory cache."
        )
      );
    }
  }

  private generateStorageKey(key: string): string {
    const normalizedKey = key.toLowerCase().replace(/\/$/, "");
    return hash(`${this.storagePrefix}_${normalizedKey}`);
  }

  set(key: string, value: any) {
    const storageKey = this.generateStorageKey(key);
    const jsonValue = JSON.stringify(value);

    if (this.storage) {
      this.storage.setItem(storageKey, jsonValue);
    }

    this.dataMap.set(storageKey, jsonValue);
    this.maintainSize();
  }

  get(key: string): any | null {
    const storageKey = this.generateStorageKey(key);
    const value = this.dataMap.get(storageKey);

    if (value) {
      this.dataMap.delete(storageKey);
      this.dataMap.set(storageKey, value);
      return JSON.parse(value);
    }

    return null;
  }

  has(key: string): boolean {
    const storageKey = this.generateStorageKey(key);
    return this.dataMap.has(storageKey);
  }

  private maintainSize() {
    if (this.dataMap.size > this.maxSize) {
      const oldestKey = this.dataMap.keys().next().value;
      this.dataMap.delete(oldestKey);
    }
  }
}
