// src/clients/baseClient.ts

import { type ClientConfig, ClientConfigSchema } from "../dtos";

export class BaseClient {
	private static readonly instances: Map<string, unknown> = new Map();
	private static MAX_INSTANCES = 50;

	protected constructor() {}

	static setMaxInstances(n: number) {
		BaseClient.MAX_INSTANCES = n;
	}

	static get<T>(config: unknown, factory: (config: ClientConfig) => T): T {
		const parsed = ClientConfigSchema.parse(config);
		const key = `${parsed.apiKey}:${parsed.baseUrl}`;

		if (BaseClient.instances.has(key)) {
			const existing = BaseClient.instances.get(key) as T;
			BaseClient.instances.delete(key);
			BaseClient.instances.set(key, existing);
			return existing;
		}

		if (BaseClient.instances.size >= BaseClient.MAX_INSTANCES) {
			const oldestKey = BaseClient.instances.keys().next().value;
			if (oldestKey !== undefined) {
				BaseClient.instances.delete(oldestKey);
			}
		}

		const instance = factory(parsed);
		BaseClient.instances.set(key, instance);
		return instance;
	}
}
