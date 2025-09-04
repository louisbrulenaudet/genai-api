// src/middlewares/inferenceProvider.ts

import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { InferenceRequest } from "../dtos/inference";

export const inferenceProvider = createMiddleware(async (c: Context, next) => {
	let rawBody: unknown;
	try {
		rawBody = await c.req.json();
	} catch {
		return c.json({ error: "Invalid or missing JSON body" }, 400);
	}

	// Parse and validate the request body using Zod schema with defaults
	const parseResult = InferenceRequest.safeParse(rawBody);
	if (!parseResult.success) {
		return c.json(
			{
				error: "Invalid request body",
				details: parseResult.error.issues,
			},
			400,
		);
	}

	const { provider, model } = parseResult.data;

	// Convert provider to ENV VAR format, e.g., google_ai_studio -> GOOGLE_AI_STUDIO_API_KEY
	const envVarName = `${`${provider}`.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_API_KEY`;

	const headerApiKey = c.req.header("X-API-Key");
	const cleanedApiKey = headerApiKey
		? headerApiKey.trim().replace(/^bearer\s+/i, "")
		: undefined;
	const apiKey =
		cleanedApiKey && cleanedApiKey !== "" ? cleanedApiKey : c.env[envVarName];

	if (!apiKey) {
		return c.json(
			{
				error: `API key not found for provider: ${provider}`,
				details: `Missing environment variable: ${envVarName} and no X-API-Key header provided.`,
			},
			500,
		);
	}

	// Optionally, map provider to a baseURL if needed, fallback to AI_GATEWAY_BASE_URL
	const baseURL = c.env.AI_GATEWAY_BASE_URL;

	c.set("AIProvider", {
		apiKey,
		model,
		baseURL,
		provider,
	});

	await next();
});
