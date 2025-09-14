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

export const ClientConfigSchema = z.object({
	apiKey: z.string().min(1, "API key is required"),
	baseUrl: z.string().url("baseUrl must be a valid URL"),
});

export type ClientConfig = z.infer<typeof ClientConfigSchema>;
export type InferenceConfigType = z.infer<typeof InferenceConfig>;
