// src/services/inference-service.ts

import type { ZodType } from "zod";
import type { InferenceResponse } from "../dtos";
import { Provider } from "../enums/provider";
import type { InferenceParams } from "../types";
import { retryAsync } from "../utils/retry";
import type { InferenceProvider } from "./providers/base-inference-provider";
import { GoogleGenAIProvider } from "./providers/google-gen-ai-provider";

const PROVIDER_REGISTRY: Record<
  Provider,
  new (
    config: InferenceParams,
  ) => InferenceProvider
> = {
  [Provider.GOOGLE_AI_STUDIO]: GoogleGenAIProvider,
};

export async function runInference(
  request: InferenceParams & { text_format?: ZodType<unknown> },
): Promise<InferenceResponse> {
  const ProviderClass = PROVIDER_REGISTRY[request.provider as Provider];
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
