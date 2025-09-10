// src/routes/completion.ts

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { InferenceRequest } from "../dtos/request";
import { InferenceResponse } from "../dtos/response";
import { apiKeyProvider } from "../middlewares/apiKeyProvider";
import { runInferenceWithRetry } from "../services/inferenceService";

import type { CompletionContext } from "../types";

const completion = new Hono<CompletionContext>();

completion.post(
	"/",
	zValidator("json", InferenceRequest),
	apiKeyProvider,
	async (c) => {
		const inferenceConfig = c.get("AIProviderConfig");

		if (!inferenceConfig) {
			return c.json({ error: "Inference config missing" }, 500);
		}

		console.log("Inference Config:", inferenceConfig);

		const result = await runInferenceWithRetry({
			...inferenceConfig,
			apiKey: inferenceConfig.apiKey ?? "",
		});

		const parseResult = InferenceResponse.safeParse(result);
		if (!parseResult.success) {
			return c.json(
				{
					error: "Invalid response from inference service",
					details: parseResult.error.issues,
				},
				500,
			);
		}

		return c.text(parseResult.data.content);
	},
);

export default completion;
export type CompletionRoute = typeof completion;
