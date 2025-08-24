// src/dtos/health.ts

import { z } from "zod";

export const HealthResponse = z.object({
	status: z.literal("ok"),
});

export type HealthResponse = z.infer<typeof HealthResponse>;
