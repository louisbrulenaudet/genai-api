// src/dtos/request.ts

import { z } from "zod";
import { Model, Provider, ReasoningEffort, Role } from "../enums";

export const Message = z
	.object({
		content: z.string().max(200000),
		role: z.nativeEnum(Role),
	})
	.transform((msg) => ({
		...msg,
		content:
			[Role.System, Role.Developer].includes(msg.role) && !msg.content.trim()
				? "You are a helpful assistant. Always respond in the user's language."
				: msg.content,
	}));

export const Messages = z.array(Message);

export const InferenceRequest = z
	.object({
		messages: Messages,
		temperature: z.number().min(0).max(2).default(0.2).optional(),
		provider: z.nativeEnum(Provider).default(Provider.GoogleAIStudio),
		model: z.nativeEnum(Model).default(Model.Gemini25Flash),
		reasoning_effort: z
			.nativeEnum(ReasoningEffort)
			.optional()
			.default(ReasoningEffort.None),
		accountId: z.string().optional(),
		gatewayId: z.string().optional(),
	})
	.transform((req) => {
		const hasSystemOrDeveloper = req.messages.some(
			(m) => m.role === Role.System || m.role === Role.Developer,
		);
		if (!hasSystemOrDeveloper) {
			return {
				...req,
				messages: [
					{
						role: Role.System,
						content:
							"You are a helpful assistant. Always respond in the user's language.",
					},
					...req.messages,
				],
			};
		}
		return req;
	});

export type MessageType = z.infer<typeof Message>;
export type MessagesType = z.infer<typeof Messages>;
export type InferenceRequestType = z.infer<typeof InferenceRequest>;
