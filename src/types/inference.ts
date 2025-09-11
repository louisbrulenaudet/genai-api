// src/types/inference.ts

import type { ContentType } from "../enums/contentType";
import type { Model } from "../enums/model";
import type { Provider } from "../enums/provider";
import type { ReasoningEffort } from "../enums/reasoningEffort";
import type { Role } from "../enums/role";

export interface TextContentBlock {
	type: ContentType.TEXT;
	text: string;
}

export interface ImageContentBlock {
	type: ContentType.IMAGE_URL;
	image_url: string;
}

export type ContentBlock = TextContentBlock | ImageContentBlock;

export interface InferenceParams {
	provider: Provider;
	model: Model;
	messages: Array<{
		role: Role;
		content: string | ContentBlock[];
	}>;
	apiKey: string;
	baseURL?: string;
	temperature?: number;
	reasoning_effort: ReasoningEffort;
	accountId?: string;
	gatewayId?: string;
}
