// src/dtos/request.ts

import { z } from "zod";
import { ContentType, Model, Provider, ReasoningEffort, Role } from "../enums";
import {
  getSupportedImageFormats,
  isValidImageDataUrl,
} from "../utils/image-utils";

export const TextContentSchema = z.object({
  type: z.literal(ContentType.TEXT),
  text: z.string().max(200000),
});

export const ImageContentSchema = z.object({
  type: z.literal(ContentType.IMAGE_URL),
  image_url: z.string().refine((url) => isValidImageDataUrl(url), {
    message: `Invalid image data URL. Supported formats: ${getSupportedImageFormats().join(", ")}`,
  }),
});

export const ContentBlockSchema = z.union([
  TextContentSchema,
  ImageContentSchema,
]);

export const MessageSchema = z
  .object({
    content: z.union([z.string().max(200000), z.array(ContentBlockSchema)]),
    role: z.enum(Role),
  })
  .transform((msg) => {
    let content = msg.content;
    if (typeof msg.content === "string") {
      const isSystemOrDeveloper = [Role.SYSTEM, Role.DEVELOPER].includes(
        msg.role,
      );
      if (isSystemOrDeveloper && !msg.content.trim()) {
        content =
          "You are a helpful assistant. Always respond in the user's language.";
      }
    }

    return {
      ...msg,
      content,
    };
  });

export const MessagesSchema = z.array(MessageSchema);

export const InferenceRequestSchema = z
  .object({
    messages: MessagesSchema,
    temperature: z.number().min(0).max(2).default(0.2).optional(),
    provider: z.enum(Provider).default(Provider.GOOGLE_AI_STUDIO),
    model: z.enum(Model).default(Model.GEMINI_25_FLASH),
    reasoning_effort: z
      .enum(ReasoningEffort)
      .optional()
      .default(ReasoningEffort.NONE),
    accountId: z.string().optional(),
    gatewayId: z.string().optional(),
  })
  .transform((req) => {
    const hasSystemOrDeveloper = req.messages.some(
      (m) => m.role === Role.SYSTEM || m.role === Role.DEVELOPER,
    );
    if (!hasSystemOrDeveloper) {
      return {
        ...req,
        messages: [
          {
            role: Role.SYSTEM,
            content:
              "You are a helpful assistant. Always respond in the user's language.",
          },
          ...req.messages,
        ],
      };
    }
    return req;
  });

export type Message = z.infer<typeof MessageSchema>;
export type Messages = z.infer<typeof MessagesSchema>;
export type InferenceRequest = z.infer<typeof InferenceRequestSchema>;
