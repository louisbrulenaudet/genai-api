// src/dtos/inference.ts

import { z } from "zod";

export const InferenceRequest = z.object({
	system: z.string().max(100000).optional(),
	input: z.string().min(1).max(200000),
	temperature: z.number().min(0).max(2).default(0.2).optional(),
});

export const InferenceResponse = z.object({
	content: z.string(),
});
