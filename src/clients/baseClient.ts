// src/clients/baseClient.ts

import { type ClientConfig, ClientConfigSchema } from "../dtos";

export class BaseClient {
	private static instance: unknown;
	private static config: ClientConfig | null = null;

	protected constructor() {}

	static get<T>(config: unknown, factory: (config: ClientConfig) => T): T {
		const parsed = ClientConfigSchema.parse(config);
		if (
			!BaseClient.instance ||
			!BaseClient.config ||
			BaseClient.config.apiKey !== parsed.apiKey ||
			BaseClient.config.baseUrl !== parsed.baseUrl
		) {
			BaseClient.instance = factory(parsed);
			BaseClient.config = parsed;
		}
		return BaseClient.instance as T;
	}
}
