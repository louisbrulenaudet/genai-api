// src/services/inferenceService.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: No need for explicit any */

import OpenAI from "openai";

import type { ZodType } from "zod";
import type { Model, Provider } from "../enums/inference";
import { ReasoningEffort, Timeout } from "../enums/inference";
import { retryAsync } from "../utils/retry";

interface InferenceParams {
	provider: Provider;
	model: Model;
	messages: Array<{ role: "user" | "system" | "assistant"; content: string }>;
	apiKey: string;
	baseURL: string;
	temperature?: number;
	reasoning_effort?: ReasoningEffort;
}

export async function runInference({
	provider,
	model,
	messages,
	apiKey,
	baseURL,
	temperature = 0,
	reasoning_effort = ReasoningEffort.None,
	text_format,
}: InferenceParams & { text_format: ZodType<unknown> }): Promise<unknown> {
	const client = new OpenAI({
		apiKey,
		baseURL,
		timeout: Timeout.Long,
	});

	const payload = {
		model: `${provider}/${model}`,
		messages,
		temperature,
		response_format: { type: "text" as const },
		reasoning_effort: reasoning_effort as any,
	};

	const completion = await client.chat.completions.create(payload);
	const content = completion.choices[0].message.content;

	if (content === null) {
		throw new Error(
			`Completion message content is null for model ${model} and provider ${provider}.`,
		);
	}

	const parsed = text_format.safeParse({ content });
	if (!parsed.success) {
		throw new Error(
			`Response validation failed: ${JSON.stringify(parsed.error)}`,
		);
	}

	return parsed.data;
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
