// src/dtos/response.ts

import { z } from "zod";

export const HealthResponseSchema = z.object({
  status: z.literal("API successfully started ☁️"),
});

export const InferenceResponseSchema = z.object({
  content: z.string(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type InferenceResponse = z.infer<typeof InferenceResponseSchema>;
