// src/types/inference.ts

import type { Model } from "../enums/model";
import type { Provider } from "../enums/provider";
import type { ReasoningEffort } from "../enums/reasoningEffort";
import type { Role } from "../enums/role";

export interface InferenceParams {
	provider: Provider;
	model: Model;
	messages: Array<{ role: Role; content: string }>;
	apiKey: string;
	baseURL?: string;
	temperature?: number;
	reasoning_effort: ReasoningEffort;
	accountId?: string;
	gatewayId?: string;
}
