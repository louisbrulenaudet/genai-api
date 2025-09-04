// src/dtos/inference.ts

import { z } from "zod";
import { Model, Provider, ReasoningEffort } from "../enums/inference";

export const InferenceRequest = z.object({
	system: z.string().max(100000).optional(),
	input: z.string().min(1).max(200000),
	temperature: z.number().min(0).max(2).default(0.2).optional(),
	provider: z.nativeEnum(Provider).default(Provider.GoogleAIStudio),
	model: z.nativeEnum(Model).default(Model.Gemini25Flash),
	reasoning_effort: z
		.nativeEnum(ReasoningEffort)
		.optional()
		.default(ReasoningEffort.None),
});

export const InferenceResponse = z.object({
	content: z.string(),
});

export type InferenceRequestType = z.infer<typeof InferenceRequest>;
export type InferenceResponseType = z.infer<typeof InferenceResponse>;
