// src/clients/base-client.ts

import { LRUCache } from "lru-cache";
import { type ClientConfig, ClientConfigSchema } from "../dtos";

export class BaseClient {
  private static maxInstances = 50;
  private static cache = new LRUCache({
    max: BaseClient.maxInstances,
    ttl: 1000 * 60 * 60, // 1 hour in milliseconds
  });

  protected constructor() {}

  static setMaxInstances(n: number) {
    BaseClient.maxInstances = n;
    const entries = Array.from(BaseClient.cache.entries());
    BaseClient.cache = new LRUCache({
      max: n,
      ttl: 1000 * 60 * 60, // 1 hour in milliseconds
    });
    for (const [key, value] of entries.slice(0, n)) {
      BaseClient.cache.set(key, value);
    }
  }

  static get<T extends object>(
    config: unknown,
    factory: (config: ClientConfig) => T,
  ): T {
    const parsed = ClientConfigSchema.parse(config);
    const key = `${parsed.apiKey}:${parsed.baseUrl}`;

    const existing = BaseClient.cache.get(key) as T | undefined;
    if (existing !== undefined) {
      return existing;
    }

    const instance = factory(parsed);
    BaseClient.cache.set(key, instance);
    return instance;
  }
}
