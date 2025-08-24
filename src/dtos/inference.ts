// src/dtos/inference.ts

import { z } from "zod";

export const InferenceRequest = z.object({
	system: z.string().optional(),
	input: z.string(),
	temperature: z.number().min(0).max(2).default(0.2).optional(),
});

export const InferenceResponse = z.object({
	content: z.string(),
});
