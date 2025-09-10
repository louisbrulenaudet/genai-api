// src/services/inferenceService.ts

import type { ZodType } from "zod";
import type { InferenceResponseType } from "../dtos";
import { Provider } from "../enums/provider";
import type { InferenceParams } from "../types";
import { retryAsync } from "../utils/retry";
import { GeminiProvider } from "./providers/geminiProvider";

export async function runInference(
	request: InferenceParams & { text_format?: ZodType<unknown> },
): Promise<InferenceResponseType> {
	switch (request.provider) {
		case Provider.GoogleAIStudio: {
			const providerInstance = new GeminiProvider(request);
			const content = await providerInstance.runInference(request);

			if (content === null) {
				throw new Error(
					`Completion message content is null for model ${request.model} and provider ${request.provider}.`,
				);
			}

			if (request.text_format !== undefined) {
				const parsed = request.text_format.safeParse({ content });
				if (!parsed.success) {
					throw new Error(
						`Response validation failed: ${JSON.stringify(parsed.error)}`,
					);
				}
			}
			return content;
		}
		default:
			throw new Error(`Unsupported provider: ${request.provider}`);
	}
}

export const runInferenceWithRetry = retryAsync<
	unknown,
	[InferenceParams & { text_format?: ZodType<unknown> }]
>({
	maxRetries: 3,
	sleepTime: 1,
	raisesOnException: true,
	nonRetryExceptions: [],
})(runInference);
