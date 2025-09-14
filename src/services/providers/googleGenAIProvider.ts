// src/services/providers/googleGenAIProvider.ts

import { env } from "cloudflare:workers";
import type { Content, GenerationConfig } from "@google/genai";
import { getGoogleGenAIClient, googleGenAIClient } from "../../clients";
import type { InferenceRequestType, InferenceResponseType } from "../../dtos";
import { ContentType, Provider, ReasoningEffort, Role } from "../../enums";
import type { ContentBlock, InferenceParams } from "../../types/inference";
import { parseDataUrl } from "../../utils/imageUtils";
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
			`${env.CLOUDFLARE_AI_GATEWAY_BASE_URL}/${env.CLOUDFLARE_ACCOUNT_ID}/${env.CLOUDFLARE_AI_GATEWAY_ID}/${Provider.GoogleAIStudio}`;

		this.client = apiKey
			? getGoogleGenAIClient({ apiKey, baseUrl })
			: googleGenAIClient;
	}

	private convertBlockToPart(block: ContentBlock) {
		if (block.type === ContentType.TEXT) return { text: block.text };
		if (block.type === ContentType.IMAGE_URL) {
			const parsed = parseDataUrl(block.image_url);
			return parsed
				? { inlineData: { mimeType: parsed.mimeType, data: parsed.data } }
				: null;
		}
		return null;
	}

	private transformMessages(
		messages: InferenceRequestType["messages"],
	): Content[] {
		return messages
			.filter((m) => m.role !== Role.System)
			.map((message) => {
				const parts =
					typeof message.content === "string"
						? [{ text: message.content }]
						: Array.isArray(message.content)
							? (message.content
									.map((b) => this.convertBlockToPart(b))
									.filter(Boolean) as Array<
									| { text: string }
									| { inlineData: { mimeType: string; data: string } }
								>)
							: [];

				return {
					role: message.role.toLowerCase(),
					parts,
				} as Content;
			});
	}

	async runInference(
		request: InferenceRequestType,
	): Promise<InferenceResponseType> {
		const systemMsg = request.messages.find((m) => m.role === Role.System);
		const contents: Content[] = this.transformMessages(request.messages);

		const reasoningEffort = this.inferenceConfig.reasoning_effort;
		const thinkingBudget = reasoningEffort === ReasoningEffort.None ? 0 : -1;

		const result = await this.client.models.generateContent({
			model: request.model,
			contents,
			config: {
				temperature: request.temperature,
				thinkingBudget,
				thinkingConfig: {
					thinkingBudget: thinkingBudget,
				},
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
