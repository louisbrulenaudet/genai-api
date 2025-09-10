// src/services/providers/geminiProvider.ts

import { type GenerationConfig, GoogleGenAI } from "@google/genai";
import type { InferenceRequestType, InferenceResponseType } from "../../dtos";
import { Role } from "../../enums";
import type { InferenceParams } from "../../types";
import { InferenceProvider } from "./baseInferenceProvider";

export class GeminiProvider extends InferenceProvider {
	private client: GoogleGenAI;

	constructor(inferenceConfig: InferenceParams) {
		super(inferenceConfig);
		const baseURL = `https://gateway.ai.cloudflare.com/v1/${inferenceConfig.accountId}/${inferenceConfig.gatewayId}/google-ai-studio`;
		this.client = new GoogleGenAI({
			apiKey: inferenceConfig.apiKey,
			httpOptions: {
				baseUrl: baseURL,
			},
		});
	}

	async runInference(
		request: InferenceRequestType,
	): Promise<InferenceResponseType> {
		const systemMsg = request.messages.find((m) => m.role === Role.System);
		const userMessages = request.messages.filter((m) => m.role !== Role.System);

		const contents =
			userMessages.length === 1
				? userMessages[0].content
				: userMessages.map((m) => m.content);

		const result = await this.client.models.generateContent({
			model: request.model,
			contents,
			config: {
				temperature: request.temperature,
				...(systemMsg && { systemInstruction: systemMsg.content }),
			} as GenerationConfig,
		});

		const content = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
		return { content };
	}
}
