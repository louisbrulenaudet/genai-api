// src/utils/image-utils.ts

import { ImageFormat } from "../enums";

export function extractImageFormat(dataUrl: string): ImageFormat | null {
  const regex = /^data:image\/([^;]+);base64,/;
  const match = regex.exec(dataUrl);
  if (!match) {
    return null;
  }

  const format = match[1];
  // Handle jpg/jpeg equivalence
  const normalizedFormat =
    format === ImageFormat.JPG ? ImageFormat.JPEG : format;
  return Object.values(ImageFormat).includes(normalizedFormat as ImageFormat)
    ? (normalizedFormat as ImageFormat)
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
  if (!dataUrl.startsWith("data:image/")) {
    return false;
  }
  return extractImageFormat(dataUrl) !== null;
}

export function getSupportedImageFormats(): ImageFormat[] {
  return Object.values(ImageFormat);
}

export function parseDataUrl(
  dataUrl: string,
): { mimeType: string; data: string } | null {
  const regex = /^data:([^;]+);base64,(.*)$/s;
  const match = regex.exec(dataUrl);
  if (!match) {
    return null;
  }
  const mimeType = match[1];
  const data = match[2].replace(/\s+/g, "");
  return { mimeType, data };
}
