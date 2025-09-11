// src/utils/imageUtils.ts

import { ImageFormat } from "../enums";

export function extractImageFormat(dataUrl: string): ImageFormat | null {
	const match = dataUrl.match(/^data:image\/([^;]+);base64,/);
	if (!match) return null;

	const format = match[1];
	return Object.values(ImageFormat).includes(format as ImageFormat)
		? (format as ImageFormat)
		: null;
}

export function isValidImageFormat(format: string): format is ImageFormat {
	return Object.values(ImageFormat).includes(format as ImageFormat);
}

export function createImageDataUrl(
	format: ImageFormat,
	base64Data: string,
): string {
	return `data:image/${format};base64,${base64Data}`;
}

export function isValidImageDataUrl(dataUrl: string): boolean {
	if (!dataUrl.startsWith("data:image/")) return false;
	return extractImageFormat(dataUrl) !== null;
}

export function getSupportedImageFormats(): ImageFormat[] {
	return Object.values(ImageFormat);
}
