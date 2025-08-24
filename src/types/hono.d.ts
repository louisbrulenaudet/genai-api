// src/types/hono.d.ts

import "hono";

declare module "hono" {
	interface ContextVariableMap {
		AIProvider: {
			apiKey: string;
			model: string;
			baseURL: string;
			provider: string;
		};
	}
}
