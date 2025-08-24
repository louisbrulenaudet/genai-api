// src/middlewares/inferenceProvider.ts

import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

type InferenceProviderBody = {
	provider: string;
	model: string;
	[key: string]: unknown;
};

/**
 * Middleware to validate and extract inference provider configuration from the request body.
 *
 * This middleware expects a JSON body containing `provider` and `model` fields.
 * It performs the following actions:
 * - Parses the JSON body and returns a 400 error if invalid or missing.
 * - Checks for the presence of `provider` and `model` in the body, returning a 400 error if missing.
 * - Constructs the environment variable name for the provider's API key (e.g., `google_ai_studio` becomes `GOOGLE_AI_STUDIO_API_KEY`).
 * - Retrieves the API key from the environment and returns a 500 error if not found.
 * - Sets an `inference` object on the context containing the API key, model, base URL, and provider.
 * - Calls the next middleware in the chain.
 *
 * @param c - The middleware context, containing the request, environment, and response helpers.
 * @param next - The next middleware function to call.
 * @returns A response with an error message and status code if validation fails, otherwise proceeds to the next middleware.
 */
export const inferenceProvider = createMiddleware(async (c: Context, next) => {
	let body: InferenceProviderBody;
	try {
		body = await c.req.json();
	} catch {
		return c.json({ error: "Invalid or missing JSON body" }, 400);
	}

	const provider = body?.provider ?? "google-ai-studio";
	const model = body?.model ?? "gemini-2.0-flash";

	// Convert provider to ENV VAR format, e.g., google_ai_studio -> GOOGLE_AI_STUDIO_API_KEY
	const envVarName = `${`${provider}`.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_API_KEY`;
	const apiKey = c.env[envVarName];

	if (!apiKey) {
		return c.json(
			{
				error: `API key not found for provider: ${provider}`,
				details: `Missing environment variable: ${envVarName}`,
				supportedProviders: ["google-ai-studio"],
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
