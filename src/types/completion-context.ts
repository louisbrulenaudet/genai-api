// src/types/completion-context.ts

import type { InferenceConfig } from "../dtos/internal";

export type CompletionContext = {
  Bindings: Env;
  Variables: {
    AIProviderConfig: InferenceConfig;
  };
};
