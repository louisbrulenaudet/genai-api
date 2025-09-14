// src/services/inferenceService.ts

import type { ZodType } from "zod";
import type { InferenceResponseType } from "../dtos";
import { Provider } from "../enums/provider";
import type { InferenceParams } from "../types";
import { retryAsync } from "../utils/retry";
import type { InferenceProvider } from "./providers/baseInferenceProvider";
import { GoogleGenAIProvider } from "./providers/googleGenAIProvider";

const ProviderRegistry: Record<
	Provider,
	new (
		config: InferenceParams,
	) => InferenceProvider
> = {
	[Provider.GoogleAIStudio]: GoogleGenAIProvider,
};

export async function runInference(
	request: InferenceParams & { text_format?: ZodType<unknown> },
): Promise<InferenceResponseType> {
	const ProviderClass = ProviderRegistry[request.provider as Provider];
	if (!ProviderClass) {
		throw new Error(`Unsupported provider: ${request.provider}`);
	}
	const providerInstance = new ProviderClass(request);
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

export const runInferenceWithRetry = retryAsync<
	unknown,
	[InferenceParams & { text_format?: ZodType<unknown> }]
>({
	maxRetries: 3,
	sleepTime: 1,
	raisesOnException: true,
	nonRetryExceptions: [],
})(runInference);
