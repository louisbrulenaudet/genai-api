// src/dtos/internal.ts

import { z } from "zod";
import { InferenceRequest } from "./request";

export const InferenceConfig = z.intersection(
	InferenceRequest,
	z.object({
		apiKey: z.string().optional(),
		baseURL: z.string().optional(),
		text_format: z.any().optional(),
	}),
);

export type InferenceConfigType = z.infer<typeof InferenceConfig>;
