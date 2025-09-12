// src/services/providers/googleGenAIProvider.ts

import { env } from "cloudflare:workers";
import type { Content, GenerationConfig } from "@google/genai";
import { getGoogleGenAIClient, googleGenAIClient } from "../../clients";
import type { InferenceRequestType, InferenceResponseType } from "../../dtos";
import { ContentType, Role } from "../../enums";
import type { InferenceParams } from "../../types/inference";
import { InferenceProvider } from "./baseInferenceProvider";

export class GoogleGenAIProvider extends InferenceProvider {
	private client:
		| ReturnType<typeof getGoogleGenAIClient>
		| typeof googleGenAIClient;

	constructor(inferenceConfig: InferenceParams) {
		super(inferenceConfig);
		const apiKey = inferenceConfig.apiKey;
		const baseUrl =
			inferenceConfig.baseURL ??
			`${env.CLOUDFLARE_AI_GATEWAY_BASE_URL}/${env.CLOUDFLARE_ACCOUNT_ID}/${env.CLOUDFLARE_AI_GATEWAY_ID}/google-ai-studio`;

		this.client = apiKey
			? getGoogleGenAIClient({ apiKey, baseUrl })
			: googleGenAIClient;
	}

	async runInference(
		request: InferenceRequestType,
	): Promise<InferenceResponseType> {
		const systemMsg = request.messages.find((m) => m.role === Role.System);
		const userMessages = request.messages.filter((m) => m.role !== Role.System);

		const contents: Content[] = [];
		for (const message of userMessages) {
			const parts: Array<
				{ text: string } | { inlineData: { mimeType: string; data: string } }
			> = [];
			if (typeof message.content === "string") {
				parts.push({ text: message.content });
			} else if (Array.isArray(message.content)) {
				for (const block of message.content) {
					if (block.type === ContentType.TEXT) {
						parts.push({ text: block.text });
					} else if (block.type === ContentType.IMAGE_URL) {
						// Extract base64 and mime type from data URL
						const match = block.image_url.match(/^data:(.+);base64,(.+)$/);
						if (match) {
							const mimeType = match[1];
							const data = match[2];
							parts.push({ inlineData: { mimeType, data } });
						}
					}
				}
			}
			contents.push({
				role: message.role.toLowerCase(),
				parts,
			} as Content);
		}

		const result = await this.client.models.generateContent({
			model: request.model,
			contents,
			config: {
				temperature: request.temperature,
				...(systemMsg && {
					systemInstruction:
						typeof systemMsg.content === "string"
							? systemMsg.content
							: Array.isArray(systemMsg.content) &&
									systemMsg.content[0]?.type === ContentType.TEXT
								? systemMsg.content[0].text
								: "",
				}),
			} as GenerationConfig,
		});

		const content = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
		return { content };
	}
}
