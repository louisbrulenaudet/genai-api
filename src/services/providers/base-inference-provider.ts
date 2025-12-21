// src/services/providers/base-inference-provider.ts

import type { InferenceRequest, InferenceResponse } from "../../dtos";

import type { InferenceParams } from "../../types/inference";

export abstract class InferenceProvider {
  protected inferenceConfig: InferenceParams;

  constructor(inferenceConfig: InferenceParams) {
    this.inferenceConfig = inferenceConfig;
  }

  abstract runInference(request: InferenceRequest): Promise<InferenceResponse>;
}
