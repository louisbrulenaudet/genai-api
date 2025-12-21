// src/types/inference.ts

import type { InferenceConfig } from "../dtos/internal";
import type { ContentType } from "../enums/content-type";

export interface TextContentBlock {
  type: ContentType.TEXT;
  text: string;
}

export interface ImageContentBlock {
  type: ContentType.IMAGE_URL;
  image_url: string;
}

export type ContentBlock = TextContentBlock | ImageContentBlock;

/**
 * InferenceParams extends InferenceConfig but requires apiKey to be present.
 * This type is used internally by providers and services that need a guaranteed API key.
 */
export type InferenceParams = InferenceConfig & { apiKey: string };
