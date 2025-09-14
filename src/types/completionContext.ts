// src/types/completionContext.ts

import type { InferenceConfigType } from "../dtos/internal";

export type CompletionContext = {
	Bindings: Env;
	Variables: {
		AIProviderConfig: InferenceConfigType;
	};
};
