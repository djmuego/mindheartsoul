
import { StorageDriver } from './types';

export class HttpDriverStub implements StorageDriver {
  constructor(private baseUrl: string) {}

  getItem(key: string): string | null {
    throw new Error(`[HttpDriver] getItem not implemented for ${this.baseUrl} (Key: ${key})`);
  }

  setItem(key: string, value: string): void {
    console.log(`[HttpDriver] Mock write to ${this.baseUrl}/${key}`, value);
  }

  removeItem(key: string): void {
    console.log(`[HttpDriver] Mock delete ${this.baseUrl}/${key}`);
  }
}
