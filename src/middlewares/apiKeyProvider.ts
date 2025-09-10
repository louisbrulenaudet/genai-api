// src/middlewares/apiKeyProvider.ts

import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { InferenceConfig } from "../dtos";

export const apiKeyProvider = createMiddleware(async (c: Context, next) => {
	let rawBody: unknown;
	try {
		rawBody = await c.req.json();
	} catch {
		return c.json({ error: "Invalid or missing JSON body" }, 400);
	}

	const parseResult = InferenceConfig.safeParse(rawBody);
	if (!parseResult.success) {
		return c.json(
			{
				error: "Invalid request body",
				details: parseResult.error.issues,
			},
			400,
		);
	}

	const config = parseResult.data;
	const provider = config.provider;

	// Directly use provider from validated request for env var lookup
	const envVarName = `${String(provider)
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, "_")}_API_KEY`;

	const headerApiKey = c.req.header("X-API-Key");
	const cleanedApiKey = headerApiKey
		? headerApiKey.trim().replace(/^bearer\s+/i, "")
		: undefined;

	// Prefer: body.apiKey > header > env
	const apiKey =
		config.apiKey && config.apiKey !== ""
			? config.apiKey
			: cleanedApiKey && cleanedApiKey !== ""
				? cleanedApiKey
				: c.env[envVarName];

	if (!apiKey) {
		return c.json(
			{
				error: `API key not found for provider: ${provider}`,
				details: `Missing environment variable: ${envVarName} and no X-API-Key header or body provided.`,
			},
			500,
		);
	}

	const fullConfig = {
		...config,
		apiKey,
		accountId: config.accountId ?? c.env.CLOUDFLARE_ACCOUNT_ID,
		gatewayId: config.gatewayId ?? c.env.CLOUDFLARE_AI_GATEWAY_ID,
	};

	c.set("AIProviderConfig", fullConfig);

	await next();
});
