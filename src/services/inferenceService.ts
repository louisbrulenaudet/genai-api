// src/services/inferenceService.ts

import OpenAI from "openai";
import type { ZodType } from "zod";
import type { Model, Provider } from "../enums/inference";
import { retryAsync } from "../utils/retry";

interface InferenceParams {
	provider: Provider;
	model: Model;
	messages: Array<{ role: "user" | "system" | "assistant"; content: string }>;
	apiKey: string;
	baseURL: string;
	temperature?: number;
}

export async function runInference({
	provider,
	model,
	messages,
	apiKey,
	baseURL,
	temperature = 0,
}: InferenceParams): Promise<string> {
	const client = new OpenAI({
		apiKey,
		baseURL,
		timeout: 120000, // 120 seconds timeout for API requests
	});

	const completion = await client.chat.completions.create({
		model: `${provider}/${model}`,
		messages: messages,
		temperature,
		response_format: { type: "text" },
	});

	const content = completion.choices[0].message.content;

	if (content === null) {
		throw new Error("Completion message content is null and cannot be parsed.");
	}

	return content;
}

export const runInferenceWithRetry = retryAsync<
	unknown,
	[InferenceParams & { text_format: ZodType<unknown> }]
>({
	maxRetries: 3,
	sleepTime: 1,
	raisesOnException: true,
	nonRetryExceptions: [],
})(runInference);
