// src/routes/completion.ts

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { InferenceRequest, InferenceResponse } from "../dtos/inference";
import type { Model, Provider } from "../enums/inference";
import { inferenceProvider } from "../middlewares/inferenceProvider";
import { runInferenceWithRetry } from "../services/inferenceService";

const completion = new Hono<{ Bindings: Env }>();

completion.post(
	"/",
	zValidator("json", InferenceRequest),
	inferenceProvider,
	async (c) => {
		const body = c.req.valid("json");
		const aiProvider = c.get("AIProvider");

		if (!aiProvider) {
			return c.json({ error: "Inference context missing" }, 500);
		}

		const systemPrompt =
			body.system ??
			"You are a helpful assistant. Always respond in the user's language.";

		const result = await runInferenceWithRetry({
			provider: aiProvider.provider as Provider,
			model: (body.model ?? aiProvider.model) as Model,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: body.input },
			],
			apiKey: aiProvider.apiKey,
			baseURL: aiProvider.baseURL ?? "",
			temperature: body.temperature ?? 0.2,
			text_format: InferenceResponse,
			reasoning_effort: body.reasoning_effort,
		});

		return c.text((result as { content: string }).content);
	},
);

export default completion;
export type CompletionRoute = typeof completion;
