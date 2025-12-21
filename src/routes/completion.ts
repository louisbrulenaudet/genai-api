// src/routes/completion.ts

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { InferenceRequestSchema, InferenceResponseSchema } from "../dtos";
import { apiKeyProvider } from "../middlewares/api-key-provider";
import { runInferenceWithRetry } from "../services/inference-service";

import type { CompletionContext } from "../types";

const completion = new Hono<CompletionContext>();

completion.post(
  "/",
  zValidator("json", InferenceRequestSchema),
  apiKeyProvider,
  async (c) => {
    const inferenceConfig = c.get("AIProviderConfig");

    if (!inferenceConfig) {
      return c.json({ error: "Inference config missing" }, 500);
    }

    const result = await runInferenceWithRetry({
      ...inferenceConfig,
      apiKey: inferenceConfig.apiKey ?? "",
    });

    const parseResult = InferenceResponseSchema.safeParse(result);
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
