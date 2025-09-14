// src/services/providers/baseInferenceProvider.ts

import type { InferenceRequestType, InferenceResponseType } from "../../dtos";

import type { InferenceParams } from "../../types/inference";

export abstract class InferenceProvider {
	constructor(protected inferenceConfig: InferenceParams) {}

	abstract runInference(
		request: InferenceRequestType,
	): Promise<InferenceResponseType>;
}
