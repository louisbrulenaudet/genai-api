// src/dtos/response.ts

import { z } from "zod";

export const HealthResponse = z.object({
	status: z.literal("API successfully started ☁️"),
});

export const InferenceResponse = z.object({
	content: z.string(),
});

export type HealthResponseType = z.infer<typeof HealthResponse>;
export type InferenceResponseType = z.infer<typeof InferenceResponse>;
