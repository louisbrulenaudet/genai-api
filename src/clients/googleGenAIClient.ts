// src/clients/googleGenAIClient.ts

import { env } from "cloudflare:workers";
import { GoogleGenAI } from "@google/genai";
import type { ClientConfig } from "../dtos";
import { BaseClient } from "./baseClient";

export function getGoogleGenAIClient(config: unknown): GoogleGenAI {
	return BaseClient.get<GoogleGenAI>(
		config,
		(parsed: ClientConfig) =>
			new GoogleGenAI({
				apiKey: parsed.apiKey,
				httpOptions: {
					baseUrl: parsed.baseUrl,
				},
			}),
	);
}

export const googleGenAIClient = getGoogleGenAIClient({
	apiKey: env.GOOGLE_AI_STUDIO_API_KEY,
	baseUrl: `${env.CLOUDFLARE_AI_GATEWAY_BASE_URL}/${env.CLOUDFLARE_ACCOUNT_ID}/${env.CLOUDFLARE_AI_GATEWAY_ID}/google-ai-studio`,
});
